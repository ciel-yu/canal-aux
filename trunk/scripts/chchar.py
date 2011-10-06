# -*- coding: UTF-8 -*-

from optparse import OptionParser
import os
import sys

parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options]' )

parser.set_defaults( **{
	'input_charset': 'sjis',
	'output_charset': 'gbk',
	'verbose': False,
} )

parser.add_option( '-I', '--input-charset' )
parser.add_option( '-O', '--output-charset' )
parser.add_option( '-v', '--verbose', action='store_true' )

opts, args = parser.parse_args()

files = os.listdir( '.' )

for file in files:
	try:
		dst_filename = file.encode( opts.output_charset ).decode( opts.input_charset )

		if file != dst_filename:
			try:
				os.rename( file, dst_filename )
				if opts.verbose:
					print( "renamed:", file, "->", dst_filename )
			except:
				if opts.verbose:
					print( "cannot rename:", file, "->", dst_filename )

	except:
		if opts.verbose:
			print( "cannot convert:", file )
