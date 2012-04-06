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


def sum_ean( digits ):
	return sum( ( ( ord( c ) - 48 ) * ( 3 if i % 2 else 1 ) ) for i, c in enumerate( digits[:13] ) )

def sum_isbn( digits ):
	return sum( ( ( 10 - i ) * sum_isbn.dict[c] ) for i, c in enumerate( digits[:10] ) )
sum_isbn.dict = dict()
for x in range( 10 ):
	sum_isbn.dict[str( x )] = x
sum_isbn.dict.update( {"x":10, "X":10} );


def main():

	print( sum_ean( "9784047150720" ) % 10 )
	print( sum_isbn( "476590282X" ) % 11 )

if __name__ == '__main__':
	main()
