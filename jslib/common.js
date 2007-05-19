Array.expand = function()
{
	var input = [];
	var arr = [];

	for( var i = 0; i<arguments.length; ++i )
		input = input.concat( arguments[i] );

	for( var i = 0, a; i<input.length; ++i )
	{
		a = input[i];

		if( a == null || a.constructor == String )
			arr.push( a );
		else if( a.constructor == Array )
			arr = arr.concat( a );
		else if( a.length != null && a.tagName == null  )
		{// HTML Collection but not any HTML element
			for( var j = 0; j < a.length; ++j )
				arr.push( a[j] );
		}
		else
			arr.push( a );
	}
	return arr;
}

Array.prototype.expand = function()
{
	var a = this;
	for( var i = 0, len = arguments.length; i<len; ++i )
		a = a.concat( arguments[i] );
	return Array.expand( a );
}


ArrayExt =
{
	forEach: function(callback,thisObject)
	{
		for(var i=0,len=this.length;i<len;i++)
			callback.call(thisObject,this[i],i,this);
	},

	map: function(callback,thisObject)
	{
		for(var i=0,res=[],len=this.length;i<len;i++)
			res[i] = callback.call(thisObject,this[i],i,this);
		return res;
	},

	filter: function(callback,thisObject)
	{
		for(var i=0,res=[],len=this.length;i<len;i++)
			callback.call(thisObject,this[i],i,this) && res.push(this[i]);
		return res;
	},

	indexOf: function(searchElement,fromIndex)
	{
		var i = (fromIndex < 0) ? this.length+fromIndex : fromIndex || 0;
		for(;i<this.length;i++)
			if(searchElement === this[i]) return i;
		return -1;
	},

	lastIndexOf: function(searchElement,fromIndex)
	{
		var max = this.length-1;
		var i = (fromIndex < 0)   ? Math.max(max+1 + fromIndex,0) :
				(fromIndex > max) ? max :
				max-(fromIndex||0) || max;
		for(;i>=0;i--)
			if(searchElement === this[i]) return i;
		return -1;
	},

	every: function(callback,thisObject)
	{
		for(var i=0,len=this.length;i<len;i++)
			if(!callback.call(thisObject,this[i],i,this)) return false;
		return true;
	},

	some: function(callback,thisObject)
	{
		for(var i=0,len=this.length;i<len;i++)
			if(callback.call(thisObject,this[i],i,this)) return true;
		return false;
	}
}



ObjectExt =
{
	absorb: function( oDst, oSrc, preserve )
	{
		if( oSrc.constructor != Array )
			oSrc=[oSrc];

		if( !preserve )
			for( var i = 0, o ; i < oSrc.length; ++i )
			{
				o = oSrc[i];
				for( var property in o )
				{
					oDst[property] = o[property];
				}
			}
		else
			for( var i = 0, o ; i < oSrc.length; ++i )
			{
				o = oSrc[i];
				for( var property in o )
				{
					if( typeof( oDst[property] ) == 'undefined' )
						oDst[property] = o[property];
				}
			}

		return oDst;
	},
	urlEncode: function( data )
	{
		var s =[];
		for( prop in data )
		{
			if( data[prop].constructor == Array )
			{
				for( var a=data[prop], i=0; i<a.length; ++i )
				{
					s.push( prop+'='+encodeURIComponent( a[i] ) );
				}
			}
			else
			{
				s.push( prop+'='+encodeURIComponent(data[prop]) );
			}
		}
		return StringExt.join(s,'&');
	}
}

StringExt =
{
	join: function( pieces, delim )
	{
		if( !delim ) delim = '';
		if( !pieces || pieces.constructor != Array )
			return pieces;
		var r = pieces[0];
		for( var i = 1; i<pieces.length; ++i )
		{
			r += delim + pieces[i];
		}
		return r;
	},

	trim: function( str )
	{
		if( str!=null )
			return str.replace( /(^\s+)|(\s+$)/g, '' );
	}
}




Functor =
{
	notnull: function( value )
	{
		return value != null;
	},

	istrue: function( value )
	{
		return !!value;
	},
	
	equal: function( value )
	{
		return this == value;
	},

	tags: function( o )
	{
		return this.getElementsByTagName(o);
	},

	// do nothing
	noop: function(){}
}

ObjectExt.absorb( Object, ObjectExt, true );
ObjectExt.absorb( Array.prototype, ArrayExt, true );
ObjectExt.absorb( String, StringExt, true );

