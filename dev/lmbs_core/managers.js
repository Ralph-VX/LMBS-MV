/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
 
Input.keyMapper[Kien.LMBS_Core.guardKey] = 'LMBSguard';
Input.keyMapper[Kien.LMBS_Core.previousTargetKey] = 'LMBSprevioustarget';
Input.keyMapper[Kien.LMBS_Core.nextTargetKey] = 'LMBSnexttarget';

DataManager._databaseFiles.push({ name: '$dataLMBSCharacters',       src: 'characterList.json'       });

//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

ImageManager.loadProjectile = function(filename, hue) {
    return this.loadBitmap('img/projectile/', filename, hue, false);
};

ImageManager.loadWeapon = function(filename) {
    return this.loadBitmap('img/weapons/', filename, 0, false);
};

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

Kien.LMBS_Core.SceneManager_isNextScene = SceneManager.isNextScene;
SceneManager.isNextScene = function(sceneClass) {
    if (sceneClass === Scene_Battle) {
        return Kien.LMBS_Core.SceneManager_isNextScene.call(this, Scene_BattleLMBS) || Kien.LMBS_Core.SceneManager_isNextScene.call(this, sceneClass);
    };
    return Kien.LMBS_Core.SceneManager_isNextScene.call(this, sceneClass);
};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

BattleManager._isEventRunning = false;

BattleManager.displayStartMessages = function() {
    // Maybe use to display enemy, but not as a message.
};

BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    //this.displayVictoryMessage();
    //this.displayRewards();
    //this.gainRewards();
    this.endBattle(0);
};

BattleManager.processDefeat = function() {
    //this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

BattleManager.hasObstacle = function(subject, object){
    var subx = subject.screenX();
    var objx = object.screenX();
    var members = null;
    if(!(Kien.LMBS_Core.moveThroughAlly || Kien.LMBS_Core.dashThroughAlly)) {
        members = subject.friendsUnit().members();
        if (members.findIndex(function(bat) {
            return Kien.LMBS_Core.inBetween(subx,objx,bat.screenX());
        }) != -1){
            return true;
        }
    }
    if(!(Kien.LMBS_Core.moveThroughEnemy || Kien.LMBS_Core.dashThroughEnemy)) {
        members = subject.opponentsUnit().members();
        if (members.findIndex(function(bat) {
            return Kien.LMBS_Core.inBetween(subx,objx,bat.screenX());
        }) != -1){
            return true;
        }
    }
    return false;
};

BattleManager.isEventRunning = function() {
    return this._isEventRunning;
}

BattleManager.isEventPausing = function() {
    return this.isEventRunning() && $gameSystem._LMBSBattleEventPauseGame;
}

BattleManager.previousTarget = function(originalTarget) {
    var members = originalTarget.friendsUnit().aliveMembers();
    var targets = members.filter(function(t) {return originalTarget._battleX > t._battleX}).sort(function(a,b) { return b._battleX - a._battleX});
    if (targets.length > 0) {
        return targets[0]
    } else {
        targets = members.filter(function(t) {return originalTarget._battleX < t._battleX}).sort(function(a,b) { return b._battleX - a._battleX});
        if (targets.length > 0) {
            return targets[0]
        } else {
            return originalTarget;
        }
    }
}

BattleManager.nextTarget = function(originalTarget) {
    var members = originalTarget.friendsUnit().aliveMembers();
    var targets = members.filter(function(t) {return originalTarget._battleX < t._battleX}).sort(function(a,b) { return a._battleX - b._battleX});
    if (targets.length > 0) {
        return targets[0]
    } else {
        targets = members.filter(function(t) {return originalTarget._battleX > t._battleX}).sort(function(a,b) { return a._battleX - b._battleX});
        if (targets.length > 0) {
            return targets[0]
        } else {
            return originalTarget;
        }
    }
}