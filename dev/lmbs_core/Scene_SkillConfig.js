//-----------------------------------------------------------------------------
// Scene_SkillConfig
//
// The scene class for 

function Scene_SkillConfig() {
    this.initialize.apply(this, arguments);
}

Scene_SkillConfig.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillConfig.prototype.constructor = Scene_SkillConfig;

Scene_SkillConfig.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SkillConfig.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createAllWindow();
    this.refreshActor();
};

Scene_SkillConfig.prototype.createAllWindow = function() {
    var y = this._helpWindow.height;
    this._skillConfigWindow = new Window_SkillConfig(0,y);
    this._skillConfigWindow.setHandler('skill', this.commandSkillConfig.bind(this));
    this._skillConfigWindow.setHandler('cancel',   this.popScene.bind(this));
    this._skillConfigWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._skillConfigWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._skillConfigWindow);
    var wx = this._skillConfigWindow.width;
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth - wx;
    var wh = this._skillConfigWindow.height;
    this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);

    this.addWindow(this._statusWindow);
    wx = 0;
    wy = this._statusWindow.y + this._statusWindow.height;
    ww = Graphics.boxWidth;
    wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    // dynamically override the includes function.
    // Yeah a easy way to prevent so many similar classes.
    this._itemWindow.includes = function(item) {return !!item};
    this._itemWindow.isEnabled = function(item) {return true};
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
}

Scene_SkillConfig.prototype.commandSkillConfig = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
}

Scene_SkillConfig.prototype.item = function() {
    return this._itemWindow.item();
};
Scene_SkillConfig.prototype.onItemOk = function() {
    this.actor().setLastMenuSkill(this.item());
    var ext = this._skillConfigWindow.currentExt();
    if (ext){
        this.actor()._skillSets[ext] = this.item().id;
        if (Kien.LMBS_Core.skillSetRightLeft && ext === "4"){
            this.actor()._skillSets["6"] = this.item().id;
        }
        this._skillConfigWindow.refresh();
    }
    this.onItemCancel();
};

Scene_SkillConfig.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._skillConfigWindow.activate();
};

Scene_SkillConfig.prototype.refreshActor = function() {
    var actor = this.actor();
    this._skillConfigWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};


Scene_SkillConfig.prototype.onActorChange = function() {
    this.refreshActor();
    this._skillConfigWindow.activate();
};