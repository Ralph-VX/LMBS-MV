//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Kien.LMBS_Core.Game_Battler_InitMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function(){
	Kien.LMBS_Core.Game_Battler_InitMembers.call(this);
	this._battleX = 0;
	this._battleY = 0; // 0: at ground. positive: at sky
	this._floatY = 0; // The height those people floating should be
	this._fallCount = 0;
    this._knockback = {
        "x": 0,
        "y": 0
    };
    this._knockdir = 0;
    this._moveSpeed = 4;
    this._facing = true; // true: inverse direction(right), false: not inverse(left)
    this._dash = false; // true when dashing, change the pose to "dash"
    this._jumpData = {
        "dur": 0, // Jump continues for 15 frames
        "sideSpeed": 0, // Speed moving horizontal plain.
        "falling": false // graph after jumping will be falling.
    };
    this._projectiles = []; // Projectile objects created by this battler.
    this._motionFall = true; // Allowed falling in skill motion
    this._target = null; // targeting battler
    this._originalTarget = undefined; // temporary storage to store original target when used those skills that not targeting enemy.
    this._guard = false; // Is guarding. when guarding, damage will reduced and knockback will not take place.
    this._guardDuration = 0; // length of guard left, used for AI
    this._moveTarget = 0 // X coordinate of target position. Y will only change when jumping.
    this._movedX = 0; // Use to revert moving.
    this._battleRect = null; // Rectangle provided by sprite. This will used as movement detection.
    this._attackRect = null; // Rectangle provided by sprite when this battler is attacking.
    this._skillMotionDescriptor = null;
    this.endMotion(); // Initialize Motion variables
    this._debugRects = []; // Additional colored rectangles drawn in screen for debug purpose
    this._rotation = 0; // rotation angle in degree.
    this._battleStart = false; // is the battle started or not
    this._forcePose = null; // pose that is forced
    this._forceWaitCount = 0; // count for hit-stop.
    this._hitStopLength = 15; // Length of hit-stop.
    this._knockbacking = false; // Is knockback or not
    this.clearCurrentHitCount();
    this.clearChainCount();
};

Game_Battler.prototype.clearCurrentHitCount = function() {
    this._currentChainCount = 0;
    this._currentHitCount = 0;
}

Kien.LMBS_Core.Game_Battler_xparam = Game_Battler.prototype.xparam;
Game_Battler.prototype.xparam = function(xparamId) {
    var val = Kien.LMBS_Core.Game_Battler_xparam.call(this, xparamId);
    if (xparamId == 1 && this.isKnockback()) {
        return val / 2;
    }
    return val;
}

Game_Battler.prototype.update = function(){
    this._debugRects.clear();
    if (this._forceWaitCount > 0) {
        this._forceWaitCount--;
    }
	this.updateGravity();
    this.updateKnockback();
    this.updateGuard();
    this.updateMotion();
    if(!this.isMotion()){
        this.updatePose();
    }
    this.updateDamaging();
    this.updateJump();
    this.updateCollide();
    this.updateMoving();
    this.updateChainCount();
};

Game_Battler.prototype.isGround = function(){
	if (this._battleY == this._floatY){
		return true;
	}
	return false;
};

Game_Battler.prototype.isFloat = function(){
	return false;
};


Game_Battler.prototype.isGuard = function() {
    return this._guard;
};

Game_Battler.prototype.isKnockback = function(){
    return this._knockbacking;
};

Game_Battler.prototype.isVerticalKnockback = function(){
    return !(this._knockback.y === 0);
};

Game_Battler.prototype.isMotion = function() {
    return this._skillMotionDescriptor !== null;
};

Game_Battler.prototype.isMotionLetFall = function() {
    return this._motionFall;
};

Game_Battler.prototype.isWaitInput = function() {
    return this._waitInput;
};

Game_Battler.prototype.isDamaging = function() {
    return !!this._damageInfo;
};

Game_Battler.prototype.isMoving = function() {
    return this._battleX != this._moveTarget;
};

Game_Battler.prototype.isJumping = function() {
    return this._jumpData.dur > 0;
};

Game_Battler.prototype.isFalling = function() {
    return this._jumpData.falling;
};

