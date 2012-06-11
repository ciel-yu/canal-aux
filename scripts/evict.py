# coding: utf-8

from collections import defaultdict
from common.dupekit import FileEntry
from common.glob import iglob
import argparse
import binascii
import itertools
import os



def main():
	parser = argparse.ArgumentParser( description='''Delete files by sizes and md5''', formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( 'refspec' )
	parser.add_argument( 'filespec', nargs="+" )
	parser.add_argument( '-v', '--verbose', action='store_true' )

	parser.set_defaults( **{
		'verbose':False
	} )

	opts = parser.parse_args()

	reg = defaultdict( set )

	for file in iglob( opts.refspec ):
		if not( os.path.exists( file ) and os.path.isfile( file ) ): continue

		entry = FileEntry( file )
		reg[entry.size].add( entry.md5 )

	opts.verbose and print( "refs:", len( reg ) )

	count = 0

	for file in itertools.chain.from_iterable( iglob( x ) for x in opts.filespec ):
		if not( os.path.exists( file ) and os.path.isfile( file ) ): continue

		entry = FileEntry( file )

		if entry.size in reg and entry.md5 in reg[entry.size]:
			if opts.verbose:
				print( "hit:", entry.path, entry.size, binascii.hexlify( entry.md5 ).decode() )

			os.remove( entry.path )
			count += 1

	print( "deleted:", count )




if __name__ == '__main__':
	main()