ObjectExt.absorb( String.prototype,
	{
		trim: function() { return String.trim( this ); }
	},
	true );

DomExt =
{
	$_: function( obj, text )
	{

		if( window.navigator.appName.toLowerCase() == 'netscape' )
		{ // for Netscape/Mozilla/Firefox
			if( text != null )
				obj.textContent = text;
			return obj.textContent;
		}
		else
		{ // for IE/Opera
			if( text != null )
				obj.innerText = text;
			return obj.innerText;
		}
	},

	$id: function( element )
	{
		if( typeof element == 'string' )
			element = document.getElementById( element );
		return element;
	},

	$ids: function()
	{
		var ids = [];
		for( var i = 0; i<arguments.length; ++i )
		{
			ids = ids.concat( arguments[i] );
		}

		return ids.map( DomExt.$id );
	},

	$form: function( element )
	{
		if( typeof element == 'string' )
			return document.forms[element];
		return element;
	},

	$element: function( formid, name )
	{
		return DomExt.$elements( formid, name )[0];
	},

	$elements: function( formid, name )
	{
		var form  = DomExt.$form( formid );
		if( !form )
			return [];

		if( !name ) // return all elements
			return Array.expand( form.elements );

		return ( name.constructor == Array ? name : [name] )
			.map( function( n ){ return this.elements[n] }, form )
			.filter( Functor.notnull )
			.expand();
	},

	$tag_name: function( obj, tagname, name )
	{
		return obj.getElementsByTagName( tagname )[name];
	},

	$tags: function( obj, tagname )
	{
		return obj.getElementsByTagName( tagname );
	}
}

ObjectExt.absorb( window, DomExt );


FormExt = {
	
	getter:
	{
		checkbox:	function( e ) { if( e.checked ) return e.value; },
		radio:		function( e ) { if( e.checked ) return e.value; },
		
		text:		function( e ) { return e.value; },
		textarea:	function( e ) { return e.value; },
		password:	function( e ) { return e.value; },
		hidden:		function( e ) { return e.value; },
		file:		function( e ) { return e.value; },
		
		'select-one': function( e ) { return e.value; },
		'select-multiple': function( e )
		{
			return Array
				.expand( e.options )
				.filter( function( e ){ return e.selected; } )
				.map( function( e ){ return e.value; } );
		},
		
		submit: Functor.noop,
		reset: Functor.noop,
		button: Functor.noop,
		image: Functor.noop
	},
	setter:
	{
		checkbox:	function( e, vals ) { e.checked = vals.some( Functor.equal, e.value ); return e; },
		radio:		function( e, vals ) { e.checked = vals.some( Functor.equal, e.value ); return e; },
		
		text:		function( e, vals ) { e.value = vals[0]; return e; },
		password:	function( e, vals ) { e.value = vals[0]; return e; },
		hidden:		function( e, vals ) { e.value = vals[0]; return e; },
		
		'select-one': function( e, vals )
		{
			Array
				.expand( e.options )
				.forEach( function( e ){ e.selected = this.some( Functor.equal, e.value ); }, vals );
				
			return e;
		},
		'select-multiple': function( e, vals )
		{
			Array
				.expand( e.options )
				.forEach( function( e ){ e.selected = this.some( Functor.equal, e.value ); }, vals );
				
			return e;
		},
		// read only
		file:		Functor.noop,
		textarea:	Functor.noop,
		submit: Functor.noop,
		reset: Functor.noop,
		button: Functor.noop,
		image: Functor.noop
	},
	
	_get: function( e )
	{
		return FormExt.getter[e.type](e);
	},
	
	scan: function( oRoot )
	{
		return [ 'input', 'select', 'textarea' ]
			.map( Functor.tags, oRoot )
			.expand();

	},
	
	collect: function( oForm )
	{
		var data = {};
		DomExt.$elements( oForm )
			.filter( function(e){ return !e.disabled && String.trim(e.name); } )
			.forEach( function(e)
				{// XXX performace: can be optimized for SELECT?
					if( !this[e.name] )
						this[e.name]=[];
					this[e.name] = this[e.name].concat( [].concat( FormExt.getter[e.type](e) ).filter( Functor.notnull ) );
				}, data );
		return data;
	},
	
	populate: function( oForm, values )
	{
		var oValues = ObjectExt.absorb( {}, values );
		for( prop in oValues )
		{
			if( typeof oValues[prop] == 'function' )
				continue;
				
			DomExt.$elements( oForm, prop )
				.forEach( function( e ){ FormExt.setter[e.type](e, this) }, [].concat( oValues[prop] ) );
		}
	}
}


