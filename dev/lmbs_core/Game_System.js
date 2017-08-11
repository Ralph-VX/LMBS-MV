//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

Kien.LMBS_Core.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Kien.LMBS_Core.Game_System_initialize.apply(this);
    this._LMBSEnabled = Kien.LMBS_Core.enableDefault;
    this._LMBSBattleEventPauseGame = false;
}