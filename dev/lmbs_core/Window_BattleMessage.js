//-----------------------------------------------------------------------------
// Window_BattleMessage
//
// The window class with cursor movement and scroll functions.

function Window_BattleMessage() {
    this.initialize.apply(this, arguments);
}

Window_BattleMessage.prototype = Object.create(Window_Base.prototype);
Window_BattleMessage.prototype.constructor = Window_BattleMessage;

Window_BattleMessage.TOP_MARGIN = 80;
Window_BattleMessage.FONT_SIZE = 28;

Window_BattleMessage.prototype.initialize = function(channel, string) {
    var textWidthBitmap = new Bitmap(1,1);
    textWidthBitmap.fontSize = Window_BattleMessage.FONT_SIZE;
    var w = textWidthBitmap.measureTextWidth(string);
    var ww = w  + this.standardPadding() * 2;
    var h = Window_BattleMessage.FONT_SIZE + 4 + this.standardPadding() * 2;
    this._channel = channel; 
    this._text = string;
    Window_Base.prototype.initialize.call(this,
        (this, Graphics.width - ww) / 2, 
        Window_BattleMessage.TOP_MARGIN + h * channel, 
        ww, 
        h);
    this.active = false;
    this.drawText(string, 0, 0, w, "center");
}

Window_BattleMessage.prototype.updateTone = function() {
    var tone = Kien.LMBS_Core.battleTopMessageWindowColors[this._channel];
    if (!tone) {
        tone = Kien.LMBS_Core.battleTopMessageWindowColors[0];
    }
    this.setTone(tone.r, tone.g, tone.b);
};