function validateField( oForm, oDescriptor, fieldname, params )
{
	if( !oDescriptor )
		return false;  
	
	oDescriptor.invalid = null;
	
	var ele = oForm.elements[fieldname];

	if( !ele )
		return false;

	oDescriptor.ignored = false;  

	// check prerequisites
	if( oDescriptor.prerequisites )
	{
		var prerequisites = Array.expand( oDescriptor.prerequisites );
		for( var i = 0, p; i < prerequisites.length; ++i )
		{
			p = prerequisites[i];
			if( typeof p.value != 'undefined' )
			{
				if( !$elements(oForm. p.element).some( Functor.equal, p.value ) )
				{
					oDescriptor.ignored = true;
					break;				
				}
			}
			
		}
	
	}

	var rules = [].concat( oDescriptor.rules );

	for( var i = 0; i<rules.length; ++i )
	{
		var rule = rules[i];
		var result =
			{
				form: oForm,
				name: fieldname,
				element: ele,
				affectedRule: rule,
				ruleSet: oDescriptor,
				ignored: oDescriptor.ignored
			};

		result.valid = 	( rule.required ? String.trim( ele.value ) != '': true )
					 && ( rule.pattern	? rule.pattern.test( ele.value ): true )
					 && ( rule.validate	? rule.validate( ele )			: true )
					 ;

		// the whole rule set fails when a rule in it fails.
		oDescriptor.invalid |= !( result.valid || oDescriptor.ignored );

		// call callback 
		// quit when the form decides not to go on
		if( oForm.validated && !( oForm.validated( result, params ) || oDescriptor.ignored ) )
			return result;
	}

	// no error, the element is valid;
	return false;

}

function validateForm( oForm, oDescriptors, params )
{
	oForm = $form( oForm );

	if( !oForm || !oDescriptors )
		return false;

	var oDescriptor = Object.absorb( {}, Array.expand( oDescriptors ) );

	oDescriptor.invalid = false;

	for( var prop in oDescriptor )
	{
		var fieldDescriptor = oDescriptor[prop];
		if( typeof( fieldDescriptor ) == 'function' )
			continue;
		
		if( fieldDescriptor.constructor == Array )
			continue;

		var error = validateField( oForm, fieldDescriptor, prop, params );

		oDescriptor.invalid |= fieldDescriptor.invalid;

		// there is an invalid element and the form wants to stop validating
		if( error )
		{
			oDescriptor.lastResult = error;
			break;
		}

	}

	return oDescriptor;

}

