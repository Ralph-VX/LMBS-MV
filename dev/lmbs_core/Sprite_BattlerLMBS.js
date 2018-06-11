//-----------------------------------------------------------------------------
// Sprite_BattlerLMBS
//
// The superclass of Sprite_ActorLMBS and Sprite_EnemyLMBS.
// Preload all graphics may need in battle for each battler.


function Sprite_BattlerLMBS() {
    this.initialize.apply(this,arguments);
}

Sprite_BattlerLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_BattlerLMBS.prototype.constructor = Sprite_BattlerLMBS;

Sprite_BattlerLMBS.prototype.initialize = function(battler){
    Sprite_Base.prototype.initialize.call(this);
    this.initMembers(battler);
}

Sprite_BattlerLMBS.prototype.initMembers = function(battler){
    this._battler = battler;
    if (this._battler){
        this.cacheAllBitmaps(this._battler.battlerName(),this._battler.isActor());
    }
    this._facing = false;
    this._poseName = "undefined";
    this._pose = "undefined";
    this._forceNoMirror = false;
    this.anchor.x = 0.5;
    this.anchor.y = 0.5;
    this._damages = [];
    this._projectiles = [];
    this._weaponParentSprite = new Sprite();
    this._weaponSprite = new Sprite_WeaponLMBS(this._weaponParentSprite);
    this.addChild(this._weaponParentSprite);
    this.clearMotion();
}

Sprite_BattlerLMBS.prototype.onStart = function() {
    if (Kien.LMBS_Core.fixCharacterSize) {
        var basewidth = this._cachedBitmaps["Stand"].boxwidth;
        var baseheight = this._cachedBitmaps["Stand"].boxheight;
        for (var i = 0;i < this._cachedBitmapNames.length; i++) {
            var name = this._cachedBitmapNames[i];
            this._cachedBitmaps[name].boxwidth = basewidth;
            this._cachedBitmaps[name].boxheight = baseheight;
        }
    }
}

Sprite_BattlerLMBS.prototype.cacheAllBitmaps = function(baseName,isactor){
    var basePath = "img/sv_actors/";
    basePath = basePath.concat(baseName + "/");
    this._cachedBitmaps = {};
    this._cachedBitmapNames = [];
    this._tempBasePath = basePath;
    var names = $dataLMBSCharacters[baseName] || [];
    if (!names.contains("Stand")) names.push("stand");;
    this.cacheAllBitmapsCallBack(names);
}

Sprite_BattlerLMBS.prototype.cacheAllBitmapsCallBack = function(names){
	for (var i = 0; i < names.length;i++){
        var filename = names[i];
        var arr = filename.match(/(.+?)(?:\[(.*)\])?$/); // ["",name,parameters,""]
        if (arr){
            var cache = this._cachedBitmaps[arr[1]];
            if (!cache) {
                cache = {};
            }
            cache.bitmap = ImageManager.loadNormalBitmap(this._tempBasePath+filename+".png",0);
            if(arr[2] && arr[2].match(/F(\d+)/i)){
                cache.frames = RegExp.$1;
            } else {
                cache.frames = 1;
            }
            cache.parameters = arr.clone();
            cache.bitmap.addLoadListener(function(){
                if (this.json) {
                    this.frames = this.json.frameCount;
                }
                this.height = this.bitmap.height;
                this.width = this.bitmap.width/this.frames;
                if (this.parameters[2] && this.parameters[2].match(/W(\d+)/i)) {
                    this.boxwidth = parseInt(RegExp.$1);
                } else {
                    this.boxwidth = this.width;
                }
                if (this.parameters[2] && this.parameters[2].match(/H(\d+)/i)) {
                    this.boxheight = parseInt(RegExp.$1);
                } else {
                    this.boxheight = this.height;
                }
                if (this.parameters[2] && this.parameters[2].match(/L/i)) {
                    this.loop = true;
                } else {
                    this.loop = false;
                }
            }.bind(cache));
            this._cachedBitmaps[arr[1]] = cache;
            if (!this._cachedBitmapNames.contains(arr[1])) {
                this._cachedBitmapNames.push(arr[1]);
            }
        }

        var posename = filename;
        var cache = this._cachedBitmaps[posename];
        if (!cache) {
            cache = {};
        }
        var xhr = new XMLHttpRequest();
        var url = this._tempBasePath+filename+".json";
        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                cache.json = JSON.parse(xhr.responseText);
                if (cache.bitmap && cache.bitmap.isReady()) {
                    cache.width = cache.bitmap.width / cache.json.frameCount;
                    cache.frames = cache.frameCount;
                }
            }
        };
        xhr.onerror = function() {
            DataManager._errorUrl = DataManager._errorUrl || url;
        };
        xhr.send();
        this._cachedBitmaps[posename] = cache;
        if (!this._cachedBitmapNames.contains(posename)) {
            this._cachedBitmapNames.push(posename);
        }
    }
}



