//-----------------------------------------------------------------------------
// Window_BattleStatusLMBS
//
// Window Use to show Battler Status.

function Window_BattleStatusLMBS() {
    this.initialize.apply(this, arguments);
}

Window_BattleStatusLMBS.prototype = Object.create(Window_Selectable.prototype);
Window_BattleStatusLMBS.prototype.constructor = Window_BattleStatusLMBS;

Window_BattleStatusLMBS.prototype.initialize = function() {
    Window_Selectable.prototype.initialize.call(this,0,0,0,0);
    var h = this.lineHeight()+12+this.standardPadding()*2;
    var w = Graphics.boxWidth;
    var y = Graphics.boxHeight - h;
    this.deactivate();
    this.width = w;
    this.height = h;
    this.y = y;
    this.opacity = 0;
    this.createContents();
    this.refresh();
};

Window_BattleStatusLMBS.prototype.maxCols = function() {
    return 4;
};

Window_BattleStatusLMBS.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
}

Window_BattleStatusLMBS.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_BattleStatusLMBS.prototype.drawItem = function(index) {
    var actor = $gameParty.battleMembers()[index];
    this.clearItem(index);
    var tw = Graphics.boxWidth / 4;
    var tx = tw * index + 15;
    this.drawText(actor.name(),tx,0,tw-30);
    this.changeTextColor(this.hpGaugeColor1());
    this.drawText(actor.hp.toString(),tx,0,tw-30,'right');
    this.resetTextColor();
    this.drawGauge(tx, this.lineHeight(), tw-30, actor.mpRate(), this.mpGaugeColor1(), this.mpGaugeColor2());
    this.drawGauge(tx, this.lineHeight()+6, tw-30, actor.tpRate(), this.tpGaugeColor1(), this.tpGaugeColor2());
}

Window_BattleStatusLMBS.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    rect.width = this.width / 4;
    rect.x = rect.width * index + 15;
    rect.height = this.height;
    return rect;
}

Window_BattleStatusLMBS.prototype.clearItem = function(index) {
    var width = this.width / 4;
    var x = width * index;
    this.contents.clearRect(x,0,width,this.height);
}

Window_BattleStatusLMBS.prototype.selectLast = function() {
    this.select($gameParty._lastBattleActorIndexLMBS);
}

Window_BattleStatusLMBS.prototype.actor = function() {
    return $gameParty.battleMembers()[this.index()];
}

Window_BattleStatusLMBS.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.actor());
};

Window_BattleStatusLMBS.prototype.isEnabled = function(actor) {
    return true;
}