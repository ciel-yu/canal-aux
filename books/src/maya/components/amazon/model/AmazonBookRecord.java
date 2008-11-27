package maya.components.amazon.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang.builder.ReflectionToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;

@Entity
@Table( name = "isbn" )
public class AmazonBookRecord {

	private String creator;

	private String author;

	private String binding;

	private String ean;

	private String isbn;

	private String publicationDate;

	private String publisher;

	private String title;

	public String getAuthor() {

		return this.author;
	}

	public String getBinding() {

		return this.binding;
	}

	public String getCreator() {

		return this.creator;
	}

	public String getEan() {

		return this.ean;
	}

	public String getIsbn() {

		return this.isbn;
	}

	public String getPublicationDate() {

		return this.publicationDate;
	}

	public String getPublisher() {

		return this.publisher;
	}

	public String getTitle() {

		return this.title;
	}

	public void setAuthor( String author ) {

		this.author = author;
	}

	public void setBinding( String binding ) {

		this.binding = binding;
	}

	public void setCreator( String creator ) {

		this.creator = creator;
	}

	public void setEan( String ean ) {

		this.ean = ean;
	}

	public void setIsbn( String isbn ) {

		this.isbn = isbn;
	}

	public void setPublicationDate( String publicationDate ) {

		this.publicationDate = publicationDate;
	}

	public void setPublisher( String publisher ) {

		this.publisher = publisher;
	}

	public void setTitle( String title ) {

		this.title = title;
	}

	@Override
	public String toString() {

		return ReflectionToStringBuilder.toString( this, ToStringStyle.SHORT_PREFIX_STYLE );
	}

}
