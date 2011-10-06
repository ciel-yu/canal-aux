# coding: utf-8
from common.glob import iglob
from optparse import OptionParser
from timeit import itertools
from functools import reduce
import os
import sys
import re

class Entry:
	def __init__( self, ean=None, id=None, date=None, vol=None, path=None ):
		self.ean = ean
		self.id = id
		self.date = date
		self.vol = vol
		self.paths = path and set( [path] ) or set()

	def absorb( self, rhs ):
		self.ean = self.ean or rhs.ean
		self.id = self.id or rhs.id
		self.date = self.date or rhs.date
		self.vol = self.vol or rhs.vol
		self.paths |= rhs.paths
		return self

	def __str__( self ):
		return 'Entry[ean={}, id={}, date={}, vol={}, paths={}]'.format( self.ean, self.id, self.date, self.vol, self.paths )

	def get_ean( self ):
		return self.ean

	def get_id_date( self ):
		return self.id and self.date and self.id + ' ' + self.date

	def get_id_vol( self ):
		return self.id and self.vol and self.id + '#' + self.vol

	def add_path( self, path ):
		self.paths.add( path )


class EntryHive:
	def __init__( self ):
		self.t_ean = {}
		self.t_date = {}
		self.t_vol = {}
		self.entries = {}

	def register( self, entry, path ):
		pass


def make_entry( filename ):
	isbns = make_entry.re_isbn.findall( filename )
	isbn = isbns and isbns[0] or None

	m = make_entry.re_maz.search( filename )
	id, date, vol = None, None, None
	if m:
		id = m.group( 1 )
		date = m.group( 2 ) != '0000-00' and m.group( 2 ) or None
		vol = m.group( 3 ) != '000' and m.group( 3 ) or None

	return ( isbn or id and( date or vol ) ) and  Entry( isbn, id, date, vol ) or None

make_entry.re_isbn = re.compile( r'\[#(\d{13}|\d{9}[0-9xX])\]', re.I | re.U )
make_entry.re_maz = re.compile( r'\[@(\w+) (\d{4}-\d{2})#(\d{3})\]', re.I | re.U )

def dirsize( dir ):
	return sum( os.stat( dir + os.path.sep + x ).st_size for x in os.listdir( dir ) if os.path.isfile( dir + os.path.sep + x ) )

def reclaim( path ):
	ns = os.path.split( path )

	for i in range( 100 ):
		nf = os.path.join( ns[0], str( i ), ns[1] )
		if not os.path.exists( nf ):
			try:
				os.renames( path, nf )
			except IOError as e:
				pass
			break

def main():
	global opts, args
	parser = OptionParser( version="%prog 2.0", usage='Usage: %prog [options] <dirs>...' )

	parser.set_defaults( **{
		'verbose': False,
		'dir_mode': False
	} )

	parser.add_option( '-d', '--dir-mode', action='store_true' )
	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()

	dirs = args

	if not dirs:
		dirs.append( '*' )

	hive = {}

	if opts.verbose:
		print( "SCAN PHASE..." )


	if opts.dir_mode:
		files = set( x for x in itertools.chain( *( iglob( x ) for x in dirs ) ) if os.path.isdir( x ) )
	else:
		files = set( x for x in itertools.chain( *( iglob( x ) for x in dirs ) ) if os.path.isfile( x ) )

	if opts.verbose:
		print( "FOUND:", len( files ) )


	for path in files:

		entry = make_entry( os.path.basename( path ) )

		if not entry:
			continue

		entry.add_path( path )

		ean = entry.get_ean()
		id_date = entry.get_id_date()
		id_vol = entry.get_id_vol()

		new_entry = reduce( lambda x, y: x.absorb( y ), set( filter( None, [ ean in hive and hive[ean], id_date in hive and hive[id_date], id_vol in hive and hive[id_vol], entry] ) ) )

		info = {}

		if new_entry.get_ean():
			info[new_entry.get_ean()] = new_entry
		if new_entry.get_id_date():
			info[new_entry.get_id_date()] = new_entry
		if new_entry.get_id_vol():
			info[new_entry.get_id_vol()] = new_entry

		hive.update( info )



	if opts.verbose:
		print( 'FILTER & SORT PHASE...' )

	for entry in set( x for x in hive.values() if len( x.paths ) > 1 ):
		paths = sorted( entry.paths, key=( opts.dir_mode and dirsize or ( lambda x: os.stat( x ).st_size ) ), reverse=True )

		retain = paths.pop( 0 )
		if opts.verbose:
			print( '----:', retain )

		for path in paths:
			if opts.verbose:
				print( '   -:', path )
			reclaim( path )
		else:
			if opts.verbose:
				print()


		updated_path = reduce( lambda x, y: y.sub( '', x ), [make_entry.re_isbn, make_entry.re_maz], os.path.basename( retain ) )


		if entry.ean:
			updated_path = '[#{}]{}'.format( entry.ean, updated_path )
		if entry.id:
			updated_path = '[@{} {}#{:03d}]{}'.format( entry.id, entry.date or '0000-00', int( entry.vol or 0 ), updated_path )

		updated_path = os.path.join( os.path.dirname( retain ), updated_path )

		if retain != updated_path:
			try:
				os.renames( retain, updated_path )
			except:
				pass

if __name__ == '__main__':
	main()