Sprite_BattlerLMBS.prototype.currentBitmapCache = function() {
    if (this._cachedBitmaps[this._pose]){
        return this._cachedBitmaps[this._pose];
    } else {
        return {};
    }
}

Sprite_BattlerLMBS.prototype.getFrameProperty = function(pi) {
    if (this.currentBitmapCache().json && this.currentBitmapCache().json.frames && this.currentBitmapCache().json.frames[pi]) {
        return this.currentBitmapCache().json.frames[pi]
    } else {
        return {
            "weaponX" : 0,
            "weaponY" : 0,
            "weaponAngle" : 0,
            "weaponMirror" : false,
            "weaponBack" : false,
            "hideWeapon" : false
        }
    }
}   

Sprite_BattlerLMBS.prototype.update = function() {
    Sprite_Base.prototype.update.call(this);
    if (!SceneManager._scene.isBattlePaused()){
        this.updateBitmap();
        this.updateAnimation();
        this.updateFrame();
        this.updatePosition();
        this.updateDamagePopup();
        this.updateProjectile();
        this.updateTestData();
        this.updateWeaponSprite();
    }
}

Sprite_BattlerLMBS.prototype.poseNameWithDirection = function(name, facing) {
    return name + (facing ? "R" : "L");
}


Sprite_BattlerLMBS.prototype.updateBitmap = function() {
    if (this._poseName != this._battler._pose || this._facing != this._battler._facing) {
        this._poseName = this._battler._pose;
        this._facing = this._battler._facing;
        if(this._cachedBitmaps[this.poseNameWithDirection(this._poseName, this._facing)]){
            this._pose = this.poseNameWithDirection(this._poseName, this._facing);
            this._forceNoMirror = true;
            this.bitmap = this._cachedBitmaps[this._pose].bitmap;
            this.clearMotion();
        } else if (this._cachedBitmaps[this._poseName]){
            this._pose = this._poseName;
            this.bitmap = this._cachedBitmaps[this._pose].bitmap;
            this.clearMotion();
        } else {
            if (this._poseName == "Stand"){
                throw new Error("You Don't have pose \"Stand\" for your battler: " + this._battler.battlerName());
            }
            this._battler._pose = "Stand";
            this._pose = "undefined";
            this._poseName = "undefined";
            this.updateBitmap();
        }
    }
}

Sprite_BattlerLMBS.prototype.getCurrentFrameCount = function() {
    if (this.currentBitmapCache().json) {
        return this.currentBitmapCache().json.frameCount;
    } else {
        return this.currentBitmapCache().frames;
    }
}

Sprite_BattlerLMBS.prototype.getCurrentLoop = function() {
    if (this.currentBitmapCache().json) {
        return this.currentBitmapCache().json.loop;
    } else {
        return this.currentBitmapCache().loop;
    }
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponX = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).weaponX;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponY = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).weaponY;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponAngle = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).weaponAngle;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponHide = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).hideWeapon;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponBack = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).weaponBack;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponMirror = function() {
    var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
    return this.getFrameProperty(pi).weaponMirror;
}

Sprite_BattlerLMBS.prototype.getCurrentBoxWidth = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].width;
    } else {
        return this.currentBitmapCache().boxwidth;
    }
}

Sprite_BattlerLMBS.prototype.getSpriteTop = function() {
    return this.y - this.height*this.anchor.y;
}

Sprite_BattlerLMBS.prototype.getCurrentBoxHeight = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].height;
    } else {
        return this.currentBitmapCache().boxheight;
    }
}

Sprite_BattlerLMBS.prototype.updateAnimation = function() {
    if(this.bitmap && this.getCurrentFrameCount() > 1){
        this._animationCount++;
        if(this._animationCount >= this.getCurrentFrameCount() * Kien.LMBS_Core.animationSpeed){
            this._animationCount = this.getCurrentLoop() ? 0 : (this.getCurrentFrameCount() * Kien.LMBS_Core.animationSpeed -1);
        }
    }
    
}

Sprite_BattlerLMBS.prototype.updateFrame = function() {
    if(this.bitmap){
        var fw = this.currentBitmapCache().width
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        if (pi >= this.getCurrentFrameCount()) {
            pi = this.getCurrentFrameCount()-1;
            this._battler._patternIndex = pi;
        }
        var fx = pi * fw;
        this.setFrame(fx,0,fw,this.currentBitmapCache().height);
    }
}

Sprite_BattlerLMBS.prototype.clearMotion = function () {
    this._animationCount = 0;
}

