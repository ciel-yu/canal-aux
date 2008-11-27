package kagami.sandbox;

import java.util.ArrayList;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class DigitParser {

	private static final String _ZERO = "零";

	private static char digits[] = "零一二三四五六七八九".toCharArray();

	final private static Log log = LogFactory.getLog( DigitParser.class );

	private static String unit1[] = { "", "十", "百", "千" };

	private static String unit2[] = { "", "万", "億", "兆", "京", "垓", "秭", "穣", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数" };

	@SuppressWarnings( "unused" )
	private static String unit3[] = { "分", "厘", "毫", "糸", "忽", "微", "繊", "沙", "塵", "埃", "渺", "漠", "模糊", "逡巡", "須臾", "瞬息", "彈指", "刹那", "六德", "虚空", "清淨", "阿頼耶", "阿摩羅", "涅槃寂静" };

	@SuppressWarnings( "unused" )
	public static void main( String[] args ) {

		String ds0[] = { "110340", "091832740001923.", "091832740001923.1234100234123", "0.1234100234123", "1234100234123" };

		for( String i : ds0 ) {
			log.info( toChineseReading( i ) );
		}

	}

	public static String toChineseReading( String input ) {

		String[] parts = input.split( "\\." );

		String result = translate( parts[0] );
		if( parts.length > 1 )
			result += "点" + translateDecimal( parts[1] );
		return result;
	}

	private static String[] makeGroup( String input ) {

		ArrayList<String> groups = new ArrayList<String>();

		final int len = input.length();

		for( int start = 0, end = len % 4 == 0 ? 4 : len % 4; end <= len; start = end, end += 4 )
			groups.add( input.subSequence( start, end ).toString() );

		return groups.toArray( new String[0] );
	}

	private static String translate( String input ) {

		if( Pattern.matches( "0+", input ) )
			return _ZERO;

		String groups[] = makeGroup( StringUtils.stripStart( input, "0" ) );

		StringBuilder buffer = new StringBuilder();
		for( int i = 0; i < groups.length; i++ ) {
			String r = translateGroup( groups[i] );
			if( r != null )
				buffer.append( r ).append( unit2[groups.length - i - 1] );
			else
				buffer.append( _ZERO );
		}

		return buffer.toString().replaceAll( "零+", _ZERO ).replaceFirst( "^一十", "十" );
	}

	private static String translateDecimal( String input ) {

		StringBuilder buffer = new StringBuilder();
		for( int i = 0; i < input.length(); ++i )
			buffer.append( digits[input.charAt( i ) - '0'] );
		return buffer.toString();
	}

	private static String translateGroup( String input ) {

		if( Pattern.matches( "0+", input ) )
			return null;

		StringBuilder buffer = new StringBuilder();
		final int len = input.length();
		for( int i = 0; i < len; ++i ) {
			char digit = input.charAt( len - i - 1 );

			if( digit == '0' )
				buffer.append( digits[0] );
			else
				buffer.append( unit1[i] ).append( digits[digit - '0'] );

		}
		return StringUtils.stripEnd( buffer.reverse().toString(), _ZERO );
	}
}
