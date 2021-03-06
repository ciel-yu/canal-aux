package maya.components.amazon;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import maya.components.amazon.infra.SimpleBooksSearchRequest;
import maya.components.amazon.model.AmazonBookRecord;
import maya.components.http.HttpClientUtil;

import org.apache.commons.digester.Digester;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.PostMethod;
import org.springframework.context.support.ApplicationObjectSupport;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

@Component
public class BookSearchTask
    extends ApplicationObjectSupport {

	private String serviceHost = "http://ecs.amazonaws.jp/onca/xml";

	@Resource
	private HttpClient httpClient;

	public List<AmazonBookRecord> search( SimpleBooksSearchRequest request )
	    throws HttpException, IOException, SAXException {

		PostMethod postMethod = new PostMethod( this.serviceHost );

		Map<String, String> params = request.prepareHttpMethod();

		NameValuePair[] nvps = HttpClientUtil.toNameValuePairs( params );

		postMethod.setRequestBody( nvps );

		int scode = this.httpClient.executeMethod( postMethod );

		InputStream is = postMethod.getResponseBodyAsStream();

		List<AmazonBookRecord> list = new ArrayList<AmazonBookRecord>();

		Digester digester = new Digester();

		digester.addObjectCreate( "*/ItemAttributes", AmazonBookRecord.class );
		digester.addCallMethod( "*/ItemAttributes/Author", "setAuthor", 0 );
		digester.addCallMethod( "*/ItemAttributes/Binding", "setBinding", 0 );
		digester.addCallMethod( "*/ItemAttributes/Creator", "setCreator", 0 );
		digester.addCallMethod( "*/ItemAttributes/EAN", "setEan", 0 );
		digester.addCallMethod( "*/ItemAttributes/ISBN", "setIsbn", 0 );
		digester.addCallMethod( "*/ItemAttributes/PublicationDate", "setPublicationDate", 0 );
		digester.addCallMethod( "*/ItemAttributes/Publisher", "setPublisher", 0 );
		digester.addCallMethod( "*/ItemAttributes/Title", "setTitle", 0 );
		digester.addSetNext( "*/ItemAttributes", "add" );

		digester.push( list );

		digester.parse( is );

		return list;
	}

}
