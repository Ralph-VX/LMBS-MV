//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

Kien.LMBS_Core.Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
Scene_Skill.prototype.createSkillTypeWindow = function() {
    Kien.LMBS_Core.Scene_Skill_createSkillTypeWindow.apply(this, arguments);
    this._skillTypeWindow.setHandler('config', this.commandConfig.bind(this));
};

Scene_Skill.prototype.commandConfig = function() {
    SceneManager.push(Scene_SkillConfig);
    //this._skillTypeWindow.activate();
}