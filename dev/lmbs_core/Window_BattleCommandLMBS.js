//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

function Window_BattleCommandLMBS() {
    this.initialize.apply(this, arguments);
}

Window_BattleCommandLMBS.prototype = Object.create(Window_HorzCommand.prototype);
Window_BattleCommandLMBS.prototype.constructor = Window_BattleCommandLMBS;

Window_BattleCommandLMBS.prototype.initialize = function(x, y) {
    this._windowWidth = 128;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    var maxwidth = Math.max(this.textWidth(Kien.LMBS_Core.battleSkillName),this.textWidth(Kien.LMBS_Core.battleItemName));
    this.width = maxwidth * 2 + this.textPadding()*4+this.standardPadding()*2;
    this.createContents();
    this.refresh();
    this.deactivate();
    this.openness = 0;
};

Window_BattleCommandLMBS.prototype.windowWidth = function() {
    return 1;
};

Window_BattleCommandLMBS.prototype.maxCols = function() {
    return 2;
};

Window_BattleCommandLMBS.prototype.makeCommandList = function() {
    this.addCommand(Kien.LMBS_Core.battleSkillName, 'skill', true, Kien.LMBS_Core.battleSkillIcon);
    this.addCommand(Kien.LMBS_Core.battleItemName, 'item', true, Kien.LMBS_Core.battleItemIcon);
};

// Window_BattleCommandLMBS.prototype.drawItem = function(index) {
//     var rect = this.itemRectForText(index);
//     var align = this.itemTextAlign();
//     this.resetTextColor();
//     this.changePaintOpacity(this.isCommandEnabled(index));
//     this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
//     this.drawIcon(this._list[index].ext, rect.x,0);
// };

// Window_BattleCommandLMBS.prototype.itemRectForText = function(index) {
//     var rect = this.itemRect(index);
//     rect.x += 32;
//     rect.width -= 32;
//     return rect;
// };