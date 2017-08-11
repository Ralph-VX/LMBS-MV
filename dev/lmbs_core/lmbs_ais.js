//-----------------------------------------------------------------------------
// Game_LMBSAiBase
//
// The superclass of AI Action.
// required property for setup
// battler: battler who this ai object is controlling.

function Game_LMBSAiBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiBase.prototype.initialize = function() {
}

Game_LMBSAiBase.prototype.setup = function(obj){
    this._battler = obj.battler
}

Game_LMBSAiBase.prototype.isFinish = function() {
    return true;
}

Game_LMBSAiBase.prototype.update = function() {
    if (this._battler.isKnockback() || this._battler.isGuard()){
        if (!this.isFinish){
            this.setFinish();
            this._battler.pushAi(Game_LMBSAiIdleAction,{'duration':5});
            this._battler.pushAiWaitIdle();
        }
    }
}

Game_LMBSAiBase.prototype.setFinish = function() {

}

//-----------------------------------------------------------------------------
// Game_LMBSAiWaitIdle
//
// The superclass of AI Action.

function Game_LMBSAiWaitIdle() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiWaitIdle.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiWaitIdle.prototype.constructor = Game_LMBSAiWaitIdle;

Game_LMBSAiWaitIdle.prototype.isFinish = function() {
    return this._battler.isIdle();
}

//-----------------------------------------------------------------------------
// Game_LMBSAiMoveTo
//
// The superclass of AI Action.
// required properties in setup:
//  target: move target for battler, need property _battleX.
//  battler: battler who is 

function Game_LMBSAiMoveTo() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiMoveTo.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiMoveTo.prototype.constructor = Game_LMBSAiMoveTo;

Game_LMBSAiMoveTo.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiMoveTo.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiMoveTo.prototype.setFinish = function() {
    this._finish = true;
}

Game_LMBSAiMoveTo.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._target = obj.target;

}

