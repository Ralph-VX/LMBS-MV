//-----------------------------------------------------------------------------
// Window_MessageLMBS
//
// The window for displaying text messages.

function Window_MessageLMBS() {
    this.initialize.apply(this, arguments);
}

Window_MessageLMBS.prototype = Object.create(Window_Message.prototype);
Window_MessageLMBS.prototype.constructor = Window_MessageLMBS;

Window_MessageLMBS.prototype.initialize = function() {
    Window_Message.prototype.initialize.call(this);
    this._lastBattleEventPause = null;
    this._autoMessageSkippingDuration = 120;
    this._isInputStarted = false;
};

Window_MessageLMBS.prototype.update = function() {
    this.checkToNotClose();
    Window_Base.prototype.update.call(this);
    while (!this.isOpening() && !this.isClosing()) {
        if (this.updateWait()) {
            return;
        } else if (this._isInputStarted){
            this._startInput.call(this);
            this._isInputStarted = false;
            return;
        } else if (this.updateLoading()) {
            return;
        } else if (this.updateInput()) {
            return;
        } else if (this.updateMessage()) {
            return;
        } else if (this.canStart()) {
            this.startMessage();
        } else {
            this.startInput();
            return;
        }
    }
};

Window_MessageLMBS.prototype._startInput = Window_Message.prototype.startInput;

Window_MessageLMBS.prototype.updateInput = function() {
    if (!$gameSystem._LMBSBattleEventPauseGame) {
        if (this.pause) {
            if (this._autoMessageSkippingDuration <= 0) {
                this.pause = false;
                this._autoMessageSkippingDuration = 120;
                if (!this._textState) {
                    this.terminateMessage();
                }
            } else {
                this._autoMessageSkippingDuration--;
            }
            return true;
        }
        return false;
    } else {
        return Window_Message.prototype.updateInput.call(this);
    }
};

Window_MessageLMBS.prototype.startInput = function() {
    var ret = false;
    if ($gameMessage.isChoice()) {
        ret = true;
    } else if ($gameMessage.isNumberInput()) {
        ret = true;
    } else if ($gameMessage.isItemChoice()) {
        ret = true;
    } else {
        ret = false;
    }
    if (ret) {
        this._lastBattleEventPause = $gameSystem._LMBSBattleEventPauseGame;
        $gameSystem._LMBSBattleEventPauseGame = true;
        this._isInputStarted = true;
        this.startWait(30);
    }
    return ret;
};

Window_MessageLMBS.prototype.terminateMessage = function() {
    Window_Message.prototype.terminateMessage.call(this);
    if (!!this._lastBattleEventPause) {
        $gameSystem._LMBSBattleEventPauseGame = this._lastBattleEventPause;
        this._lastBattleEventPause = null;
    }
};