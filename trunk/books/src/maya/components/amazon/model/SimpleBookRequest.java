package maya.components.amazon.model;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table( name = "request" )
public class SimpleBookRequest
    implements Serializable {

	private static final long serialVersionUID = -6498392377825911213L;

	private String author;

	@Id
	@GeneratedValue( generator = "identity" )
	@GenericGenerator( name = "identity", strategy = "identity" )
	private Integer id;

	private String isbn;

	private int status = 0;

	private String title;

	public String getAuthor() {

		return author;
	}

	public Integer getId() {

		return id;
	}

	public String getIsbn() {

		return isbn;
	}

	public int getStatus() {

		return status;
	}

	public String getTitle() {

		return title;
	}

	public void setAuthor( String author ) {

		this.author = author;
	}

	public void setId( Integer id ) {

		this.id = id;
	}

	public void setIsbn( String isbn ) {

		this.isbn = isbn;
	}

	public void setStatus( int status ) {

		this.status = status;
	}

	public void setTitle( String title ) {

		this.title = title;
	}

}
