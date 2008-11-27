package sillia.webapp.debug;

import java.io.IOException;
import java.util.Arrays;
import java.util.Enumeration;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class EchoServlet

    extends HttpServlet {

	private static final long serialVersionUID = -1359081286822402358L;

	private static final Log log = LogFactory.getLog( EchoServlet.class );

	@Override
	public void init( ServletConfig config )
	    throws ServletException {

	}

	@SuppressWarnings( "unchecked" )
	@Override
	protected void service( HttpServletRequest req, HttpServletResponse res )
	    throws ServletException, IOException {

		if( !log.isDebugEnabled() )
			return;

		for( Enumeration<String> names = req.getParameterNames(); names.hasMoreElements(); ) {
			String name = names.nextElement();

			log.debug( name + ": " + req.getParameter( name ) + "|" + Arrays.deepToString( req.getParameterValues( name ) ) );

		}

	}
}
