# coding: utf-8

from optparse import OptionParser
import os
import sys
import re
import itertools
from common.glob import iglob
import tempfile


def find_shorten_target( path ):
	for dir, dirs, files in os.walk( path ):
		if not ( len( dirs ) == 1 and len( files ) == 0 ):
			return dir
def ___( paths ):
	for path in paths:
		if os.path.exists( path ):
			target = find_shorten_target( path )
			if target and target != path:
				yield path, target


def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options]' )
	parser.set_defaults( **{
		'verbose': False,
	} )
	parser.add_option( '-v', '--verbose', action='store_true' )
	opts, args = parser.parse_args()

	args = args or []

	curdir = os.path.abspath( os.curdir )


	for path, target in ___( set( os.path.abspath( x ) for x in itertools.chain.from_iterable( iglob( x ) for x in args ) if os.path.isdir( x ) and not curdir.startswith( os.path.abspath( x ) ) ) ):
		parent = os.path.dirname( path )
		temp_dir = tempfile.mkdtemp( dir=parent )
		temp_target = os.path.join( temp_dir, os.path.basename( target ) )

		if opts.verbose:
			print( path, target, temp_target )

		os.renames( target, temp_target )
		os.renames( temp_target, path )


if __name__ == '__main__':
	main()