Game_Battler.prototype.isDashing = function() {
    return this.isMoving() && this._dash;
};

Game_Battler.prototype.isJumpProcess = function() {
    return this.isJumping() || this.isFalling();
};

Game_Battler.prototype.isForceWaiting = function() {
    return this._forceWaitCount != 0;
}

Game_Battler.prototype.isIdle = function() {
    return !this.isJumpProcess() && !this.isMotion() && !this.isMoving() && !this.isFalling() && !this.isKnockback() && !this.isDead() && !this.isForceWaiting();
};

Game_Battler.prototype.isActable = function() {
    return !this.isJumpProcess() && !this.isMotion() && !this.isKnockback() && !this.isDead() && !this.isForceWaiting();
}

Game_Battler.prototype.isAttacking = function() {
    return this._attackRect;
};

Game_Battler.prototype.isHit = function() {
    return this.isMotion() && this.isDamaging() && this._damageList.length > 0;
}

Game_Battler.prototype.hasProjectile = function() {
    return this._projectiles.length > 0;
};

Game_Battler.prototype.screenX = function(){
    return this._battleX;
};

Game_Battler.prototype.isOpaque = function() {
    return this._battleRect != null && !this.isDead();
};

Game_Battler.prototype.screenY = function(){
    return Kien.LMBS_Core.battleY - this._battleY;
};

Kien.LMBS_Core.Game_Battler_refresh = Game_Battler.prototype.refresh;
Game_Battler.prototype.refresh = function() {
    Kien.LMBS_Core.Game_Battler_refresh.call(this);
    if (this.isDead() && $gameParty.inBattle()){
        this.endMotion();
        this.clearAiData();
    }
};

Game_Battler.prototype.updateGravity = function(){
	if (!this.isGround() && !this.isFloat() && !this.isVerticalKnockback() && !this.isJumping() && (!this.isMotion() || this.isMotionLetFall()) && !this.isForceWaiting()) {
		var fv = Math.pow(this._fallCount,1)
		fv = Math.min(fv,Kien.LMBS_Core.fallMaxSpeed,(this._battleY-this._floatY));
		this._battleY -= fv;
        if(this._jumpData.sideSpeed != 0){
            this.moveWith(this._jumpData.sideSpeed);
        }
        this._fallCount++;
        if (this.isGround()){
            this._fallCount = 0;
            this._jumpData.falling = false;
            this._jumpData.sideSpeed = 0;
        }
	}
};

Game_Battler.prototype.updateDamaging = function() {
    if (this.isDamaging()){
        var nrect = this._damageInfo.rect;
        var attackRect = new Rectangle(nrect.x,nrect.y,nrect.width,nrect.height);
        if(this._facing){
            attackRect.x += this.screenX();
        } else {
            attackRect.x = this.screenX() - attackRect.x;
            attackRect.x -= attackRect.width;
        }
        attackRect.y += this.screenY() - attackRect.height;
        var memb = [];
        if (this.currentAction().isForFriend()){
            memb = this.friendsUnit().members();
        } else if (this.currentAction().isForOpponent()){
            memb = this.opponentsUnit().members();
        }
        memb.forEach(function(enemy){
            if (enemy.isAppeared() && (this.currentAction().isForDeadFriend() == enemy.isDead()) && enemy._battleRect.overlap(attackRect)){
                this.dealDamage(enemy);
            }
        }, this);
    }
}

Game_Battler.prototype.moveTo = function(target) {
    this._moveTarget = Math.round(target);
    this._moveTarget = Math.max(this._battleRect.width/2 ,Math.min(Kien.LMBS_Core.battleWidth - this._battleRect.width/2,this._moveTarget));
}

Game_Battler.prototype.moveWith = function(dx) {
    this.moveTo(this._battleX + dx);
}

Game_Battler.prototype.forceMove = function(target) {
    this._battleX = this._moveTarget = Math.round(target);
    this._moveTarget = this._battleX = Math.max(this._battleRect.width/2 ,Math.min(Kien.LMBS_Core.battleWidth - this._battleRect.width/2,this._battleX));
}

Game_Battler.prototype.forceMoveWith = function(dx) {
    this.forceMove(this._battleX + dx);
}

