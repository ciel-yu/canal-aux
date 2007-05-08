/*
General Javascript Librairy
Authored by Ciel
*/

// Hacking javescript data types
if( typeof(_JSHACKING) == 'undefined' )
{
	_JSHACKING = true;
	// Array.concat was implemented natively in IE & FF
	if( false && !Array.prototype.concat )
	Array.prototype.concat = function()
	{
		for( var i = 0, length = arguments.length, a ; i<arguments.length; ++i )
		{
			a = arguments[i];
			if( a.constructor == Array )
			{
				for( var j = 0; j<a.length; ++j )
					this.push( a[j] );
			}
			else
			{
				this.push( a );
			}
		}
	}

	if( !Array.expand ) // FIXME: performance issue?
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
			{
				// HTML Collection but not any HTML element
				for( var j = 0; j < a.length; ++j )
					arr.push( a[j] );
			}
			else
				arr.push( a );
		}
		return arr;
	}
	
	if( !Array.prototype.swap )
	Array.prototype.swap = function ( i, j )
	{
		var temp = this[i];
		this[i] = this[j];
		this[j] = temp;
		return this;
	}

	if( !Array.prototype.expand )
	Array.prototype.expand = function()
	{
		var arr = [].concat( this );
		for( var i = 0; i<arguments.length; ++i )
			arr = arr.concat( arguments[i] );
		return Array.expand( arr );
	}


	// codes from Mozilla
	// http://snippets.dzone.com/posts/show/718
	// http://developer.mozilla.org/en/docs/Core_JavaScript_1.5_Reference:Objects:Array:filter

	if (!Array.prototype.filter)
	{
		Array.prototype.filter = function(fun /*, thisp*/)
		{
			var len = this.length;
			if (typeof fun != "function")
				throw new TypeError();

			var res = new Array();
			var thisp = arguments[1];
			for (var i = 0; i < len; i++)
			{
				if (i in this)
				{
					var val = this[i]; // in case fun mutates this
					if (fun.call(thisp, val, i, this))
						res.push(val);
				}
			}

			return res;
		};
	}

	// these methods are natively implemented in FF 1.5
	if(!Array.prototype.forEach)
	{
		Array.prototype.forEach = function(callback,thisObject)
		{
			for(var i=0,len=this.length;i<len;i++)
				callback.call(thisObject,this[i],i,this);
		}
		
		Array.prototype.map = function(callback,thisObject)
		{
			for(var i=0,res=[],len=this.length;i<len;i++)
				res[i] = callback.call(thisObject,this[i],i,this);
			return res;
		}
		
		Array.prototype.filter = function(callback,thisObject)
		{
			for(var i=0,res=[],len=this.length;i<len;i++)
				callback.call(thisObject,this[i],i,this) && res.push(this[i]);
			return res;
		}
		
		Array.prototype.indexOf = function(searchElement,fromIndex)
		{
			var i = (fromIndex < 0) ? this.length+fromIndex : fromIndex || 0;
			for(;i<this.length;i++)
				if(searchElement === this[i]) return i;
			return -1;
		}
		
		Array.prototype.lastIndexOf = function(searchElement,fromIndex)
		{
			var max = this.length-1;
			var i = (fromIndex < 0)   ? Math.max(max+1 + fromIndex,0) :
					(fromIndex > max) ? max :
					max-(fromIndex||0) || max;
			for(;i>=0;i--)
				if(searchElement === this[i]) return i;
			return -1;
		}
		
		Array.prototype.every = function(callback,thisObject)
		{
			for(var i=0,len=this.length;i<len;i++)
				if(!callback.call(thisObject,this[i],i,this)) return false;
			return true;
		}
		
		Array.prototype.some = function(callback,thisObject)
		{
			for(var i=0,len=this.length;i<len;i++)
				if(callback.call(thisObject,this[i],i,this)) return true;
			return false;
		}
	}


	if( !Object.absorb )
	Object.absorb = function( oDst, oSrc, preserve )
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
	};
	
	if( !String.join )
	String.join = function( pieces, delim )
	{
		if( !delim ) delim='';
		if( !pieces || pieces.constructor != Array )
			return pieces;
		var r = pieces[0];
		for( var i = 1; i<pieces.length; ++i )
		{
			r += delim + pieces[i];
		}
		return r;
	}
	
	if( !String.prototype.join )
	String.prototype.join = function()
	{
		return String.join(  Array.expand( arguments ).expand(), this );
	}

}

