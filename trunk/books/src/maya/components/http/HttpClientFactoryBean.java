package maya.components.http;

import javax.annotation.PostConstruct;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.MultiThreadedHttpConnectionManager;
import org.apache.commons.httpclient.params.HttpConnectionManagerParams;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.springframework.beans.factory.FactoryBean;
import org.springframework.context.support.ApplicationObjectSupport;

public class HttpClientFactoryBean
    extends ApplicationObjectSupport
    implements FactoryBean {

	private String userAgent = "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.2; .NET CLR 1.1.4322; .NET CLR 2.0.50727; .NET CLR 3.0.04506.30)";

	private MultiThreadedHttpConnectionManager httpConnectionManager = new MultiThreadedHttpConnectionManager();

	@SuppressWarnings( "deprecation" )
	public Object getObject()
	    throws Exception {

		HttpClient httpClient = new HttpClient( httpConnectionManager );
		httpClient.getParams().setParameter( HttpMethodParams.USER_AGENT, userAgent );
		httpClient.getParams().setParameter( HttpMethodParams.RETRY_HANDLER, new DefaultHttpMethodRetryHandler( 0, false ) );

		return httpClient;
	}

	@SuppressWarnings( "unchecked" )
	public Class getObjectType() {

		return HttpClient.class;

	}

	@PostConstruct
	public void init() {

		HttpConnectionManagerParams params = this.httpConnectionManager.getParams();
		logger.info( "defaultMaxConnectionsPerHost:" + params.getDefaultMaxConnectionsPerHost() );
		logger.info( "maxTotalConnections:" + params.getMaxTotalConnections() );
		logger.info( "connectionTimeout:" + params.getConnectionTimeout() );
		logger.info( "soTimeout:" + params.getSoTimeout() );
		logger.info( "userAgent:" + userAgent );

	}

	public boolean isSingleton() {

		return true;
	}

	public void setHttpConnectionManager( MultiThreadedHttpConnectionManager httpConnectionManager ) {

		this.httpConnectionManager = httpConnectionManager;
	}

	public void setUserAgent( String userAgent ) {

		this.userAgent = userAgent;
	}

}
