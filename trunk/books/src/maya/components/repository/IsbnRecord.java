package maya.components.repository;

public class IsbnRecord {

	/**
	 * content
	 */
	private String content;

	/**
	 * data
	 */
	private byte[] data;

	/**
	 * id
	 */
	private int id;

	/**
	 * isbn
	 */
	private String isbn;

	/**
	 * state
	 */
	private int state;

	public String getContent() {

		return this.content;
	}

	public byte[] getData() {

		return this.data;
	}

	public int getId() {

		return this.id;
	}

	public String getIsbn() {

		return this.isbn;
	}

	public int getState() {

		return this.state;
	}

	public void setContent( String val ) {

		this.content = val;
	}

	public void setData( byte[] val ) {

		this.data = val;
	}

	public void setId( int val ) {

		this.id = val;
	}

	public void setIsbn( String val ) {

		this.isbn = val;
	}

	public void setState( int val ) {

		this.state = val;
	}

}
