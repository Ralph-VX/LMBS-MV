//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.


Kien.LMBS_Core.Scene_Map_updateEncounter = Scene_Map.prototype.updateEncounter;
Scene_Map.prototype.updateEncounter = function() {
    if (!$gameSystem._LMBSEnabled){
        Kien.LMBS_Core.Scene_Map_updateEncounter.call(this);
        return;
    }
    if ($gamePlayer.executeEncounter()) {
        SceneManager.push(Scene_BattleLMBS);
    }
};