Sprite_BattlerLMBS.prototype.updatePosition = function() {
    this.x = this._battler.screenX();
    this.y = this._battler.screenY();
    if (this.bitmap) {
        this.y -= this.height/2;
    }
    if (this._battler._facing != Kien.LMBS_Core.defaultFacing){
        this.scale.x = -1;
    } else {
        this.scale.x = 1;
    }
    this._battler._battleRect = this.battlerBox();
    this.rotation = this._battler._rotation * Math.PI / 180;
    if (this._battler._facing != Kien.LMBS_Core.defaultFacing) {
        this.rotation = Math.PI * 2 - this.rotation;
    }
}

Sprite_BattlerLMBS.prototype.battlerBox = function() {
    var rect = new Rectangle(this._battler.screenX(),this._battler.screenY(),0,0);
    if (this.bitmap){
        rect.width = this.getCurrentBoxWidth();
        rect.height = this.getCurrentBoxHeight();
        rect.x -= rect.width/2;
        rect.y -= rect.height;
    }
    return rect;
}

Sprite_BattlerLMBS.prototype.updateDamagePopup = function() {
    this.setupDamagePopup();
    if (this._damages.length > 0) {
        if (!this._damages[0].isPlaying()) {
            this.parent.removeChild(this._damages[0]);
            this._damages.shift();
        }
    }
}

Sprite_BattlerLMBS.prototype.updateProjectile = function() {
    while(this._battler.hasProjectile()){
        var obj = this._battler.shiftProjectile();
        if (eval(obj.classname) === undefined) {
            continue;
        }
        var sprite = new (eval(obj.classname))(obj, this);
        var updateFunc = sprite.update;
        var newUpdateFunc = function() {
            if (!SceneManager._scene.isBattlePaused()){
                updateFunc.call(this);
            }
        }
        sprite.update = newUpdateFunc;
        this._projectiles.push(sprite);
        this.parent.addChild(sprite);
    }
    var func = function(sprite){
        return sprite._finish;
    };
    var i = this._projectiles.findIndex(func);
    while(i >= 0){
        var sprite = this._projectiles.splice(i,1)[0];
        sprite.removeLMBS();
        this.parent.removeChild(sprite);
        i = this._projectiles.findIndex(func);
    }
}

Sprite_BattlerLMBS.prototype.updateTestData = function() {
    if(Kien.LMBS_Core.isTest() && SceneManager._scene._testBitmap){
        var rect = this.battlerBox();
        var color = "rgba(0,0,255,0.5)";
        SceneManager._scene._testBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);
        if(this._battler.isDamaging()){
            var nrect = this._battler._damageInfo.rect;
            var arect = new Rectangle(nrect.x,nrect.y,nrect.width,nrect.height);
            if(this._battler._facing){
                arect.x += this._battler.screenX();
            } else {
                arect.x = this._battler.screenX() - arect.x;
                arect.x -= arect.width;
            }
            arect.y += this._battler.screenY() - arect.height;
            color = "rgba(255,0,0,0.5)";
            if (this._battler._waitInput){
                color = "rgba(255,0,255,0.5)";
            }
            SceneManager._scene._testBitmap.fillRect(arect.x,arect.y,arect.width,arect.height,color);
        }
        var rects = this._battler._debugRects;
        for (var i = 0; i < rects.length; i++) {
            rect = rects[i];
            color = "rgba(128,128,128,0.5)";
            SceneManager._scene._testBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);
        }
    }
}

Sprite_BattlerLMBS.prototype.updateWeaponSprite = function() {
    if (this._battler.getWeaponName() != this._weaponSprite._name) {
        this._weaponSprite.setup(this._battler.getWeaponName());
    }
    this._weaponParentSprite.x = this.getCurrentWeaponX() ? this.getCurrentWeaponX() : 0;
    this._weaponParentSprite.y = this.getCurrentWeaponY() ? this.getCurrentWeaponY() : 0;
    this._weaponParentSprite.x += this._battler._weaponProperty.dx;
    this._weaponParentSprite.y += this._battler._weaponProperty.dy;
    this._weaponSprite._hide = this.getCurrentWeaponHide();
    this._weaponSprite._angle = this.getCurrentWeaponAngle() ? this.getCurrentWeaponAngle() : 0;
    if (this._battler._weaponProperty.overrideRotation) {
        this._weaponSprite._angle = this._battler._weaponProperty.rotation;
    }
    this._weaponParentSprite.scale.x = this.getCurrentWeaponMirror() ? -1 : 1;
    this._weaponSprite.update();
}

