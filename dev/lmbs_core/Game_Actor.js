//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Kien.LMBS_Core.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    Kien.LMBS_Core.Game_Actor_initMembers.apply(this, arguments);
    this._availableAttacks = [];
    this._attackSets = {}; // Preloaded Attack Motion Sets. ["dir"] shows different direction.
    this._skillSets = {}; // Skills can performed with skill button. ["dir"] shows different direction.
    this._inputData = {};
    this.resetInputData();
}

Game_Actor.prototype.resetInputData = function() {
    this._inputData.lastDir = 0;
    this._inputData.lastDirPast = 0;
    this._inputData.reservedInput = null;
    this._inputData.reservedInputDir = 0;
    this._inputData.jumpInputDur = 0;
    this._inputData.inputKeepTime = -1;
}

Kien.LMBS_Core.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    Kien.LMBS_Core.Game_Actor_setup.apply(this, arguments);
    this.loadBaseAiClass();
    this.loadVictorySkill();
    this.loadMoveSpeed();
    this.clearAiData();
}

Game_Actor.prototype.loadBaseAiClass = function() {
    this._aiData = {};
    if (this.actor().meta["Attack Rate"]){
        var subs = this.actor().meta["Attack Rate"].split(",");
        this._aiData.attackRate = parseInt(subs[0],10);
        this._aiData.magicRate = parseInt(subs[1],10);
    } else {
        this._aiData.attackRate = 50;
        this._aiData.magicRate = 50;
    }
    if (this.actor().meta["Target Type"]){
        this.loadTargetType(this.actor().meta["Target Type"]);
    } else {
        this._aiData.targetType = "nearest";
    }
    this._aiData.classname = "Game_LMBSAiActorBase";
    if (this.actor().meta["Ai Class"]) {
        this._aiData.classname = his.actor().meta["Ai Class"];
    }
}

Game_Actor.prototype.loadVictorySkill = function() {
    this._victorySkillId = -1;
    if (this.actor().meta["Victory Skill"]){
        this._victorySkillId = parseInt(this.actor().meta["Victory Skill"],10);
    }
}

Game_Actor.prototype.loadMoveSpeed = function() {
    if (this.actor().meta["Move Speed"]){
        this._moveSpeed = parseInt(this.actor().meta["Move Speed"],10);
    }
}

Game_Actor.prototype.clearAiData = function() {
    this._aiTree = [];
    this._aiData.readySkill = null; // Skill that character Ai is trying to use.
    this._aiData.forceAi = false; // Force to move by AI even the player is controlling it
    if ($gameParty.inBattle()) {
        var ai = eval(this._aiData.classname);
        this.pushAi(ai);
    }
}

Game_Actor.prototype.resetAi = function() {
    this._pauseAi = false;
    this._aiTree = [];
    this._aiData.readySkill = null; // Skill that character Ai is trying to use.
    this._aiData.forceAi = false; // Force to move by AI even the player is controlling it
    if ($gameParty.inBattle()) {
        var ai = eval(this._aiData.classname);
        this.pushAi(ai);
    }
}

Game_Actor.prototype.pushAi = function(aiClass, obj) {
    var ai = new aiClass();
    if (!obj) {
        obj = {};
    }
    obj.battler = this;
    ai.setup(obj);
    this._aiTree.push(ai);
}

Game_Actor.prototype.displayLevelUp = function(newSkills) {
    this.addPopup("Level UP!", 135);
    if (newSkills.length > 0) {
        this.addPopup("New Skills!", 135, 90);
    }
};


Game_Actor.prototype.pushAiWaitIdle = function() {
    this.pushAi(Game_LMBSAiWaitIdle);
}

Game_Actor.prototype.forceAi = function(aiClass,obj) {
    this.clearAiData();
    this._aiData.forceAi = true;
    this.pushAi(Game_LMBSAiForceActionFinish);
    this.pushAi(aiClass,obj);
    this.pushAiWaitIdle();
}

