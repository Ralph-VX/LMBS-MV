//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

Kien.LMBS_Core.Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
Window_SkillType.prototype.makeCommandList = function() {
    Kien.LMBS_Core.Window_SkillType_makeCommandList.apply(this, arguments);
    if (this._actor && !$gameParty.inBattle()){
        this.addCommand(Kien.LMBS_Core.skillTypeName, 'config', true);
    }
};

//-----------------------------------------------------------------------------
// Window_SkillConfig
//
// The window for Showing How the skill is asigned to each key.

function Window_SkillConfig() {
    this.initialize.apply(this, arguments);
}

Window_SkillConfig.prototype = Object.create(Window_Command.prototype);
Window_SkillConfig.prototype.constructor = Window_SkillConfig;

Window_SkillConfig.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this._actor = null;
}

Window_SkillConfig.prototype.windowWidth = function() {
    return 240;
};

Window_SkillConfig.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_SkillConfig.prototype.numVisibleRows = function() {
    return Kien.LMBS_Core.skillSetRightLeft ? 4 : 5;
};

Window_SkillConfig.prototype.makeCommandList = function() {
    if (!this._actor){
        return;
    }
    var lsit = [];
    var string = [];
    if (Kien.LMBS_Core.skillSetRightLeft) {
        list = ["0","8","4","2"];
        strings = ["X","↑X","←→X","↓X"];
    } else {
        list = ["0","8","4","6","2"];
        strings = ["X","↑X","←X","→X","↓X"];
    }
    for (var index = 0;index < list.length; index++) {
        this.addCommand(strings[index],'skill',true,list[index]);
    }
};

Window_SkillConfig.prototype.drawItem = function(index) {
    Window_Command.prototype.drawItem.call(this,index);
    if (this._actor){
    var rect = this.itemRectForText(index);
    var skill = $dataSkills[this._actor._skillSets[this._list[index].ext]];
        if (skill){
            this.drawText(skill.name, rect.x, rect.y, rect.width, "right");
        }
    }
};