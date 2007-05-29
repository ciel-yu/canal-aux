patterns=
{
	// approved
	strictEmail: /^((([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+(\.([a-z]|[0-9]|!|#|$|%|&|'|\*|\+|\-|\/|=|\?|\^|_|`|\{|\||\}|~)+)*)@((((([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.))*([a-z]|[0-9])([a-z]|[0-9]|\-){0,61}([a-z]|[0-9])\.(af|ax|al|dz|as|ad|ao|ai|aq|ag|ar|am|aw|au|at|az|bs|bh|bd|bb|by|be|bz|bj|bm|bt|bo|ba|bw|bv|br|io|bn|bg|bf|bi|kh|cm|ca|cv|ky|cf|td|cl|cn|cx|cc|co|km|cg|cd|ck|cr|ci|hr|cu|cy|cz|dk|dj|dm|do|ec|eg|sv|gq|er|ee|et|fk|fo|fj|fi|fr|gf|pf|tf|ga|gm|ge|de|gh|gi|gr|gl|gd|gp|gu|gt| gg|gn|gw|gy|ht|hm|va|hn|hk|hu|is|in|id|ir|iq|ie|im|il|it|jm|jp|je|jo|kz|ke|ki|kp|kr|kw|kg|la|lv|lb|ls|lr|ly|li|lt|lu|mo|mk|mg|mw|my|mv|ml|mt|mh|mq|mr|mu|yt|mx|fm|md|mc|mn|ms|ma|mz|mm|na|nr|np|nl|an|nc|nz|ni|ne|ng|nu|nf|mp|no|om|pk|pw|ps|pa|pg|py|pe|ph|pn|pl|pt|pr|qa|re|ro|ru|rw|sh|kn|lc|pm|vc|ws|sm|st|sa|sn|cs|sc|sl|sg|sk|si|sb|so|za|gs|es|lk|sd|sr|sj|sz|se|ch|sy|tw|tj|tz|th|tl|tg|tk|to|tt|tn|tr|tm|tc|tv|ug|ua|ae|gb|us|um|uy|uz|vu|ve|vn|vg|vi|wf|eh|ye|zm|zw|com|edu|gov|int|mil|net|org|biz|info|name|pro|aero|coop|museum|arpa))|(((([0-9]){1,3}\.){3}([0-9]){1,3}))|(\[((([0-9]){1,3}\.){3}([0-9]){1,3})\])))$/,
	QQ: /^[1-9]\d{4,8}$/,

	idcard: /^\d{15}(\d{3})?$/,

	username: /^\w{4,12}$/,
	password: /^.{6,}$/,

	mobilephone: /^(159\d{8}|13\d{9})$/,

	digital: /^\d*$/,

	____:null
};

validators=
{
	account_info:
	{
		check_num:
		{
			rules:{required:true, desc:"请填写验证码"}
		},
		account_login_id:
		{
			rules:{pattern:patterns.username, desc:'请填写登录名称, 登录名称只能由4到12个字母和数字组成'}
		},
		account_password:
		{
			rules:
			[
				{required:true, desc:'请填写密码'},
				{pattern:patterns.password, desc:'密码至少要6位'}
			]
		},
		misc_password2:
		{
			rules:
			[
				{required:true, desc:'请确认密码'},
				{
						validate:function( elem )
							{ return elem.value == elem.form.elements['account_password'].value;},
						desc:'两次输入的密码不一致'
				}
			]
		}

	},
	person_info:
	{
		person_name:
		{
			rules:{required:true, desc:'请填写姓名'}
		},
		contact_name:
		{
			rules:{required:true, desc:'请填写您的真实姓名' }
		},
		person_id_no:
		{
			rules:
			[
				{required:true, desc:'请填写身份证号码'},
				{pattern:patterns.idcard, desc:'身份证号码不正确'}
			]
		}
	},
	driver_info:
	{
		driver_name:
		{
			prerequisites:{refer:'misc_is_driver', value:'1'},
			rules:{required:true, desc:'请填写驾驶证上的姓名'}
		},
		driver_driving_lic_no:
		{
			prerequisites:{refer:'misc_is_driver', value:'1'},
			rules:[ {required:true, desc:'驾照号码'},
					{pattern:patterns.idcard, desc:'驾照号码长度'}]
		},
		driver_years_driven:
		{
			prerequisites:{refer:'misc_is_driver', value:'1'},
			rules:{ pattern:patterns.digital, desc:'驾龄只能填写阿拉伯数字' }
		}
	},
	business_info:
	{
		biz_name:
		{
			rules:{required:true, desc:'请填写企业名称'}
		},
		bizt_road_biz_lic_no:
		{
			rules:{required:true, desc:'请填写道路经营许可证号'}
		},
		biz_biz_lic_no:
		{
			rules:{required:true, desc:'请填写营业执照号码'}
		},
		biz_national_taxation_no:
		{
			rules:{required:true, desc:'请填写营业执照号码'}
		}
	},
	login_info:
	{
		mod_mylogin_username:
		{
			rules:{required:true, desc:'请填写用户名'}
		},
		mod_mylogin_password:
		{
			rules:{required:true, desc:'请填写密码'}
		},
		check_num:
		{
			rules:{required:true, desc:'请填写验证码'}
		}
	}
};

if( false )
ValidateEngine =
{
	validate: function( form, rules )
	{
		var params =
		{
			form: form,
			data: FormExt.collect( form )
		};

		var result = {};

		rules.map( this._validateField, params )
			.forEach( this._mergeResult, result );


	},

	_validateField: function( rule )
	{
		var result = rule( this.form, this.data );
	},

	_mergeResult: function( result )
	{
		if( result == null )
			return;
		for( var prop in result )
		{
			this[prop] = prop in this
				? this[prop] && result[prop]
				: result[prop];
		}
	}
};


function checkAganst( value, rule )
{
	if( !rule )
		return true;



	return true;
};

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
		var prerequisites = [].concat( oDescriptor.prerequisites );
		for( var i = 0, p; i < prerequisites.length; ++i )
		{
			p = prerequisites[i];

			if( 'value' in p )
			{
				if( !$elements( oForm, p.refer ).map( FormExt._get, oForm ).some( Functor.equal, p.value ) )
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

};

function validateForm( oForm, oDescriptors, params )
{
	oForm = $form( oForm );

	if( !oForm || !oDescriptors )
		return false;

	var oDescriptor = ObjectExt.patch( {}, Array.expand( oDescriptors ) );

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

};
