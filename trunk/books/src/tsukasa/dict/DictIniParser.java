package tsukasa.dict;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.time.FastDateFormat;

public class DictIniParser {

	public static void main( String[] args )
	    throws IOException {

		FileInputStream fis = new FileInputStream( "./data/dict.ini" );

		InputStreamReader isr = new InputStreamReader( fis, "gbk" );

		BufferedReader reader = new BufferedReader( isr );

		Pattern p1 = Pattern.compile( "\\[(.*)\\]" );
		Pattern p2 = Pattern.compile( "(\\w+)=(.*)" );
		List<Map<String, String>> entries = new ArrayList<Map<String, String>>();

		Map<String, String> lastEntry = null;

		HashSet<String> kws = new HashSet<String>();

		for( String line = reader.readLine(); line != null; line = reader.readLine() ) {
			Matcher m1 = p1.matcher( line );
			if( m1.matches() ) {

				lastEntry = new HashMap<String, String>();

				lastEntry.put( "keyword", m1.group( 1 ) );

				entries.add( lastEntry );

				continue;

			}
			FastDateFormat f = FastDateFormat.getInstance( "yyyy-MM-dd HH:mm:ss(ZZ)" );
			Matcher m2 = p2.matcher( line );
			if( m2.matches() ) {
				if( lastEntry == null )
					throw new RuntimeException();
				if( m2.group( 1 ).compareToIgnoreCase( "time" ) == 0 )
					lastEntry.put( m2.group( 1 ), f.format( new Date( Long.parseLong( m2.group( 2 ) ) * 1000 ) ) );
				else
					lastEntry.put( m2.group( 1 ), m2.group( 2 ) );

			}

		}

		for( Map<String, String> d : entries ) {
			kws.addAll( d.keySet() );

		}
		System.out.println( kws );

	}
}
