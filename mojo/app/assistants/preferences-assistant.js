

function PreferencesAssistant() {

}

PreferencesAssistant.prototype.setup = function() {
 
	// Internationalization:
    prefMainGroupTitleElement = this.controller.get("prefMainGroupTitle");
    prefMainGroupTitleElement.innerHTML = $L("Engine");

	prefPlayWhteElement = this.controller.get("prefPlayWhte");
    prefPlayBlckElement = this.controller.get("prefPlayBlck");
    prefInvBoardElement = this.controller.get("prefInvBoard");
    prefShowInfoElement = this.controller.get("prefShowInfo");
    
    
    prefPlayWhteElement.innerHTML = $L("Engine plays white");
    prefPlayBlckElement.innerHTML = $L("Engine plays black");
	prefInvBoardElement.innerHTML = $L("Invert board");
	prefShowInfoElement.innerHTML = $L("Show info");

	
	
////////////////////////////////////////////////////////////////////////////

    
    // Setup list selector for UPDATE INTERVAL
    this.controller.setupWidget("prefMoveTime",
        {
            label: $L("Movetime"),
            choices: [
                {label: $L("  2 sec"),   value: 0},
                {label: $L("  3 sec"),   value: 1000},
                {label: $L("  4 sec"),   value: 2000},
                {label: $L("  5 sec"),   value: 3000},
                {label: $L(" 10 sec"),   value: 8000},    
                {label: $L(" 15 sec"),   value: 12000},    
                {label: $L("  3 min"),   value: 108000},    
                {label: $L(" 30 min"),   value: 1080000},    
                     ]    
        },
        this.MoveTimeModel = {
            value : PreChess.MoveTime
        }
	);
    
    
////////////////////////////////////////////////////////////////////////////


    this.controller.setupWidget("PlayWhteToggle",{},this.PlayWhteToggleModel = { value: PreChess.PlayWhte });
    this.controller.setupWidget("PlayBlckToggle",{},this.PlayBlckToggleModel = { value: PreChess.PlayBlck });
    this.controller.setupWidget("InvBoardToggle",{},this.InvBoardToggleModel = { value: PreChess.InvBoard });
    this.controller.setupWidget("ShowInfoToggle",{},this.ShowInfoToggleModel = { value: PreChess.ShowInfo });

    this.changeMoveTimeHandler = this.changeMoveTime.bindAsEventListener(this);
 	this.changePlayWhteHandler = this.changePlayWhte.bindAsEventListener(this);
   	this.changePlayBlckHandler = this.changePlayBlck.bindAsEventListener(this);
    this.changeInvBoardHandler = this.changeInvBoard.bindAsEventListener(this);
    this.changeShowInfoHandler = this.changeShowInfo.bindAsEventListener(this);
   
    this.controller.listen("prefMoveTime",   Mojo.Event.propertyChange, this.changeMoveTimeHandler);
    this.controller.listen("PlayWhteToggle", Mojo.Event.propertyChange, this.changePlayWhteHandler);
    this.controller.listen("PlayBlckToggle", Mojo.Event.propertyChange, this.changePlayBlckHandler);
    this.controller.listen("InvBoardToggle", Mojo.Event.propertyChange, this.changeInvBoardHandler);
    this.controller.listen("ShowInfoToggle", Mojo.Event.propertyChange, this.changeShowInfoHandler);
        

};

// Deactivate - save News preferences and globals
PreferencesAssistant.prototype.deactivate = function() {
    PreChess.Cookie.storeCookie();                                                                                    
};

// Cleanup - remove listeners
PreferencesAssistant.prototype.cleanup = function() {
    
    this.controller.stopListening("prefMoveTime",   Mojo.Event.propertyChange, this.changeMoveTimeHandler);
    this.controller.stopListening("PlayWhteToggle", Mojo.Event.propertyChange, this.changePlayWhteHandler);
    this.controller.stopListening("PlayBlckToggle", Mojo.Event.propertyChange, this.changePlayBlckHandler);
    this.controller.stopListening("InvBoardToggle", Mojo.Event.propertyChange, this.changeInvBoardHandler);
    this.controller.stopListening("ShowInfoToggle", Mojo.Event.propertyChange, this.changeShowInfoHandler);
    };

PreferencesAssistant.prototype.changeMoveTime = function(event) {PreChess.MoveTime = this.MoveTimeModel.value;};
PreferencesAssistant.prototype.changePlayWhte = function(event) {PreChess.PlayWhte = this.PlayWhteToggleModel.value;};
PreferencesAssistant.prototype.changePlayBlck = function(event) {PreChess.PlayBlck = this.PlayBlckToggleModel.value;};
PreferencesAssistant.prototype.changeInvBoard = function(event) {PreChess.InvBoard = this.InvBoardToggleModel.value;};
PreferencesAssistant.prototype.changeShowInfo = function(event) {PreChess.ShowInfo = this.ShowInfoToggleModel.value;};


