//-----------------------------------------------------------------------------
// Sprite_WeaponLMBS
//
// use to show weapon image. Properties should be set correctly by battler sprite.

function Sprite_WeaponLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_WeaponLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_WeaponLMBS.prototype.constructor = Sprite_WeaponLMBS;

Sprite_WeaponLMBS.caches = {};

Sprite_WeaponLMBS.prototype.initialize = function(parentSprite){
    Sprite_Base.prototype.initialize.call(this);
    parentSprite.addChild(this);
    this._angle = 0;
    this._hide = false;
    this._prop = null;
    this._name = "";
}

Sprite_WeaponLMBS.prototype.setup = function(filename) {
    this._name = filename;
    if (!filename || filename.length === 0) {
        this.bitmap = null;
        this._prop = null;
        return;
    }
    this.bitmap = ImageManager.loadWeapon(filename);
    this._prop = Sprite_WeaponLMBS.caches[filename];
    if (!this._prop) {
        var xhr = new XMLHttpRequest();
        var url = 'img/weapons/'+filename+'.json';
        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                this._prop = JSON.parse(xhr.responseText);
                this.onLoadFinish();
            }
        }.bind(this);
        xhr.onerror = function() {
            this._prop = {};
            this._prop.ox = 0;
            this._prop.oy = 0;
            this._prop.angle = 0;
            this.onLoadFinish();
        }.bind(this);
        xhr.send();
    } else {
        this.onLoadFinish();
    }
}

Sprite_WeaponLMBS.prototype.update = function() {
    if (this._prop) {
        this.updateAngle();
        this.updateVisible();
        this.updateAnchor();
    }
}

Sprite_WeaponLMBS.prototype.updateAngle = function() {
    this.rotation = Math.deg2Rad(this._prop.angle + this._angle);
}

Sprite_WeaponLMBS.prototype.updateVisible = function() {
    this.visible = !this._hide;
}

Sprite_WeaponLMBS.prototype.updateAnchor = function() {
    this.anchor.x = 0.5 + this._prop.ox / this.bitmap.width;
    this.anchor.y = 0.5 + this._prop.oy / this.bitmap.height;
}

Sprite_WeaponLMBS.prototype.onLoadFinish = function() {
    Sprite_WeaponLMBS.caches[this._name] = this._prop;
}