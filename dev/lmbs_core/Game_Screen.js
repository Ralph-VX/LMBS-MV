//-----------------------------------------------------------------------------
// Game_Screen
//
// The game object class for screen effect data, such as changes in color tone
// and flashes.

Kien.LMBS_Core.Game_Screen_clear = Game_Screen.prototype.clear;
Game_Screen.prototype.clear = function() {
    Kien.LMBS_Core.Game_Screen_clear.call(this);
    this.clearBattleCamera();
};

Game_Screen.prototype.clearBattleCamera = function() {
    // Members that should be take into the screen.
    this._screenMembers = [];
    // Members that instant camera will take.
    // erase each member after showing.
    this._instantZoomTarget = [];
    this._instantTimer = this.instantZoomLength();
    this.clearZoom();
}

Game_Screen.prototype.instantZoomLength = function() {
    return 30;
}

Kien.LMBS_Core.Game_Screen_update = Game_Screen.prototype.update;
Game_Screen.prototype.update = function() {
    Kien.LMBS_Core.Game_Screen_update.call(this);
    this.updateBattleCamera();
};

Game_Screen.prototype.updateBattleCamera = function() {
    if ($gameParty.inBattle()){
        if (this._instantZoomTarget.length > 0) {
            if (this._instantTimer > 0) {
                this._instantTimer--;
                var target = this._instantZoomTarget[0];
                this.zoomBattleCameraAt(target);
            } else {
                this._instantZoomTarget.shift();
                this._instantTimer = this.instantZoomLength();
            }
        } else {
            this.zoomBattleCameraAt(this._screenMembers);
        }
    }
}

Game_Screen.prototype.zoomBattleCameraAt = function(targets) {
    if (targets.length > 0){
        var left = Math.min.apply(null,targets.map(function(obj){
            return obj._battleX;
        })) - Kien.LMBS_Core.leftCameraMargin; 
        left = Math.max(0,left);
        var right = Math.max.apply(null,targets.map(function(obj){
            return obj._battleX + (obj.isOpaque() ? obj._battleRect.width : 0);
        })) + Kien.LMBS_Core.rightCameraMargin;
        right = Math.min(right,Kien.LMBS_Core.battleWidth);
        var width = right-left;
        var magnitude = Graphics.boxWidth / width;
        if (this._instantZoomTarget.length === 0){
            magnitude = Math.max(Math.min(magnitude,Kien.LMBS_Core.maxCameraZoom),Kien.LMBS_Core.minCameraZoom);
        }
        left = Math.min(left, Kien.LMBS_Core.battleWidth-(Graphics.boxWidth/magnitude));
        var y = Kien.LMBS_Core.battleY;
        this.setZoom(left,y,magnitude);
    } else {
        this.setZoom(0,0,1.0);
    }
}