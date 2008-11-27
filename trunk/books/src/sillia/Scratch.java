package sillia;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Scratch {

	public static void main( String[] args ) {

		ClassPathXmlApplicationContext ctx = new ClassPathXmlApplicationContext( new String[] { "db.ctx.xml" } );

		ctx.registerShutdownHook();

	}

}
