//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

// Battle Processing
Kien.LMBS_Core.Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        if (!$gameSystem._LMBSEnabled) {
            return Kien.LMBS_Core.Game_Interpreter_command301.apply(this, arguments);
        }
        var troopId;
        if (this._params[0] === 0) {  // Direct designation
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable
            troopId = $gameVariables.value(this._params[1]);
        } else {  // Same as Random Encounter
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_BattleLMBS);
        }
    }
    return true;
}

Game_Interpreter.prototype.setEventPause = function(args) {
    if (args == "true") {
        $gameSystem._LMBSBattleEventPauseGame = true;
    } else if (args == "false") {
        $gameSystem._LMBSBattleEventPauseGame = false;
    }
}

Kien.lib.addPluginCommand("PauseBattle",Game_Interpreter.prototype.setEventPause);