if( typeof(Compat) == 'undefined' )
{
	Compat={};


	function $_( obj, text )
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
	}

	function $id( element )
	{
		if( typeof element == 'string' )
			element = document.getElementById( element );
		return element;
	}

	function $ids()
	{
		var ids = [];
		for( var i = 0; i<arguments.length; ++i )
		{
			ids = ids.concat( arguments[i] );
		}
		ids = ids.expand();
		var objs = [];
		for( var i = 0; i<ids.length; ++i )
		{
			objs.push( $id( ids[i] ) );
		}
		return objs;
	}

	function $form( element )
	{
		if( typeof element == 'string' )
			return document.forms[element];
		return element;
	}

	function $element( formid, name )
	{
		return $elements( formid, name )[0];
	}

	function $elements( formid, name )
	{
		var form  = $form( formid );
		if( form )
			return Array.expand( form.elements[name] );
		return null;
	}

	function $getValue( oForm, name )
	{
		var es = Array.expand( oForm.elements[name] );
		
		if( es.length == 1 )
			return es[0].value;

		// checkbox or radio
		for( var i = es.length; i; )
		{
			if( es[--i].checked )
				return es[i].value;
		}
		return null;
	}

	function $tag_name( obj, tagname, name )
	{
		return obj.getElementsByTagName( tagname )[name];
	}

	function $tag( obj, tagname )
	{
		return obj.getElementsByTagName( tagname );
	}

	FormData = {
		collect: function( oForm )
		{
			var data = {};
	
			for( var i = oForm.elements.length; i; )
			{
				var e = oForm.elements[--i];
				
				if( e.disabled )
					continue;
	
				if( ( e.type == 'checkbox' || e.type == 'radio' ) && !e.checked )
					continue;
	
				if( e.name != '' )
				{
					if( e.type )
					switch( typeof data[e.name] )
					{
					case 'undefined':
						data[e.name] = e.value;
						break;
					case 'string':
						data[e.name] = [ e.value, data[e.name] ];
						break;
					default: // data[e.name] is already an array
						data[e.name].unshift( e.value );
						break;
	
					}
				}
	
			}
			return data;
		},
		
		_setElement: function( oElement, val )
		{
			if( oElement.type == 'checkbox' || oElement.type == 'radio' )
			{
				if( oElement.value == val )
				{
					oElement.checked = true;
					Evt.fire( oElement, Evt.createEx('click') ); // simulate user click action
				}
			}
			else if( oElement.type == 'select-one' )
			{
				for( var j = oElement.options.length; j;  )
				{
					if( oElement.options[--j].value == val )
					{
						oElement.options[j].selected = true;
						Evt.fire( oElement, Evt.createEx('change') );
						break;
					}
				}
			}
			else if( oElement.type == 'text' || oElement.type == 'password' || oElement.type == 'hidden' )
			{
				oElement.value = val;
				Evt.fire( oElement, Evt.createEx('change') );
			}
		},

		setElements: function( oElement, val )
		{
			var es = Array.expand( oElement ).filter( Pred.notnull );
	
			for( var i = es.length, e; i; )
			{
				e = es[--i];
				this._setElement( e, val );
			}
		},		
		
		populate: function( oForm, oValues )
		{
			oForm = $form( oForm );
			
			if( !oForm || !oValues )
				return;
			
			for( prop in oValues )
			{
				if( oValues[prop] != null )
				{
					for( var i = oForm.elements.length, e; i;  )
					{
						e = oForm.elements[--i];
			
						if( e.name == prop )
						{
							FormData._setElement( e, oValues[prop] );
						}
					}
				}
			}
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
			return String.join(s,'&');
		}
	};

	function setValue( oForm, name, val )
	{
		for( var i = oForm.elements.length, e; i;  )
		{
			e = oForm.elements[--i];

			if( e.name == name )
			{
				FormData._setElement( e, val );
			}
		}

	}
	


	function setElement( oElement, val )
	{
		FormData.setElements( oElement, val );
	}

	function populateForm( oForm, oValues, prefix, suffix )
	{
		FormData.populate( oForm, oValues );
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
					if( $getValue( oForm, p.element ) != p.value )
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

			result.valid = 	( rule.required ? trim( ele.value ) != '' 		: true )
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

	// DEPRECATED!
	function stopEvent(event) {
		if( event.preventDefault ) {
		  event.preventDefault();
		  event.stopPropagation();
		} else {
		  event.returnValue = false;
		  event.cancelBubble = true;
		}
	}

	function trim( str )
	{
		return str.replace( /(^\s+)|(\s+$)/g, '' );
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

		// Experimental
		enrich: function( evt )
		{
			var e = evt || window.event;
			if( !e.target )
			{// IE
				e.target = e.srcElement;
				if( e.type == 'mouseout' )
				{
					e.relatedTarget = e.toElement;
				}
				else if( e.type == 'mouseover' )
				{
					e.relatedTarget = e.fromElement;
				}
			}
			else
			{
				e.srcElement = e.target;
				if( e.type == 'mouseout' )
				{
					e.fromElement = e.target;
					e.toElement = e.relatedTarget;
				}
				else if( e.type == 'mouseover' )
				{
					e.fromElement = e.relatedTarget;
					e.toElement = e.target;
				}
			}
			return e;
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
		elements = Array.expand( elements );
		events = Array.expand( events );
		
		for( var j = elements.length, e; j; )
		{
			e = elements[--j];
			for( var i = events.length; i; Event.observe( e, events[--i], handler, capture ) );
		}
		
	}
	
	function showHiddenMsgs( oMsgs )
	{
		Array.expand( oMsgs ).filter( Pred.notnull ).map( $id ).forEach( ElementEx.forceShow );
	}
	
	Pred =
	{
		notnull: function( value )
		{
			return value != null;
		},
		
		istrue: function( value )
		{
			return !!value;
		}
	}
	
	displayDefaults =
	{
		ADDRESS: 'block', 
		BLOCKQUOTE: 'block', 
		BODY: 'block', 
		CENTER: 'block', 
		COL: 'block', 
		COLGROUP: 'block', 
		DD: 'block', 
		DIR: 'block', 
		DIV: 'block', 
		DL: 'block', 
		DT: 'block', 
		FIELDSET: 'block', 
		FORM: 'block', 
		FRAME: 'none', 
		H1: 'block', 
		H2: 'block', 
		H3: 'block', 
		H4: 'block', 
		H5: 'block', 
		H6: 'block', 
		H7: 'block', 
		H8: 'block', 
		H9: 'block', 
		HR: 'block', 
		IFRAME: 'block', 
		LEGEND: 'block', 
		LI: 'list-item', 
		LISTING: 'block', 
		MARQUEE: 'block', 
		MENU: 'block', 
		OL: 'block', 
		P: 'block', 
		PLAINTEXT: 'block', 
		PRE: 'block', 
		TABLE: 'block', 
		TBODY: 'none', 
		TD: 'block', 
		TFOOT: 'none', 
		TH: 'block', 
		THEAD: 'none', 
		TR: 'block', 
		UL: 'block', 
		XMP: 'block'
	}
	
	
	ElementEx = 
	{
		forceShow: function( element )
		{
			element.style.display = displayDefaults[element.tagName] || 'inline';
			return element;
		},
		forceHide: function( element )
		{
			element.style.display = 'none';
			return element;
		}
	}
	
	Latch = function(){};
	Object.absorb( Latch.prototype,
		{
			latches:{};
			latch: function( key, data )
			{
				this.latches[key] = data;
				this.trigger();
			},
			
			trigger: function()
			{
				
			}
			
			
		
		
		}
	);
	
	
	
	
}