Game_Battler.prototype.jump = function(dir) {
    this._jumpData.dur = 15;
    this._jumpData.sideSpeed = this.moveSpeed() * (dir == 4 ? -1 : dir == 6 ? 1 : 0) ;
}

Game_Battler.prototype.knockback = function(knockback, knockdir){
    if (!this._guard){
        this.endMotion();
        this.clearCurrentHitCount();
        this._knockback.x = knockback.x;
        this._knockback.y = knockback.y;
        this._knockdir = knockdir;
        this._knockbacking = true;
        this._fallCount = 0;
    } else {
        if (this._guardDuration < Kien.LMBS_Core.autoGuardDuration) {
            this._guardDuration = Kien.LMBS_Core.autoGuardDuration;
        }
        this._knockback.x = 0;
        this._knockback.y = 0;
        this._knockdir = 0;
        this._knockbacking = false;
        this.clearChainCount();
    }
}

Game_Battler.prototype.updateKnockback = function() {
    if(this.isKnockback() && !this.isForceWaiting()){
        if (this._knockback.x != 0 || this._knockback.y != 0){
            var dir = this._knockdir-5;
            this.forceMoveWith(this._knockback.x * dir);
            this._battleY += this._knockback.y;
            this._knockback.x = this._knockback.x * 3 / 4;
            this._knockback.y = this._knockback.y * 3 / 4;
            if (this._knockback.x < 0.05){
                this._knockback.x = 0;
            }
            if (this._knockback.y < 0.05){
                this._knockback.y = 0;
            }
        }
        if (this.isGround()) {
            this._knockbacking = false;
            this.clearChainCount();
        }
    }
}

Game_Battler.prototype.updateGuard = function() {
    if (this._guard && !this.isForceWaiting()) {
        if (this._guardDuration > 0) {
            this._guardDuration--;
            if (this._guardDuration == 0) {
                this._guard = false;
            }
        }
    }
}

Game_Battler.prototype.updateMotion = function() {
    if (this.isMotion() && !this.isForceWaiting()) {
        if (this._skillMotionDescriptor.isFinish()) {
            this.endMotion();
            this.clearCurrentHitCount();
        } else {
            this._skillMotionDescriptor.update();
        }
    }
}

Game_Battler.prototype.startDamage = function(obj) {
    this.clearDamage();
    obj.rect = new Rectangle(obj.rect.x,obj.rect.y,obj.rect.width,obj.rect.height);
    this._damageInfo = obj;
    if(this._actions[0]){
        this._actions[0]._damagePercentage = obj.damage;
    }
}

Game_Battler.prototype.registProjectile = function(obj) {
    this._projectiles.push(obj);
}

Game_Battler.prototype.shiftProjectile = function() {
    return this._projectiles.shift();
}

Game_Battler.prototype.updateMoving = function() {
    if(this.isMoving() && !this.isForceWaiting()){
        var mdir = (this._battleX - this._moveTarget) > 0 ? -1 : 1;
        var dx = Math.min(Math.abs(this._battleX - this._moveTarget),this.moveSpeed()) * mdir;
        this._movedX = dx;
        this.checkCollide();
        this._battleX += this._movedX;
        if (this._movedX != dx) {
            this._moveTarget = this._battleX;
        }
        if (mdir > 0){
            this._facing = true;
        } else {
            this._facing = false;
        }
    }
}

Game_Battler.prototype.checkCollide = function() {
    var newrect = this._battleRect.clone();
    newrect.x += this._movedX;
    var members = null;
    while (true) {
        if (this._movedX == 0){
            break;
        }
        if(!Kien.LMBS_Core.moveThroughAlly && !(Kien.LMBS_Core.dashThroughAlly && this.isDashing())){
            members = this.friendsUnit().members();
            if (members.findIndex(function(obj) {
                return obj.isOpaque() && newrect.overlap(obj._battleRect);
            }) != -1 ){
                this._movedX += this._movedX > 0 ? -1 : 1;
                newrect = this._battleRect.clone();
                newrect.x += this._movedX;
                continue;
            }
        }
        if(!Kien.LMBS_Core.moveThroughEnemy && !(Kien.LMBS_Core.dashThroughEnemy && this.isDashing())){
            members = this.opponentsUnit().members();
            if (members.findIndex(function(obj) {
                return obj.isOpaque() && newrect.overlap(obj._battleRect);
            }) != -1 ){
                this._movedX += this._movedX > 0 ? -1 : 1;
                newrect = this._battleRect.clone();
                newrect.x += this._movedX;
                continue;
            }
        }
        break;
    }

}

