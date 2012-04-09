# coding: utf-8

from common import glob
from optparse import OptionParser
import logging
import os
import sys

parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options] input_file' )

parser.set_defaults( **{
	'input_charset': 'gbk',
	'output_charset': 'utf-8',
	'verbose': False,
} )

parser.add_option( '-I', '--input-charset' )
parser.add_option( '-O', '--output-charset' )
parser.add_option( '-v', '--verbose', action='store_true' )

opts, args = parser.parse_args()

def change_encoding( in_file, in_enc, out_enc ):

	try:
		if opts.verbose:
			print( in_file, )

		tem_file = in_file + '.temp'

		with os.open( in_file, 'r', encoding=in_enc ) as i, os.open( tem_file, 'w', encoding=out_enc ) as o :
			o.write( i.read() )

		os.renames( in_file, in_file + "." + in_enc )
		os.renames( tem_file, in_file )

		if opts.verbose:
			print( 'done.' )

	except Exception as e:
		if opts.verbose:
			print
			logging.exception( e )


if len( args ) < 1:
	parser.print_help()
	sys.exit()

for file in glob.glob( args[0] ):

	change_encoding( file, opts.input_charset, opts.output_charset )

