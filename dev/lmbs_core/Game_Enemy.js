//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

//Kien.LMBS_Core.Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
//Game_Enemy.prototype.initMembers = function() {
//   Kien.LMBS_Core.Game_Enemy_initMembers.call(this);
//}

Game_Enemy.prototype.clearAiData = function() {
    this._aiTree = [];
    this._aiData.readySkill = null; // Skill Id that character Ai is trying to use.
    this._pauseAi = false;
    var ai = eval(this._aiData.classname);
    this.pushAi(ai);
}

Game_Enemy.prototype.resetAi = function() {
    this.clearAiData();
}

Game_Enemy.prototype.pushAi = function(aiClass, obj) {
    var ai = new aiClass();
    if (!obj) {
        obj = {};
    }
    obj.battler = this;
    ai.setup(obj);
    this._aiTree.push(ai);
}

Game_Enemy.prototype.pushAiWaitIdle = function() {
    this.pushAi(Game_LMBSAiWaitIdle);
}

Game_Enemy.prototype.forceAi = function(aiClass,obj) {
    this.clearAiData();
    this.pushAi(aiClass,obj);
    this.pushAiWaitIdle();
}

Game_Enemy.prototype.screenX = function(){
    return $gameSystem._LMBSEnabled ? this._battleX : this._screenX;
};

Game_Enemy .prototype.screenY = function(){
    return $gameSystem._LMBSEnabled ? Kien.LMBS_Core.battleY - this._battleY : this._screenY;
};

Kien.LMBS_Core.Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Kien.LMBS_Core.Game_Enemy_setup.apply(this,arguments);
    this._aiData = {};
    if (this.enemy().meta["Target Type"]){
        this.loadTargetType(this.enemy().meta["Target Type"]);
    } else {
        this._aiData.targetType = "nearest";
    }
    if (this.enemy().meta["Ai Class"]){
        this._aiData.classname = this.enemy().meta["Ai Class"];
    } else {
        this._aiData.classname = 'Game_LMBSAiEnemyBase';
    }
    if (this.enemy().meta["Move Speed"]){
        this._moveSpeed = parseInt(this.enemy().meta["Move Speed"],10);
    }
    this.clearAiData();
};

Game_Enemy.prototype.loadTargetType = function(string) {
    switch(string){
        case "Nearest":
        case "Farest":
        case "HighestHP":
        case "LowestHP":
            this._aiData.targetType = string.toLowerCase();
            return;
    }
    this._aiData.targetType = "nearest";
}

Game_Enemy.prototype.chooseTarget = function() {
    this.chooseEnemyTarget();
}
Game_Enemy.prototype.chooseEnemyTarget = function() {
    this._target = null;
    switch (this._aiData.targetType){
        case "nearest":
            this.chooseNearestTarget();
            break;
        case "farest":
            this.chooseFarestTarget();
            break;
        case "highesthp":
            this.chooseHighestHpTarget();
            break;
        case "lowesthp":
            this.chooseLowestHpTarget();
            break;
    }
    if (this._target == null) {
        this.chooseNearestTarget();
    }
}

Game_Enemy.prototype.chooseNearestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseFarestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseHighestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseLowestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.isAiActing = function() {
    return (this._aiTree.filter(function(obj) {
        return !obj.isFinish();
    }).length !== 0 );
}

Game_Enemy.prototype.availableActions = function() {
    return this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
}

Game_Enemy.prototype.actionListRatingMax = function(actionList) {
    return Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
}

Game_Enemy.prototype.actionsToSkills = function(actionList) {
    return actionList.map(function(a) {
        return $dataSkills[a.skillId];
    })
}

Kien.LMBS_Core.Game_Enemy_battlerName = Game_Enemy.prototype.battlerName;
Game_Enemy.prototype.battlerName = function() {
    if (!$gameSystem._LMBSEnabled) {
        return Kien.LMBS_Core.Game_Enemy_battlerName.call(this);
    }
    if(typeof this._battlerName == "undefined"){
    	if(this.enemy().meta["Battler Name"]){
    		this._battlerName = this.enemy().meta["Battler Name"];
    	} else {
    		this._battlerName = null;
    	}
    }
    return this._battlerName || Kien.LMBS_Core.Game_Enemy_battlerName.call(this);
}

Game_Enemy.prototype.initBattlePosition = function(){
    this._battleX = Kien.LMBS_Core.enemyXStart + this._screenX;
    this._moveTarget = this._battleX;
    this._target = $gameParty.members()[0];
    this._battleY = 0;
    this._facing = false;
}

Game_Enemy.prototype.update = function() {
    Game_Battler.prototype.update.call(this);
    if (BattleManager.isBattleEnd() || this._battleStart) {
        this._battleStart = false;
        return;
    }
    if (!this.isDead()){
        this.updateAiAction();
    }
}

Game_Enemy.prototype.updateAiAction = function() {
    if (this._pauseAi) {
        return;
    }
    var ai = this._aiTree[this._aiTree.length - 1];
    while (true){
        if (ai && ai.isFinish()){
            this._aiTree.pop();
            ai = this._aiTree[this._aiTree.length - 1];
        } else {
            break;
        }
    }
    if (ai){
        ai.update();
    }
}

Game_Enemy.prototype.startAiIdle = function(canMove) {
    var obj = {'duration' :Math.randomInt(90) + 60};
    if(canMove){
        obj.moveDur = Math.randomInt(15) + 15;
        obj.dir = Math.randomInt(2) == 0 ? -1 : 1;
    }
    this.pushAi(Game_LMBSAiIdleAction, obj);
}

Game_Enemy.prototype.getWeaponName = function() {
    if (this._weaponName) {
        return this._weaponName;
    }
    if (this.enemy().meta["Weapon Name"]) {
        return this.enemy().meta["Weapon Name"];
    }
    return "";
}