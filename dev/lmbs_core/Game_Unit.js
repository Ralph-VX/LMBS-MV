//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

Game_Unit.prototype.update = function(){
    this.members().forEach(function(battler){
        battler.update();
    })
}