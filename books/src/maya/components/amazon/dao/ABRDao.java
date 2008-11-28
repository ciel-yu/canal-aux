package maya.components.amazon.dao;

import maya.components.amazon.model.AmazonBookRecord;

public interface ABRDao {

	public AmazonBookRecord get( String isbn );

	public AmazonBookRecord merge( AmazonBookRecord record );

	public void refresh( AmazonBookRecord record );

}