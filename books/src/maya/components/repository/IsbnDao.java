package maya.components.repository;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import maya.components.core.IsbnState;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.springframework.stereotype.Repository;

import sillia.collection.MapBuilder;

@Repository
public class IsbnDao
    extends AbstractRepository {

	private static final String SQL_NS = "isbn" + ".";

	public void addNewIsbn( List<String> isbns ) {

		this.getSqlMapClientTemplate().insert( SQL_NS + "insertIsbnList", isbns );

	}

	public List<IsbnRecord> getAnalyzingRecordList( int limit ) {

		MapBuilder<String, Object> mb = MapBuilder.build( new HashMap<String, Object>() );

		mb.put( "state", IsbnState.received );

		if( limit > -1 )
			mb.put( "limit", limit );

		return this.getSqlMapClientTemplate().queryForList( SQL_NS + "queryRecordList", mb.getMap() );
	}

	public List<IsbnRecord> getPendingKeys( int limit ) {

		MapBuilder<String, Object> mb = MapBuilder.build( new HashMap<String, Object>() );

		mb.put( "state", IsbnState.normal );

		if( limit > -1 )
			mb.put( "limit", limit );

		return this.getSqlMapClientTemplate().queryForList( SQL_NS + "queryRecordList", mb.getMap() );

	}

	public void saveIsbnRecord( IsbnRecord isbnRecord ) {

		this.getSqlMapClientTemplate().insert( SQL_NS + "insertRecordList", Collections.singletonList( isbnRecord ) );

	}

	public void test() {

		List<IsbnRecord> list = this.getSqlMapClientTemplate().queryForList( SQL_NS + "queryRecordList",
		//
		    null

		);
		for( IsbnRecord isbnRecord : list )
			System.out.println( ReflectionToStringBuilder.toString( isbnRecord, ToStringStyle.SHORT_PREFIX_STYLE ) );

	}

}
