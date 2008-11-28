package maya.components.amazon.dao;

import maya.components.amazon.model.AmazonBookRecord;

import org.springframework.orm.hibernate3.HibernateTemplate;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class ABRDaoImpl
    extends HibernateDaoSupport
    implements ABRDao {

	private final Class<AmazonBookRecord> entityClass = AmazonBookRecord.class;

	public AmazonBookRecord get( String isbn ) {

		return (AmazonBookRecord)this.getHibernateTemplate().get( entityClass, isbn );
	}

	@Transactional
	public AmazonBookRecord merge( AmazonBookRecord record ) {

		HibernateTemplate tmpl = this.getHibernateTemplate();

		return (AmazonBookRecord)tmpl.merge( record );
	}

	public void refresh( AmazonBookRecord record ) {

		this.getHibernateTemplate().refresh( record );

	}

}
