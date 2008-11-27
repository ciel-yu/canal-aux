package maya.components.repository;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import org.springframework.context.support.ApplicationObjectSupport;
import org.springframework.orm.ibatis.SqlMapClientTemplate;

import com.ibatis.sqlmap.client.SqlMapClient;

public abstract class AbstractRepository
    extends ApplicationObjectSupport {

	@Resource
	private SqlMapClient sqlMapClient;

	private SqlMapClientTemplate sqlMapClientTemplate;

	public void setSqlMapClient( SqlMapClient sqlMapClient ) {

		this.sqlMapClient = sqlMapClient;
	}

	protected SqlMapClientTemplate getSqlMapClientTemplate() {

		return this.sqlMapClientTemplate;
	}

	@SuppressWarnings( "unused" )
	@PostConstruct
	final private void initSqlMapClientTemplate() {

		this.sqlMapClientTemplate = new SqlMapClientTemplate( this.sqlMapClient );

	}

}
