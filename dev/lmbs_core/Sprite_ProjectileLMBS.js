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
    this.anchor.y = 1;
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

Sprite_ProjectileLMBS.prototype.onJSONloaded = function(param) {
    this._xspeed = Kien.LMBS_Core.loadJSONEvaluableValue(param.xspeed,this) || 3;
    this._yspeed = Kien.LMBS_Core.loadJSONEvaluableValue(param.yspeed,this) || 0;
    this._damagePer = Kien.LMBS_Core.loadJSONEvaluableValue(param.damagePercent,this) || 1;
    this._bitmapName = param.filename || "";
    this._knockbackx = Kien.LMBS_Core.loadJSONEvaluableValue(param.knockbackx,this) || 5;
    this._knockbacky = Kien.LMBS_Core.loadJSONEvaluableValue(param.knockbacky,this) || 5;
    this._knockbackdir = Kien.LMBS_Core.loadJSONEvaluableValue(param.knockbackdir,this) || 0;
    this._pierce = Kien.LMBS_Core.loadJSONEvaluableValue(param.pierce,this) || 1;
    this._dangle = param.angleFollowDirection || false;
    this._invincibleFrames = Kien.LMBS_Core.loadJSONEvaluableValue(param.invincibleFrames,this) || 1;
    this._frameNumber = 1;
    this._animationSpeed = 4;
    this._finish = false;
    this._animationCount = 0;
    this.updateBitmap();
    this.x = this._userSprite._battler.screenX() + (param.dx ? Kien.LMBS_Core.loadJSONEvaluableValue(param.dx,this) : 0);
    this.y = this._userSprite._battler.screenY() + (param.dy ? Kien.LMBS_Core.loadJSONEvaluableValue(param.dy,this) : 0);
    this._action._damagePercentage = this._damagePer;
    this.visible = true;
    this._isLoaded = true;
    if (this._dangle) {
        this.rotation = (new Kien.Vector2D(this._xspeed,-this._yspeed)).angleWithHorizon();
    }
}

Sprite_ProjectileLMBS.prototype.updateBitmap = function() {
    if(!this.bimtap){
        this.bitmap = ImageManager.loadProjectile(this._bitmapName);
        this.obtainImageProperty();
    }
}

Sprite_ProjectileLMBS.prototype.obtainImageProperty = function() {
    var arr = this._bitmapName.match(/(.+?)(?:\[(.*)\])?$/)
    if (arr[2]) {
        var params = arr[2];
        if (params.match(/F(\d+)/)) {
            this._frameNumber = parseInt(RegExp.$1,10);
        }
        if (params.match(/S(\d+)/)) {
            this._animationSpeed = parseInt(RegExp.$1,10);
        }
    }
}

Sprite_ProjectileLMBS.prototype.removeLMBS = function() {

}

Sprite_ProjectileLMBS.prototype.update = function() {
    if (!this._finish && this._isLoaded){
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
        if(this.outOfBound()){
            this.visible = false;
            this._finish = true;
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
                    enemy._battler.knockback({"x": this._knockbackx, "y": this._knockbacky},dir);
                    enemy._battler.onHitted(this._battler);
                    this._battler.onHit(enemy._battler);
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
    return new Rectangle(this.x-this.width/2,this.y-this.height,this.width,this.height);
}

Sprite_ProjectileLMBS.prototype.outOfBound = function() {
    return (this.x < 0 || this.x > Kien.LMBS_Core.battleWidth || this.y > Graphics.height);
}