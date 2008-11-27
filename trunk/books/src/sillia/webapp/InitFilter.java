package sillia.webapp;

import java.io.IOException;

import javax.servlet.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

public class InitFilter
    implements Filter {

	private static final Log log = LogFactory.getLog( InitFilter.class );

	private String contextPath;

	@Override
	public void destroy() {

		// noop

	}

	@Override
	public void doFilter( ServletRequest request, ServletResponse res, FilterChain chain )
	    throws IOException, ServletException {

		String siteContext =
		//
		request.getScheme() + "://" + request.getServerName()

		+ ( request.getServerPort() == 80 ? "" : ":" + request.getServerPort() ) + this.contextPath + "/";

		request.setAttribute( "siteContext", siteContext );

		chain.doFilter( request, res );

	}

	@Override
	public void init( FilterConfig config )
	    throws ServletException {

		this.contextPath = config.getServletContext().getContextPath();

	}

}
