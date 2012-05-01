# -*- coding: UTF-8 -*-


import sys, os, re
import win32com.client
import win32console
from itertools import *
from optparse import OptionParser


def main():
	parser = OptionParser( version="%prog 1.0", usage='Usage: %prog [options]' )

	parser.set_defaults( **{
		'verbose': False,
	} )

	parser.add_option( '-v', '--verbose', action='store_true' )

	opts, args = parser.parse_args()


	ocr = win32com.client.Dispatch( "INBarcodeCOM.INBarcode" )

	if not ocr:
		print( "INBarcodeCOM not found" )
		sys.exit();

	registered = ocr.RegisterBarcodeDLL( "ciel", "EDACE8EB48EA4" )

	if opts.verbose:
		print( 'Registered:', registered )
		print( 'INBarcode version:', ocr.GetBarcodeVersionInfo() )

	r = re.compile( r'#(\d{13}|\d{9}[0-9xX])|^-', re.I | re.U )

	dirs = ( x for x in os.listdir( '.' ) if os.path.isdir( x ) and not r.findall( x ) )

	ocr.DisableEAN8 = True
	ocr.DisableCode39 = True
	ocr.DisableCode128 = True
	ocr.Disable2of5 = True
	ocr.DisableRotation = True
	ocr.UseIncreasedSensitivity = True

	ocr.UseFineSearch = True
	if opts.verbose:
		print( 'UseFineSearch' )

	for dir in dirs:
		fs = os.listdir( dir )
		if '~.bmp' in fs:
			fs = ['~.bmp']
		files = list( x for x in ( dir + os.path.sep + x for x in fs ) if os.path.isfile( x ) )

		if not files:
			continue

		ean = None

		# scan filenames
		for file in files:
			if re.match( '^(\d{13}|\d{9}[0-9xX])$', os.path.splitext( os.path.basename( file ) )[0], re.UNICODE ):
				ean = os.path.splitext( os.path.basename( file ) )[0]
				break;

		# scan image
		if not ean:
			if len( files ) > 10:
				t = []
				for i in range( 5 ):
					t.append( files[i] )
					t.append( files[-i - 1] )
				#t = files[-5:]
				#t.reverse()
				#files = files[:5]+t
				files = t

			for file in files:
				print( 'checking:', file )
				count = ocr.FindBarcodesFile( file )
				codes = []
				for i in range( count ):
					codes.append( re.sub( r'\s+', '', ocr.GetBarcodeCode( i + 1 ) ) )

				# 978 for ISBN13(EAN), 49/45 for JAN
				for code in codes:
					if re.match( '978', code ):
						ean = code
						break
				if not ean:
					for code in codes:
						if re.match( '49|45', code ):
							ean = code
							break
				if ean:
					break

		if ean:
			print( 'got:', ean )
			try:
				os.renames( dir, '[#' + ean + ']' + dir )
			except:
				print( 'cannot rename:', dir )

if __name__ == '__main__':
	main()



