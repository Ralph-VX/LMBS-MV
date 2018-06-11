//-----------------------------------------------------------------------------
// Sprite_EscapeGauge
//
// The sprite for displaying Escaping Gauge.

function Sprite_EscapeGauge() {
    this.initialize.apply(this, arguments);
}

Sprite_EscapeGauge.prototype = Object.create(Sprite_Base.prototype);
Sprite_EscapeGauge.prototype.constructor = Sprite_EscapeGauge;

Sprite_EscapeGauge.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.apply(this, arguments);
    this.createBitmap();
}

Sprite_EscapeGauge.prototype.createBitmap = function() {
	var gh = 24;
	var th = 36;
	this._textSprite = new Sprite();
	var text =  BattleManager.canEscape() ? "Escaping" : "No Escape!";
	var tw = Kien.lib.emptyBitmap.measureTextWidth(text);
	this._textSprite.bitmap = new Bitmap(tw, th);
	this._textSprite.bitmap.fontSize = th - 4;
	this._textSprite.bitmap.drawText(text, 0, 0, tw, th);
	this._textSprite.x = (Graphics.width - tw) / 2;
	this._textSprite.y -= (th-gh)/2;
	this.addChild(this._textSprite);
    this.bitmap = new Bitmap(Graphics.width, 24);
    if (!BattleManager.canEscape()) {
    	this.bitmap.clear();
    	this.bitmap.fillAll("rgba(0,0,0,255)");
    }
    this._gaugeColor1 = Kien.lib.renderWindow.textColor(30);
    this._gaugeColor2 = Kien.lib.renderWindow.textColor(31);
}

Sprite_EscapeGauge.prototype.update = function() {
	Sprite_Base.prototype.update.apply(this, arguments);
	this.updateVisibility();
	this.updateGauge();
	this._textSprite.visible = this.visible;
}

Sprite_EscapeGauge.prototype.updateVisibility = function() {
	this.visible = BattleManager._escapeCount > 0;
}

Sprite_EscapeGauge.prototype.updateGauge = function() {
	if (this.visible && BattleManager.canEscape()) {
		var gh = 24;
		var pad = 4;
		this.bitmap.clear();
		this.bitmap.fillAll("rgba(0,0,0,255)");
		var w = Math.min(BattleManager.escapeRate(), 1) * Graphics.width-pad*2;
		this.bitmap.gradientFillRect(pad, pad, Graphics.width-pad*2, gh-pad*2, this._gaugeColor1, this._gaugeColor2);
		this.bitmap.fillRect(pad + w, pad, Graphics.width-8-w, gh-pad*2, "rgba(0,0,0,255)");
	}
}