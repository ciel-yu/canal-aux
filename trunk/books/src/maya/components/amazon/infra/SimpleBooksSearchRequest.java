package maya.components.amazon.infra;

import java.util.*;

import org.apache.commons.codec.EncoderException;
import org.apache.commons.codec.net.URLCodec;

public class SimpleBooksSearchRequest {

	private String accessKeyId = "12743NDQC2GV9WXECFG2";

	private String apiVersion = "2008-08-19";

	private String author;

	private Set<String> keywords = new HashSet<String>();

	private String service = "AWSECommerceService";

	private String serviceHost = "http://ecs.amazonaws.jp/onca/xml";

	private String title;

	public String getAccessKeyId() {

		return accessKeyId;
	}

	public String getApiVersion() {

		return apiVersion;
	}

	public String getAuthor() {

		return author;
	}

	public Set<String> getKeywords() {

		return keywords;
	}

	public String getService() {

		return service;
	}

	public String getServiceHost() {

		return serviceHost;
	}

	public String getTitle() {

		return title;
	}

	public Map<String, String> prepareHttpMethod( ) {

		try {
			URLCodec codec = new URLCodec( "utf-8" );

			Map<String, String> params = new HashMap<String, String>();

			params.put( "Service", service );
			params.put( "AWSAccessKeyId", accessKeyId );
			params.put( "Version", apiVersion );

			params.put( "Operation", "ItemSearch" );

			params.put( "ItemSearch.1.SearchIndex", "Books" );
			params.put( "ItemSearch.1.ResponseGroup", "ItemAttributes" );
			params.put( "ItemSearch.1.Condition", "All" );

			if( keywords.size() == 1 ) {
				params.put( "ItemSearch.1.Keywords", codec.encode( keywords.iterator().next() ) );
			} else {
				Iterator<String> itor = keywords.iterator();
				for( int i = 1; itor.hasNext(); ++i ) {
					params.put( "ItemSearch.1.Keywords." + i, codec.encode( itor.next() ) );
				}
			}

			if( author != null ) {
				params.put( "ItemSearch.1.Author", codec.encode( author ) );
			}
			if( title != null ) {
				params.put( "ItemSearch.1.Title", codec.encode( title ) );
			}

			return params;
		} catch( EncoderException e ) {

		}
		return null;
	}

	public void setAccessKeyId( String accessKeyId ) {

		this.accessKeyId = accessKeyId;
	}

	public void setApiVersion( String apiVersion ) {

		this.apiVersion = apiVersion;
	}

	public void setAuthor( String author ) {

		this.author = author;
	}

	public void setService( String service ) {

		this.service = service;
	}

	public void setServiceHost( String serviceHost ) {

		this.serviceHost = serviceHost;
	}

	public void setTitle( String title ) {

		this.title = title;
	}

}
