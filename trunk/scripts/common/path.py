# -*- coding: UTF-8 -*-

import os
import re
import string

def join( *paths ):
	return os.path.normpath( os.sep.join( paths ) )

r = re.compile( r'\s*(?:\(([^)]*)\)|\[([^\]]*)\])\s*', re.UNICODE )
def extract_tags( filename ):
	tags = []
	def _( tags=[] ):
		def _( m ):
			_.tags += filter( None, m.groups() )
			return '\n'
		_.tags = tags
		return _

	parts = list( filter( None, r.sub( _( tags ), filename ).replace( '\n.\n', '\n' ).split( '\n' ) ) )
	tags = [x.strip() for x in tags]
	return tags, parts

def del_tags( filename ):
	return r.sub( '', filename )

def get_ext( filename ):
	parts = filename.rsplit( os.path.extsep, 1 )
	if len( parts ) < 2:
		parts.append( '' )
	return parts


def main():
	print( FileInfoEntry( '(一般コミック) [浅草寺きのと×築地俊彦×駒都えーじ] まぶらほ COLORFUL COMIC 第02巻 (完)(2).zip' ).tags )

class FileInfoEntry:
	tags_pattern = re.compile( r'\s*(?:\(([^)]*)\)|\[([^\]]*)\])\s*', re.UNICODE )

	def __init__( self, path ):
		self.path = path
		self.parent, self.name = os.path.split( path )
		self.parts, self.tags = FileInfoEntry.extract_tags( self.name )

	@staticmethod
	def extract_tags( filename ):
		tags = []
		def _( tags=[] ):
			def _( m ):
				_.tags += filter( None, m.groups() )
				return '\n'
			_.tags = tags
			return _

		parts = list( filter( lambda x: x and x != '.', FileInfoEntry.tags_pattern.sub( _( tags ), filename ).split( '\n' ) ) )
		tags = list( x.strip() for x in tags )
		return parts, tags

if __name__ == '__main__':
	main()
