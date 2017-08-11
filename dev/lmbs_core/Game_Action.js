//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Kien.LMBS_Core.Game_Action_clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function() {
    Kien.LMBS_Core.Game_Action_clear.call(this);
    this._damagePercentage = 1;
};

Kien.LMBS_Core.Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var value = Kien.LMBS_Core.Game_Action_makeDamageValue.call(this,target,critical);
    value = Math.round(value * this._damagePercentage);
    return value
};

Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (!result.isHit()) {
        target._guard = true;
        result.missed = false;
        result.evaded = false;
    }
    if (this.item().damage.type > 0) {
        result.critical = (Math.random() < this.itemCri(target));
        var value = this.makeDamageValue(target, result.critical);
        this.executeDamage(target, value);
    }
    this.item().effects.forEach(function(effect) {
        this.applyItemEffect(target, effect);
    }, this);
    this.applyItemUserEffect(target);
};

Game_Action.prototype.isHpHeal = function() {
    return this.isHpRecover() || this.hasHpRecoverEffect();
};

Game_Action.prototype.hasHpRecoverEffect = function() {
    return this.item().effects.some(function(effect) {
        return effect.code == Game_Action.EFFECT_RECOVER_HP && this.isEffectHeal(effect);
    }, this);
};

Game_Action.prototype.isEffectHeal = function() {
    return (effect.value1 > 0 && effect.value2 >= 0) || (effect.value1 >= 0 && effect.value2 > 0);;
}

Game_Action.prototype.isDeathStateRemoving = function() {
    return this.item().effects.some(function(effect) {
        return effect.code == Game_Action.EFFECT_REMOVE_STATE && effect.dataId == this.subject().deathStateId();
    }, this);
}

Game_Action.prototype.isStateAffecting = function() {
    return this.item().effects.some(function(effect) {
        return [Game_Action.EFFECT_REMOVE_STATE, Game_Action.EFFECT_ADD_STATE, Game_Action.EFFECT_ADD_BUFF, Game_Action.EFFECT_REMOVE_DEBUFF].contains(effect.code);
    }, this);
}

Game_Action.prototype.getAllStateAffectingEffect = function() {
    return this.item().effects.filter(function(effect) {
        return [Game_Action.EFFECT_REMOVE_STATE, Game_Action.EFFECT_ADD_STATE, Game_Action.EFFECT_ADD_BUFF, Game_Action.EFFECT_REMOVE_DEBUFF].contains(effect.code);
    }, this)
}


Game_Action.prototype.evaluateHealEffect = function(target) {
    if (target.isDead() && !this.isDeathStateRemoving()) {
        return -Infinity;
    } 
    return this.item().effects.reduce(function (sum, effect) {
        if (effect.code == Game_ACTION.EFFECT_RECOVER_HP) {
            return sum + effect.value1 + (effect.value2 / target.mhp);
        } else {
            return sum;
        }
    }, 0)
};

Game_Action.prototype.isTargetAvailable = function(target) {
    if (target.isDead() && !this.isForDeadFriend()) {
        return false;
    }
    return true;
}