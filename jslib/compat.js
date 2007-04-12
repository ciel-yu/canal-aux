/*
General Javascript Librairy
Authored by Ciel
*/

// Hacking javescript data types


// Array.concat was implemented in IE & FF
if( !Array.prototype.concat )
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


if( !Array.prototype.expand )
Array.prototype.expand = function()
{
	var arr = [];
	for( var i = 0, a; i<this.length; ++i )
	{
		a = this[i];
		if( a == null )
			arr.push( a );
		else if( a.constructor == Array )
			arr = arr.concat( a );
		else if( a.length != null )
		{
			for( var j = 0; j < a.length; ++j )
			arr.push( a[j] );
		}	
		else
			arr.push( a );
	}
	
	for( var i = 0, a; i<arguments.length; ++i )
	{
		a = arguments[i];
		if( a == null )
			arr.push( a );
		else if( a.constructor == Array )
			arr = arr.concat( a );
		else if( a.length != null )
		{
			for( var j = 0; j < a.length; ++j )
			arr.push( a[j] );
		}	
		else
			arr.push( a );
	}
	
	return arr;
}

if( !Array.prototype.expandDeep )
Array.prototype.expandDeep = function()
{
	var arr = [];
	for( var i = 0, a; i<this.length; ++i )
	{
		a = this[i];
		if( a == null )
			arr.push( a );
		else if( a.constructor == Array )
			arr = arr.concat( a.expandDeep() );
		else if( a.length != null )
		{
			for( var j = 0; j < a.length; ++j )
			arr.push( a[j] );
		}	
		else
			arr.push( a );
	}
	
	for( var i = 0, a; i<arguments.length; ++i )
	{
		a = arguments[i];
		if( a == null )
			arr.push( a );
		else if( a.constructor == Array )
			arr = arr.concat( a.expandDeep() );
		else if( a.length != null )
		{
			for( var j = 0; j < a.length; ++j )
			arr.push( a[j] );
		}	
		else
			arr.push( a );
	}
	
	return arr;
}

if( !Array.expand )
Array.expand = function()
{
	return [arguments].expand().expand().expand();
}

if(!Array.prototype.filter)
Array.prototype.filter = function()
{
	var arr = [];
	for( var i = this.length; i; )
	{
		if( this[--i] )
			arr.unshift( this[i] );
	}
	return arr;
}

