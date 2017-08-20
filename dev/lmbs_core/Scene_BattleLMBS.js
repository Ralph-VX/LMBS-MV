//-----------------------------------------------------------------------------
// Scene_BattleLMBS
//
// The scene class of the battle screen.

function Scene_BattleLMBS() {
    this.initialize.apply(this, arguments);
}

Scene_BattleLMBS.prototype = Object.create(Scene_Base.prototype);
Scene_BattleLMBS.prototype.constructor = Scene_BattleLMBS;

Scene_BattleLMBS.prototype.initialize = function() {
    Scene_Base.prototype.initialize.call(this);
};

Scene_BattleLMBS.prototype.create = function() {
    Scene_Base.prototype.create.call(this);
    this._spriteset = new Spriteset_BattleLMBS();
    this.addChild(this._spriteset);
    this._turnCount = 0;
    this._defeatCount = Kien.LMBS_Core.battleEndWaitTime;
    this._inputData = {
        "lastDir": 0,
        "lastDirPast": 0,
        "jumpInputDur": 0
    };
    this._battleEnd = false;
    this.createHitCountSprite();
    this.createWindowLayer();
    this.createAllWindows();
    this.createRewardSprite();
    if (Kien.LMBS_Core.isTest()){
        this._testBitmap = new Bitmap(SceneManager._boxWidth,SceneManager._boxHeight);
        this._testSprite = new Sprite(this._testBitmap);
        this.addChild(this._testSprite);
    }
}

Scene_BattleLMBS.prototype.createAllWindows = function() {
    this.createHelpWindow();
    this.createStatusWindow();
    this.createMenuWindow();
    this.createSkillWindow();
    this.createItemWindow();
    this.createEnemyWindow();
    this.createMessageWindow();
};

Scene_BattleLMBS.prototype.createHelpWindow = function() {
    this._helpWindow = new Window_Help();
    this.addWindow(this._helpWindow);
    this._helpWindow.deactivate();
    this._helpWindow.hide();
};

Scene_BattleLMBS.prototype.createMessageWindow = function() {
    this._messageWindow = new Window_MessageLMBS();
    this._messageWindow.deactivate();
    this._messageWindow._goldWindow.deactivate();
    this.addWindow(this._messageWindow);
    this._messageWindow.subWindows().forEach(function(window) {
        this.addWindow(window);
    }, this);
    this._battleMessageWindows = [];
}

Scene_BattleLMBS.prototype.createStatusWindow = function() {
    this._statusWindow = new Window_BattleStatusLMBS();
    BattleManager.setStatusWindow(this._statusWindow);
    this._statusWindow.deactivate();
    this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelMenu.bind(this));
    this.addWindow(this._statusWindow);
};

Scene_BattleLMBS.prototype.createMenuWindow = function() {
    this._menuWindow = new Window_BattleCommandLMBS(0,0);
    this._menuWindow.x = (Graphics.boxWidth-this._menuWindow.width)/2
    this._menuWindow.y = (Graphics.boxHeight-this._menuWindow.height)/2
    this._menuWindow.setHandler('skill',  this.onMenuWindowSkill.bind(this));
    this._menuWindow.setHandler('item',  this.onMenuWindowItem.bind(this));
    this._menuWindow.setHandler('cancel', this.onMenuWindowCancel.bind(this));
    this._menuWindow.deactivate();
    this.addWindow(this._menuWindow);
};

