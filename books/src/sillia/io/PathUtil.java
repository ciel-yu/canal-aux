package sillia.io;

import java.io.File;
import java.net.MalformedURLException;
import java.net.URI;

public class PathUtil {

	public static String getRelative( File base, File dest )
	    throws MalformedURLException {

		URI relativize = base.toURI().relativize( dest.toURI() );

		return relativize.getPath();
	}

}
