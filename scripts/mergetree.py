# -*- coding: UTF-8 -*-


from common.glob import glob
from common.path import join
from optparse import OptionParser
import itertools
import os
import sys



def move_tree( dstdir, srcdir ):
	dst_dir, src_dir = [os.path.abspath( x ) for x in ( dstdir, srcdir )]

	for dir, dirs, files in os.walk( src_dir ):
		curr_dir = os.path.relpath( dir, src_dir )

		for item in itertools.chain( dirs, files ):
			n = join( dst_dir, curr_dir, item )
			if not os.path.lexists( n ):
				try:
					os.renames( join( dir, item ), n )
				except:
					pass


def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options] <dst> <src>...' )

	parser.set_defaults( **{
		'verbose': False,
	} )


	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()

	if( len( args ) < 2 ):
		parser.print_help()
		sys.exit()

	dirs = args

	dst = dirs.pop( 0 )

	if not os.path.exists( dst ):
		os.makedirs( dst )

	if not os.path.isdir( dst ) :
		sys.exit( "Invalid destination." )

	srcs = set( itertools.chain.from_iterable( glob( x ) for x in dirs ) )

	for src in ( x for x in srcs if os.path.exists( x ) and os.path.isdir( x ) ):

		if os.path.abspath( dst ).startswith( os.path.abspath( src ) ):
			if opts.verbose:
				print( "invalid src:", src )
			continue


		if opts.verbose:
			print( "merging", src , "=>", dst )

		move_tree( dst, src )

if __name__ == "__main__":
	main()