Scene_BattleLMBS.prototype.createSkillWindow = function() {
    this._skillConfigWindow = new Window_SkillConfig(0,0);
    this._skillConfigWindow.y = this._helpWindow.height;
    this._skillConfigWindow.hide();
    this._skillConfigWindow.deactivate();
    this._skillConfigWindow.setHandler('skill',  this.onSkillConfigOk.bind(this));
    this._skillConfigWindow.setHandler('cancel', this.onSkillConfigCancel.bind(this));
    this.addWindow(this._skillConfigWindow);
    var wx = this._skillConfigWindow.width;
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth - wx;
    var wh = this._skillConfigWindow.height;
    this._skillStatusWindow = new Window_SkillStatus(wx, wy, ww, wh);
    this._skillStatusWindow.hide();
    this._skillStatusWindow.deactivate();
    this.addWindow(this._skillStatusWindow);
    this._skillTypeWindow = new Window_SkillType(0, wy);
    this._skillTypeWindow.hide();
    this._skillTypeWindow.deactivate();
    this._skillTypeWindow.height = wh;
    this._skillTypeWindow.setHandler('skill',    this.onSkillTypeOk.bind(this));
    this._skillTypeWindow.setHandler('cancel',    this.onSkillTypeCancel.bind(this));
    this.addWindow(this._skillTypeWindow);
    wx = 0;
    wy = this._skillStatusWindow.y + this._skillStatusWindow.height;
    ww = Graphics.boxWidth;
    wh = Graphics.boxHeight - wy - this._statusWindow.height;
    this._skillListWindow = new Window_SkillList(wx,wy,ww,wh);
    this._skillListWindow.y = this._skillConfigWindow.y+this._skillConfigWindow.height;
    this._skillListIncludeFuncSkill = this._skillListWindow.includes;
    this._skillListIncludeFuncConfig = function(item) {return !!item; };
    this._skillListEnableFuncSkill = this._skillListWindow.isEnabled;
    this._skillListEnableFuncConfig = function(item) {return true };
    this._skillListWindow.hide();
    this._skillListWindow.deactivate();
    this._skillListWindow.setHelpWindow(this._helpWindow);
    this._skillTypeWindow.setSkillWindow(this._skillListWindow);
    this.addWindow(this._skillListWindow);
};

Scene_BattleLMBS.prototype.createItemWindow = function() {
    var wy = this._helpWindow.y + this._helpWindow.height;
    var wh = this._statusWindow.y - wy;
    this._itemListWindow = new Window_BattleItem(0,wy,Graphics.boxWidth,wh);
    this._itemListWindow.setHandler('ok', this.onItemListOk.bind(this));
    this._itemListWindow.setHandler('cancel', this.onItemListCancel.bind(this));
    this._itemListWindow.setHelpWindow(this._helpWindow);
    this._itemListWindow.hide();
    this._itemListWindow.deactivate();
    this.addWindow(this._itemListWindow);
}

Scene_BattleLMBS.prototype.createEnemyWindow = function() {
    this._enemyWindow = new Window_BattleEnemy(0,0);
    this._enemyWindow.maxCols = function() {return 1};
    this._enemyWindow.setHandler('ok', this.onEnemyListOk.bind(this));
    this._enemyWindow.setHandler('cancel', this.onEnemyListCancel.bind(this));
    this.addWindow(this._enemyWindow);
}

Scene_BattleLMBS.prototype.createRewardSprite = function() {
    this._rewardSprite = new Sprite_BattleRewardLMBS();
    this._spriteset.addChild(this._rewardSprite);
}

Scene_BattleLMBS.prototype.createHitCountSprite = function() {
    this._hitCountSprite = new Sprite_HitCount();
    this._hitCountSprite.x = Graphics.width - (Sprite_HitCount.HIT_FONT_SIZE * 4 + 4);
    this._hitCountSprite.y = 40;
    this.addChild(this._hitCountSprite);
}

Scene_BattleLMBS.prototype.start = function() {
    Scene_Base.prototype.start.call(this);
    this.startFadeIn(this.fadeSpeed(), false);
    this._spriteset.onStart();
    BattleManager.playBattleBgm();
    BattleManager.startBattle();
    BattleManager._actorIndex = 0;
    this._statusWindow.open();
}

