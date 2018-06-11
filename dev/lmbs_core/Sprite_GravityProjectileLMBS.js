//-----------------------------------------------------------------------------
// Sprite_GravityProjectileLMBS
//
// Projectile that affected by specified gravity.

function Sprite_GravityProjectileLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_GravityProjectileLMBS.prototype = Object.create(Sprite_ProjectileLMBS.prototype);
Sprite_GravityProjectileLMBS.prototype.constructor = Sprite_GravityProjectileLMBS;

Sprite_GravityProjectileLMBS.prototype.onJSONloaded = function(param) {
    Sprite_ProjectileLMBS.prototype.onJSONloaded.call(this, param);
    this._gravity = this.evaluateJSONString(param.gravity,this) || 0.2;
}

Sprite_GravityProjectileLMBS.prototype.updatePosition = function() {
    Sprite_ProjectileLMBS.prototype.updatePosition.call(this);
    this._yspeed -= this._gravity;
    if (this._dangle) {
        this.rotation = (new Kien.Vector2D(this._xspeed * this._direction,-this._yspeed)).angleWithHorizon();
    }
}

Sprite_GravityProjectileLMBS.prototype.outOfBound = function() {
    return Sprite_ProjectileLMBS.prototype.outOfBound.call(this) || this.y > Kien.LMBS_Core.battleY;
}