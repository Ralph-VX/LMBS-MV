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
    this.bitmap = new Bitmap(Graphics.width, 30);
}