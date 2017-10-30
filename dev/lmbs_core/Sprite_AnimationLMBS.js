//-----------------------------------------------------------------------------
// Sprite_AnimationLMBS
//
// The sprite for displaying an animation.
// Extends from Sprite_Animation, with ability to load json timing and
// process it.

/*
    
*/

function Sprite_AnimationLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_AnimationLMBS.prototype = Object.create(Sprite_Animation.prototype);
Sprite_AnimationLMBS.prototype.constructor = Sprite_AnimationLMBS;

Sprite_AnimationLMBS.prototype.initialize = function(object, sprite){
    Sprite_Animation.prototype.initialize.call(this);
    this._isLoaded = false;
    this._targetSprite =  sprite.targetSprite();
    this._target = this._targetSprite;
    this._finish = false;
    this._userSprite = sprite;
    this._battler = sprite._battler;
    this._action = new Game_Action(this._battler);
    this._action.setItemObject(object.item);
    var name = object.parameters;
    var xhr = new XMLHttpRequest();
    var url = "data/animations/" + name + ".json";
    xhr.open('GET', url, false);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            obj = JSON.parse(xhr.responseText);
            this.onJSONloaded(obj);
        }
    }.bind(this); 
    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
}

Sprite_AnimationLMBS.prototype.onJSONloaded = function(param) {
    var thisObject = this._battler.getEvaluateObjects();
    this._timingArray = param.timing || {};
    this._xOrigin = param.x.origin || "target";
    this._yOrigin = param.y.origin || "target";
    this._dx = Kien.LMBS_Core.loadJSONEvaluableValue(param.x.value,this) || 0;
    this._dy = Kien.LMBS_Core.loadJSONEvaluableValue(param.y.value,this) || 0;
    this._animation = $dataAnimations[param.animationId] || null;
    this._delay = param.delay || 0;
    this._mirror = param.mirror || false
    this._follow = param.follow || false;
    this._animationPosition = {
        "x" : this.animationX(),
        "y" : this.animationY(),
        "height" : this._targetSprite.height
    }
    if (this._mirror === null) {
        this._mirror = !this._battler._facing;
    }
    if(this._targetSprite && this._animation){
        if (this._mirror){
           this.scale.x = -1;
        }
        this.setup(this._targetSprite , this._animation, this._mirror, this._delay);
    } else {
        this._finish = true;
    }
    this._isLoaded = true;
}

Sprite_AnimationLMBS.prototype.updateCellSprite = function(sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 192;
        var sy = Math.floor(pattern % 100 / 5) * 192;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 100;
        if (cell[5]) {
            sprite.scale.x *= -1;
        }
        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = this._target.visible;
    } else {
        sprite.visible = false;
    }
};

Sprite_AnimationLMBS.prototype.initMembers = function() {
    Sprite_Animation.prototype.initMembers.call(this);
    this._timingArray = {};
    this._processingTiming = [];
}


Sprite_AnimationLMBS.prototype.animationX = function() {
    switch (this._xOrigin) {
        case "target":
            return (this._targetSprite._battler.screenX() + this._dx);
        case "user":
            return (this._userSprite._battler.screenX() + this._dx);
        case "screen":
            return (this._dx);
        case "field":
            return (Kien.LMBS_Core.fieldToScreenX(this._dy));
    }
    return 0;
}

Sprite_AnimationLMBS.prototype.animationY = function() {
    switch (this._yOrigin) {
        case "target":
            return (this._targetSprite._battler.screenY() - this._dy);
        case "user":
            return (this._userSprite._battler.screenY() - this._dy);
        case "screen":
            return (this._dy);
        case "field":
            return (Kien.LMBS_Core.fieldToScreenY(this._dy));
    }
    return 0;
}

Sprite_AnimationLMBS.prototype.removeLMBS = function() {
    this.remove();
}