Game_Actor.prototype.forceActionLMBS = function(obj,target) {
    this.forceAi(Game_LMBSAiForceAction,{'item': obj,'target': target});
}

Game_Actor.prototype.loadTargetType = function(string) {
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

Game_Actor.prototype.highestSkillPriority = function() {
    var array = this.attackSkills();
    var pri = 0;
    for (var i = 0; i < array.length; i++){
        var pri2 = Kien.LMBS_Core.getSkillPriority(array[i]);
        if (pri2 > pri){
            pri = pri2;
        }
    }
    return pri;
}

Game_Actor.prototype.lowestSkillPriority = function() {
    var array = this.attackSkills();
    var pri = 0;
    for (var i = 0; i < array.length; i++){
        var pri2 = Kien.LMBS_Core.getSkillPriority(array[i]);
        if (pri2 < pri){
            pri = pri2;
        }
    }
    return pri;
}

Kien.LMBS_Core.Game_Actor_initImage = Game_Actor.prototype.initImages;
Game_Actor.prototype.initImages = function() {
	Kien.LMBS_Core.Game_Actor_initImage.apply(this, arguments);
	var actor = this.actor();
	if(actor.meta["Battler Name"]){
		this._battlerName = actor.meta["Battler Name"];
	}
};

Game_Actor.prototype.onBattleStart = function() {
    Game_Battler.prototype.onBattleStart.call(this);
    this.resetAi();
    this.initAttackSkills();
    this.resetInputData();
};

Game_Actor.prototype.onBattleEnd = function() {
    Game_Battler.prototype.onBattleEnd.call(this);
    this.resetAi();
};

Game_Actor.prototype.isInputAvailable = function() {
    return (!this.isMotion() || this._waitInput) && !this.isKnockback() && !this.isGuard();
}

Game_Actor.prototype.update = function() {
    Game_Battler.prototype.update.call(this);
    if (BattleManager.isBattleEnd() || !this._battleStart) {
        this._battleStart = false;
        return;
    }
    if (!this.isDead()) {
        if (this.isPlayerActor() && !this.isAiForcing()) {
            this.updateInputData();
            this.updateInputGuard();
            this.updateInputAttack();
            this.updateInputSkill();
            this.updateInputTarget();
            if (!this.isMotion() && !this.isGuard()) {
                this.updateInputDash();
                if(this._inputData.lastDir != 0){
                    this._inputData.lastDirPast++;
                    if (this._inputData.lastDirPast > Kien.LMBS_Core.doubleTapDur){
                        this._inputData.lastDir = 0;
                        this._inputData.lastDirPast = 0;
                    }
                }
                this.updateInputMovement();
            }
        } else if (((this.isAiActing() && !this.isPlayerActor()) || this.isAiForcing())) {
            this.updateAi();
        } else if (!this.isAiActing()) {
            this.clearAiData();
        }
    }
}

Game_Actor.prototype.updateInputData = function() {
    if (this._inputData.reservedInput != null && this._inputData.inputKeepTime > 0) {
        this._inputData.inputKeepTime--;
        if (this._inputData.inputKeepTime == 0) {
            this._inputData.reservedInput = null;
            this._inputData.inputKeepTime = -1;
        }
    }
    if (this.isKnockback()) {
        this._inputData.reservedInput = null;
    } else if (Input.isTriggered('ok')) {
        this._inputData.reservedInput = 'ok';
        this._inputData.reservedInputDir = Input.dir4;
        this._inputData.inputKeepTime = Kien.LMBS_Core.inputKeepTime;
    } else if (Input.isTriggered('cancel')) {
        this._inputData.reservedInput = 'cancel';
        this._inputData.reservedInputDir = Input.dir4;
        this._inputData.inputKeepTime = Kien.LMBS_Core.inputKeepTime;
    } else if (Input.isPressed('LMBSguard')) {
        this._inputData.reservedInput = 'LMBSguard';
        this._inputData.inputKeepTime = Kien.LMBS_Core.inputKeepTime;
    }
    if (Input.dir4 != 0) {
        this._inputData.movementReservedInputDir = Input.dir4;
        if (Input.isPressed("up")) {
            this._inputData.movementReservedInput = "jump";
            this._inputData.movementReservedInputDir = Input.isPressed('left') ? 4 : Input.isPressed('right') ? 6 : 0;
        } else if (Input.isTriggered("left")) {
            this._inputData.movementReservedInput = "left";
        } else if (Input.isTriggered("right")) {
            this._inputData.movementReservedInput = "right";
        } else {
            this._inputData.movementReservedInput = "move";
        }
    }
    if (Input.isTriggered("LMBSprevioustarget")) {
        this._inputData.utilInput = "ptarget";
    } else if (Input.isTriggered("LMBSnexttarget")) {
        this._inputData.utilInput = "ntarget";
    }
}

Game_Actor.prototype.updateInputGuard = function() {
    if(this._inputData.reservedInput === 'LMBSguard' && !this.isMotion()){
        this._guard = true;
        this._guardDuration = 2;
        this._inputData.reservedInput = null;
        this._inputData.reservedInputDir = 0;
        this._inputData.inputKeepTime = -1;
    }
}

Game_Actor.prototype.updateInputAttack = function() {
    if(this._inputData.reservedInput ==='ok' && this.isInputAvailable()) {
        var d4 = this._inputData.reservedInputDir;
        if(d4 == 4){
            d4 = (this._facing ? 4 : 6)
        } else if (d4 == 6){
            d4 = (this._facing ? 6 : 4)
        }
        this.useNormalAttack(d4);
        this._inputData.reservedInput = null;
        this._inputData.reservedInputDir = 0;
        this._inputData.inputKeepTime = -1;
    }
}

Game_Actor.prototype.updateInputSkill = function() {
    if(this._inputData.reservedInput ==='cancel' && this.isInputAvailable()) {
        var d4 = this._inputData.reservedInputDir;
        if(d4 == 4){
            d4 = (this._facing ? 4 : 6)
        } else if (d4 == 6){
            d4 = (this._facing ? 6 : 4)
        }
        this.useRegistedSkill(d4);
        this._inputData.reservedInput = null;
        this._inputData.reservedInputDir = 0;
        this._inputData.inputKeepTime = -1;
    }
}

Game_Actor.prototype.updateInputTarget = function() {
    if (this._inputData.utilInput == "ptarget") {
        if (this._target) {
            var temp = this._target;
            do  {
                this._target = BattleManager.previousTarget(this._target);
            } while (!(this.isTargetAvailable(this._target) || this._target === temp));
        }
        this._inputData.utilInput = null;
    } else if (this._inputData.utilInput == "ntarget") {
        if (this._target) {
            var temp = this._target;
            do  {
                this._target = BattleManager.nextTarget(this._target);
            } while (!(this.isTargetAvailable(this._target) || this._target === temp))
        }
        this._inputData.utilInput = null;
    } else if (!this._target || this._target.isDead()) {
        this.chooseTarget();
    }
}

Game_Actor.prototype.updateInputMovement = function() {
    if(this.isActable()){
        if (this._inputData.movementReservedInput == "move") {
            this._inputData.jumpInputDur++;
            if (this._inputData.jumpInputDur >= Kien.LMBS_Core.inputDelay){
                if (this._inputData.movementReservedInputDir == 4){
                    this.moveLeft();
                } else if (this._inputData.movementReservedInputDir == 6){
                    this.moveRight();
                }
            }
            this._inputData.movementReservedInput = null;
            this._inputData.movementReservedInputDir = 0;
        } else if (this._inputData.movementReservedInput == "jump"){
            this._inputData.jumpInputDur++;
            if (this._inputData.jumpInputDur == Kien.LMBS_Core.inputDelay){
                var dir = this._inputData.movementReservedInputDir;
                this.jump(dir);
                this._inputData.jumpInputDur = 0;
            }
            this._inputData.movementReservedInput = null;
        } else {
            this._inputData.jumpInputDur = 0;
            this._dash = false;
        }
    }
}

Game_Actor.prototype.moveLeft = function() {
    var lt = this._moveTarget;
    this.moveWith(-(this.moveSpeed()));
    if (lt == this._moveTarget) {
        BattleManager._escaping = true;
    }
}

Game_Actor.prototype.moveRight = function() {
    var lt = this._moveTarget;
    this.moveWith(this.moveSpeed());
    if (lt == this._moveTarget) {
        BattleManager._escaping = true;
    }
}

Game_Actor.prototype.updateInputJump = function() {
}

Game_Actor.prototype.updateInputDash = function() {
    if (this._inputData.movementReservedInput == "left"){
        if(this._inputData.lastDir == 4){
            this._dash = true
        } else {
            this._inputData.lastDir = 4;
            this._inputData.lastDirPast = 0;
        }
        this._inputData.movementReservedInput = "move";
    }
    if (this._inputData.movementReservedInput == "right"){
        if(this._inputData.lastDir == 6){
            this._dash = true;
        } else {
            this._inputData.lastDir = 6;
            this._inputData.lastDirPast = 0;
        }
        this._inputData.movementReservedInput = "move";
    }
}

Game_Actor.prototype.updatePose = function() {
    if (!this._battleStart){
        return;
    }
    Game_Battler.prototype.updatePose.apply(this);
}

Game_Actor.prototype.isPlayerActor = function() {
    return BattleManager.actor() == this;
}

Game_Actor.prototype.isAiActing = function() {
    return (this._aiTree.filter(function(obj) {
        return !obj.isFinish();
    }).length !== 0 );
}

Game_Actor.prototype.isAiForcing = function() {
    return this._aiData.forceAi;
}

Game_Actor.prototype.isTargetAvailable = function() {
    if (this._actions[0]) {
        return this._actions[0].isTargetAvailable(this._target);
    } else {
        return true;
    }
}

Game_Actor.prototype.magicSkills = function() {
    return this.skills().filter(function(skill) {
        return skill.hitType === Game_Action.HITTYPE_MAGICAL
    })
}

Game_Actor.prototype.attackSkills = function() {
    return this.skills().filter(function(skill) {
        return skill.hitType === Game_Action.HITTYPE_PHYSICAL
    })
}

Game_Actor.prototype.updateAi = function() {
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

Game_Actor.prototype.startAiIdle = function(canMove) {
    var obj = {'duration' :Math.randomInt(90) + 60};
    if(canMove){
        obj.moveDur = Math.randomInt(15) + 15;
        obj.dir = Math.randomInt(2) == 0 ? -1 : 1;
    }
    this.pushAi(Game_LMBSAiIdleAction, obj);
}

Game_Actor.prototype.chooseAvailableSkills = function(skills) {
    return skills.filter(function(skill){
        return this.canUseLMBS(skill);
    }, this);
}

Game_Actor.prototype.chooseRandomSkill = function(skills) {
    return skills[Math.randomInt(skills.length)];
}

Game_Actor.prototype.chooseTarget = function() {
    this._target = null;
    if (this._aiData.readySkill) {
        var action = new Game_Action(this);
        action.setSkill(this._aiData.readySkill.id);
        if (action.isForOpponent()) {
            this.chooseEnemyTarget();
        } else if (action.isForUser()) {
            this._target = this;
        } else if (action.isForDeadFriend()) {
            this._target = this.friendsUnit().randomDeadTarget();
        } else if (action.isForFriend()) {
            var temp = this._actions[0];
            this._actions[0] = action;
            this.chooseFriendTarget();
            this._actions[0] = temp;
        }
    } else {
        this.chooseEnemyTarget();
    }
}

Game_Actor.prototype.chooseEnemyTarget = function() {
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

Game_Actor.prototype.chooseNearestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
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

Game_Actor.prototype.chooseFarestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
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

Game_Actor.prototype.chooseHighestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
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

Game_Actor.prototype.chooseLowestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
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

Game_Actor.prototype.initBattlePosition = function() {
    if (this.actor().meta["BattlePosition"]) {
        this._battleX = parseInt(this.actor().meta["BattlePosition"]);
    } else {
        this._battleX = $gameParty.battlerPosition(this);
    }
    this._moveTarget = this._battleX;
    this._target = $gameTroop.members()[0];
    this._battleY = 0;
}

Game_Actor.prototype.initAttackSkills = function() {
    this.loadAttackSkills(this.actor());
}

Game_Actor.prototype.loadAttackSkills = function(noteObject) {
    this._attackSets = {};
    this._availableAttacks = [];
    if(noteObject && noteObject.note){
        var dirs = [0,2,4,6,8];
        for (var i = 0; i < dirs.length ; i++) {
            var dir = dirs[i]
            if (noteObject.meta["Attack Skill Set "+dir]) {
                this._attackSets[""+dir] = parseInt(noteObject.meta["Attack Skill Set "+dir],10);
                var skill = $dataSkills[parseInt(noteObject.meta["Attack Skill Set "+dir],10)];
                if (skill){
                    this._availableAttacks.push(skill);
                }
            }
        }
        if (this._attackSets["0"] && !this._attackSets["2"] && !this._attackSets["4"] && !this._attackSets["6"] && !this._attackSets["8"]){
            this._attackSets["2"] = this._attackSets["4"] = this._attackSets["6"] = this._attackSets["8"] = this._attackSets["0"];
        }
    }
}

Game_Actor.prototype.useSkill = function(skillId){
    Game_Battler.prototype.useSkill.call(this,skillId);
    var skill = $dataSkills[skillId];
    // Want some way to confirm useSkill in Game_Battler is succeed or not...
    if (this._actions[0] && this._actions[0].item() == skill){
        this.loadAttackSkills(skill);
    }
}

Game_Actor.prototype.endMotion = function() {
    var opose,opi;
    if (BattleManager.isBattleEnd() || !this._battleStart) {
        opose = this._pose;
        opi = this._patternIndex;
    }
    Game_Battler.prototype.endMotion.call(this);
    this.initAttackSkills();
     if (BattleManager.isBattleEnd() || !this._battleStart) {
        this._pose = opose;
        this._patternIndex = opi;
     }
}

Game_Actor.prototype.useNormalAttack = function(dir) {
    var id = this._attackSets[dir.toString()];
    if(id){
        this.useSkill(id);
    }
}

Game_Actor.prototype.useRegistedSkill = function(dir) {
    var id = this._skillSets[dir.toString()];
    if(id){
        this.useSkill(id);
    }
}

Game_Actor.prototype.performVictorySkill = function() {
    if (this._victorySkillId >= 0){
        this.endMotion();
        var action = new Game_Action(this);
        action.setSkill(this._victorySkillId);
        this.setAction(0,action);
        this.loadMotionFromObject($dataSkills[this._victorySkillId]);
    } else {
        this._forcePose = 'Victory';
    }
}


Game_Actor.prototype.getWeaponName = function() {
    if (this._weaponName) {
        return this._weaponName;
    }
    if (this.weapons()[0] && this.weapons()[0].meta["Weapon Name"]) {
        return this.this.weapons()[0].meta["Weapon Name"];
    }
    if (this.currentClass() && this.currentClass().meta["Weapon Name"]) {
        return this.currentClass().meta["Weapon Name"];
    }
    if (this.actor() && this.actor().meta["Weapon Name"]) {
        return this.actor().meta["Weapon Name"];
    }
    return "";
}