Game_Battler.prototype.moveSpeed = function() {
    return this._moveSpeed * (this._dash ? 2 : 1);
}

Game_Battler.prototype.motionSkillId = function() {
    return this.isMotion() ? this._skillMotionDescriptor._item.id : 0;
}

Game_Battler.prototype.updateJump = function() {
    if(this.isJumping() && !this.isForceWaiting()){
        this._battleY += Math.round(Kien.LMBS_Core.jumpPower * Math.pow(4/5,15-this._jumpData.dur));
        this.moveWith(this._jumpData.sideSpeed);
        this._jumpData.dur--;
        if(this._jumpData.dur == 0){
            this._jumpData.falling = true;
        }
    }
}

Game_Battler.prototype.updateCollide = function() {
    if (this.isForceWaiting()) {
        return;
    }
    var newrect = this._battleRect;
    if(!Kien.LMBS_Core.moveThroughAlly && !(Kien.LMBS_Core.dashThroughAlly && this.isDashing())){
        members = this.friendsUnit().members();
        var index = members.findIndex(function(obj) {
            return  obj != this && (obj.isOpaque() && newrect.overlap(obj._battleRect)) && (!Kien.LMBS_Core.dashThroughAlly || !obj.isDashing());
        });
        if (index != -1 ){
            var bat = members[index]._battleRect;
            if (bat.x == newrect.x) {
                this.forceMoveWith(-2);
                other.forceMoveWith(2);
            } else if (bat.x >= newrect.x){
                this.forceMoveWith(-4);
                //other.forceMoveWith(4);
            } else {
                this.forceMoveWith(4);
                //other.forceMoveWith(-4);
            }
            return;
        }
    }
    if(!Kien.LMBS_Core.moveThroughEnemy && !(Kien.LMBS_Core.dashThroughEnemy && this.isDashing())){
        members = this.opponentsUnit().members();
        var index = members.findIndex(function(obj) {
            return obj.isOpaque() && newrect.overlap(obj._battleRect) && (!Kien.LMBS_Core.dashThroughEnemy || !obj.isDashing());
        });
        if (index != -1 ){
            var bat = members[index]._battleRect;
            var other = members[index];
            if (bat.x == newrect.x) {
                this.forceMoveWith(-2);
                other.forceMoveWith(2);
            } else if (bat.x >= newrect.x){
                this.forceMoveWith(-4);
                //other.forceMoveWith(4);
            } else {
                //other.forceMoveWith(-4);
                this.forceMoveWith(4);
            }
            return;
        }
    }
}

Game_Battler.prototype.updatePose = function() {
    if (!!this._forcePose){
        this._pose = this._forcePose;
        return;
    }
    if(this.isDead()){
        this._pose = "Dead";
        return;
    }
    if(this.isJumping()){
        this._pose = "Jump";
        return;
    }
    if(this.isFalling()){
        this._pose = "Fall";
        return;
    }
    if(this.isDashing()){
        this._pose = "Dash";
        return;
    }
    if(this.isMoving()){
        this._pose = "Walk";
        return;
    }
    if(this.isKnockback()){
        this._pose = "Damage";
        return;
    }
    if(this.isGuard()){
        this._pose = "Guard";
        return;
    }
    this._pose = "Stand";
}

Game_Battler.prototype.updateChainCount = function() {
    var removed = [];
    var keys = this._lastSkillHit.keys();
    for (var i = 0; i < keys.length; i++) {
        var obj = keys[i];
        if (!obj.isMotion()) {
            this._lastSkillHit.remove(obj);
        }
    }
}

Kien.LMBS_Core.Game_Battlre_clearMotion = Game_Battler.prototype.clearMotion;
Game_Battler.prototype.clearMotion = function() {
	Kien.LMBS_Core.Game_Battlre_clearMotion.call(this);
	this._pose = "Stand";
};

