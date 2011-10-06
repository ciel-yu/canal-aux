# coding: utf-8

import os
import itertools
import re

from common import path
from optparse import OptionParser

def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options]' )

	parser.set_defaults( **{
		'verbose': False,
	} )

	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()

	pat_dot = re.compile( r'\s+\.', re.UNICODE )

	for fn in os.listdir( '.' ):

		tags, rest = path.extract_tags( fn )

		dst = pat_dot.sub( '.', ' '.join( rest ) )

		p = ''.join( map( lambda x: '[' + x + ']', tags ) )

		dst = p and p + ' ' + dst or dst

		if os.path.exists( dst ):
			print( "Existed, skiped:", dst )
		else:
			try:
				os.renames( fn , dst )
			except OSError:
				print( "Failed:", dst )

if __name__ == '__main__':
	main()