Sprite_BattlerLMBS.prototype.setupDamagePopup = function() {
    var obj;
    while (obj = this._battler.obtainDamagePopup()) {
        var sprite = new Sprite_Damage();
        sprite.setup(obj);
        var w = sprite.spriteWidth();
        var h = sprite.spriteHeight();
        sprite.x = this.x + this.damageOffsetX() + (Math.randomInt(w) - w/2);
        sprite.y = this.y + this.damageOffsetY() + (Math.randomInt(h) - h/2);
        var updateFunc = sprite.update;
        var newUpdateFunc = function() {
            if (!SceneManager._scene.isBattlePaused()){
                updateFunc.call(this);
                // Call twice to speed up the effect
                updateFunc.call(this);
            }
        }
        sprite.update = newUpdateFunc;
        this._damages.push(sprite);
        this.parent.addChild(sprite);
        this._battler.clearDamagePopup();
        this._battler.clearResult();
    }
    while (obj = this._battler.obtainPopup()) {
        var sprite = new Sprite_Damage();
        sprite.setup(obj.string, obj.duration, obj.delay);
        var w = sprite.spriteWidth();
        var h = sprite.spriteHeight();
        sprite.x = this.x + this.damageOffsetX() + (Math.randomInt(w) - w/2);
        sprite.y = this.y + this.damageOffsetY() + (Math.randomInt(h) - h/2);
        var updateFunc = sprite.update;
        var newUpdateFunc = function() {
            if (!SceneManager._scene.isBattlePaused()){
                updateFunc.call(this);
            }
        }
        sprite.update = newUpdateFunc;
        this._damages.push(sprite);
        this.parent.addChild(sprite);
    }
};

Sprite_BattlerLMBS.prototype.damageOffsetX = function() {
    return Kien.LMBS_Core.damageOffsetX;
}

Sprite_BattlerLMBS.prototype.damageOffsetY = function() {
    return Kien.LMBS_Core.damageOffsetY;
}

Sprite_BattlerLMBS.prototype.oppositeMembers = function() {
     var spriteset = this.parent;
     return this._battler.isActor() ? spriteset._Enemies : spriteset._Actors;
}

Sprite_BattlerLMBS.prototype.targetSprite = function() {
    if(!this._battler._target){
        return new Sprite();
    }
    return this.parent.findSprite(this._battler._target);
}

Sprite_BattlerLMBS.prototype.renderWebGL = function (renderer)
{

    // if the object is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.worldAlpha <= 0 || !this.renderable)
    {

        return;
    }

    var i, j;

    // do a quick check to see if this element has a mask or a filter.
    if (this._mask || this._filters)
    {
        renderer.currentRenderer.flush();

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters && this._filters.length)
        {
            renderer.filterManager.pushFilter(this, this._filters);
        }

        if (this._mask)
        {
            renderer.maskManager.pushMask(this, this._mask);
        }

        renderer.currentRenderer.start();

        // Render children first if this.getCurrentWeaponBack returns true.
        if (this.getCurrentWeaponBack()) {
            for (i = 0, j = this.children.length; i < j; i++)
            {
                this.children[i].renderWebGL(renderer);
            }
            this._renderWebGL(renderer);
        } else {
            // add this object to the batch, only rendered if it has a texture.
            this._renderWebGL(renderer);

            // now loop through the children and make sure they get rendered
            for (i = 0, j = this.children.length; i < j; i++)
            {
                this.children[i].renderWebGL(renderer);
            }

        }
        renderer.currentRenderer.flush();

        if (this._mask)
        {
            renderer.maskManager.popMask(this, this._mask);
        }

        if (this._filters)
        {
            renderer.filterManager.popFilter();

        }
        renderer.currentRenderer.start();
    }
    else
    {
        if (this.getCurrentWeaponBack()) {
            // simple render children!
            for (i = 0, j = this.children.length; i < j; ++i)
            {
                this.children[i].renderWebGL(renderer);
            }
            this._renderWebGL(renderer);

        } else {
            this._renderWebGL(renderer);

            // simple render children!
            for (i = 0, j = this.children.length; i < j; ++i)
            {
                this.children[i].renderWebGL(renderer);
            }
        }
    }
};

/**
 * Renders the object using the Canvas renderer
 *
 * @param renderer {PIXI.CanvasRenderer} The renderer
 */
 Sprite_BattlerLMBS.prototype.renderCanvas = function (renderer)
 {
    // if not visible or the alpha is 0 then no need to render this
    if (!this.visible || this.alpha <= 0 || !this.renderable)
    {
        return;
    }

    if (this._mask)
    {
        renderer.maskManager.pushMask(this._mask);
    }
    if (this.getCurrentWeaponBack()) {
        for (var i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].renderCanvas(renderer);
        }
        this._renderCanvas(renderer);
    } else {
        this._renderCanvas(renderer);
        for (var i = 0, j = this.children.length; i < j; ++i)
        {
            this.children[i].renderCanvas(renderer);
        }
    }
    if (this._mask)
    {
        renderer.maskManager.popMask(renderer);
    }
};