Game_LMBSAiMoveTo.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    if (!!this._target && !!this._battler && !this._finish){
        var tx = this._target._battleX;
        var dir = tx > this._battler._battleX ? 1 : -1;
        var dx = tx - this._battler._battleX;
        this._battler._dash = true;
        if (dx == 0) {
            this._finish = true;
            this._battler._dash = false;
            return;
        }
        this._battler.moveWith(Math.min(this._battler.moveSpeed(),Math.abs(dx))*dir);
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiAttackMove
//
// Ai Action to move and detect enemy in range.

function Game_LMBSAiAttackMove() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiAttackMove.prototype = Object.create(Game_LMBSAiMoveTo.prototype);
Game_LMBSAiAttackMove.prototype.constructor = Game_LMBSAiAttackMove;

Game_LMBSAiAttackMove.prototype.initialize = function() {
    Game_LMBSAiMoveTo.prototype.initialize.apply(this,arguments);
}

Game_LMBSAiAttackMove.prototype.setup = function(obj) {
    Game_LMBSAiMoveTo.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiAttackMove.prototype.update = function() {
    if (!!this._target && !!this._battler && !this._finish) {
        var dist = this._distance;
        var newRect = this._battler._battleRect.clone();
        if (!this._battler._facing){
            newRect.x -= dist;
        } else {
            newRect.x += newRect.width
        }
        newRect.width = dist;
        this._battler._debugRects.push(newRect);
        if (this._battler.opponentsUnit().members().findIndex(function(enemy){
            return enemy._battleRect.overlap(newRect);
        }) != -1){
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._finish = true;
            return;
        }
    }
    Game_LMBSAiMoveTo.prototype.update.apply(this);
}

function Game_LMBSAiCertainAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiCertainAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiCertainAction.prototype.constructor = Game_LMBSAiCertainAction;

Game_LMBSAiCertainAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiCertainAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiCertainAction.prototype.isFinish = function() {
    return this._phase == 1;
}

Game_LMBSAiCertainAction.prototype.setFinish = function() {
    this._phase = 1;
}


Game_LMBSAiCertainAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            if (this._battler._aiData.readySkillIsItem) {
                this._battler.useItemLMBS(this._battler._aiData.readySkill.id);
            } else {
                this._battler.useSkill(this._battler._aiData.readySkill.id);
            }
            this._phase = 1;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorChainSkill
//
// Ai Action to chain skill automatically

function Game_LMBSAiActorChainSkill() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorChainSkill.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorChainSkill.prototype.constructor = Game_LMBSAiActorChainSkill;

Game_LMBSAiActorChainSkill.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiActorChainSkill.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiActorChainSkill.prototype.setFinish = function() {
    this._finish = true;
}

Game_LMBSAiActorChainSkill.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    if (!!this._battler && !this._finish) {
            if (this._battler.isMotion()){
                if (this._battler.isWaitInput()){
                    var avail = this._battler.chooseAvailableSkills(this._battler._availableAttacks);
                    if (avail.length > 0){
                        var skill = avail.sample();
                        this._battler.useSkill(skill.id);
                    } else {
                        var pri = Kien.LMBS_Core.getSkillPriority(this._battler._actions[0].item());
                        var highpri = this._battler.highestSkillPriority();
                        if (pri == highpri || pri < 0) {
                            this.updateAiAttackNegativePriority();
                        } else {
                            var n = 1;
                            var skill = this._battler.attackSkills().filter(function(s) {
                                return Kien.LMBS_Core.getSkillPriority(s) == (pri + n) && this._battler.canUseLMBS(s);
                            }, this).sample();
                            while (!skill && pri+n <= highpri){
                                n++;
                                skill = this._battler.attackSkills().filter(function(s) {
                                return Kien.LMBS_Core.getSkillPriority(s) == (pri + n) && this._battler.canUseLMBS(s);
                                }, this).sample();
                            }
                            if (skill) {
                                this._battler.useSkill(skill.id);
                            } else {
                                this.updateAiAttackNegativePriority();
                            }
                        }
                    }
                }
            } else {
                this._finish = true;
            }
    }
}

Game_LMBSAiActorChainSkill.prototype.updateAiAttackNegativePriority = function() {
    var pri = Kien.LMBS_Core.getSkillPriority(this._battler._actions[0].item());
    if (pri != -1) {
        var skill = this._battler.attackSkills().filter(function(s) {
            return Kien.LMBS_Core.getSkillPriority(s) == -2 && this._battler.canUseLMBS(s);
        }, this).sample();
        if (!skill) {
            skill = this._battler.attackSkills().filter(function(s) {
                return Kien.LMBS_Core.getSkillPriority(s) == -1 && this._battler.canUseLMBS(s);
            }, this).sample();
        }
        if (skill) {
            this._battler.useSkill(skill.id);
        } else {
            this._finish = true;
        }
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorPhysicalAction
//
// Ai Action to chain skill automatically

function Game_LMBSAiActorPhysicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorPhysicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorPhysicalAction.prototype.constructor = Game_LMBSAiActorPhysicalAction;

Game_LMBSAiActorPhysicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorPhysicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiActorPhysicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiActorPhysicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiActorPhysicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase) {
        case 0:
            this._battler.pushAi(Game_LMBSAiAttackMove,{'dist': this._distance,'target': this._battler._target});
            this._phase = 1;
            break;
        case 1:
            this._battler.startAiIdle(true);
            this._battler.pushAi(Game_LMBSAiActorChainSkill);
            this._phase = 2;
            break;
        }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorMagicAction
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiActorMagicAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorMagicAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorMagicAction.prototype.constructor = Game_LMBSAiActorMagicAction;

Game_LMBSAiActorMagicAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorMagicAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiActorMagicAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiActorMagicAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiActorMagicAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0:// Back to initial position, and use the skill
            var tx = $gameParty.battlerPosition(this._battler);
            this._battler.pushAi(Game_LMBSAiMoveTo, {'target': {'_battleX':tx}});
            this._phase = 1;
            return;
        case 1: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiIdleAction
//
// Ai Action to be idle between actions

function Game_LMBSAiIdleAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiIdleAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiIdleAction.prototype.constructor = Game_LMBSAiIdleAction;

Game_LMBSAiIdleAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
}

Game_LMBSAiIdleAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._duration = obj.duration;
    this._dir = obj.dir;
    this._moveDur = obj.moveDur;
}

