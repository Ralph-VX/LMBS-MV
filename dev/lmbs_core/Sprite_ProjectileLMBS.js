//-----------------------------------------------------------------------------
// Sprite_ProjectileLMBS
//
// Basic Projectile class.

function Sprite_ProjectileLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_ProjectileLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_ProjectileLMBS.prototype.constructor = Sprite_ProjectileLMBS;

Sprite_ProjectileLMBS.prototype.initialize = function(object, sprite){
    Sprite_Base.prototype.initialize.call(this);
    // var parameters = object.parameters.split(",");
    // var matches = [/([+-]?\d+)/,/([+-]?\d+)/,/(.+)/,
    //                /(\d+)/,/(\d+)/,/([+-]?\d+)/,
    //                /([+-]?\d+)/,/(\d+(?:\.\d+)?)/,/(\d+(?:\.\d+)?)/,
    //                /(\d+(?:\.\d+)?)/,/(\d+)/];
    // var names = ["dx","dy","filename",
    //              "xspeed","yspeed","damagePer",
    //              "knockbackx","knockbacky","knockbackdir",
    //              "pierce"];
    // var parser = [Kien.parseInt,Kien.parseInt,null,
    //               parseFloat,parseFloat,parseFloat,
    //               Kien.parseInt,Kien.parseInt,Kien.parseInt,
    //               Kien.parseInt];
    // var param = {};
    // //                  dx,dy,filename,framenumber,animationSpeed,xspeed,yspeed,damagePercent,knockbackx,knockbacky,knockbackdir
    // for (var i = 0; i < names.length; i++) {
    //     if (!!parameters[i]) {
    //         if (parameters[i].match(matches[i])) {
    //             param[names[i]] = parser[i] ? parser[i](RegExp.$1) : RegExp.$1;
    //         }
    //     } else {
    //         break;
    //     }
    // }
    this._userSprite = sprite;
    this._isLoaded = false;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._battler = sprite._battler;
    this._direction = (this._battler._facing ? 1 : -1);
    this.scale.x = this._direction * (Kien.LMBS_Core.defaultFacing ? 1 : -1);
    this._action = new Game_Action(this._battler);
    this._action.setItemObject(object.item);
    this._hittenEnemy = {};
    var name = object.parameters;
    var xhr = new XMLHttpRequest();
    var url = "data/projectiles/" + name + ".json";
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

Sprite_ProjectileLMBS.prototype.getEvaluateObjects = function() {
    return {"sprite" : this};
}

Sprite_ProjectileLMBS.prototype.evaluateJSONString = function(string) {
    return Kien.LMBS_Core.loadJSONEvaluableValue(
        string, 
        this._battler.getEvaluateObjects(this.getEvaluateObjects())
    );
}

Sprite_ProjectileLMBS.prototype.onJSONloaded = function(param) {
    var thisObject = this._battler.getEvaluateObjects();
    this._xspeed = this.evaluateJSONString(param.xspeed) || 3;
    this._yspeed = this.evaluateJSONString(param.yspeed) || 0;
    this._damagePer = this.evaluateJSONString(param.damagePercent) || 1;
    this._bitmapName = param.filename || "";
    this._knockbackx = this.evaluateJSONString(param.knockbackx) || 5;
    this._knockbacky = this.evaluateJSONString(param.knockbacky) || 5;
    this._knocklength = this.evaluateJSONString(param.knocklength) || 5;
    this._knockbackdir = this.evaluateJSONString(param.knockbackdir) || 0;
    this._pierce = this.evaluateJSONString(param.pierce) || 1;
    this._dangle = param.angleFollowDirection || false;
    this._invincibleFrames = this.evaluateJSONString(param.invincibleFrames) || 1;
    this._delay = this.evaluateJSONString(param.delay) || 0;
    this._frameNumber = 1;
    this._animationSpeed = 4;
    this._finish = false;
    this._animationCount = 0;
    this.updateBitmap();
    this._xOrigin = param.dx.origin || "target";
    this._yOrigin = param.dy.origin || "target";
    this._dx = this.evaluateJSONString(param.dx.value) || 0;
    this._dy = this.evaluateJSONString(param.dy.value) || 0;
    this.x = this.projectileX();
    this.y = this.projectileY();
    this._entered = !this.outOfBound();
    this._count = 0;
    this._action._damagePercentage = this._damagePer;
    this.visible = true;
    this._isLoaded = true;
    if (this._dangle) {
        this.rotation = (new Kien.Vector2D(this._xspeed * this._direction,-this._yspeed)).angleWithHorizon();
        this.scale.x = (Kien.LMBS_Core.defaultFacing ? 1 : -1);
    }
}

Sprite_ProjectileLMBS.prototype.projectileX = function() {
    switch (this._xOrigin) {
        case "target":
            return (this._targetSprite.x + this._targetSprite._battler.getRelativeX(this._dx));
        case "user":
            return (this._userSprite.x + this._userSprite._battler.getRelativeX(this._dx));
        case "screen":
            return (this._dx);
        case "field":
            return (Kien.LMBS_Core.fieldToScreenX(this._dy));
    }
    return 0;
}

Sprite_ProjectileLMBS.prototype.projectileY = function() {
    switch (this._yOrigin) {
        case "target":
            return (this._targetSprite._battler.screenY() - this._dy) - 
                this._targetSprite.height / 2 * this._targetSprite.scale.y;
        case "user":
            return (this._userSprite._battler.screenY() - this._dy) - 
                this._userSprite.height / 2 * this._userSprite.scale.y;
        case "screen":
            return (this._dy);
        case "field":
            return (Kien.LMBS_Core.fieldToScreenY(this._dy));
    }
    return 0;
}
Sprite_ProjectileLMBS.prototype.updateBitmap = function() {
    if(!this.bimtap && this._bitmapName){
        this.bitmap = ImageManager.loadProjectile(this._bitmapName);
        this.obtainImageProperty();
    }
}

Sprite_ProjectileLMBS.prototype.obtainImageProperty = function() {
    var arr = this._bitmapName.match(/(.+?)(?:\[(.*)\])?$/)
    if (arr[2]) {
        var params = arr[2];
        if (params.match(/F(\d+)/i)) {
            this._frameNumber = parseInt(RegExp.$1,10);
        }
        if (params.match(/S(\d+)/i)) {
            this._animationSpeed = parseInt(RegExp.$1,10);
        }
    }
}

Sprite_ProjectileLMBS.prototype.removeLMBS = function() {

}

Sprite_ProjectileLMBS.prototype.update = function() {
    if (!this._finish && this._isLoaded){
        if (this._delay > 0) {
            this._delay--;
            return;
        }
        this.updatePosition();
        this.updateAnimation();
        this.updateDamage();
        this.updateTestData();
    }
}

Sprite_ProjectileLMBS.prototype.updatePosition = function() {
    if (this._direction != 0){
        this.x += this._xspeed * this._direction;
        this.y -= this._yspeed;
        if (this._entered && this.outOfBound()){
            this.visible = false;
            this._finish = true;
        } else if (!this._entered) {
            this._entered = !this.outOfBound();
        }
    }
}

Sprite_ProjectileLMBS.prototype.updateAnimation = function() {
    this._animationCount++;
    if(this._animationCount > this._animationSpeed*this._frameNumber){
        this._animationCount = 0;
    }
    var fn = this._frameNumber;
    if (fn > 1){
        var pn = Math.floor(this._animationCount / this._animationSpeed);
        var pw = Math.floor(this.bitmap.width / fn);
        var px = pw * pn;
        this.setFrame(px,0,pw,this.bitmap.height);
    }
}

Sprite_ProjectileLMBS.prototype.updateDamage = function() {
    if (this._userSprite){
        var rect = this.boundRect();
        var memb = this._userSprite.oppositeMembers();
        memb.forEach(function(enemy){
            if(!enemy._battler.isDead() && enemy.battlerBox().overlap(rect) && !this._finish && !this._hittenEnemy[enemy]){
                this._action.apply(enemy._battler);
                var dir = this._knockbackdir ? ( 5 - this._direction ) : ( 5 + this._direction );
                if (this._action.isDamage() || this._action.isDrain()){
                    enemy._battler.knockback({"x": this._knockbackx, "y": this._knockbacky},dir, this._knocklength);
                    enemy._battler.onHitted(this._battler);
                    this._battler.onHit(enemy._battler, this._action);
                }
                enemy._battler.startDamagePopup();
                if (this._pierce > 0) {
                    this._pierce--;
                    if (this._pierce == 0) {
                        this.visible = false;
                        this._finish = true;
                    }
                }
                this._hittenEnemy[enemy] = this._invincibleFrames;
            }
        }, this);
    }
    for (var e in this._hittenEnemy) {
        if (this._hittenEnemy[e] > 0) {
            this._hittenEnemy[e]--;
        }
    }
}

Sprite_ProjectileLMBS.prototype.updateTestData = function() {
    if(Kien.LMBS_Core.isTest() && SceneManager._scene._testBitmap){
        var rect = this.boundRect();
        var color = "rgba(0,255,0,0.5)";
        SceneManager._scene._testBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);
    }
}

Sprite_ProjectileLMBS.prototype.boundRect = function() {
    return new Rectangle(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
}

Sprite_ProjectileLMBS.prototype.outOfBound = function() {
    return (this.x < 0 || this.x > Kien.LMBS_Core.battleWidth || this.y > Graphics.height);
}