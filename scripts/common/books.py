# coding: UTF-8

import re

isbn_pat = re.compile( r'#(\d{13}|\d{9}[0-9xX])', re.I | re.U )
maz_pat = re.compile( r'^\[(@\w+) (\d{4})-(\d{2})\]\[#(\d{3})\]', re.I | re.U )

def get_isbn( file ):
	pass


def analyse( file ):
	isbns = isbn_pat.findall( file )
	isbn = None
	if isbns:
		isbn = isbns[0]

	m = maz_pat.search( file )
	mazid = year = month = vol = None
	if m:
		mazid = m.group( 1 )
		year = int( m.group( 2 ) )
		month = int( m.group( 3 ) )
		vol = int( m.group( 4 ) )
	return isbn, mazid, year, month, vol