Sprite_AnimationLMBS.prototype.updateMain = function() {
    if (this._isLoaded) {
        Sprite_Animation.prototype.updateMain.call(this);
        this.updateTestData();
        if (this.isPlaying() && this.isReady() && this._delay == 0) {
            this.updateDamage();
        }
        if(!this.isPlaying()){
            this._finish = true;
        }
    }
}

Sprite_AnimationLMBS.prototype.updateTestData = function() {
    if(Kien.LMBS_Core.isTest() && SceneManager._scene._testBitmap){
        var color = "rgba(0,255,0,0.5)";
        for (var i = 0; i < this._processingTiming.length; i++) {
            var obj = this._processingTiming[i];
            var rectsource = obj.rect;
            var rect = new Rectangle(rectsource.x,rectsource.y,rectsource.width,rectsource.height);
            rect.x += this.x;
            rect.y += this.y;
            SceneManager._scene._testBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);
        }
    }
}

Sprite_AnimationLMBS.prototype.updateDamage = function() {
    var memb = this._userSprite.oppositeMembers();
    var func = function(enemy){
        if(!enemy._battler.isDead() && enemy.battlerBox().overlap(rect) && obj.hitted.indexOf(enemy) == -1){
            this._action.apply(enemy._battler);
            var dir = obj.knockdir ? (this._battler._facing ? 4 : 6) : (this._battler._facing ? 6 : 4);
            if (this._action.isDamage() || this._action.isDrain()){
                enemy._battler.knockback(obj.knockback,dir, obj.knocklength);
                enemy._battler.onHitted(this._battler);
                this._battler.onHit(enemy._battler);
            }
            enemy._battler.startDamagePopup();
            BattleManager.refreshStatus();
            obj.hitted.push(enemy);
        }
    };
    for (var i = 0; i < this._processingTiming.length; i++) {
        var obj = this._processingTiming[i];
        var rectsource = obj.rect;
        this._action._damagePercentage = obj.damagePer;
        var rect = new Rectangle(rectsource.x,rectsource.y,rectsource.width,rectsource.height);
        rect.x += this.x;
        rect.y += this.y;
        memb.forEach(func, this);
    }
}

Sprite_AnimationLMBS.prototype.updatePosition = function() {
    Sprite_Animation.prototype.updatePosition.call(this);
    if (this._follow) {
        this._animationPosition.x = this.animationX();
        this._animationPosition.y = this.animationY();
    }
    this.x = this._animationPosition.x;
    this.y = this._animationPosition.y;
    if (this._yOrigin == "field" || this._yOrigin == "screen") {
        // if (this._animationPosition == 0) {
        //     this.anchor.y = 0;
        // }
        // if (this._animationPosition == 2) {
        //     this.anchor.y = 1;
        // }
    } else {
        if (this._animation.position == 0){
            this.y -= this._animationPosition.height;
        }
        if (this._animation.position == 1){
            this.y -= this._animationPosition.height/2
        }
    }

};

Sprite_AnimationLMBS.prototype.updateFrame = function() {
    Sprite_Animation.prototype.updateFrame.call(this);
    if (this._duration > 0) {
        this.updateTiming();
        this.updateProcessingTiming();
    }
}

Sprite_AnimationLMBS.prototype.updateTiming = function() {
    var index = this.currentFrameIndex().toString();
    if(this._timingArray[index]){
        var array = this._timingArray[index];
        for (var i = 0; i < array.length;i++){
            var obj = Object.create(array[i]);
            if (obj.type == "damage") {
                obj.hitted = [];
                if (obj.knockdir == 0){
                    obj.knockdir = this._battler._facing ? 6 : 4;
                }
                this._processingTiming.push(obj);
            }
        }
    }
}

Sprite_AnimationLMBS.prototype.updateProcessingTiming = function() {
    for (var i = 0; i<this._processingTiming.length; i++) {
        this._processingTiming[i].dur--;
    }
    var func = function(obj) {
        return obj.dur == 0;
    };
    var index = this._processingTiming.findIndex(func)
    while(index >= 0){
        this._processingTiming.splice(index,1);
        index = this._processingTiming.findIndex(func);
    }
}