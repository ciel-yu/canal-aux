package sillia;

import maya.components.amazon.dao.ABRDao;
import maya.components.amazon.model.AmazonBookRecord;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Scratch {

	public static void main( String[] args ) {

		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext( new String[] { "db.ctx.xml" } );

		ctx.registerShutdownHook();

		ABRDao dao = (ABRDao)ctx.getBean( "isbnDao" );

		AmazonBookRecord record = new AmazonBookRecord();

		record.setIsbn( "1213123111212" );
		record.setTitle( "12312" );
		// record.setUpdateTime( new Date() );

		dao.merge( record );

	}

}
