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

import java.io.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import net.sf.ehcache.constructs.web.filter.FilterServletOutputStream;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

/**
 * Provides a wrapper for {@link javax.servlet.http.HttpServletResponseWrapper}.
 * <p/> It is used to wrap the real Response so that we can modify it after that
 * the target of the request has delivered its response. <p/> It uses the
 * Wrapper pattern.
 * 
 * @author <a href="mailto:gluck@thoughtworks.com">Greg Luck</a>
 * @version $Id: GenericResponseWrapper.java 336 2007-02-15 21:36:31Z gregluck $
 */
public class GenericResponseWrapper
    extends HttpServletResponseWrapper
    implements Serializable {

	private static final long serialVersionUID = -5976708169031065498L;

	private static final Log LOG = LogFactory.getLog( GenericResponseWrapper.class );

	private int statusCode = SC_OK;

	private int contentLength;

	private String contentType;

	private final List<String[]> headers = new ArrayList<String[]>();

	private final List<Cookie> cookies = new ArrayList<Cookie>();

	private ServletOutputStream outstr;

	private PrintWriter writer;

	/**
	 * Creates a GenericResponseWrapper
	 */
	public GenericResponseWrapper( final HttpServletResponse response, final OutputStream outstr ) {

		super( response );
		this.outstr = new FilterServletOutputStream( outstr );
	}

	/**
	 * Adds a cookie.
	 */
	@Override
	public void addCookie( final Cookie cookie ) {

		this.cookies.add( cookie );
		super.addCookie( cookie );
	}

	/**
	 * Adds a header.
	 */
	@Override
	public void addHeader( final String name, final String value ) {

		final String[] header = new String[] { name, value };
		this.headers.add( header );
		super.addHeader( name, value );
	}

	/**
	 * Override the deprecated method and call non-deprecated method
	 */
	@Override
	public String encodeRedirectUrl( String s ) {

		return super.encodeRedirectURL( s );
	}

	/**
	 * Override the deprecated method and call non-deprecated method
	 */
	@Override
	public String encodeUrl( String s ) {

		return super.encodeURL( s );
	}

	/**
	 * Flushes all the streams for this response.
	 */
	public void flush()
	    throws IOException {

		if( this.writer != null )
			this.writer.flush();
		this.outstr.flush();
	}

	/**
	 * Flushes buffer and commits response to client.
	 */
	@Override
	public void flushBuffer()
	    throws IOException {

		this.flush();
		super.flushBuffer();
	}

	/**
	 * Gets the content length.
	 */
	public int getContentLength() {

		return this.contentLength;
	}

	/**
	 * Gets the content type.
	 */
	@Override
	public String getContentType() {

		return this.contentType;
	}

	/**
	 * Gets all the cookies.
	 */
	public Collection<Cookie> getCookies() {

		return this.cookies;
	}

	/**
	 * Gets the headers.
	 */
	public Collection<String[]> getHeaders() {

		return this.headers;
	}

	/**
	 * Gets the outputstream.
	 */
	@Override
	public ServletOutputStream getOutputStream() {

		return this.outstr;
	}

	/**
	 * Returns the status code for this response.
	 */
	public int getStatus() {

		return this.statusCode;
	}

	/**
	 * Gets the print writer.
	 */
	@Override
	public PrintWriter getWriter()
	    throws IOException {

		if( this.writer == null )
			this.writer = new PrintWriter( new OutputStreamWriter( this.outstr, this.getCharacterEncoding() ), true );
		return this.writer;
	}

	/**
	 * Resets the response.
	 */
	@Override
	public void reset() {

		super.reset();
		this.cookies.clear();
		this.headers.clear();
		this.statusCode = SC_OK;
		this.contentType = null;
		this.contentLength = 0;
	}

	/**
	 * Resets the buffers.
	 */
	@Override
	public void resetBuffer() {

		super.resetBuffer();
	}

	/**
	 * Send the error. If the response is not ok, most of the logic is bypassed
	 * and the error is sent raw Also, the content is not cached.
	 * 
	 * @param i
	 *            the status code
	 * @throws IOException
	 */
	@Override
	public void sendError( int i )
	    throws IOException {

		this.statusCode = i;
		super.sendError( i );
	}

	/**
	 * Send the error. If the response is not ok, most of the logic is bypassed
	 * and the error is sent raw Also, the content is not cached.
	 * 
	 * @param i
	 *            the status code
	 * @param string
	 *            the error message
	 * @throws IOException
	 */
	@Override
	public void sendError( int i, String string )
	    throws IOException {

		this.statusCode = i;
		super.sendError( i, string );
	}

	/**
	 * Send the redirect. If the response is not ok, most of the logic is
	 * bypassed and the error is sent raw. Also, the content is not cached.
	 * 
	 * @param string
	 *            the URL to redirect to
	 * @throws IOException
	 */
	@Override
	public void sendRedirect( String string )
	    throws IOException {

		this.statusCode = HttpServletResponse.SC_MOVED_TEMPORARILY;
		super.sendRedirect( string );
	}

	/**
	 * Sets the content length.
	 */
	@Override
	public void setContentLength( final int length ) {

		this.contentLength = length;
		super.setContentLength( length );
	}

	/**
	 * Sets the content type.
	 */
	@Override
	public void setContentType( final String type ) {

		this.contentType = type;
		super.setContentType( type );
	}

	/**
	 * @see #addHeader
	 */
	@Override
	public void setHeader( final String name, final String value ) {

		this.addHeader( name, value );
	}

	/**
	 * Sets the status code for this response.
	 */
	@Override
	public void setStatus( final int code ) {

		this.statusCode = code;
		super.setStatus( code );
	}

	/**
	 * Sets the status code for this response.
	 */
	@Override
	public void setStatus( final int code, final String msg ) {

		this.statusCode = code;
		LOG.warn( "Discarding message because this method is deprecated." );
		super.setStatus( code );
	}

}
