function PreferenceAssistant()
{
}
PreferenceAssistant.prototype.setup = function ()
{
	// Internationalization:
	prefMainGroupTitleElement = this.controller.get("prefMainGroupTitle");
	prefMainGroupTitleElement.innerHTML = $L("Engine");
	prefPlayWhteElement = this.controller.get("prefPlayWhte");
	prefPlayBlckElement = this.controller.get("prefPlayBlck");
	prefInvBoardElement = this.controller.get("prefInvBoard");
	prefShowInfoElement = this.controller.get("prefShowInfo");
	prefMakeToneElement = this.controller.get("prefMakeTone");
	// prefDownloadElement = this.controller.get("prefDownload");
	prefPlayWhteElement.innerHTML = $L("Engine plays white");
	prefPlayBlckElement.innerHTML = $L("Engine plays black");
	prefInvBoardElement.innerHTML = $L("Invert board");
	prefShowInfoElement.innerHTML = $L("Show info");
	prefMakeToneElement.innerHTML = $L("Sound");
	// prefDownloadElement.innerHTML = $L("Download Book");
	////////////////////////////////////////////////////////////////////////////
	// Setup list selector for UPDATE INTERVAL
	this.controller.setupWidget("prefMoveTime", {
		label: $L("Movetime"),
		choices: [
		{
			label: $L("  2 sec"),
			value: 0
		}, {
			label: $L("  3 sec"),
			value: 1000
		}, {
			label: $L("  4 sec"),
			value: 2000
		}, {
			label: $L("  5 sec"),
			value: 3000
		}, {
			label: $L("  7 sec"),
			value: 5000
		}, {
			label: $L(" 10 sec"),
			value: 8000
		}, {
			label: $L(" 15 sec"),
			value: 12000
		}, {
			label: $L("  3 min"),
			value: 108000
		}, {
			label: $L(" 30 min"),
			value: 1080000
		}, ]
	}, this.MoveTimeModel =
	{
		value: PreChess.MoveTime
	});
	////////////////////////////////////////////////////////////////////////////
	this.controller.setupWidget("PlayWhteToggle", {
	}, this.PlayWhteToggleModel =
	{
		value: PreChess.PlayWhte
	});
	this.controller.setupWidget("PlayBlckToggle", {
	}, this.PlayBlckToggleModel =
	{
		value: PreChess.PlayBlck
	});
	this.controller.setupWidget("InvBoardToggle", {
	}, this.InvBoardToggleModel =
	{
		value: PreChess.InvBoard
	});
	this.controller.setupWidget("ShowInfoToggle", {
	}, this.ShowInfoToggleModel =
	{
		value: PreChess.ShowInfo
	});
	this.controller.setupWidget("MakeToneToggle", {
	}, this.MakeToneToggleModel =
	{
		value: PreChess.MakeTone
	});
	this.controller.setupWidget('DownloadToggle', this.atts =
	{
		type: Mojo.Widget.activityButton
	}, this.model =
	{
		buttonLabel: 'Download book',
		buttonClass: 'affirmative',
		disabled: false,
	});
	this.callDeactivateSpinner = this.callDeactivateSpinner.bind(this);
	this.changeMoveTimeHandler = this.changeMoveTime.bindAsEventListener(this);
	this.changePlayWhteHandler = this.changePlayWhte.bindAsEventListener(this);
	this.changePlayBlckHandler = this.changePlayBlck.bindAsEventListener(this);
	this.changeInvBoardHandler = this.changeInvBoard.bindAsEventListener(this);
	this.changeShowInfoHandler = this.changeShowInfo.bindAsEventListener(this);
	this.changeMakeToneHandler = this.changeMakeTone.bindAsEventListener(this);
	this.changeDownloadHandler = this.changeDownload.bindAsEventListener(this);
	this.controller.listen("prefMoveTime", Mojo.Event.propertyChange, this.changeMoveTimeHandler);
	this.controller.listen("PlayWhteToggle", Mojo.Event.propertyChange, this.changePlayWhteHandler);
	this.controller.listen("PlayBlckToggle", Mojo.Event.propertyChange, this.changePlayBlckHandler);
	this.controller.listen("InvBoardToggle", Mojo.Event.propertyChange, this.changeInvBoardHandler);
	this.controller.listen("ShowInfoToggle", Mojo.Event.propertyChange, this.changeShowInfoHandler);
	this.controller.listen("MakeToneToggle", Mojo.Event.propertyChange, this.changeMakeToneHandler);
	this.controller.listen("DownloadToggle", Mojo.Event.tap, this.changeDownloadHandler);
};

