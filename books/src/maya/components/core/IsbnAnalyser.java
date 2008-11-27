package maya.components.core;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.zip.GZIPInputStream;

import javax.annotation.Resource;

import maya.components.amazon.model.AmazonBookRecord;
import maya.components.repository.IsbnDao;
import maya.components.repository.IsbnRecord;

import org.apache.commons.digester.Digester;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;
import org.springframework.context.support.ApplicationObjectSupport;
import org.springframework.stereotype.Component;
import org.xml.sax.SAXException;

import flexjson.JSONSerializer;

@Component
public class IsbnAnalyser
    extends ApplicationObjectSupport {

	private static List<AmazonBookRecord> parse( Reader reader )
	    throws IOException, SAXException {

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

		digester.parse( reader );

		return list;
	}

	@Resource
	private IsbnDao isbnDao;

	public static void main( String[] args )
	    throws DocumentException {

		final SAXReader reader = new SAXReader();
		final Document doc = reader.read( new File( "data/amazon.res.xml" ) );

		final List<Element> nodes = doc.selectNodes( "//*" );

		for( Element node : nodes ) {
			System.out.println( node.getQName() );
		}

	}

	public void analyze() {

		JSONSerializer serializer = new JSONSerializer();
		serializer.setExcludes( Collections.singletonList( "class" ) );

		try {
			List<IsbnRecord> ilist = this.isbnDao.getAnalyzingRecordList( 100 );

			for( IsbnRecord isbnRecord : ilist ) {

				GZIPInputStream is = new GZIPInputStream( new ByteArrayInputStream( isbnRecord.getData() ) );

				List<AmazonBookRecord> list = IsbnAnalyser.parse( new InputStreamReader( is, "utf-8" ) );

				for( AmazonBookRecord amazonBookRecord : list )
					this.logger.debug( serializer.serialize( amazonBookRecord ) );

			}
		} catch( UnsupportedEncodingException e ) {
			this.logger.debug( "", e );
		} catch( IOException e ) {
			this.logger.debug( "", e );
		} catch( SAXException e ) {
			this.logger.debug( "", e );
		}

	}
}
