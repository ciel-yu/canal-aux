# coding: utf-8

import os, sys
import argparse
from common.glob import iglob
from os.path import basename
def main():
	parser = argparse.ArgumentParser( description="test", formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( 'catdir' )
	parser.add_argument( 'files', nargs="+" )
	parser.add_argument( '-v', '--verbose', action='store_true' )

	parser.set_defaults( **{
		'verbose':False
	} )

	opts = parser.parse_args()

	if not os.path.isdir( opts.catdir ):
		print( "invalid catdir:", opts.catdir )
		sys.exit( 1 )


	catdict = dict( ( basename( x ), x ) for x in  iglob( os.path.join( opts.catdir, "*" ) ) if os.path.isdir( x ) )

	opts.verbose and print( catdict )

	for spec in opts.files:
		opts.verbose and print( "collecting from:", spec )

		for file in filter( os.path.isfile, iglob( spec ) ):

			for key in catdict:

				if ~basename( file ).lower().find( key.lower() ):

					new_file = os.path.join( catdict[key], basename( file ) )

					if not os.path.exists( new_file ):
						os.rename( file, new_file )
						break

if __name__ == '__main__':
	main()