// Deactivate - save News preferences and globals
PreferenceAssistant.prototype.activate = function ()
{
	PreChess.LockPlay = true;
};


// Deactivate - save News preferences and globals
PreferenceAssistant.prototype.deactivate = function ()
{
	PreChess.Cookie.storeCookie();
	PreChess.LockPlay = false;
};


// Cleanup - remove listeners
PreferenceAssistant.prototype.cleanup = function ()
{
	this.controller.stopListening("prefMoveTime", Mojo.Event.propertyChange, this.changeMoveTimeHandler);
	this.controller.stopListening("PlayWhteToggle", Mojo.Event.propertyChange, this.changePlayWhteHandler);
	this.controller.stopListening("PlayBlckToggle", Mojo.Event.propertyChange, this.changePlayBlckHandler);
	this.controller.stopListening("InvBoardToggle", Mojo.Event.propertyChange, this.changeInvBoardHandler);
	this.controller.stopListening("ShowInfoToggle", Mojo.Event.propertyChange, this.changeShowInfoHandler);
	this.controller.stopListening("MakeToneToggle", Mojo.Event.propertyChange, this.changeMakeToneHandler);
	this.controller.stopListening("DownloadToggle", Mojo.Event.propertyChange, this.changeDownloadHandler);
};
PreferenceAssistant.prototype.changeMoveTime = function (event)
{
	PreChess.MoveTime = this.MoveTimeModel.value;
};
PreferenceAssistant.prototype.changePlayWhte = function (event)
{
	PreChess.PlayWhte = this.PlayWhteToggleModel.value;
};
PreferenceAssistant.prototype.changePlayBlck = function (event)
{
	PreChess.PlayBlck = this.PlayBlckToggleModel.value;
};
PreferenceAssistant.prototype.changeInvBoard = function (event)
{
	PreChess.InvBoard = this.InvBoardToggleModel.value;
};
PreferenceAssistant.prototype.changeShowInfo = function (event)
{
	PreChess.ShowInfo = this.ShowInfoToggleModel.value;
};
PreferenceAssistant.prototype.changeMakeTone = function (event)
{
	PreChess.MakeTone = this.MakeToneToggleModel.value;
};
PreferenceAssistant.prototype.changeDownload = function (event)
{
	this.question(),
	this.callDeactivateSpinner();
};
PreferenceAssistant.prototype.callDeactivateSpinner = function ()
{
	if (!this.spinning)
	{
		window.setTimeout(this.deactivateSpinner.bind(this), 3000);
		this.spinning = true;
	}
}
PreferenceAssistant.prototype.deactivateSpinner = function ()
{
	this.buttonWidget = this.controller.get('DownloadToggle');
	this.buttonWidget.mojo.deactivate();
	this.spinning = false;
}
PreferenceAssistant.prototype.question = function (event)
{
	Mojo.Controller.stageController.activeScene().showAlertDialog(
	{
		onChoose: (function (value)
		{
			if (value == true) this.download();
		}).bind(this),
		message: "Start background download 15MB ? ",
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
PreferenceAssistant.prototype.download = function (event)
{
	try
	{
		this.controller.serviceRequest('palm://com.palm.downloadmanager/', {
			method: 'download',
			parameters: {
				target: 'http://git.webos-internals.org/?p=applications/prechess.git;a=blob_plain;f=engines/book.bin;hb=HEAD',
				targetDir: '/media/internal/.app-storage/file_.media.cryptofs.apps.usr.palm.applications.com.vocshopgames.chess_0',
				targetFilename: 'book.bin',
				keepFilenameOnRedirect: false,
				subscribe: false
			}, onSuccess: function (response)
			{
			}, onFailure: function (error)
			{
			}, onComplete: function (response)
			{
				Mojo.Log.error('complete');
				// this.finished();
			}
		})
	}
	catch (error)
	{
	}
}