# coding:utf-8

import binascii
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
					return self._crc
			finally:
				file.close()

	@property
	def md5( self ):
		if hasattr( self, '_md5' ):
			return self._md5
		else:
			m = hashlib.new( 'md5' )
			file = open( self.path, "rb" )
			try:
				data = file.read( FileEntry.BUFFER_SIZE )
				while data:
					m.update( data )
					data = file.read( FileEntry.BUFFER_SIZE )
				self._md5 = m.digest();
				return self._md5
			finally:
				file.close()

def main():
	fe = FileEntry( 'U:/temp/PDApp.log' )
	print( fe.crc_head )
	print( binascii.hexlify( fe.md5 ) )


if __name__ == '__main__':
	main()
