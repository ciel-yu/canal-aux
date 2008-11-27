package sillia.numbering;

public class ISBNUtil {

	private final static char[] albat = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'X' };

	public static boolean check10( String code ) {

		if( notDigits( code ) || code.length() != 10 )
			return false;

		int sum = sum10( code.substring( 0, 9 ).toCharArray() );

		if( code.charAt( 9 ) == 'X' || code.charAt( 9 ) == 'x' )
			sum += 10;
		else
			sum += code.codePointAt( 9 ) - '0';

		if( sum % 11 != 0 )
			return false;

		return true;
	}

	public static boolean check13( String code ) {

		if( notDigits( code ) || code.length() != 13 )
			return false;

		int sum = sum13( code.toCharArray() );

		if( sum % 10 != 0 )
			return false;

		return true;
	}

	public static String convert10to13( String code10 ) {

		if( !check10( code10 ) )
			return null;

		return gen13( "978" + code10 );

	}

	public static String convert13to10( String code13 ) {

		if( !check13( code13 ) )
			return null;

		return gen10( code13.substring( 3 ) );

	}

	public static String gen10( String code ) {

		if( notDigits( code ) || code.length() < 9 )
			return null;

		String cs = code.substring( 0, 9 );

		int sum10 = sum10( cs.toCharArray() );

		int d = ( 11 - sum10 % 11 ) % 11;

		return cs + albat[d];
	}

	public static String gen13( String code ) {

		if( notDigits( code ) || code.length() < 12 )
			return null;

		String cs = code.substring( 0, 12 );

		int sum10 = sum13( cs.toCharArray() );

		int d = ( 10 - sum10 % 10 ) % 10;

		return cs + albat[d];
	}

	public static void main( String[] args ) {

		String i10 = gen10( "0000112011" );
		System.out.println( i10 );
		System.out.println( check10( i10 ) );
		System.out.println( convert10to13( i10 ) );
		System.out.println( convert13to10( convert10to13( i10 ) ) );
		System.out.println( validIsbn( convert13to10( convert10to13( i10 ) ) ) );

	}

	public static boolean validIsbn( String code ) {

		if( code == null )
			return false;

		if( !code.matches( "[-\\d]+" ) )
			return false;

		String c = code.replaceAll( "-", "" );

		return check10( c ) || check13( c );
	}

	private static boolean notDigits( String code ) {

		return code == null || !code.matches( "\\d+" );
	}

	private static int sum10( char[] cs ) {

		int sum = 0;

		for( int i = 0; i < cs.length; i++ )
			sum += ( 10 - i ) * ( cs[i] - '0' );
		return sum;
	}

	private static int sum13( char[] cs ) {

		int sum = 0;

		for( int i = 0; i < cs.length; i++ )
			sum += ( i % 2 == 0 ? 1 : 3 ) * ( cs[i] - '0' );
		return sum;
	}

}
