//-----------------------------------------------------------------------------
// Spriteset_BattleLMBS
//
// The set of sprites on the battle screen.

function Spriteset_BattleLMBS() {
    this.initialize.apply(this, arguments);
}

Spriteset_BattleLMBS.prototype = Object.create(Spriteset_Base.prototype);
Spriteset_BattleLMBS.prototype.constructor = Spriteset_BattleLMBS;

Spriteset_BattleLMBS.prototype.initialize = function() {
    Spriteset_Base.prototype.initialize.call(this);
};

Spriteset_BattleLMBS.prototype.createLowerLayer = function() {
    Spriteset_Base.prototype.createLowerLayer.call(this);
    this.createBackground();
    this.createBattleback();
    this.createBattlerSprite();
}

Spriteset_BattleLMBS.prototype.createUpperLayer = function() {
    Spriteset_Base.prototype.createUpperLayer.call(this);
    this.createTargettingCursor();
};

Spriteset_BattleLMBS.prototype.createBackground = function() {
    this._backgroundSprite = new Sprite();
    this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
    this._baseSprite.addChild(this._backgroundSprite);
};

Spriteset_BattleLMBS.prototype.createBattlerSprite = function() {
    this._Actors = [];
    this._Enemies = [];
    $gameParty.members().forEach(function(actor){
        var sprite = new Sprite_ActorLMBS(actor);
        this._Actors.push(sprite);
        this.addChild(sprite);
    }, this);
    $gameTroop.members().forEach(function(actor){
        var sprite = new Sprite_EnemyLMBS(actor);
        this._Enemies.push(sprite);
        this.addChild(sprite);
    }, this);

}

Spriteset_BattleLMBS.prototype.createTargettingCursor = function() {
    this._targetCursor = new Sprite_TargetArrow();
    this._targetCursorTargetSprite = null;
    this.addChild(this._targetCursor);
}

Spriteset_BattleLMBS.prototype.onStart = function() {
    this._Actors.forEach(function(sprite) {
        sprite.onStart();
    });
    this._Enemies.forEach(function(sprite) {
        sprite.onStart();
    });
}

Spriteset_BattleLMBS.prototype.findSprite = function(battler){
    var func = function(spr){
        return spr._battler == battler;
    }
    var sprite = this._Actors.find(func);
    if(sprite){
        return sprite;
    }
    sprite = this._Enemies.find(func);
    if(sprite){
        return sprite;
    }
    return null;
}

Spriteset_BattleLMBS.prototype.update = function() {
    Spriteset_Base.prototype.update.call(this);
    this.updateTargetArrow();
}

Spriteset_BattleLMBS.prototype.updateTargetArrow = function() {
    if (BattleManager.actor()) {
        var target = BattleManager.actor()._target;
        if (target) {
            if (target.isActor()) {
                this._targetCursorTargetSprite = this._Actors.filter(function(sprite) { 
                    return sprite._battler == target; 
                })[0];
            } else {
                this._targetCursorTargetSprite = this._Enemies.filter(function(sprite) { 
                    return sprite._battler == target; 
                })[0];
            }
        }
    } else {
        this._targetCursorTargetSprite = null;
    }
    if (this._targetCursorTargetSprite) {
        this._targetCursor.x = this._targetCursorTargetSprite.x;
        this._targetCursor.y = this._targetCursorTargetSprite.getSpriteTop();
        this._targetCursor.visible = !this._targetCursorTargetSprite._battler.isDead();
    } else {
        this._targetCursor.visible = false;
    }
}

Spriteset_BattleLMBS.prototype.updatePosition = function() {
    var screen = $gameScreen;
    var scale = screen.zoomScale();
    this.scale.x = scale;
    this.scale.y = scale;
    this.x = Math.round(-screen.zoomX()*scale);
    this.y = Math.round(-(screen.zoomY()*scale - screen.zoomY())); // * (scale - 1)
    this.x += Math.round(screen.shake());
    this.updateBackground();
};

