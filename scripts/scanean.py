# -*- coding: UTF-8 -*-


from tia.barcode import InbarcodeOcr
import argparse
import os
import re
import sys


def main():
	parser = argparse.ArgumentParser( formatter_class=argparse.ArgumentDefaultsHelpFormatter )

	parser.set_defaults( **{
		'verbose': False,
		'version': False
	} )

	parser.add_argument( '-v', '--verbose', action='store_true' )
	parser.add_argument( '-V', dest='version', action='store_true' )

	opts = parser.parse_args()

	ocr = InbarcodeOcr( "ciel", "EDACE8EB48EA4" )

	if opts.version:
		print( 'Registered:', ocr.registered )
		print( 'INBarcode version:', ocr.version )
		sys.exit();

	r = re.compile( r'#(\d{13}|\d{9}[0-9xX])|^-', re.I | re.U )


	for root in ( x for x in os.listdir( '.' ) if os.path.isdir( x ) and not r.findall( x ) ):

		ean = ocr.search( root )

		if ean:
			print( 'got:', ean )
			try:
				os.renames( root, '[#' + ean + ']' + root )
			except:
				print( 'cannot rename:', dir )

if __name__ == '__main__':
	main()
