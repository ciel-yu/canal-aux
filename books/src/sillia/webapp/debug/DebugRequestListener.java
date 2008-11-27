package sillia.webapp.debug;

import javax.servlet.ServletRequest;
import javax.servlet.ServletRequestAttributeEvent;
import javax.servlet.ServletRequestAttributeListener;

import org.springframework.web.context.support.WebApplicationObjectSupport;

/**
 * @author IFREETA
 * 
 */
public class DebugRequestListener
    extends WebApplicationObjectSupport
    implements ServletRequestAttributeListener {

	@Override
	public void attributeAdded( ServletRequestAttributeEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[R_]" + "[+]: " + e.getName() + " | " + e.getValue() );

	}

	@Override
	public void attributeRemoved( ServletRequestAttributeEvent e ) {

		if( this.logger.isTraceEnabled() )
			this.logger.trace( "[R_]" + "[-]: " + e.getName() );

	}

	@Override
	public void attributeReplaced( ServletRequestAttributeEvent e ) {

		if( this.logger.isTraceEnabled() ) {
			String name = e.getName();
			ServletRequest request = e.getServletRequest();
			this.logger.trace( "[R_]" + "[*]: " + name + " | " + request.getAttribute( name ) + " <- " + e.getValue() );
		}

	}

}
