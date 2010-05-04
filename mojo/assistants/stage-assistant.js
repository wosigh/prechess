function StageAssistant() {}
StageAssistant.prototype.setup = function () {
    this.controller.pushScene('game');
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
function AppAssistant(appController) {
    this.appController = appController;
}
AppAssistant.prototype.handleRelaunch = function () {
    var stageMgr = Mojo.Controller.getAppController().getStageMgr();
    if (stageMgr.stageExists("game")) {
        this.appController.getStageMgr().focusStage("game");
    } else {
        var f = function (stageController) {
            this.stageController = stageController;
            stageController.pushScene('game');
        }.bind(this);
        Mojo.Controller.getAppController().createStageWithCallback("game", f);
    }
};