Scene_BattleLMBS.prototype.update = function() {
    if (Kien.LMBS_Core.isTest()){
        this._testBitmap.clear();
        this._testSprite.x = this._spriteset.x;
        this._testSprite.y = this._spriteset.y;
        this._testSprite.scale = this._spriteset.scale;
    }
    Scene_Base.prototype.update.call(this);
    if(this._battleEnd){
        this.updateBattleEnd();
    } else {
        if(BattleManager.updateEvent()){
            BattleManager._isEventRunning = true;
            if (BattleManager.isBattleEnd()) {
                this.startBattleEnd();
            }
        } else {
            BattleManager._isEventRunning = false;
        }
        this.updateTurn();
    }
    this.updateBattleMessage();
    this.updateInput();
    this.updateMain();
    this.updateCamera();
    this.updateInput();
}

Scene_BattleLMBS.prototype.updateCamera = function() {
    if (this._battleEnd){
        $gameScreen._screenMembers = [];
    } else {
        $gameScreen._screenMembers = [this.activeActor(), this.activeActor()._target];
        if (this.activeActor()._originalTarget) {
            $gameScreen._screenMembers.push(this.activeActor()._originalTarget);
        }
        if (this._enemyWindow.active) {
            if (!!this._enemyWindow.enemy()){
                $gameScreen._screenMembers.push(this._enemyWindow.enemy());
            }
        }
        if (this._statusWindow.active) {
            if (!!this._statusWindow.actor()){
                $gameScreen._screenMembers.push(this._statusWindow.actor());
            }
        }
        if ($gameParty.isAllDead()){
            $gameScreen._screenMembers = $gameParty.members().concat($gameTroop.members());
        }
    }
}

Scene_BattleLMBS.prototype.updateMain = function() {
    if (!this.isBattlePaused()){
        $gameParty.update();
        $gameTroop.update();
    }
    $gameScreen.update();
}

Scene_BattleLMBS.prototype.activeActor = function() {
    return BattleManager.actor();
}

Scene_BattleLMBS.prototype.updateBattleMessage = function() {
    var length = $gameTemp.getBattleMessageLength();
    for (var channel = 0; channel < length; channel++) {
        if (!$gameTemp.getBattleMessage(channel) && this._battleMessageWindows[channel]) {
            this._windowLayer.removeChild(this._battleMessageWindows[channel]);
            delete this._battleMessageWindows[channel];
        } else if ($gameTemp.getBattleMessage(channel)) {
            if (this._battleMessageWindows[channel]) {
                if (this._battleMessageWindows[channel]._text == $gameTemp.getBattleMessage(channel)) {
                    continue;
                } else {
                    this._windowLayer.removeChild(this._battleMessageWindows[channel]);
                    delete this._battleMessageWindows[channel];
                }
            }
            this._battleMessageWindows[channel] = new Window_BattleMessage(channel, $gameTemp.getBattleMessage(channel));
            this.addWindow(this._battleMessageWindows[channel]);
        }
    }
}

Scene_BattleLMBS.prototype.updateInput = function() {
    this.updateInputMenu();
}

Scene_BattleLMBS.prototype.updateInputMenu = function() {
    if (Input.isTriggered('shift')){
        this._menuWindow.open();
        this._menuWindow.activate();
    }
}

// Is player controllable. return false when menus are opened.
Scene_BattleLMBS.prototype.isMovable = function() {
    return !this.isBattlePaused();
}

Scene_BattleLMBS.prototype.isBattlePaused = function() {
    return this.isAnyInputWindowActive();
}

Scene_BattleLMBS.prototype.isAnyInputWindowActive = function() {

    return (this._windowLayer && (this._windowLayer.children.filter(function(w) {
        return w.active;
    }.bind(this)).length > 0)) || (this._messageWindow && (this._messageWindow.isOpen() && $gameSystem._LMBSBattleEventPauseGame));
};

