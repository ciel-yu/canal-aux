package sillia.webapp.debug;

import javax.servlet.http.*;

import org.springframework.web.context.support.WebApplicationObjectSupport;

/**
 * @author IFREETA
 * 
 */
public class DebugSessionListener
    extends WebApplicationObjectSupport
    implements HttpSessionAttributeListener, HttpSessionListener {

	@Override
	public void attributeAdded( HttpSessionBindingEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[_S]" + "[" + e.getSession().getId() + "]" + "[+]: " + e.getName() + " | " + e.getValue() );
	}

	@Override
	public void attributeRemoved( HttpSessionBindingEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[_S]" + "[" + e.getSession().getId() + "]" + "[-]: " + e.getName() );
	}

	@Override
	public void attributeReplaced( HttpSessionBindingEvent e ) {

		if( this.logger.isTraceEnabled() ) {
			String name = e.getName();
			HttpSession session = e.getSession();
			this.logger.trace( "[_S]" + "[" + session.getId() + "]" + "[*]: " + name + " | " + session.getAttribute( name ) + " <- " + e.getValue() );
		}
	}

	@Override
	public void sessionCreated( HttpSessionEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[_S]" + "[" + e.getSession().getId() + "]" + "[#]" );

	}

	@Override
	public void sessionDestroyed( HttpSessionEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[_S]" + "[" + e.getSession().getId() + "]" + "[X]" );

	}

}
