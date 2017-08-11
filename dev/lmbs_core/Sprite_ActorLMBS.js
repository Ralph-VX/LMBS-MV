//-----------------------------------------------------------------------------
// Sprite_ActorLMBS
//
// Add some Player specified methods, such as collapse effect.

function Sprite_ActorLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_ActorLMBS.prototype = Object.create(Sprite_BattlerLMBS.prototype);
Sprite_ActorLMBS.prototype.constructor = Sprite_ActorLMBS;

Sprite_ActorLMBS.prototype.initialize = function(battler){
    Sprite_BattlerLMBS.prototype.initialize.call(this,battler);
}