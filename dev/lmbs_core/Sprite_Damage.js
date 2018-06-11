
//-----------------------------------------------------------------------------
// Sprite_Damage
//
// The sprite for displaying a popup damage.

Kien.LMBS_Core.Sprite_Damage_initialize = Sprite_Damage.prototype.initialize;
Sprite_Damage.prototype.initialize = function() {
    Kien.LMBS_Core.Sprite_Damage_initialize.apply(this, arguments);
    this._spriteWidth = 0;
    this._spriteHeight = 0;
    this._delayDuration = 0;
};

Kien.LMBS_Core.Sprite_Damage_createMiss = Sprite_Damage.prototype.createMiss;
Sprite_Damage.prototype.createMiss = function() {
    Kien.LMBS_Core.Sprite_Damage_createMiss.apply(this, arguments);
    var w = this.digitWidth();
    var h = this.digitHeight();
    this._spriteWidth = 4 * w;
    this._spriteHeight = h;
};

Kien.LMBS_Core.Sprite_Damage_createDigits = Sprite_Damage.prototype.createDigits;
Sprite_Damage.prototype.createDigits = function(baseRow, value) {
    Kien.LMBS_Core.Sprite_Damage_createDigits.apply(this, arguments);
    var string = Math.abs(value).toString();
    var w = this.digitWidth();
    var h = this.digitHeight();
    this._spriteWidth = string.length * w;
    this._spriteHeight = h;
};

Sprite_Damage.prototype.spriteWidth = function() {
    return this._spriteWidth;
}

Sprite_Damage.prototype.spriteHeight = function() {
    return this._spriteHeight
}

Sprite_Damage.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._delayDuration > 0) {
        this._delayDuration--;
        this.visible = this._delayDuration == 0;
        return;
    }
    if (this._duration > 0) {
        this._duration--;
        for (var i = 0; i < this.children.length; i++) {
            this.updateChild(this.children[i]);
        }
    }
    this.updateFlash();
    this.updateOpacity();
};

Sprite_Damage.prototype.setup = function(obj, duration, delay) {
    if (Number.isFinite((delay))) {
        this._delayDuration = delay;
    }
    if (Number.isFinite(duration)) {
        this._duration = duration;
    }
    if (typeof obj == "string") {
        this.setupString(obj);
    } else if (obj instanceof Game_ActionResult) {
        var result = obj;
        if (result.missed || result.evaded) {
            this.createMiss();
        } else if (result.hpAffected) {
            this.createDigits(0, result.hpDamage);
        } else if (result.mpDamage !== 0) {
            this.createDigits(2, result.mpDamage);
        }
        if (result.critical) {
            this.setupCriticalEffect();
        }
    }
};

Sprite_Damage.prototype.setupString = function(string) {
    var sprite = this.createChildSprite();
    var bitmap = new Bitmap(Kien.lib.emptyBitmap.measureTextWidth(string), 36);
    bitmap.drawText(string, 0, 0, bitmap.width, bitmap.height);
    sprite.bitmap = bitmap;
    sprite.dy = 0;
}