Game_LMBSAiIdleAction.prototype.isFinish = function() {
    return this._duration <= 0;
}

Game_LMBSAiIdleAction.prototype.setFinish = function() {
    this._duration = 0;
}

Game_LMBSAiIdleAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    this._duration--;
    this._battler._dash = false;
    if(this._dir && this._moveDur > 0){
        this._battler.moveWith(this._battler.moveSpeed()*this._dir);
        this._moveDur--;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiForceActionFinish
//
// Ai Action to be idle between actions

function Game_LMBSAiForceActionFinish() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiForceActionFinish.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiForceActionFinish.prototype.constructor = Game_LMBSAiForceActionFinish;

Game_LMBSAiForceActionFinish.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiForceActionFinish.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiForceActionFinish.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    this._battler._aiData.forceAi = false;
    this._battler._aiData.readySkillIsItem = false;
    this._finish = true;
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorBase
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiActorBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorBase.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorBase.prototype.constructor = Game_LMBSAiActorBase;

Game_LMBSAiActorBase.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorBase.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiActorBase.prototype.isFinish = function() {
    // As the basic Ai for battlers, this Ai will never finish.
    //To Pause Ai just do nothing in its update, or push Game_LMBSAiIdleAction.
    return false;
}

Game_LMBSAiActorBase.prototype.update = function() {
    if (this._battler.isMotion()) {
        this._battler.pushAiWaitIdle();
        if (this._battler._actions[0].isPhysical()){
            this._battler.pushAi(Game_LMBSAiActorChainSkill);
        }
        return;
    }
    var max = this._battler._aiData.attackRate + this._battler._aiData.magicRate;
    var ran = Math.randomInt(max);
    if (ran < this._battler._aiData.attackRate || this._battler.magicSkills().length == 0) {
        // When chosen the normal attack, or there have no magic skills.
        this._battler._aiData.actionType = 'attack';
        this._battler._aiData.readySkill = this._battler.chooseAvailableSkills(this._battler._availableAttacks).sample();
        if(this._battler._aiData.readySkill) {
            this._battler.chooseTarget();
            if (this._battler._target) {
                var dist = Kien.LMBS_Core.getSkillRange(this._battler._aiData.readySkill);
                this._battler.pushAi(Game_LMBSAiActorPhysicalAction,{'dist': dist});
            } else {
                this._battler.startAiIdle(false);
            }
        } else {
            this._battler.startAiIdle(false);
        }
    } else {
        // When chosen the magic attack.
        this._battler._aiData.actionType = 'magic';
        this._battler._aiData.readySkill = this._battler.chooseRandomSkill(this._battler.chooseAvailableSkills(this._battler.magicSkills()));
        if (this._battler._aiData.readySkill) {
            this._battler.chooseTarget();
            if (this._battler._target){
                this._battler.pushAi(Game_LMBSAiActorMagicAction);
            } else {
                this._battler.startAiIdle(false);
            }
        } else {
            this._battler.startAiIdle(false);
        }
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiForceAction
//
// Ai Action which cast or uses a determined Skill/Item.

function Game_LMBSAiForceAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiForceAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiForceAction.prototype.constructor = Game_LMBSAiForceAction;

Game_LMBSAiForceAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._item = obj.item;
    this._target = obj.target;
    this._oldTarget = null;
    this._phase = 0;
}

Game_LMBSAiForceAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiForceAction.prototype.update = function() {
    switch(this._phase){
        case 0: 
            this._oldTarget = this._battler._target;
            this._battler._target = this._target;
            this._battler._aiData.readySkill = this._item;
            this._battler._aiData.readySkillIsItem = DataManager.isItem(this._item);
            if (this._battler._aiData.readySkillIsItem) {
                this._battler.pushAi(Game_LMBSAiCertainAction);
            } else if (this._item.hitType == Game_Action.HITTYPE_PHYSICAL){
                var dist = Kien.LMBS_Core.getSkillRange(this._battler._aiData.readySkill);
                this._battler.pushAi(Game_LMBSAiActorPhysicalAction,{'dist': dist});
            } else if (this._item.hitType == Game_Action.HITTYPE_MAGICAL) {
                this._battler.pushAi(Game_LMBSAiActorMagicAction);
            } else {
                this._battler.startAiIdle(true);
                this._battler.pushAiWaitIdle();
                this._battler.pushAi(Game_LMBSAiCertainAction);
            }
            this._phase = 1;
            break;
        case 1:
            this._battler._target = this._oldTarget;
            this._phase = 2;
            break;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorPhysicalAction
//
// Ai Action to chain skill automatically

function Game_LMBSAiEnemyPhysicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyPhysicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyPhysicalAction.prototype.constructor = Game_LMBSAiEnemyPhysicalAction;

Game_LMBSAiEnemyPhysicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyPhysicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiEnemyPhysicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiEnemyPhysicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiEnemyPhysicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase) {
        case 0:
            this._battler.pushAi(Game_LMBSAiAttackMove,{'dist': this._distance,'target': this._battler._target});
            this._phase = 1;
            break;
        case 1:
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            break;
        }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiEnemyMagicalAction
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiEnemyMagicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyMagicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyMagicalAction.prototype.constructor = Game_LMBSAiEnemyMagicalAction;

Game_LMBSAiEnemyMagicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyMagicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiEnemyMagicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiEnemyMagicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiEnemyMagicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0:// Back to initial position, and use the skill
            var tx = Kien.LMBS_Core.enemyXStart + this._battler._screenX;
            this._battler.pushAi(Game_LMBSAiMoveTo, {'target': {'_battleX':tx}});
            this._phase = 1;
            return;
        case 1: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiEnemyBase

function Game_LMBSAiEnemyBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyBase.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyBase.prototype.constructor = Game_LMBSAiEnemyBase;

Game_LMBSAiEnemyBase.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyBase.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiEnemyBase.prototype.isFinish = function() {
    // As the basic Ai for battlers, this Ai will never finish.
    //To Pause Ai just do nothing in its update.
    return false;
}

Game_LMBSAiEnemyBase.prototype.update = function() {
    var actionList = this._battler.availableActions();
    if (actionList.length > 0 && this._battler._target !== null) {
        var ratingZero = this._battler.actionListRatingMax(actionList) - 3;
        var action = this._battler.selectAction(actionList,ratingZero);
        if (action) {
            var skill = $dataSkills[action.skillId];
            if (skill.hitType == Game_Action.HITTYPE_MAGICAL){
                this._battler._aiData.actionType = 'magic';
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.pushAi(Game_LMBSAiEnemyMagicalAction);
            } else if (skill.hitType == Game_Action.HITTYPE_PHYSICAL) {
                this._battler._aiData.actionType = 'attack';
                var dist = Kien.LMBS_Core.getSkillRange(skill);
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.pushAi(Game_LMBSAiEnemyPhysicalAction,{'dist': dist });
            } else {
                this._battler._aiData.actionType = 'certain';
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.startAiIdle(true);
                this._battler.pushAiWaitIdle();
                this._battler.pushAi(Game_LMBSAiCertainAction);
            }
        } else {
            this._battler.startAiIdle();
        }
    } else {
        this._battler.startAiIdle();
    }
}