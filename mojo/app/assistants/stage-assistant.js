//  News namespace
PreChess = {};

PreChess.MoveTime = 2000;
PreChess.InvBoard = false;             	
PreChess.ShowInfo = true;  
PreChess.PlayWhte = false;
PreChess.PlayBlck = true;
PreChess.CNewGame = false;
  	 
//PreChess.MoveTime = "  4 sec";       	// Feed update interval 
PreChess.MoveTime;
var GameScene;

//  AppAssistant.handleCommand()
MenuAttr = {omitDefaultItems: true};

MenuModel = {
visible: true,
items: [ 
	Mojo.Menu.editItem,
	{label: $L("New Game"), command: "doNewGame"},    
	{label: $L("Preferences..."), command: "doPrefs"},    
	Mojo.Menu.helpItem          
]
};


function StageAssistant(appController) {
    Mojo.Log.error("StageAssistant");
    
	this.appController = appController;
	// this.controller.pushScene('game');
}


StageAssistant.prototype.setup = function () {
    PreChess.Cookie.initialize(); 
    GameScene= this.controller.pushScene('game');
};

// -----------------------------------------
// handleCommand - called to handle app menu selections
//    
StageAssistant.prototype.handleCommand = function(event) {
	
    var currentScene = this.controller.activeScene();
       
    if (event.type == Mojo.Event.command) {
        switch(event.command) 
		{
 
			case 'doPrefs':
		            
                this.controller.pushScene("preferences");
				
            break;            
            
            case 'doNewGame':
                PreChess.CNewGame=true;
            break;
				
            
		}
	}
};


StageAssistant.prototype.showScene = function (directory, sceneName, arguments) {
    if (arguments === undefined) {
        this.controller.pushScene({
            name: sceneName,
            sceneTemplate: directory + "/" + sceneName + "-scene"
        })
    } else {
        this.controller.pushScene({
            name: sceneName,
            sceneTemplate: directory + "/" + sceneName + "-scene"
        },
        arguments)
    }
};

//  -------------------------------------------------------
//  handleLaunch - called by the framework when the application is asked to launch
//    - First launch; create card stage and first scene
//    - Update; after alarm fires to update feeds
//    - Notification; after user taps banner or dashboard
//
StageAssistant.prototype.handleLaunch = function (launchParams) {
		   Mojo.Log.error("handleLaunch");
    
	       
};


PreChess.Cookie = ({
        
  initialize: function()  {
  	
  	Mojo.Log.error("initialize Cookie");
    // Update globals with preferences or create it.
    this.cookieData = new Mojo.Model.Cookie("ComVocShopGamesChess");
    var oldPrefs = this.cookieData.get();

	if (oldPrefs)
	{ 
	    Mojo.Log.error("iMoveTime:"+oldPrefs.MoveTime);
	    Mojo.Log.error("iMoveTime:"+oldPrefs.MoveTime.value);
	    
	    Mojo.Log.error("InvBoard;"+oldPrefs.InvBoard);
		Mojo.Log.error("ShowInfo;"+oldPrefs.ShowInfo);
		Mojo.Log.error("PlayWhte;"+oldPrefs.PlayWhte);
		Mojo.Log.error("PlayBlck;"+oldPrefs.PlayBlck);
	    
	    PreChess.MoveTime = oldPrefs.MoveTime;
	    PreChess.InvBoard = oldPrefs.InvBoard;
	    PreChess.ShowInfo = oldPrefs.ShowInfo;
	    PreChess.PlayWite = oldPrefs.PlayWhte;
	    PreChess.PlayBlck = oldPrefs.PlayBlck;                
	  
	    
	    this.storeCookie();
	  }
  },
      
  //  store - function to update stored cookie with global values
  storeCookie: function() {
  	
  	Mojo.Log.error("storeCookie");
  	Mojo.Log.error(PreChess.MoveTime);
  	
  	  Mojo.Log.error("sMoveTime:"+PreChess.MoveTime);
        Mojo.Log.error("sInvBoard;"+PreChess.InvBoard);
    	Mojo.Log.error("sShowInfo;"+PreChess.ShowInfo);
    	Mojo.Log.error("sPlayWhte;"+PreChess.PlayWhte);
    	Mojo.Log.error("sPlayBlck;"+PreChess.PlayBlck);
    
    this.cookieData.put(    {
      MoveTime: PreChess.MoveTime,
      InvBoard: PreChess.InvBoard,
      ShowInfo: PreChess.ShowInfo,
      PlayWhte: PreChess.PlayWhte,
      PlayBlck: PreChess.PlayBlck,
      });
  }
  
});