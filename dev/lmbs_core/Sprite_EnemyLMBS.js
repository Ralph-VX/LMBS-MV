//-----------------------------------------------------------------------------
// Sprite_EnemyLMBS
//
// Add some Enemy specified methods, such as collapse effect.

function Sprite_EnemyLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_EnemyLMBS.prototype = Object.create(Sprite_BattlerLMBS.prototype);
Sprite_EnemyLMBS.prototype.constructor = Sprite_EnemyLMBS;

Sprite_EnemyLMBS.prototype.initialize = function(battler){
    Sprite_BattlerLMBS.prototype.initialize.call(this,battler);
}

Sprite_EnemyLMBS.prototype.initMembers = function(battler) {
    Sprite_BattlerLMBS.prototype.initMembers.call(this,battler);
    this._effectDuration = 0;
    this._collapsed = false;
}

Sprite_EnemyLMBS.prototype.update = function() {
    Sprite_BattlerLMBS.prototype.update.call(this);
    this.updateCollapseEffect();
}

Sprite_EnemyLMBS.prototype.updateCollapseEffect = function() {
    if(!this._collapsed && this._battler.isDead()){
        this._collapsed = true;
        this._effectDuration = 32;
    }
    if (this._collapsed && this._effectDuration > 0){
        this._effectDuration--;
        this.updateCollapse();
        if(this._effectDuration == 0){
            this.visible = false;
        }
    }
}

Sprite_EnemyLMBS.prototype.updateCollapse = function() {
    this.blendMode = Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};