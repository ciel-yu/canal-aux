package sillia.math;

import org.apache.commons.lang.math.IntRange;

/**
 * @author Ciel
 */
public class MathUtil {

	/**
	 * @param num
	 * @param lower
	 * @param upper
	 * @return
	 * 
	 */
	static public int clip( int num, int lower, int upper ) {

		if( upper < lower )
			throw new ArithmeticException( "upper < lower" );

		if( num > upper )
			return upper;

		if( num < lower )
			return lower;

		return num;

	}

	static public IntRange clip( int min, int max, int begin, int end ) {

		if( min > max )
			return null;
		return new IntRange( clip( begin, min, max ), clip( end, min, max ) );
	}

	static public int cyclicMod( int a, int mod ) {

		if( mod == 0 )
			throw new ArithmeticException( "divided by zero" );
		if( a == 0 )
			return 0;
		int m = a % mod;
		if( m * mod < 0 )
			return m + mod;
		else
			return m;

	}

	/**
	 * @param dividend
	 * @param divisor
	 * @return
	 */
	static public int divCeil( int dividend, int divisor ) {

		if( divisor == 0 )
			throw new ArithmeticException( "divided by zero" );

		return dividend / divisor + ( dividend % divisor == 0 ? 0 : 1 );
	}

	public static void main( String[] args ) {

		System.out.println( cyclicMod( 100, -7 ) );
		System.out.println( cyclicMod( -100, -7 ) );
		System.out.println( cyclicMod( 100, 7 ) );
		System.out.println( cyclicMod( -100, 7 ) );
		System.out.println( cyclicMod( 0, 7 ) );
	}

}
