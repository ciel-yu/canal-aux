package sillia.text;

import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javolution.util.FastSet;

import org.apache.commons.lang.StringUtils;

public class TagExtractor {

	private static final Pattern pat01 = Pattern.compile( "(\\[[^\\]]*\\]|\\([^\\)]*\\))|([^\\[\\(]+)" );

	@SuppressWarnings( "unchecked" )
	public static void main( String[] args ) {

		System.out.println( getTags( "[11111(123123)11]4  4444  {44 444}5 55 55()[2345]" ) );

	}

	public static Set<String> getTags( String name ) {

		FastSet<String> tags = new FastSet<String>();

		Matcher m = pat01.matcher( name );

		for( ; m.find(); ) {

			if( m.group( 1 ) != null ) {
				tags.add( m.group( 1 ) );
			} else {
				tags.add( StringUtils.trim( m.group( 2 ) ) );

			}

		}
		return tags;
	}
}
