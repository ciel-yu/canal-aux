#
# coding:utf-8

from argparse import ArgumentParser
from glob import glob
import argparse
import itertools
import os
import tempfile


def main():
	parser = ArgumentParser( description="test", formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.add_argument( '-I', '--input-encoding' )
	parser.add_argument( '-O', '--output-encoding' )
	parser.add_argument( 'input_files', nargs='+' )
	parser.add_argument( '-v', '--verbose', action='store_true' )

	parser.set_defaults( **{
		'verbose':False,
		'input_encoding':'utf-8',
		'output_encoding':'utf-8',
		'suffix':'~'
	} )

	opts = parser.parse_args()

	_tbl = dict( ( x, x - 0xff00 + 0x20 ) for x in range( 0xff01, 0xff7f ) )
	_tbl.update( {0x3000:0x20, 0x00a0:0x20} )

	def handle( file ):
		with open( file, "r", encoding=opts.input_encoding ) as infile:
			content = infile.read()

		new_content = content.translate( _tbl )

		tmpfd, tmpfile = tempfile.mkstemp( dir=os.path.dirname( file ) )

		with os.fdopen( tmpfd, "w", encoding=opts.output_encoding ) as outfile:
			outfile.write( new_content )

		os.renames( file, file + opts.suffix )
		os.renames( tmpfile, file )

	for file in itertools.chain.from_iterable( glob( x ) for x in opts.input_files ):
		if os.path.isfile( file ):
			handle( file )

if __name__ == '__main__':
	main()
