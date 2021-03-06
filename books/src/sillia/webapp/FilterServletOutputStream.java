/**
 *  Copyright 2003-2007 Greg Luck
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

package sillia.webapp;

import java.io.IOException;
import java.io.OutputStream;

import javax.servlet.ServletOutputStream;

public class FilterServletOutputStream
    extends ServletOutputStream {

	private OutputStream stream;

	public FilterServletOutputStream( final OutputStream stream ) {

		this.stream = stream;
	}

	@Override
	public void write( final byte[] b )
	    throws IOException {

		this.stream.write( b );
	}

	@Override
	public void write( final byte[] b, final int off, final int len )
	    throws IOException {

		this.stream.write( b, off, len );
	}

	@Override
	public void write( final int b )
	    throws IOException {

		this.stream.write( b );
	}
}
