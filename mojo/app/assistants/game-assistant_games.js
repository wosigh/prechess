
GameAssistant.prototype.Fail = function (error)
{
	Mojo.Log.info("Fail");
};

GameAssistant.prototype.OK = function (error)
{
	Mojo.Log.info("Save OK");
};


GameAssistant.prototype.reloadmymoves = function(val) 
{
	vv.iMoves = val;
	if (vv.iMoves==undefined)	vv.iMoves=0;
	Mojo.Log.error("s mymoves"+vv.iMoves);
};	

GameAssistant.prototype.reloadb = function(val)          { if (vv.iMoves!=0 && val!=undefined) vv.aBoard = val; };
GameAssistant.prototype.reloaddeltas = function(val)     { if (vv.iMoves!=0 && val!=undefined) vv.aDelta = val; };
GameAssistant.prototype.reloaddelta_cnts = function(val) { if (vv.iMoves!=0 && val!=undefined) vv.aDeltaCnt = val;};
GameAssistant.prototype.reloadredos = function(val)      { if (vv.iMoves!=0 && val!=undefined) vv.aRedo = val; };
GameAssistant.prototype.reloadredo_cnts = function(val)  { if (vv.iMoves!=0 && val!=undefined) vv.aRedoCnt = val; };
GameAssistant.prototype.reloadc = function(val)          { 
	if (vv.iMoves!=0) 
	{	if (val!=undefined) vv.iColor = val; 
		vv.l_first=false;
		Mojo.Log.error("reloadc iColor"+vv.iColor);
		this.activate();
	}
};

GameAssistant.prototype.SaveGame = function ()
{
	Mojo.Log.error("Save Game");
	Mojo.Log.error("SaveGame iColor"+vv.iColor);

	this.db = new Mojo.Depot({name: 'ext:achess'});
						
	this.db.add('cp_mymoves', (vv.iMoves!=null)?vv.iMoves:'nullval', this.OK, this.Fail);
	this.db.add('cp_b', (vv.aBoard!=null)?vv.aBoard:'nullval', this.OK, this.Fail);
	this.db.add('cp_deltas', (vv.aDelta!=null)?vv.aDelta:'nullval', this.OK, this.Fail);
	this.db.add('cp_delta_cnts', (vv.aDeltaCnt!=null)?vv.aDeltaCnt:'nullval', this.OK, this.Fail);
	this.db.add('cp_redos', (vv.aRedo!=null)?vv.aRedo:'nullval', this.OK, this.Fail);
	this.db.add('cp_redo_cnts', (vv.aRedoCnt!=null)?vv.aRedoCnt:'nullval', this.OK, this.Fail);
	this.db.add('cp_c', (vv.iColor!=null)?vv.iColor:'nullval', this.OK, this.Fail);	
}


GameAssistant.prototype.LoadGame = function ()
{		
		Mojo.Log.error("Load Game");

	
		this.db = new Mojo.Depot({name:"ext:achess"});
		
		if (this.db==undefined) Mojo.Log.error("Fehler");
		
		this.db.get('cp_mymoves',this.reloadmymoves.bind(this), this.Fail.bind(this));		    	   
    	this.db.get("cp_b",this.reloadb.bind(this),this.Fail.bind(this));	
    	this.db.get("cp_deltas",this.reloaddeltas.bind(this), this.Fail.bind(this));	
    	this.db.get('cp_delta_cnts',this.reloaddelta_cnts.bind(this), this.Fail.bind(this));	
    	this.db.get('cp_redos',this.reloadredos.bind(this) , this.Fail.bind(this));	        	
    	this.db.get('cp_redo_cnts',this.reloadredo_cnts.bind(this), this.Fail.bind(this));	
    	this.db.get('cp_c',this.reloadc.bind(this), this.Fail.bind(this));	
};
	
GameAssistant.prototype.ResetDepot = function ()
{		
		
		this.db = new Mojo.Depot({name:"ext:achess"});		
		
		this.db.discard('cp_mymoves',this.OK.bind(this), this.Fail.bind(this));		    	   
    	this.db.discard("cp_b",this.OK.bind(this),this.Fail.bind(this));	
    	this.db.discard("cp_deltas",this.OK.bind(this), this.Fail.bind(this));	
    	this.db.discard('cp_delta_cnts',this.OK.bind(this), this.Fail.bind(this));	
    	this.db.discard('cp_redos',this.OK.bind(this) , this.Fail.bind(this));	        	
    	this.db.discard('cp_redo_cnts',this.OK.bind(this), this.Fail.bind(this));	

};

