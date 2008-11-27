package sillia.text;

import java.io.IOException;
import java.io.StringReader;

public class StringGrouper {

	public static String group( String text, int count, String delim ) {

		StringReader r = new StringReader( text );

		StringBuilder stringBuilder = new StringBuilder();
		try {
			for( int c = r.read(), len = count; c != -1; c = r.read() ) {
				if( len <= 0 ) {
					stringBuilder.append( delim );
					len = count;
				}
				stringBuilder.append( (char)c );
				--len;
			}
		} catch( IOException e ) {
		}
		return stringBuilder.toString();
	}

}
