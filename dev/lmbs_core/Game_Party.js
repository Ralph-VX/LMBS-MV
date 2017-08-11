//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Kien.LMBS_Core.Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    Kien.LMBS_Core.Game_Party_initialize.apply(this);
    this._lastBattleActorIndexLMBS = 0;
};

Game_Party.prototype.battlerPosition = function(battler){
    return 100 + this.battleMembers().indexOf(battler) * 80;
}