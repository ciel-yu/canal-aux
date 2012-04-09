# coding:utf-8

from common.dupekit import FileEntry
from common.glob import iglob
from functools import partial
import argparse
import binascii
import itertools
import os


def collect_files( files, dest_dir ):
	for file in files:
		name = os.path.basename( file )

		dest = os.path.join( dest_dir, name )

		if os.path.exists( dest ):
			for i in range( 100 ):
				dest = os.path.join( dest_dir, "#{:02d}".format( i ), name )
				if not os.path.exists( dest ):
					break

		if not os.path.exists( dest ):
#			os.renames( file, dest )
			print( file, dest )

def find_dups( files ):
	def group_and_yield( chunks, keyfunc, badkeys=set() ):
		for entries in chunks:
			for key, items in itertools.groupby( sorted( entries, key=keyfunc ), keyfunc ):
				if key in badkeys:
					continue
				group = list( items )
				if len( group ) > 1:
					yield group

	groups = [ map( FileEntry, files ) ]

	grouper_chain = [ partial( group_and_yield, keyfunc=lambda x: x.size, badkeys=set( [0] ) ),
					  partial( group_and_yield, keyfunc=lambda x: x.crc_head ),
					  partial( group_and_yield, keyfunc=lambda x: x.md5 )
					]

	for grouper in grouper_chain:
		groups = grouper( groups )

	for group in groups:
		yield group

def scan_dir( path ):
	for root, dirs, files in os.walk( path ):
		for file in files:
			yield os.path.join( root, file )

def main():
	parser = argparse.ArgumentParser( description="no comment", formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( 'filespec', nargs="+" )
	parser.add_argument( '-v', '--verbose', action='store_true' )
	parser.add_argument( '-d', dest='collecting_dir', metavar='DIR', help='collecting dir', required=True )
	parser.add_argument( '-m', '--mode' )


	parser.set_defaults( **{
		'verbose':False
	} )

	opts = parser.parse_args()


#	files = set( os.path.abspath( x ) for x in itertools.chain.from_iterable( iglob( x ) for x in  opts.filespec ) if os.path.isfile( x ) )
	files = set( filter( os.path.isfile, map( os.path.abspath, itertools.chain.from_iterable( map( iglob, opts.filespec ) ) ) ) )
#	files = scan_dir( opts.root_dir )

	opts.verbose and print( "files:", len( files ) )

	for group in find_dups( files ):
		print( "for md5: {} size: {}".format( binascii.hexlify( group[0].md5 ), group[0].size ) )

		files = sorted( map( lambda x:x.path, group ), key=lambda x:x.count( '\\' ), reverse=True )

		retain_file = files.pop( 0 ) #retain first
		print( "retained:", retain_file )
		collect_files( files, opts.collecting_dir )

if __name__ == '__main__':
	main()