Scene_BattleLMBS.prototype.startBattleEnd = function() {
    this._battleEnd = true;
    $gameParty.aliveMembers().forEach(function(actor){
        actor.endMotion();
    })
    $gameTroop.aliveMembers().forEach(function(actor){
        actor.endMotion();
    })
    if(!$gameParty.isAllDead()){
        // Victory!
        $gameParty.aliveMembers().forEach(function(actor){
            //actor._target = actor;
            actor.performVictorySkill();
        });
        this._rewardSprite.start();
        BattleManager.gainRewards();
    }
}

Scene_BattleLMBS.prototype.updateTurn = function() {
    if (!this.isBattlePaused()){
        this._turnCount++;
    }
    if (this._turnCount >= Kien.LMBS_Core.turnLength) {
        this._turnCount = 0;
        $gameParty.members().forEach(function(actor) {
            actor.onTurnEnd();
        })
        $gameTroop.members().forEach(function(enemy) {
            enemy.onTurnEnd();
        });
    }
}

Scene_BattleLMBS.prototype.updateBattleEnd = function() {
    if (!BattleManager.isBattleEnd()){
        return;
    }
    if ($gameParty.isAllDead()){
        if (this._defeatCount > 0){
            this._defeatCount--;
            return;
        }
        BattleManager.updateBattleEnd();
    } else if (this._rewardSprite.isFinish() && $gameParty.aliveMembers().filter(function(actor){
        actor.isMotion();
    }).length == 0 ){
        BattleManager.updateBattleEnd()
    }
}

Scene_BattleLMBS.prototype.stop = function() {
    Scene_Base.prototype.stop.call(this);
    if (this.needsSlowFadeOut()) {
        this.startFadeOut(this.slowFadeSpeed(), false);
    } else {
        this.startFadeOut(this.fadeSpeed(), false);
    }
    this._statusWindow.close();
};


Scene_BattleLMBS.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);
    $gameParty.onBattleEnd();
    $gameTroop.onBattleEnd();
    AudioManager.stopMe();
    $gameScreen.clearBattleCamera();
    $gameTemp.clearBattleMessage();
};

Scene_BattleLMBS.prototype.needsSlowFadeOut = function() {
    return (SceneManager.isNextScene(Scene_Title) ||
            SceneManager.isNextScene(Scene_Gameover));
};

// Window Handlers
// Main Menu
Scene_BattleLMBS.prototype.onMenuWindowCancel = function() {
    this._menuWindow.close();
}

Scene_BattleLMBS.prototype.onMenuWindowSkill = function() {
    this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkill.bind(this));
    this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelMenu.bind(this));
    this._statusWindow.selectLast();
    this._statusWindow.activate();
}

Scene_BattleLMBS.prototype.onMenuWindowItem = function() {
    this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkItem.bind(this));
    this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelMenu.bind(this));
    this._statusWindow.selectLast();
    this._statusWindow.activate();
}

// Status Window
Scene_BattleLMBS.prototype.onStatusOkSkill = function() {
    var index = this._statusWindow.index();
    var actor = $gameParty.battleMembers()[index];
    $gameParty._lastBattleActorIndexLMBS = index;
    this._helpWindow.show();
    this._skillStatusWindow.show();
    this._skillListWindow.show();
    if (actor == this.activeActor()){
        this._skillConfigWindow.setActor(actor);
        this._skillListWindow.includes = this._skillListIncludeFuncConfig;
        this._skillListWindow.isEnabled = this._skillListEnableFuncConfig;
        this._skillListWindow.setActor(actor);
        this._skillStatusWindow.setActor(actor);
        this._skillConfigWindow.show();
        this._skillConfigWindow.activate();
    } else {
        this._skillTypeWindow.setActor(actor);
        this._skillListWindow.includes = this._skillListIncludeFuncSkill;
        this._skillListWindow.isEnabled = this._skillListEnableFuncSkill;
        this._skillListWindow.setActor(actor);
        this._skillTypeWindow.show();
        this._skillTypeWindow.activate();
        this._skillStatusWindow.setActor(actor);
    }
}

