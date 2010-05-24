//  News namespace
PreChess = {};

PreChess.versionString = "0.0.7";
PreChess.InvBoard = false;             	
PreChess.ShowInfo = true;  
PreChess.PlayWhte = false;
PreChess.PlayBlck = true;
PreChess.CNewGame = false;
  	 
PreChess.MoveTime = "  4 sec";       	// Feed update interval 

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
    this.cookieData = new Mojo.Model.Cookie("ComVocshopgamesChess");
    var oldPrefs = this.cookieData.get();
	
    if (oldPrefs) {
      // If current version, just update globals & prefs
      if (oldPrefs.versionString == PreChess.versionString)    {
        Mojo.Log.error(oldPrefs.MoveTime);
    
        PreChess.MoveTime = oldPrefs.MoveTime;
        PreChess.InvBoard = oldPrefs.InvBoard;
        PreChess.ShowInfo = oldPrefs.ShowInfo;
        PreChess.PlayWite = oldPrefs.PlayWhte;
        PreChess.PlayBlck = oldPrefs.PlayBlck;                
        } else {
        // migrate old preferences here on updates of News app        
      }
    }
  
    this.storeCookie();
  },
      
  //  store - function to update stored cookie with global values
  storeCookie: function() {
  	
  	Mojo.Log.error("storeCookie");
  	Mojo.Log.error(PreChess.MoveTime);
    
    this.cookieData.put(    {
      MoveTime: PreChess.MoveTime,
      versionString: PreChess.versionString,
      InvBoard: PreChess.InvBoard,
      ShowInfo: PreChess.ShowInfo,
      PlayWhte: PreChess.PlayWhte,
      PlayBlck: PreChess.PlayBlck,
      });
  }
  
});