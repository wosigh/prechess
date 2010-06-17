//  namespace
vv =
{
};
vv.that; // copy of this
vv.iRunning = -1; // -1=engine not ready ; 0=ready for move , 1=cpu , 2=go infinite , 3=stop
vv.iMoves = -1; // -1=Game not loaded yet,NewGame triggered
vv.iAction = 0; // 0=init , 1=human, 2=computer
vv.iColor = 0; // 64=white , 128=black
vv.aBoard;
vv.aDelta = [];
vv.aDeltaCnt = [];
vv.aRedo = [];
vv.aRedoCnt = [];
vv.sStatus = "nnn";
vv.sFEN = "";
vv.sLastMove = "Please wait!";
vv.sBestMove = "";
vv.loopTimerInfo;
vv.loopTimerCalc;
vv.loopTimerStop;
vv.loopTimerResult;
vv.loopTimerResultInit;
vv.loopTimerPlay;
vv.cWHITE_FIG = 64;
vv.cBLACK_FIG = 128;
vv.cCHANGE_COLOR = 192;
vv.bFirst_l = false;
vv.bEnPassentMarker = false;
vv.bEngineBroken = false;
vv.iMattMove = 999 ; 
vv.bSingleShot = false ; 
function GameAssistant()
{
}
// PlayWhte
GameAssistant.prototype.play = function ()
{
	var delay = 0;
		
	if (vv.bEngineBroken)
	{
		engine_broken_dialog();
	}
	if (PreChess.CNewGame)
	{
		doNewGame();
		this.ResetDepot();
		PreChess.CNewGame = false;
		delay = 2000;
	}
	if (  (PreChess.PlayWhte || vv.bSingleShot)
	    && PreChess.LockPlay==false 
	    && vv.iRunning >= 0 
	    && vv.iMoves >= 0 
	    && vv.iAction < 2 
	    && vv.iColor == vv.cWHITE_FIG 
	    && vv.iMoves < vv.iMattMove
	    )
	{
		vv.bSingleShot = false ;
		vv.iAction = 2;
		setTimeout("cpu(true)", 800 + delay);
	}
	else
	{
	
	}
	if ( (PreChess.PlayBlck || vv.bSingleShot)  
		&& PreChess.LockPlay==false
	    && vv.iRunning >= 0 
	    && vv.iMoves >= 0 
	    && vv.iAction < 2 
	    && vv.iColor == vv.cBLACK_FIG 
	    && vv.iMoves < vv.iMattMove
	    )
	{
		vv.bSingleShot = false ;
		vv.iAction = 2;
		setTimeout("cpu(false)", 800 + delay);
	}
	else
	{
	
	}
	vv.loopTimerPlay = setTimeout("vv.that.play()", 1000) + delay;
}
GameAssistant.prototype.handleFlick = function (event)
{
	st("iAction=" + vv.iAction + " iRunning=" + vv.iRunning + " iMoves" + vv.iMoves + " iColor=" + vv.iColor +
	   "PlayBlck=" + PreChess.PlayBlck + " PlayWhte=" + PreChess.PlayWhte + "LockPlay=" + PreChess.LockPlay +
	   " iMattMove=" + vv.iMattMove );
	question();
}
GameAssistant.prototype.setup = function ()
{
	vv.that = this;
	this.setup2();
};
GameAssistant.prototype.setup2 = function ()
{
	this.controller.setupWidget(Mojo.Menu.appMenu, MenuAttr, MenuModel);
	var attributes =
	{
		hintText: 'hint',
		textFieldName: 'name',
		modelProperty: 'original',
		multiline: false,
		disabledProperty: 'disabled',
		focus: true,
		modifierState: Mojo.Widget.capsLock,
		limitResize: false,
		holdToEnable: false,
		focusMode: Mojo.Widget.focusSelectMode,
		changeOnKeyPress: true,
		textReplacement: false,
		maxLength: 30,
		requiresEnterKey: false
	};
	this.model =
	{
		'original': 'initial value',
		disabled: false
	};
	this.controller.setupWidget('textField', attributes, this.model);
	Mojo.Log.error('ported apps setup'); //Globals for chess program
	vv.sLastMove = "Please wait init!";
	st("");
	vv.loopTimerResultInit = setTimeout("plugin_result_init()", 2000);
	pimg = new Array();
	i = new Array("b", "bb1", "bb2", "bb3", "bb4", "bb5", "bb6", "bw1", "bw2", "bw3", "bw4", "bw5", "bw6", "l", "r", "sbb1", "sbb2", "sbb3", "sbb4", "sbb5", "sbb6", "sbw1", "sbw2", "sbw3", "sbw4", "sbw5", "sbw6", "swb1", "swb2", "swb3", "swb4", "swb5", "swb6", "sww1", "sww2", "sww3", "sww4", "sww5", "sww6", "t", "u", "w", "wb1", "wb2", "wb3", "wb4", "wb5", "wb6", "ww1", "ww2", "ww3", "ww4", "ww5", "ww6");
	for (j = 0; j < i.length; ++j)
	{
		pimg[j] = new Image();
		pimg[j].src = "images/" + i[j] + ".png";
	}
	this.gametime = this.controller.get('gametime');
	Element.observe(this.gametime, Mojo.Event.flick, this.handleFlick);
	N = 1;
	K = "";
	vv.iAction = 0;
	px = 0;
	py = 0;
	this.LoadGame(); // Attention LoadGame is asynchron
	Mojo.Log.error('end of setup');
}
GameAssistant.prototype.backgesture = function (event)
{
	if (vv.iMoves<2)
	{
		PreChess.CNewGame=true;
	}
	else
	{
		if (vv.iRunning < 2)
		{
			iAction_save = vv.iAction;
			vv.iAction = 0;
			vv.iRunning = 0 ;
			vv.sLastMove="";
			clearTimeout(vv.loopTimerCalc);
			clearTimeout(vv.loopTimerStop);
			clearTimeout(vv.loopTimerResult);
			clearTimeout(vv.loopTimerInfo);
			delta_back();
			iAction_save = vv.iAction;
			st("");
		}
	}
};
GameAssistant.prototype.forwardgesture = function (event)
{
	
	Mojo.Log.error("forward0");
	if (vv.iRunning == 2) // still thinking
	{
		Mojo.Log.error("forward1");
		clearTimeout(vv.loopTimerStop);
		clearTimeout(vv.loopTimerInfo);
		clearTimeout(vv.loopTimerResult);
		vv.iRunning=0;
		vv.iAction=0;
		vv.loopTimerStop = setTimeout("plugin_stop()", 50);
		vv.loopTimerResult = setTimeout("plugin_result()", 1000);
	}
	else
	{
		if (vv.aRedoCnt == 0)
		{
			vv.bSingleShot=true;
		}
		else
		{
			Mojo.Log.error("forward2" + vv.iRunning);
			vv.iRunning=0;		
			vv.iAction = 0;
			vv.sLastMove="";		
			clearTimeout(vv.loopTimerCalc);
			clearTimeout(vv.loopTimerStop);
			clearTimeout(vv.loopTimerResult);
			clearTimeout(vv.loopTimerInfo);
			delta_fwd();
			st("");
		}
	}
};
GameAssistant.prototype.handleCommand = function (event)
{
	this.controller = Mojo.Controller.stageController.activeScene();
	if (event.type == Mojo.Event.flick)
	{
		this.handleFlick();
	}
	if (event.type == Mojo.Event.back)
	{
		this.backgesture(event);
		event.preventDefault();
		event.stopPropagation();
	}
	if (event.type == Mojo.Event.forward)
	{
		this.forwardgesture(event);
		event.preventDefault();
		event.stopPropagation();
	}
}
GameAssistant.prototype.activate = function (event)
{
	if (!vv.bFirst_l)
	{
		l();
		initboard = vv.aBoard.clone();
	}
	vv.bFirst_l = true;
	vv.loopTimerPlay = setTimeout("vv.that.play()", 500);
	dxxx(vv.aBoard);
};
GameAssistant.prototype.deactivate = function (event)
{
	Mojo.Log.info("deactivate");
};
GameAssistant.prototype.cleanup = function (event)
{
	Mojo.Log.info("clean");
};
function engine_broken_dialog()
{
	vv.bEngineBroken = false;
	Mojo.Log.error("engine_broken");
	clearTimeout(vv.loopTimerResultInit);
	clearTimeout(vv.loopTimerPlay);
	Mojo.Controller.stageController.activeScene().showAlertDialog(
	{
		onChoose: (function (value)
		{
		}).bind(this),
		message: "Engine not ready, please restart ! ",
		choices: [
		{
			label: "Ok",
			value: true,
			type: 'negative'
		}]
	});
}
function question()
{
	Mojo.Controller.stageController.activeScene().showAlertDialog(
	{
		onChoose: (function (value)
		{
			if (value == true) doNewGame();
		}).bind(this),
		message: "New game ? ",
		choices: [
		{
			label: "Yes",
			value: true,
			type: 'negative'
		}, {
			label: "No",
			value: false,
			type: 'affirmative'
		}]
	});
}