regexs=
{
	// approved
	strictEmail: /^((([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.(af|ax|al|dz|as|ad|ao|ai|aq|ag|ar|am|aw|au|at|az|bs|bh|bd|bb|by|be|bz|bj|bm|bt|bo|ba|bw|bv|br|io|bn|bg|bf|bi|kh|cm|ca|cv|ky|cf|td|cl|cn|cx|cc|co|km|cg|cd|ck|cr|ci|hr|cu|cy|cz|dk|dj|dm|do|ec|eg|sv|gq|er|ee|et|fk|fo|fj|fi|fr|gf|pf|tf|ga|gm|ge|de|gh|gi|gr|gl|gd|gp|gu|gt| gg|gn|gw|gy|ht|hm|va|hn|hk|hu|is|in|id|ir|iq|ie|im|il|it|jm|jp|je|jo|kz|ke|ki|kp|kr|kw|kg|la|lv|lb|ls|lr|ly|li|lt|lu|mo|mk|mg|mw|my|mv|ml|mt|mh|mq|mr|mu|yt|mx|fm|md|mc|mn|ms|ma|mz|mm|na|nr|np|nl|an|nc|nz|ni|ne|ng|nu|nf|mp|no|om|pk|pw|ps|pa|pg|py|pe|ph|pn|pl|pt|pr|qa|re|ro|ru|rw|sh|kn|lc|pm|vc|ws|sm|st|sa|sn|cs|sc|sl|sg|sk|si|sb|so|za|gs|es|lk|sd|sr|sj|sz|se|ch|sy|tw|tj|tz|th|tl|tg|tk|to|tt|tn|tr|tm|tc|tv|ug|ua|ae|gb|us|um|uy|uz|vu|ve|vn|vg|vi|wf|eh|ye|zm|zw|com|edu|gov|int|mil|net|org|biz|info|name|pro|aero|coop|museum|arpa))|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/,
	QQ: /^[1-9]\d{4,8}$/,
	idcard: /^\d{15}(\d{3})?$/
};


Evt =
{
	stop: function( evt )
	{
		if( evt.preventDefault )
		{
			evt.preventDefault();
			evt.stopPropagation();
		}
		else
		{
			evt.returnValue = false;
			evt.cancelBubble = true;
		}

	},

	create: function( type )
	{
		var e;
		if( document.createEventObject )
		{
			e = document.createEventObject();
		}
		else if( document.createEvent )
		{
			if( this.eventTable[type] )
				e = document.createEvent( this.eventTable[type].catagory );
		}

		return e;
	},

	init: function( evt, type, canBubble, cancelable )
	{
		if( this.eventTable[type] )
		{
			if( canBubble == null )
				canBubble = this.eventTable[type].bubbles;
			if( cancelable == null )
				cancelable = this.eventTable[type].cancelable;
		}
		else
		{
			canBubble = canBubble || false;
			cancelable = cancelable || false;
		}

		if( evt.initEvent )
		{
			evt.initEvent( type, canBubble, cancelable );
		}
		else
		{// for IE
			evt.type = type;
			evt.cancelBubble = !canBubble;
			evt.returnValue = !cancelable;
		}

	},

	createEx: function( type )
	{
		var e = this.create( type );
		if( e )
			this.init( e, type );
		return e;
	},

	fire: function( target, oEvent )
	{
		return this.fireEx( target, oEvent.type, oEvent );
	},

	fireEx: function( target, type, oEvent )
	{
		target = $id( target );
		try
		{
			if( target.fireEvent )
				return target.fireEvent( 'on'+type, oEvent );
			else if( target.dispatchEvent )
				return target.dispatchEvent( oEvent );
		}
		catch( e )
		{
		}

		return null;
	},
	
	eventTable:
	{
		// W3C DOM Level 2 spec.
		click:		{ catagory: 'MouseEvents',	bubbles: true,	cancelable: true },
		mousedown:	{ catagory: 'MouseEvents',	bubbles: true,	cancelable: true },
		mouseup:	{ catagory: 'MouseEvents',	bubbles: true,	cancelable: true },
		mouseover:	{ catagory: 'MouseEvents',	bubbles: true,	cancelable: true },
		mousemove:	{ catagory: 'MouseEvents',	bubbles: true,	cancelable: false },
		mouseout:	{ catagory: 'MouseEvents',	bubbles: true,	cancelable: true },
		load:		{ catagory: 'HTMLEvents',	bubbles: false,	cancelable: false },
		unload:		{ catagory: 'HTMLEvents',	bubbles: false,	cancelable: false },
		abort:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		error:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		select:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		change:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		submit:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: true },
		reset:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		focus:		{ catagory: 'HTMLEvents',	bubbles: false,	cancelable: false },
		blur:		{ catagory: 'HTMLEvents',	bubbles: false,	cancelable: false },
		resize:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		scroll:		{ catagory: 'HTMLEvents',	bubbles: true,	cancelable: false },
		// KeyEvents, Experimental, Mozilla spec.
		keypress:	{ catagory: 'KeyEvents',	bubbles: true,	cancelable: true },
		keydown:	{ catagory: 'KeyEvents',	bubbles: true,	cancelable: true },
		keyup:		{ catagory: 'KeyEvents',	bubbles: true,	cancelable: false } // follow IE
	}


};

// depends on prototype.js
Synchronizer =
{
	sync: function( master, slaves, events, condition )
	{
		master.sync={};
		master.sync.slaves = slaves.expand();

		if( !events )
			events = ['keyup', 'change'];

		master.sync.condition = condition;

		for( var i = events.length; i; Event.observe( master, events[--i], this.dosync.bindAsEventListener(master) ) );

		Evt.fire( master, Evt.createEx( 'change' ) );
	},

	dosync: function( evt )
	{
		var master = evt.target || evt.srcElement;
		var sync = master.sync;
		if( sync )
		{
			if( sync.condition )
			{
				for( var i = sync.slaves.length, slave; i; )
				{
					slave = sync.slaves[--i];
					if( !slave || !sync.condition( master, slave ) )
						continue;
					setElement( slave, master.value );
				}
			}
			else
			{
				for( var i = sync.slaves.length, slave; i; )
				{
					slave = sync.slaves[--i];
					if( !slave )
						continue;
					setElement( slave, master.value );
				}
			}
		}
	}
	
	
	
};
// depends on prototype.js
if( window.Event )
Event.observeEx = function( elements, events, handler, capture )
{
	elements = Array.expand( elements ).filter( Functor.notnull );
	events = Array.expand( events );
	
	for( var j = elements.length, e; j; )
	{
		e = elements[--j];
		for( var i = events.length; i; Event.observe( e, events[--i], handler, capture ) );
	}
	
}

function showHiddenMsgs( oMsgs )
{
	Array.expand( oMsgs ).filter( Functor.notnull ).map( $id ).forEach( ElementExt.forceShow );
}



ElementExt = 
{
	displayDefaults:
	{
		ADDRESS: 'block',BLOCKQUOTE: 'block', BODY: 'block', CENTER: 'block', COL: 'block', COLGROUP: 'block', DD: 'block', DIR: 'block', DIV: 'block', DL: 'block', DT: 'block', FIELDSET: 'block', FORM: 'block', FRAME: 'none', H1: 'block', H2: 'block', H3: 'block', H4: 'block', H5: 'block', H6: 'block', H7: 'block', H8: 'block', H9: 'block', HR: 'block', IFRAME: 'block', LEGEND: 'block', LI: 'list-item', LISTING: 'block', MARQUEE: 'block', MENU: 'block', OL: 'block', P: 'block', PLAINTEXT: 'block', PRE: 'block', TABLE: 'block', TBODY: 'none', TD: 'block', TFOOT: 'none', TH: 'block', THEAD: 'none', TR: 'block', UL: 'block', XMP: 'block'
	},

	forceShow: function( element )
	{
		element.style.display = ElementExt.displayDefaults[element.tagName] || 'inline';
		return element;
	},
	forceHide: function( element )
	{
		element.style.display = 'none';
		return element;
	}
}

function plantInnerHtml( oValues, prefix, suffix )
{
	if( prefix == null ) prefix = '';
	if( suffix == null ) suffix = '';
	var e;
	for( prop in oValues )
	{
		e = $id( prefix + prop + suffix );
		if( !e )
			continue;
		e.innerHTML = oValues[prop];
	}
}

Select =
{
	init: function( oSelect, oData, emptyEntry )
	{
		if( !oSelect )
			return false;
		
		if( !emptyEntry )
			emptyEntry = { title:'--', value:-1 };
		
		oSelect.options.length = 0;
			
		var entries = oData &&　oData.children || [ emptyEntry ];

		entries.forEach( function ( e )
			{
				opt = new Option( e.title, e.value );
				opt.entry = e;
				this.options.add( opt );
			},
			oSelect
		);
	},
	
	setOpts: function( oSelect, oData, emptyEntry )
	{
		if( !oSelect )
			return false;
		
		if( !emptyEntry )
			emptyEntry = { title:'--', value:-1 };
		
		oSelect.options.length = 0;
			
		var entries = oData || [ emptyEntry ];

		entries.forEach( function ( e )
			{
				opt = new Option( e.title, e.value );
				opt.entry = e;
				this.options.add( opt );
			},
			oSelect
		);
	},
	
	initChain: function( root )
	{
		if( arguments.length < 3 )
			return;
			
		this.init( arguments[1], root );
		
		// setup master/slave		
		for( var i = 1; i < (arguments.length - 1); ++i )
		{
			arguments[i].slave = arguments[i+1];
		}

		// install event handler
		for( var i = 1; i < arguments.length ; ++i )
		{
    		Event.observe( arguments[i], 'change', this.selectHandler );
		}

		// IGNATE!
		Evt.fire( arguments[1], Evt.createEx( 'change' ) ); 
	},
	
	selectHandler: function ( evt )
    {
    	evt = evt || window.event;
    	
    	var oSelect = evt.target || evt.srcElement;

		if( oSelect.slave )
		{
			opt = oSelect.options[oSelect.selectedIndex];
			entry = opt.entry;
			Select.init( oSelect.slave, entry, { title:'--', value:-1 } );
			Evt.fire( oSelect.slave, Evt.createEx( 'change' ) );
		}
    }
};

