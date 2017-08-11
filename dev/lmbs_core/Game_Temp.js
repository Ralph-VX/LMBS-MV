//-----------------------------------------------------------------------------
// Game_Temp
//
// The game object class for temporary data that is not included in save data.

Kien.LMBS_Core.Game_Temp_initialize = Game_Temp.prototype.initialize;
Game_Temp.prototype.initialize = function() {
    Kien.LMBS_Core.Game_Temp_initialize.call(this);
    this._inBattleTopMessage = [];
};

Game_Temp.prototype.clearBattleMessage = function() {
    this._inBattleTopMessage = [];
}

Game_Temp.prototype.setBattleMessage = function(channel, string) {
    this._inBattleTopMessage[channel] = string;
}

Game_Temp.prototype.removeBattleMessage = function(channel) {
    this._inBattleTopMessage[channel] = undefined;
}

Game_Temp.prototype.getBattleMessage = function(channel) {
    return this._inBattleTopMessage[channel];
}

Game_Temp.prototype.getBattleMessageLength = function() {
    return this._inBattleTopMessage.length;
}