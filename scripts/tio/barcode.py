# -*- coding: UTF-8 -*-
import os
import re
import win32com.client

class InbarcodeOcr:
	def __init__( self, name, regkey ):
		ocr = win32com.client.Dispatch( "INBarcodeCOM.INBarcode" )

		if ocr:

			registered = False
			if name and regkey:
				registered = ocr.RegisterBarcodeDLL( name, regkey )
			else:
				reg = os.environ['INBARCODE_REG'].split()
				if len( reg ) > 1 :
					registered = ocr.RegisterBarcodeDLL( reg.pop( 0 ), reg. pop( 0 ) )

			self.registered = registered

			ocr.DisableEAN8 = True
			ocr.DisableCode39 = True
			ocr.DisableCode128 = True
			ocr.Disable2of5 = True
			ocr.DisableRotation = True
			ocr.UseIncreasedSensitivity = True
			ocr.UseFineSearch = True

			self.version = ocr.GetBarcodeVersionInfo()

			self.ocr = ocr

	def search( self, root ):
		if not os.path.isdir( root ):
			pass
		files = os.listdir( root )

		# if filename is an ean, return it
		for file in files:
			if re.match( '^(\d{13}|\d{9}[0-9xX])$', os.path.splitext( file )[0], re.UNICODE ):
				return os.path.splitext( file )[0]

		if '~.bmp' in files:
			files = ['~.bmp']

		if len( files ) > 10:
			t = [None] * 10
			t[::2], t[1::2] = files[:5:], files[:-6:-1]
			files = t

		for file in ( x for x in ( root + os.path.sep + x for x in files ) if os.path.isfile( x ) ):
			print( 'checking:', file )
			count = self.ocr.FindBarcodesFile( file )
			codes = []
			for i in range( count ):
				codes.append( re.sub( r'\s+', '', self.ocr.GetBarcodeCode( i + 1 ) ) )

			# 978 for ISBN13(EAN), 49/45 for JAN
			for code in codes:
				if re.match( '978', code ):
					return code
			for code in codes:
				if re.match( '49|45', code ):
					return code