Scene_BattleLMBS.prototype.onStatusOkItem = function() {
    $gameParty._lastBattleActorIndexLMBS = this._statusWindow.index();
    this._helpWindow.show();
    this._itemListWindow.refresh();
    this._itemListWindow.show();
    this._itemListWindow.activate();
}

Scene_BattleLMBS.prototype.onStatusCancelMenu = function() {
    this._menuWindow.activate();
    this._statusWindow.deselect();
}

Scene_BattleLMBS.prototype.onStatusCancelSkillTarget = function() {
    this._helpWindow.show();
    this._skillStatusWindow.show();
    this._skillListWindow.show();
    this._skillTypeWindow.show();
    this._skillListWindow.activate();
}

Scene_BattleLMBS.prototype.onStatusCancelItemTarget = function() {
    this._helpWindow.show();
    this._itemListWindow.show();
}

Scene_BattleLMBS.prototype.onStatusOkSkillTarget = function() {
    var object = null;
    switch(this._menuWindow.currentSymbol()){
        case 'skill':
            object = this._skillListWindow.item();
            break;
        case 'item':
            object = this._itemListWindow.item();
            break;
    }
    if (!!object) {
        var index = $gameParty._lastBattleActorIndexLMBS;
        var actor = $gameParty.battleMembers()[index];
        actor.forceActionLMBS(object, this._statusWindow.actor());
    }
    this._menuWindow.openness = 0;
    this._statusWindow.deselect();
}

// Skill Config Window
Scene_BattleLMBS.prototype.onSkillConfigCancel = function() {
    this._skillConfigWindow.hide();
    this._skillListWindow.hide();
    this._helpWindow.hide();
    this._skillStatusWindow.hide();
    this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkill.bind(this));
    this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelMenu.bind(this));
    this._statusWindow.activate();
}

Scene_BattleLMBS.prototype.onSkillConfigOk = function() {
    this.changeSkillListHandlerConfig();
    this._skillListWindow.activate();
    this._skillListWindow.selectLast();
}

//Skill List Window
Scene_BattleLMBS.prototype.onSkillListOkConfig = function() {
    this._skillListWindow._actor.setLastMenuSkill(this._skillListWindow.item());
    var ext = this._skillConfigWindow.currentExt();
    if (ext){
        this._skillListWindow._actor._skillSets[ext] = this._skillListWindow.item().id;
        if (Kien.LMBS_Core.skillSetRightLeft && ext === "4"){
            this._skillListWindow._actor._skillSets["6"] = this._skillListWindow.item().id;
        }
        this._skillConfigWindow.refresh();
    }
    this.onSkillListCancelConfig();
}

Scene_BattleLMBS.prototype.onSkillListCancelConfig = function() {
    this._skillListWindow.deselect();
    this._skillConfigWindow.activate();
}

Scene_BattleLMBS.prototype.onSkillListOkSkill = function() {
    var item = this._skillListWindow.item();
    if (!!item) {
        this._skillListWindow.hide();
        this._skillTypeWindow.hide();
        this._helpWindow.hide();
        this._skillStatusWindow.hide();
        var index = $gameParty._lastBattleActorIndexLMBS;
        var actor = $gameParty.battleMembers()[index];
        var action = new Game_Action(actor);
        action.setSkill(item.id);
        if(action.isForUser()){
            this._statusWindow.select(actor.index());
            this._statusWindow.setCursorFixed(true);
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelSkillTarget.bind(this));
        } else if (action.isForDeadFriend()){
            this._statusWindow.setCursorFixed(false);
            this._statusWindow.activate();
            this._statusWindow.selectLast();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelSkillTarget.bind(this));
        } else if (action.isForFriend()) {
            this._statusWindow.setCursorFixed(false);
            this._statusWindow.activate();
            this._statusWindow.selectLast();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelSkillTarget.bind(this));
        } else {
            this._enemyWindow.refresh();
            this._enemyWindow.select(0);
            this._enemyWindow.activate();
        }
    }
}

