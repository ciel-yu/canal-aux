# coding:utf-8
from optparse import OptionParser
import os
import sys

import itertools
from common.glob import iglob

def empty_dirs( root_dir ):
	for curr_dir, dirs, files in os.walk( root_dir ):
		if len( dirs ) == 0 and len( files ) == 0:
			yield curr_dir

def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options] dirs...' )

	parser.set_defaults( **{
		'verbose': False,
	} )


	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()

	cleaning_dirs = set( x for x in itertools.chain.from_iterable( iglob( x ) for x in ( args or ['.'] ) ) if os.path.isdir( x ) )

	for root in cleaning_dirs:
		
		if opts.verbose:
			print( 'cleaning:', root )

		for dir in empty_dirs( root ):
			try:
				os.removedirs( dir )
				print( "Deleted:", dir )
			except Exception as e:
				print( "Cannot delete:", dir )


if __name__ == "__main__":
	main()

