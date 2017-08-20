//-----------------------------------------------------------------------------
// Sprite_TargetArrow
//
// Sprite use to show which battler is player targetting.

function Sprite_TargetArrow() {
    this.initialize.apply(this, arguments);
}
 
 
Sprite_TargetArrow.prototype = Object.create(Sprite_Base.prototype);
Sprite_TargetArrow.prototype.constructor = Sprite_TargetArrow;

Sprite_TargetArrow.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.call(this);
    this.animationCount = 0;
    this.animationSpeed = Kien.LMBS_Core.cursorAnimationSpeed;
    this.isAnimating = true;
    this.frameNumber = 0;
    this.anchor.y = 1;
    this.anchor.x = 0.5;
    this.createBitmap();
}

Sprite_TargetArrow.prototype.createBitmap = function() {
    this.bitmap = ImageManager.loadSystem('cursorLMBS');
}

Sprite_TargetArrow.prototype.update = function() {
    if (this.isAnimating) {
        this.updateAnimation();
    }
    this.updateFrame();
}

Sprite_TargetArrow.prototype.updateAnimation = function() {
    if (++this.animationCount >= this.animationSpeed) {
        this.animationCount = 0;
        this.frameNumber = (this.frameNumber+1) % Kien.LMBS_Core.cursorFrameCount;
    }
}

Sprite_TargetArrow.prototype.updateFrame = function() {
    var fw = this.bitmap.width / Kien.LMBS_Core.cursorFrameCount;
    var fh = this.bitmap.height;
    var fx = fw * this.frameNumber;
    this.setFrame(fx,0,fw,fh);
}