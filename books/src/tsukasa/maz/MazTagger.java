package tsukasa.maz;

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.context.support.ApplicationObjectSupport;

public class MazTagger
    extends ApplicationObjectSupport {

	public static void main( String[] args ) {

		MazTagger m = new MazTagger();

		m.foo();

	}

	private List<MazIdAnalyzer> afadsf = new ArrayList<MazIdAnalyzer>();

	@SuppressWarnings( "unchecked" )
	private void foo() {

		String p1 = "P:/.HC/.maz/03";

		Collection<File> files = FileUtils.listFiles( new File( p1 ), null, false );

		for( File file : files ) {

			String bn = FilenameUtils.getBaseName( file.getName() );

			String mazid = this.getMazId( bn );
			String v = this.getVol( bn );
			String d = this.getdate( bn );

			this.logger.trace( bn );
			this.logger.trace( "m:" + mazid + " d:" + d + " v:" + v );

		}

	}

	private String getdate( String bn ) {

		List<Pattern> pl = new ArrayList<Pattern>();

		pl.add( Pattern.compile( "(\\d{4})-(\\d{2})?", Pattern.CASE_INSENSITIVE ) );
		pl.add( Pattern.compile( "(\\d{4})年(\\d{1,2})月(号|號)?", Pattern.CASE_INSENSITIVE ) );

		String r = "0000-00";

		String y = "";
		String mon = "";
		for( Pattern pattern : pl ) {

			Matcher m = pattern.matcher( bn );

			if( m.find() ) {

				y = m.group( 1 );
				mon = StringUtils.leftPad( m.group( 2 ), 2, '0' );
				r = y + "-" + mon;
				break;
			}

		}

		return r;
	}

	private String getMazId( String bn ) {

		for( MazIdAnalyzer mazIdAnalyzer : this.afadsf )
			if( mazIdAnalyzer.match( bn ) )
				return mazIdAnalyzer.getMazid();

		return null;

	}

	private String getVol( String bn ) {

		List<Pattern> pl = new ArrayList<Pattern>();

		pl.add( Pattern.compile( "#(0?\\d\\d)" ) );
		pl.add( Pattern.compile( "vol.(0?\\d\\d)", Pattern.CASE_INSENSITIVE ) );

		String r = "#---";
		for( Pattern pattern : pl ) {

			Matcher m = pattern.matcher( bn );

			if( m.find() ) {

				r = "#" + StringUtils.leftPad( m.group( 1 ), 3, '0' );

				break;
			}

		}

		return r;
	}
}