Game_Battler.prototype.clearChainCount = function() {
    this._hitCount = 0;
    this._chainCount = 0;
    this._lastSkillHit = new Kien.HashMap();
}

Kien.LMBS_Core.Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    Kien.LMBS_Core.Game_Battler_onBattleEnd.call(this);
    this._battleRect = null;
    this._battleStart = false;
    this._forcePose = null;
    this.endMotion();
    this.clearChainCount();
};

Kien.LMBS_Core.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    Kien.LMBS_Core.Game_Battler_onBattleStart.call(this);
    this._battleStart = true;
    this._forcePose = null;
    this.initBattlePosition();
    this.clearChainCount();
};

Game_Battler.prototype.initBattlePosition = function() {
    
}

Game_Battler.prototype.endMotion = function() {
    if (this._skillMotionDescriptor !== null) {
        this._skillMotionDescriptor.release();
    }
    this._skillMotionDescriptor = null; // Skill motion descriptor for current motion.
    this._patternIndex = -1;
    this._pose = "Stand";
    this._weaponName = null;
    this.clearWeaponProperty();
    this._waitInput = false; // accepting input.
    this._motionFall = true;
    this._rotation = 0;
    this._hitStopLength = 15;
    if (this._originalTarget !== undefined) {
        this._target = this._originalTarget;
        this._originalTarget = undefined;
    }
    this.clearDamage();
    this.clearActions();
}

Game_Battler.prototype.clearWeaponProperty = function() {
    this._weaponProperty = {
        "dx" : 0,
        "dy" : 0,
        "rotation" : 0,
        "overrideRotation" : false
    }
}

Game_Battler.prototype.clearDamage = function() {
    // _damageList: a list of enemies that has been damage through this dmaage process
    // will refresh every time enddamage is called.
    this._damageList = [];
    // _damageInfo:
    // an object contains information that used for calculating damage
    // this object contains following properties:
    // type: not really have meaning in this use
    // rect: an area that damage occurs. x,y coordinate is a relative coordinate from the character coordinate
    // damage: an value multiplied to item/skill damage. 1 will be 100%
    // knockback: strength of knockback applied to targets. A Point object which describes x and y direction's strength.
    this._damageInfo = null;
}

Game_Battler.prototype.loadMotionFromObject = function(obj) {
    var klass = Kien.LMBS_Core.loadMotionDescriptorClass(obj);
    if (klass) {
        this._skillMotionDescriptor = new klass(this, obj);
    }
}

Game_Battler.prototype.useSkill = function(skillId){
    var skill = $dataSkills[skillId];
    if (skill && this.canUseLMBS(skill)){
        this.endMotion();
        var action = new Game_Action(this);
        action.setSkill(skillId);
        this.setAction(0,action);
        this.loadMotionFromObject(skill);
        this.chooseCorrectTarget();
        BattleManager.refreshStatus();
    }
}

// Force the skill to be casted, without checkign the condition.
Game_Battler.prototype.forceSkill = function(skillId){
    var skill = $dataSkills[skillId];
    if (skill){
        this.endMotion();
        var action = new Game_Action(this);
        action.setSkill(skillId);
        this.setAction(0,action);
        this.loadMotionFromObject(skill);
        this.chooseCorrectTarget();
        BattleManager.refreshStatus();
    }
}

Game_Battler.prototype.useItemLMBS = function(itemId){
    var item = $dataItems[itemId];
    if (item && this.canUseLMBS(item)){
        this.endMotion();
        var action = new Game_Action(this);
        action.setItem(itemId);
        this.setAction(0,action);
        this.loadMotionFromObject(item);
        this.chooseCorrectTarget();
        BattleManager.refreshStatus();
    }
}

Game_Battler.prototype.forceItemLMBS = function(itemId){
    var item = $dataItems[itemId];
    if (item){
        this.endMotion();
        var action = new Game_Action(this);
        action.setItem(itemId);
        this.setAction(0,action);
        this.loadMotionFromObject(item);
        this.chooseCorrectTarget();
        BattleManager.refreshStatus();
    }
}

