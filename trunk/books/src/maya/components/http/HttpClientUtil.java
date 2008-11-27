package maya.components.http;

import java.util.ArrayList;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;

import org.apache.commons.httpclient.NameValuePair;

public class HttpClientUtil {

	public static NameValuePair[] toNameValuePairs( Map<String, String> params ) {

		ArrayList<NameValuePair> list = new ArrayList<NameValuePair>();

		Set<Entry<String, String>> entries = params.entrySet();
		for( Entry<String, String> entry : entries ) {

			NameValuePair nameValuePair = new NameValuePair( entry.getKey(), entry.getValue() );

			list.add( nameValuePair );

		}

		return list.toArray( new NameValuePair[] {} );
	}
}
