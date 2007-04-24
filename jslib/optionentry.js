// Authored By Ciel

// dependency: Prototype Library, compat.js

if( typeof(OptionEntry) == 'undefined' )
{
	g_optionEntryManager = {
		entries:[],
		id_count:0,
		addEntry:function( entry )
		{
			this.entries.push( entry );
			entry.id = this.entries.length;
		},
		getEntry:function( id ){ return this.entries[id]; }
	};
	
	OptionEntry = function( title, value , children )
	{
		this.id = null;
		this.title = title;
		this.value = value;
		if( children )
		{
			this.children = children;
		   	for( var i = 0; i < children.length; ++i )
	    	{
	    		this.children[i].parentid = this.id;
	    	}
		}
		else
			this.children = [];
		//this.parent = null;
		g_optionEntryManager.addEntry( this );
	};
	
	OptionEntry.prototype.add = function( entry )
	{
		this.children.push( entry );
		entry.parentid = this.id;
		return this;
	};
	
	OptionEntry.prototype.addEntry = function( label, value )
	{
		this.add( new OptionEntry( label, value ) );
		return this;
	};
		
	OptionEntry.prototype.initSelect = function ( oSelect, oSlave, nullEntry )
	{
	    // remove options
	    oSelect.options.length = 0;
	    
	    // populate new options and entries
	    if( this.children.length )
	    {
		    for( var j = 0; j < this.children.length; ++j )
		    {
		    	entry = this.children[j];
		    	opt = new Option( entry.title, entry.value );
		    	opt.entry = entry;
		    	oSelect.options.add( opt );
		    }
		}
		else
		{
			if( nullEntry )
			{
		    	opt = new Option( nullEntry.title, nullEntry.value );
		    	opt.entry = entry;
		    	oSelect.options.add( opt );
			}
	    }
	    
	    // extend the oSelect
	    if( oSlave )
	    	oSelect.slave = oSlave;
	};
	
    function selectHandler( evt )
    {
    	evt = evt || window.event;
    	
    	oSelect = evt.target || evt.srcElement;

		if( oSelect.slave )
		{
			opt = oSelect.options[oSelect.selectedIndex];
			entry = opt.entry;
			entry.initSelect( oSelect.slave, null, new OptionEntry( '--', -1 ) );
			Evt.fire( oSelect.slave, Evt.createEx( 'change' ) );
		}
    }

	OptionEntry.initSelects = function( root )
	{
		if( arguments.length < 3 )
			return;
			
		root.initSelect( arguments[1] );
		
		// install event handler
		for( var i = 1; i < arguments.length ; ++i )
		{
    		Event.observe( arguments[i], 'change', selectHandler );
		}
		
		// setup master/slave		
		for( var i = 1; i < (arguments.length - 1); ++i )
		{
			arguments[i].slave = arguments[i+1];
		}

		// IGNATE!
		Evt.fire( arguments[1], Evt.createEx( 'change' ) ); 
	};
	
	
	initSelect = function( oSelect, data )
	{
		if( !oSelect )
			return;
		oSelect.options.length = 0;
		for( var i = 0; i<data.length; ++i )
		{
			oSelect.options.add( new Option( data[i].title, data[i].value ) );
		} 
	}
	
	Select = {};
	Select.init = initSelect;   

}