if( typeof(Compat) == 'undefined' )
{
	Compat={};
	Compat.extend = function( destination, source )
	{
		for( var property in source ) {
			destination[property] = source[property];
		}
		return destination;
	};

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
		if( arguments.length > 1 )
		{
			for( var i = arguments.length, elements = [] ; i ; )
				elements.unshift( $id( arguments[--i] ) );
			return elements;
		}
		
		if( typeof element == 'string' )
			element = document.getElementById( element );
		return element;
	}

	function $form( id )
	{
		return document.forms[id];
	}

	function $elements( formid, name )
	{
		var form  = $form( formid );
		if( form )
			return form.elements[name];
	}

	function $getValue( oForm, name )
	{
		var es = oForm.elements[name];

		if( typeof( es.length ) == 'undefined' );
			return es.value;

		// checkbox or radio
		for( var i = es.length; i; )
		{
			if( es[--i].checked )
				return es[i].value;
		}
	}

	function $tag_name( obj, tagname, name )
	{
		return obj.getElementsByTagName( tagname )[name];
	}

	function $tag( obj, tagname )
	{
		return obj.getElementsByTagName( tagname );
	}

	function collectData( oForm )
	{
		var data = {};

		for( var i = oForm.elements.length; i; )
		{
			var e = oForm.elements[--i];

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

	}

	function setValue( oForm, name, val, setHidden )
	{
		for( var i = oForm.elements.length; i;  )
		{
			e = oForm.elements[--i];

			if( e.name == name )
			{
				if( e.type == 'checkbox' || e.type == 'radio' )
				{
					if( e.value == val )
					{
						e.checked = true;
						Evt.fire( e, Evt.createEx('click') ); // simulate user click action
						break;
					}

				}
				else if( e.type == 'select-one' )
				{
					for( var j = e.options.length; j;  )
					{
						if( e.options[--j].value == val )
						{
							e.options[j].selected = true;
							Evt.fire( e, Evt.createEx('change') );
							break;
						}
					}
					break;
				}
				else if( e.type == 'text' || e.type == 'password' && false || e.type == 'hidden' && setHidden )
				{
					e.value = val;
					Evt.fire( e, Evt.createEx('change') );
					break;
				}; // ignore 'submit', 'button', 'reset' and 'select-multi'
			}
		}

	}
	
	function setElement( oElement, val )
	{
		var e = oElement;

		if( e.type == 'checkbox' || e.type == 'radio' )
		{
			if( e.value == val )
			{
				e.checked = true;
				Evt.fire( e, Evt.createEx('click') ); // simulate user click action
			}

		}
		else if( e.type == 'select-one' )
		{
			for( var j = e.options.length; j;  )
			{
				if( e.options[--j].value == val )
				{
					e.options[j].selected = true;
					Evt.fire( e, Evt.createEx('change') );
					break;
				}
			}
		}
		else if( e.type == 'text' || e.type == 'password' || e.type == 'hidden' )
		{
			e.value = val;
			Evt.fire( e, Evt.createEx('change') );
		}; // ignore 'submit', 'button', 'reset' and 'select-multi'
	}

	function populateForm( oForm, oValues, prefix, suffix )
	{
		if( !oForm || !oValues )
			return;
		if( typeof( oForm ) == 'string' )
			oForm = $id( oForm );
		if( !oForm )
			return;
		if( !prefix )
			prefix='';
		if( !suffix )
			suffix='';
		for( k in oValues )
		{
			setValue( oForm, prefix+k+suffix, oValues[k] );
		}
	}

	function validateField( oForm, oDescriptor, fieldname, params )
	{
		oDescriptor[fieldname].invalid = false;

		var rules = oDescriptor[fieldname].rules;
		var ele = oForm.elements[fieldname];

		if( !ele )
			return false;

		for( var i = 0; i<rules.length; ++i )
		{
			var rule = rules[i];
			var result = { name:fieldname, form:oForm, element:ele, affectedRule:rule, ruleSet:oDescriptor[fieldname] };

			result.valid = rule.required	&& trim( ele.value ) != ''
						 || rule.pattern	&& rule.pattern.test( ele.value )
						 || rule.validate	&& rule.validate( ele )
						 || false;

			// the whole rule set fails when a rule in it fails.
			oDescriptor[fieldname].invalid |= !result.valid;

			// quit when the form decides not to go on
			if( oForm.validated && !oForm.validated( result, params ) )
				return result;
		}

		// no error, the element is valid;
		return false;

	}

	function validateForm( oForm, oDescriptor, params )
	{
		if( !oForm || !oDescriptor )
			return;
		if( typeof( oForm ) == 'string' )
			oForm = $form( oForm );
		if( !oForm )
			return;

		oDescriptor.invalid = false;

		for( prop in oDescriptor )
		{
			if( typeof( oDescriptor[prop] ) == 'function' )
				continue;

			var error = validateField( oForm, oDescriptor, prop, params );

			oDescriptor.invalid |= oDescriptor[prop].invalid;

			// there is invalid element and the form wants to stop validating
			if( error )
				return error;

		}

		return false;

	}

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
		strictEmail:/^((([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.(af|ax|al|dz|as|ad|ao|ai|aq|ag|ar|am|aw|au|at|az|bs|bh|bd|bb|by|be|bz|bj|bm|bt|bo|ba|bw|bv|br|io|bn|bg|bf|bi|kh|cm|ca|cv|ky|cf|td|cl|cn|cx|cc|co|km|cg|cd|ck|cr|ci|hr|cu|cy|cz|dk|dj|dm|do|ec|eg|sv|gq|er|ee|et|fk|fo|fj|fi|fr|gf|pf|tf|ga|gm|ge|de|gh|gi|gr|gl|gd|gp|gu|gt| gg|gn|gw|gy|ht|hm|va|hn|hk|hu|is|in|id|ir|iq|ie|im|il|it|jm|jp|je|jo|kz|ke|ki|kp|kr|kw|kg|la|lv|lb|ls|lr|ly|li|lt|lu|mo|mk|mg|mw|my|mv|ml|mt|mh|mq|mr|mu|yt|mx|fm|md|mc|mn|ms|ma|mz|mm|na|nr|np|nl|an|nc|nz|ni|ne|ng|nu|nf|mp|no|om|pk|pw|ps|pa|pg|py|pe|ph|pn|pl|pt|pr|qa|re|ro|ru|rw|sh|kn|lc|pm|vc|ws|sm|st|sa|sn|cs|sc|sl|sg|sk|si|sb|so|za|gs|es|lk|sd|sr|sj|sz|se|ch|sy|tw|tj|tz|th|tl|tg|tk|to|tt|tn|tr|tm|tc|tv|ug|ua|ae|gb|us|um|uy|uz|vu|ve|vn|vg|vi|wf|eh|ye|zm|zw|com|edu|gov|int|mil|net|org|biz|info|name|pro|aero|coop|museum|arpa))|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/,
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
				else if( e.type = 'mouseover' )
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
				else if( e.type = 'mouseover' )
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
			master.sync.slaves = slaves;
			
			if( !events )
				events = ['keyup', 'change'];
			
			master.sync.condition = condition;
			
			for( var i = events.length; i; Event.observe( master, events[--i], this.dosync ) );
			
			Evt.fire( master, Evt.createEx( 'change' ) );
		},
		
		dosync: function( evt )
		{
			var evt = evt || window.event;
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
	

	
}
