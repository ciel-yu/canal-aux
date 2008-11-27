package sillia.collection;

import java.util.Map;

public class MapBuilder<K, V> {

	public static <K, V> MapBuilder<K, V> build( Map<K, V> map ) {

		return new MapBuilder<K, V>( map );
	}

	private Map<K, V> map;

	protected MapBuilder( Map<K, V> m ) {

		this.map = m;
	}

	public MapBuilder<K, V> clear() {

		this.map.clear();
		return this;
	}

	public Map<K, V> getMap() {

		return this.map;
	}

	public MapBuilder<K, V> put( K key, V val ) {

		this.map.put( key, val );
		return this;
	}

	public MapBuilder<K, V> putAll( Map<? extends K, ? extends V> m ) {

		this.map.putAll( m );
		return this;
	}

	public MapBuilder<K, V> remove( Object key ) {

		this.map.remove( key );
		return this;
	}

}
