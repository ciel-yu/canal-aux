TabController = function( tabs, panels, options )
{
	ObjectExt.patch( this, options );
	this._init( [].concat(tabs), [].concat(panels) );
};

TabController.prototype =
{
	// styles
	tabSelected:'',
	tabHover:'',


	defaultTab: 0,

	lastTab: null,
	lastPanel: null,

	handler:
	{
		click: function( e )
		{
			this.tabController.showTab( this );
		},
		mouseout: function( e )
		{
			CSS.remove( this, this.tabController.tabHover );
		},
		mouseover: function( e )
		{
			CSS.add( this, this.tabController.tabHover );
		}
	},

	_init: function( tabs, panels )
	{
		var self = this;

		tabs.forEach(
			function( e, i )
			{
				if( !this[i] )
					return;
				EventExt.observe( e, 'click', self.handler.click.bindAsEventListener( e ) );
				EventExt.observe( e, 'mouseover', self.handler.mouseover.bindAsEventListener( e ) );
				EventExt.observe( e, 'mouseout', self.handler.mouseout.bindAsEventListener( e ) );

				e.tabController = self;
				e.targetPanel = this[i];
			},
			panels
		);

		panels.forEach( ElementExt.forceHide );

		this.showTab( tabs[ this.defaultTab || 0 ] );
	},

	showTab: function( tab )
	{
		if( this.lastTab )
		{
			if( this.lastTab.targetPanel )
				ElementExt.forceHide( this.lastTab.targetPanel );
			CSS.remove( this.lastTab, this.tabSelected );
		}

		CSS.add( tab, this.tabSelected );

		if( tab.targetPanel )
			ElementExt.forceShow( tab.targetPanel );

		this.lastTab = tab;

	}


};