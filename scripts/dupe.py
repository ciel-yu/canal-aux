# coding:utf-8

from common.glob import iglob
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

	@property
	def crc_head( self ):
		if hasattr( self, '_crc' ):
			return self._crc
		else:
			file = open( self.path, "rb" )
			try:
				if file.readable():
					data = file.read( FileEntry.CRC_SIZE )
					self._crc = zlib.crc32( data )
			finally:
				file.close()
			return self._crc

	@property
	def md5( self ):
		if hasattr( self, '_md5' ):
			return self._md5
		else:
			m = hashlib.new( 'md5' )
			file = open( self.path, "rb" )
			try:
				while True:
					data = file.read( FileEntry.BUFFER_SIZE )
					if not data : break
					m.update( data )
				self._md5 = m.digest();
			finally:
				file.close()
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

	for key, entries in itertools.groupby( sorted( map( FileEntry, files ), key=lambda x: x.size ), lambda x: x.size ):
		if key == 0:
			continue

		file_entries = list( entries )

		if len( file_entries ) < 2:
			continue

		opts.verbose and print( "checking CRC for files of size:", key )

		file_entries.sort( key=lambda x: x.md5 )

		for key, entries in itertools.groupby( file_entries, lambda x: x.md5 ):
			dups = list( entries )
			if len( dups ) > 1:
				print( "dups for md5:", binascii.hexlify( key ) )
				list( ( print( x.path ) for x in entries ) )










if __name__ == '__main__':
	main()