Spriteset_BattleLMBS.prototype.updateBackground = function() {
    this._backgroundSprite.x = -this.x / this.scale.x; // Base Position
    var per = $gameScreen.zoomX() / Kien.LMBS_Core.battleWidth;
    this._backgroundSprite.x -= Math.round(per * this._backgroundSprite.width);

}

Spriteset_BattleLMBS.prototype.createBattleback = function() {
    this._back1Sprite = new Sprite();
    this._back2Sprite = new Sprite();
    this._back1Sprite.bitmap = this.battleback1Bitmap();
    this._back2Sprite.bitmap = this.battleback2Bitmap();
    this._baseSprite.addChild(this._back1Sprite);
    this._baseSprite.addChild(this._back2Sprite);
};

Spriteset_BattleLMBS.prototype.battleback1Bitmap = function() {
    return ImageManager.loadBattleback1(this.battleback1Name());
};

Spriteset_BattleLMBS.prototype.battleback2Bitmap = function() {
    return ImageManager.loadBattleback2(this.battleback2Name());
};

Spriteset_BattleLMBS.prototype.battleback1Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback1Name;
    } else if ($gameMap.battleback1Name()) {
        return $gameMap.battleback1Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback1Name();
    } else {
        return '';
    }
};

Spriteset_BattleLMBS.prototype.battleback2Name = function() {
    if (BattleManager.isBattleTest()) {
        return $dataSystem.battleback2Name;
    } else if ($gameMap.battleback2Name()) {
        return $gameMap.battleback2Name();
    } else if ($gameMap.isOverworld()) {
        return this.overworldBattleback2Name();
    } else {
        return '';
    }
};

Spriteset_BattleLMBS.prototype.overworldBattleback1Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback1Name();
    } else {
        return this.normalBattleback1Name();
    }
};

Spriteset_BattleLMBS.prototype.overworldBattleback2Name = function() {
    if ($gamePlayer.isInVehicle()) {
        return this.shipBattleback2Name();
    } else {
        return this.normalBattleback2Name();
    }
};

Spriteset_BattleLMBS.prototype.normalBattleback1Name = function() {
    return (this.terrainBattleback1Name(this.autotileType(1)) ||
            this.terrainBattleback1Name(this.autotileType(0)) ||
            this.defaultBattleback1Name());
};

Spriteset_BattleLMBS.prototype.normalBattleback2Name = function() {
    return (this.terrainBattleback2Name(this.autotileType(1)) ||
            this.terrainBattleback2Name(this.autotileType(0)) ||
            this.defaultBattleback2Name());
};

Spriteset_BattleLMBS.prototype.terrainBattleback1Name = function(type) {
    switch (type) {
    case 24: case 25:
        return 'Wasteland';
    case 26: case 27:
        return 'DirtField';
    case 32: case 33:
        return 'Desert';
    case 34:
        return 'Lava1';
    case 35:
        return 'Lava2';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    default:
        return null;
    }
};

Spriteset_BattleLMBS.prototype.terrainBattleback2Name = function(type) {
    switch (type) {
    case 20: case 21:
        return 'Forest';
    case 22: case 30: case 38:
        return 'Cliff';
    case 24: case 25: case 26: case 27:
        return 'Wasteland';
    case 32: case 33:
        return 'Desert';
    case 34: case 35:
        return 'Lava';
    case 40: case 41:
        return 'Snowfield';
    case 42:
        return 'Clouds';
    case 4: case 5:
        return 'PoisonSwamp';
    }
};

Spriteset_BattleLMBS.prototype.defaultBattleback1Name = function() {
    return 'Grassland';
};

Spriteset_BattleLMBS.prototype.defaultBattleback2Name = function() {
    return 'Grassland';
};

Spriteset_BattleLMBS.prototype.shipBattleback1Name = function() {
    return 'Ship';
};

Spriteset_BattleLMBS.prototype.shipBattleback2Name = function() {
    return 'Ship';
};

Spriteset_BattleLMBS.prototype.autotileType = function(z) {
    return $gameMap.autotileType($gamePlayer.x, $gamePlayer.y, z);
};