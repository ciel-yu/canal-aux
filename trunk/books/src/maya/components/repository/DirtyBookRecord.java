package maya.components.repository;

public class DirtyBookRecord {

	/**
	 * id
	 * 
	 * PK
	 */
	private int id;

	/**
	 * author
	 */
	private String author;

	/**
	 * title
	 */
	private String title;

	/**
	 * create_date
	 */
	private java.sql.Timestamp create_date;

	/**
	 * ISBN
	 */
	private String ISBN;

	/**
	 * EAN
	 */
	private String EAN;

	/**
	 * state
	 */
	private int state;

	/**
	 * update_date
	 */
	private java.sql.Timestamp update_date;

	public String getAuthor() {

		return this.author;
	}

	public java.sql.Timestamp getCreate_date() {

		return this.create_date;
	}

	public String getEAN() {

		return this.EAN;
	}

	public int getId() {

		return this.id;
	}

	public String getISBN() {

		return this.ISBN;
	}

	public int getState() {

		return this.state;
	}

	public String getTitle() {

		return this.title;
	}

	public java.sql.Timestamp getUpdate_date() {

		return this.update_date;
	}

	public void setAuthor( String val ) {

		this.author = val;
	}

	public void setCreate_date( java.sql.Timestamp val ) {

		this.create_date = val;
	}

	public void setEAN( String val ) {

		this.EAN = val;
	}

	public void setId( int val ) {

		this.id = val;
	}

	public void setISBN( String val ) {

		this.ISBN = val;
	}

	public void setState( int val ) {

		this.state = val;
	}

	public void setTitle( String val ) {

		this.title = val;
	}

	public void setUpdate_date( java.sql.Timestamp val ) {

		this.update_date = val;
	}

}
