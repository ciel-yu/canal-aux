# coding: utf-8
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
		if hasattr( self, '_crc_1m' ):
			return self._crc_1m
		else:
			with open( self.path, "rb" ) as file:
				if file.readable():
					data = file.read( FileEntry.CRC_SIZE )
					self._crc_1m = zlib.crc32( data )
			return self._crc_1m

	@property
	def crc( self ):
		if hasattr( self, '_crc' ):
			return self._crc
		else:
			with open( self.path, "rb" ) as file:
				self._crc = 0
				while True:
					data = file.read( FileEntry.BUFFER_SIZE )
					if not data: break
					self._crc = zlib.crc32( data, self._crc ) & 0xffffffff

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

	@property
	def sha1( self ):
		if hasattr( self, '_sha1' ):
			return self._sha1
		else:
			m = hashlib.new( 'sha1' )
			with open( self.path, "rb" ) as file:
				while True:
					data = file.read( FileEntry.BUFFER_SIZE )
					if not data : break
					m.update( data )
				self._sha1 = m.digest();
			return self._sha1