Game_Battler.prototype.chooseCorrectTarget = function() {
    if (!this._target) {
        this._originalTarget = null;
        if (this._actions[0].isForOpponent()) {
            this.chooseEnemyTarget();
        } else if (this._actions[0].isForUser()) {
            this._target = this;
        } else if (this._actions[0].isForFriend()) {
            this.chooseFriendTarget();
        }
    } else if (this._actions[0].isForUser() && this._target !== this) {
        this._originalTarget = this._target;
        this._target = this;
    } else if (this._actions[0].isForOpponent() && !this.opponentsUnit().members().contains(this._target)) {
        this._originalTarget = this._target;
        this.chooseEnemyTarget();
    } else if (this._actions[0].isForFriend() && !this.friendsUnit().members().contains(this._target)) {
        this._originalTarget = this._target;
        this.chooseFriendTarget();
    }
}

Game_Battler.prototype.chooseEnemyTarget = function() {
    this._target = this.opponentsUnit().members()[0];
}

Game_Battler.prototype.chooseFriendTarget = function() {
    var action = this._actions[0];
    if (action.isDeathStateRemoving()) {
        this._target = this.friendsUnit().randomDeadTarget();
    }
    if (!this._target && action.isStateRemoving()) {
        var effects = action.getAllStateAffectingEffect();
        var members = this.friendsUnit().getStateAffectableMembers(effects);
        if (members.length > 0) {
            this._target = members[0];
        }
    }
    if (!this._target && action.isHpHeal()) {
        var scores = [];
        var indices = [];
        var members = this.friendsUnit().members();
        members.forEach(function(battler, index) {
            indices.push(index);
            scores[index] = action.evaluateWithTarget(battler) + action.evaluateHealEffect(battler);
        });
        indices.filter(function(a) {
            return scores[a] > 0;
        }).sort(function(a,b) {
            var ra = scores[a];
            var rb = scores[b];
            if (ra >= 1 && rb >= 1) {
                return members[a].hpRate() - members[b].hpRate();
            } else {
                return rb - ra;
            }
        })
        this._target = members[indices[0]];
    }
    if (!this._target) {
        this._target = this.friendsUnit().randomTarget();
    }
}

Game_Battler.prototype.canUseLMBS = function(obj) {
    var klass = Kien.LMBS_Core.loadMotionDescriptorClass(obj);
    if (klass) {
        return klass.prototype.canUse(this, obj);
    } else {
        return AbstractMotionDescriptor.prototype.canUse(this, obj);
    }
};

Game_Battler.prototype.dealDamage = function(target) {
    if(this._damageList.indexOf(target) == -1){
        this._actions[0].apply(target);
        var dir = this._damageInfo.knockdir ? (this._facing ? 4 : 6) : (this._facing ? 6 : 4);
        target.startDamagePopup();
        if (this._actions[0].isDamage() || this._actions[0].isDrain()){
            target.knockback(this._damageInfo.knockback, dir);
            target.onHitted(this);
            this.onHit(target);
        }
        BattleManager.refreshStatus();
        this._damageList.push(target);
        this._forceWaitCount = this._hitStopLength;
        target._forceWaitCount = this._hitStopLength;
    }
}

Game_Battler.prototype.forceDamage = function(target) {
    this._actions[0].apply(target);
    var dir = this._damageInfo.knockdir ? (this._facing ? 4 : 6) : (this._facing ? 6 : 4);
    target.startDamagePopup();
    if (this._actions[0].isDamage() || this._actions[0].isDrain()){
        target.knockback(this._damageInfo.knockback, dir);
        target.onHitted(this);
        this.onHit(target);
    }
    BattleManager.refreshStatus();
}

Game_Battler.prototype.onHit = function(target) {
    if (target._hitCount > this._currentHitCount) {
        this._currentHitCount = target._hitCount;
    }
    if (target._chainCount > this._currentChainCount) {
        this._currentChainCount = target._chainCount;
    }
}

Game_Battler.prototype.onHitted = function(user) {
    if (this._knockbacking) {
        if (!this._lastSkillHit.get(user) || user.motionSkillId() != this._lastSkillHit.get(user)) {
            this._lastSkillHit.put(user,user.motionSkillId());
            this._chainCount++;
        }
        this._hitCount++;
    }
}

Game_Battler.prototype.getWeaponName = function() {
    return this._weaponName;
}