# coding:utf-8

from common.glob import iglob
from functools import partial
import argparse
import binascii
import functools
import itertools
import hashlib
import os
import zlib


class FileEntry:

	CRC_SIZE = 1 * 1024 * 1024;

	BUFFER_SIZE = 4 * 1024 * 1024;

	def __init__( self, path ):
		self.path = path
		self.name = os.path.basename( path )
		self.size = os.stat( path ).st_size

	def __str__( self ):
		return repr( self.path ) + ' ' + str( self.size )

	@property
	def crc_head( self ):
		if hasattr( self, '_crc' ):
			return self._crc
		else:
			with open( self.path, "rb" ) as file:
				if file.readable():
					data = file.read( FileEntry.CRC_SIZE )
					self._crc = zlib.crc32( data )
			return self._crc

	@property
	def md5( self ):
		if hasattr( self, '_md5' ):
			return self._md5
		else:
			m = hashlib.new( 'md5' )
			with open( self.path, "rb" ) as file:
				while True:
					data = file.read( FileEntry.BUFFER_SIZE )
					if not data : break
					m.update( data )
				self._md5 = m.digest();
			return self._md5

def main():
	parser = argparse.ArgumentParser( description="no comment", formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( 'filespec', nargs="+" )
	parser.add_argument( '-v', '--verbose', action='store_true' )

	parser.set_defaults( **{
		'verbose':False
	} )

	opts = parser.parse_args()

	files = set( os.path.abspath( x ) for x in itertools.chain.from_iterable( iglob( x ) for x in  opts.filespec ) if os.path.isfile( x ) )

	opts.verbose and print( "files:", len( files ) )


	def group_and_evict( chunks, keyfunc, badkeys=set() ):

		for entries in chunks:
			for key, items in itertools.groupby( sorted( entries, key=keyfunc ), keyfunc ):
				if key in badkeys:
					continue
				group = list( items )
				if len( group ) > 1:
					yield group

	groups = [ map( FileEntry, files ) ]

	grouper_chain = [ partial( group_and_evict, keyfunc=lambda x: x.size, badkeys=set( [0] ) ),
					  partial( group_and_evict, keyfunc=lambda x: x.crc_head ),
					  partial( group_and_evict, keyfunc=lambda x: x.md5 ) ]

	for grouper in grouper_chain:
		groups = grouper( groups )

	print( groups )

	for group in groups:
		for item in group:
			print( item )







if __name__ == '__main__':
	main()