Scene_BattleLMBS.prototype.onSkillListCancelSkill = function() {
    this._skillListWindow.deselect();
    this._skillTypeWindow.activate();
}

Scene_BattleLMBS.prototype.changeSkillListHandlerConfig = function() {
    this._skillListWindow.setHandler('ok',Scene_BattleLMBS.prototype.onSkillListOkConfig.bind(this));
    this._skillListWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onSkillListCancelConfig.bind(this));
}

Scene_BattleLMBS.prototype.changeSkillListHandlerSkill = function() {
    this._skillListWindow.setHandler('ok',Scene_BattleLMBS.prototype.onSkillListOkSkill.bind(this));
    this._skillListWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onSkillListCancelSkill.bind(this));
}

// Skill Type
Scene_BattleLMBS.prototype.onSkillTypeOk = function() {
    this.changeSkillListHandlerSkill();
    this._skillListWindow.activate();
    this._skillListWindow.selectLast();
}

Scene_BattleLMBS.prototype.onSkillTypeCancel = function() {
    this._skillTypeWindow.hide();
    this._skillListWindow.hide();
    this._helpWindow.hide();
    this._skillStatusWindow.hide();
    this._statusWindow.activate();
}

// Item List
Scene_BattleLMBS.prototype.onItemListOk = function() {
    var item = this._itemListWindow.item();
    if (!!item) {
        this._itemListWindow.hide();
        this._helpWindow.hide();
        var index = $gameParty._lastBattleActorIndexLMBS;
        var actor = $gameParty.battleMembers()[index];
        var action = new Game_Action(actor);
        action.setItem(item.id);
        if(action.isForUser()){
            this._statusWindow.select(this._itemListWindow._actor.index());
            this._statusWindow.setCursorFixed(true);
            this._statusWindow.activate();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelItemTarget.bind(this));
        } else if (action.isForDeadFriend()){
            this._statusWindow.setCursorFixed(false);
            this._statusWindow.activate();
            this._statusWindow.selectLast();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelItemTarget.bind(this));
        } else if (action.isForFriend()) {
            this._statusWindow.setCursorFixed(false);
            this._statusWindow.activate();
            this._statusWindow.selectLast();
            this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkSkillTarget.bind(this));
            this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelItemTarget.bind(this));
        } else {
            this._enemyWindow.refresh();
            this._enemyWindow.select(0);
            this._enemyWindow.activate();
        }
    }
}

Scene_BattleLMBS.prototype.onItemListCancel = function() {
    this._helpWindow.hide();
    this._itemListWindow.hide();
    this._statusWindow.setHandler('ok',Scene_BattleLMBS.prototype.onStatusOkItem.bind(this));
    this._statusWindow.setHandler('cancel',Scene_BattleLMBS.prototype.onStatusCancelMenu.bind(this));
    this._statusWindow.activate();
}

// Enemy List
Scene_BattleLMBS.prototype.onEnemyListOk = function() {
    var object = null;
    switch(this._menuWindow.currentSymbol()){
        case 'skill':
            object = this._skillListWindow.item();
            break;
        case 'item':
            object = this._itemListWindow.item();
            break;
    }
    if (!!object) {
        var index = $gameParty._lastBattleActorIndexLMBS;
        var actor = $gameParty.battleMembers()[index];
        actor.forceActionLMBS(object, this._enemyWindow.enemy());
    }
    this._menuWindow.openness = 0;
    this._statusWindow.deselect();
}

Scene_BattleLMBS.prototype.onEnemyListCancel = function() {
    switch(this._menuWindow.currentSymbol()){
        case 'skill':
            this._helpWindow.show();
            this._skillStatusWindow.show();
            this._skillListWindow.show();
            this._skillTypeWindow.show();
            this._skillListWindow.activate();
            break;
        case 'item':
            this._helpWindow.sho();
            this._itemListWindow.show();
            break;
    }
}