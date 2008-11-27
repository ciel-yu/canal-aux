package sillia.io;

import java.io.FilterInputStream;
import java.io.InputStream;

public class AsciiTextFileInputStream
    extends FilterInputStream {

	public AsciiTextFileInputStream( InputStream in ) {

		super( in );
	}

}
