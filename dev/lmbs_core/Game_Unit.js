//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

Game_Unit.prototype.update = function(){
    this.members().forEach(function(battler){
        battler.update();
    })
}

Game_Unit.prototype.getStateAffectableMembers = function(effects) {
	var scores = [];
	var indices = [];
	var members = this.members();
	members.forEach(function(battler, index) {
		scores[index] = this.getStateAffectableScore(effects, battler);
		indices.push(index);
	}, this);
	return indices.filter(function(a) {
		return scores[a] > 0;
	}).sort(function(a, b) {
		return scores[b] - scores[a];
	}).map(function(a) {
		return members[a];
	})
}

Game_Unit.prototype.getStateAffectableScore = function(effects, battler) {
	var score = 0;
	effects.forEach(function(effect) {
		switch (effect.code) {
			case Game_Action.EFFECT_REMOVE_STATE:
			if (battler.isStateAffected(effect.dataId)) {
				score += $dataStates[effect.dataId].priority;
			}
			break;
			case Game_Action.EFFECT_ADD_STATE:
			if (!battler.isStateAffected(effect.dataId)) {
				score += $dataStates[effect.dataId].priority;
			}
			break;
			case Game_Action.EFFECT_ADD_BUFF:
			if (!battler.isMaxBuffAffected(effect.dataId)) {
				score += 50;
			}
			break;
			case Game_Action.EFFECT_REMOVE_DEBUFF:
			if (battler.isDebuffAffected(effect.dataId)) {
				score += 50;
			}
			break;
		}
	})
	return score;
}