//-----------------------------------------------------------------------------
// Sprite_HitCount
//
// The sprite for displaying Hit(Combo) count and Chain count.

function Sprite_HitCount() {
    this.initialize.apply(this, arguments);
}

Sprite_HitCount.prototype = Object.create(Sprite_Base.prototype);
Sprite_HitCount.prototype.constructor = Sprite_HitCount;

Sprite_HitCount.HIT_COUNT_FONT_SIZE = 48;
Sprite_HitCount.HIT_FONT_SIZE = 36;
Sprite_HitCount.CHAIN_FONT_SIZE = 28;

Sprite_HitCount.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this._lastHitCount = 0;
    this._lastChainCount = 0;
    this.createSprites();
}

Sprite_HitCount.prototype.createSprites = function() {
    this._hitCountSprite = new Sprite();
    this._hitCountSprite.bitmap = new Bitmap(Sprite_HitCount.HIT_COUNT_FONT_SIZE * 4 + 4, Sprite_HitCount.HIT_COUNT_FONT_SIZE + 4);
    this._hitCountSprite.bitmap.fontSize = Sprite_HitCount.HIT_COUNT_FONT_SIZE;
    this._hitSprite = new Sprite();
    this._hitSprite.y = Sprite_HitCount.HIT_COUNT_FONT_SIZE - Sprite_HitCount.HIT_FONT_SIZE;
    this._hitSprite.bitmap = new Bitmap(Sprite_HitCount.HIT_FONT_SIZE * 4, Sprite_HitCount.HIT_FONT_SIZE + 4);
    this._hitSprite.bitmap.fontSize = Sprite_HitCount.HIT_FONT_SIZE;
    this._hitSprite.bitmap.fontItalic = true;
    this._hitSprite.bitmap.drawText("HIT",0,0,this._hitSprite.bitmap.width,this._hitSprite.bitmap.height);
    this._chainCountSprite = new Sprite();
    this._chainCountSprite.y = Math.max(this._hitCountSprite.bitmap.height, this._hitSprite.bitmap.height);
    this._chainCountSprite.bitmap = new Bitmap(Sprite_HitCount.CHAIN_FONT_SIZE * 4 + 4, Sprite_HitCount.CHAIN_FONT_SIZE + 4);
    this._chainSprite = new Sprite();
    this._chainSprite.y = this._chainCountSprite.y;
    this._chainSprite.bitmap = new Bitmap(this._chainCountSprite.bitmap.width, this._chainCountSprite.height);
    this._chainSprite.bitmap.fontItalic = true;
    this._chainSprite.bitmap.drawText("Chain",0,0,this._chainSprite.width, this._chainSprite.height);
    this.addChild(this._hitSprite);
    this.addChild(this._hitCountSprite);
    this.addChild(this._chainSprite);
    this.addChild(this._chainCountSprite);
}

Sprite_HitCount.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    this.updateVisibility();
    this.updateBitmap();
    this.updateEffect();
}

Sprite_HitCount.prototype.updateVisibility = function() {
    var index = $gameTroop.aliveMembers().findIndex(function(obj) {
        return obj._hitCount > 0;
    });
    if (index === -1) {
        this._lastHitCount = 0;
        this._hitCountSprite.visible = false;
        this._hitSprite.visible = false;
        this._hitCountSprite.bitmap.clear();
    } else {
        this._hitCountSprite.visible = true;
        this._hitSprite.visible = true;
    }
    index = $gameTroop.aliveMembers().findIndex(function(obj) {
        return obj._chainCount > 0;
    });
    if (index === -1) {
        this._lastChainCount = 0;
        this._chainCountSprite.visible = false;
        this._chainSprite.visible = false;
        this._chainCountSprite.bitmap.clear();
    } else {
        this._chainCountSprite.visible = true;
        this._chainSprite.visible = true;
    }
}

Sprite_HitCount.prototype.updateBitmap = function() {
    if (this._hitCountSprite.visible) {
        var index = $gameTroop.aliveMembers().findIndex(function(obj) {
            return obj._hitCount > this._lastHitCount;
        }.bind(this));
        if (index >= 0) {
            this._lastHitCount = $gameTroop.aliveMembers()[index]._hitCount;
            this._hitCountSprite.bitmap.clear();
            this._hitCountSprite.bitmap.drawText(this._lastHitCount.toString(),0,0,this._hitCountSprite.bitmap.width,this._hitCountSprite.bitmap.height);
            this._hitSprite.x = this._hitCountSprite.bitmap.measureTextWidth(this._lastHitCount.toString()) + 4;
            this._hitCountSprite.scale.x = 1.2;
            this._hitCountSprite.scale.y = 1.2;
            this._hitSprite.scale.x = 1.2;
            this._hitSprite.scale.y = 1.2;
        }
    }
    if (this._chainCountSprite.visible) {
        var index = $gameTroop.aliveMembers().findIndex(function(obj) {
            return obj._chainCount > this._lastChainCount;
        }.bind(this));
        if (index >= 0) {
            this._lastChainCount = $gameTroop.aliveMembers()[index]._chainCount;
            this._chainCountSprite.bitmap.clear();
            this._chainCountSprite.bitmap.drawText(this._lastChainCount.toString(),0,0,this._chainCountSprite.bitmap.width,this._chainCountSprite.bitmap.height);
            this._chainSprite.x = this._chainCountSprite.bitmap.measureTextWidth(this._lastChainCount.toString()) + 4;
        }
    }
}

Sprite_HitCount.prototype.updateEffect = function() {
    if (this._hitCountSprite.scale.x > 1.0) {
        this._hitCountSprite.scale.x = Math.max(this._hitCountSprite.scale.x - 0.02, 1);
        this._hitSprite.scale.x = this._hitCountSprite.scale.x;
    }
    if (this._hitCountSprite.scale.y > 1.0) {
        this._hitCountSprite.scale.y = Math.max(this._hitCountSprite.scale.y - 0.02, 1);
        this._hitSprite.scale.y = this._hitCountSprite.scale.y;
    }
}