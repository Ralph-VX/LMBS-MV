//-----------------------------------------------------------------------------
// Sprite_BattleRewardLMBS
//
// Sprite use to show rewards in battle result.

function Sprite_BattleRewardLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_BattleRewardLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_BattleRewardLMBS.prototype.constructor = Sprite_BattleRewardLMBS;

Sprite_BattleRewardLMBS.prototype.initialize = function(parameters){
    Sprite_Base.prototype.initialize.call(this);
    this.bitmap = new Bitmap(1,1);
    this.x = 100;
    this.y = (Graphics.boxHeight-200)/2;
    this.sprites = [];
    this._count = 0;
    this._start = false;
    this._finish = false;
    this._itemNum = 0;
}

Sprite_BattleRewardLMBS.prototype.isFinish = function() {
    return this._finish;
}

Sprite_BattleRewardLMBS.prototype.start = function() {
    this._start = true;
}

Sprite_BattleRewardLMBS.prototype.update = function() {
    if (this._start){
        this.updateMain();
        if((Input.isLongPressed('ok') || TouchInput.isLongPressed())){
            this.updateMain();
            this.updateMain();
            this.updateMain();
        }
    }
}

Sprite_BattleRewardLMBS.prototype.updateMain = function() {
    if (this._count == 0) {
        this.createExpPart();
    } else if (this._count == 30) {
        this.createGoldPart();
    } else if (this._count == 60) {
        this.createItemPart();
    } else if (this._count == (60 + this._itemNum*30) + Kien.LMBS_Core.battleEndWaitTime) {
        this._finish = true;
        this._start = false;
    }
    this.updateAllParts();
    this._count++;
}

Sprite_BattleRewardLMBS.prototype.createExpPart = function() {
    var sprite = new Sprite();
    var string = TextManager.exp + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var y = this.y;
    var height = this.bitmap.fontSize+12;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.visible = true;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var valueSprite = new Sprite();
    x = x + width + 16;
    string = BattleManager._rewards.exp.toString();
    width = this.bitmap.measureTextWidth(string);
    valueSprite.bitmap = new Bitmap(width,height);
    valueSprite.bitmap.drawText(string,0,0,width,height,'right')
    valueSprite.opacity = 0;
    valueSprite.x = x + 80;
    valueSprite.y = y;
    valueSprite.moveTargetX = x;
    valueSprite.moveCount = 20;
    valueSprite.visible = true;
    this.parent.addChild(valueSprite);
    this.sprites.push(valueSprite);
}

Sprite_BattleRewardLMBS.prototype.createGoldPart = function() {
    var sprite = new Sprite();
    var string = TextManager.currencyUnit + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var height = this.bitmap.fontSize+12;
    var y = this.y + height;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var valueSprite = new Sprite();
    x = x + width + 16;
    string = BattleManager._rewards.gold.toString();
    width = this.bitmap.measureTextWidth(string);
    valueSprite.bitmap = new Bitmap(width,height);
    valueSprite.bitmap.drawText(string,0,0,width,height,'right')
    valueSprite.opacity = 0;
    valueSprite.x = x + 80;
    valueSprite.y = y;
    valueSprite.moveTargetX = x;
    valueSprite.moveCount = 20;
    this.parent.addChild(valueSprite);
    this.sprites.push(valueSprite);
}

Sprite_BattleRewardLMBS.prototype.createItemPart = function() {
    var sprite = new Sprite();
    sprite.bitmap = new Bitmap(1,1);
    var string = TextManager.item + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var height = this.bitmap.fontSize+12;
    var y = this.y + height * 2;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var basex = x + width + 16;
    var basey = y;
    var lastwidth = 0;
    var items = BattleManager._rewards.items;
    this._itemNum = items.length;
    if (items.length > 0){
        for (var i = 0; i < items.length; i++){
            var item = items[i];
            var valueSprite = new Sprite();
            string = item.name;
            width = this.bitmap.measureTextWidth(string) + 36;
            valueSprite.bitmap = new Bitmap(width,height);
            this.drawIconTo(valueSprite.bitmap,item.iconIndex,0,0);
            valueSprite.bitmap.drawText(string,0,0,width,height,'right')
            valueSprite.opacity = 0;
            valueSprite.x = basex + (i.mod(2) == 1 ? lastwidth : 0) + 80;
            valueSprite.y = basey + parseInt(i/2) * height;
            lastwidth = width;
            valueSprite.moveTargetX = basex + (i.mod(2) == 1 ? lastwidth : 0);
            valueSprite.moveCount = 20;
            valueSprite.waitCount = i * 30;
            this.parent.addChild(valueSprite);
            this.sprites.push(valueSprite);
        }
    }
}

Sprite_BattleRewardLMBS.prototype.drawIconTo = function(target,iconIndex,x,y){
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    target.blt(bitmap, sx, sy, pw, ph, x, y);
}

Sprite_BattleRewardLMBS.prototype.updateAllParts = function() {
    for (var i = 0 ; i < this.sprites.length ; i++){
        var sprite = this.sprites[i];
        sprite.visible = true;
        if (sprite.waitCount && sprite.waitCount > 0) {
            sprite.waitCount--;
        } else if (sprite.moveCount && sprite.moveCount > 0) {
            if (sprite.moveCount == 0) {
                AudioManager.playSe({'name': 'Absorb1', 'pitch' : 150, 'volume' : 60});
            }
            sprite.x += (sprite.moveTargetX - sprite.x) / sprite.moveCount;
            sprite.opacity += (255 - sprite.opacity) / sprite.moveCount;
            sprite.moveCount--;
        }
    }
}