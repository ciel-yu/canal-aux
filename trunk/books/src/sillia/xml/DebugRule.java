package sillia.xml;

import org.apache.commons.digester.Rule;
import org.xml.sax.Attributes;

public class DebugRule
    extends Rule {

	@Override
	public void begin( String namespace, String name, Attributes attributes )
	    throws Exception {

		System.out.println( name );
		super.begin( namespace, name, attributes );
	}

}
