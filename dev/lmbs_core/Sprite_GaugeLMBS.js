
//-----------------------------------------------------------------------------
// Sprite_GaugeLMBS
//
// The sprite for displaying configurable guages.

function Sprite_GaugeLMBS() {
    this.initialize.apply(this, arguments);
}
 
Sprite_GaugeLMBS.prototype = Object.create(Sprite.prototype);
Sprite_GaugeLMBS.prototype.constructor = Sprite_GaugeLMBS;

Sprite_GaugeLMBS.prototype.initialize = function(battler, width, height, propertyList, propertyMaxList, propertyIgnoreList, colorList) {
    Sprite.prototype.initialize.call(this);
    propertyList = propertyList || ['hp','mp','tp'];
    propertyMaxList = propertyMaxList || ['mhp','mmp','maxTp'];
    propertyIgnoreList = propertyIgnoreList || ['hpIgnoreAmount', 'mpIgnoreAmount', 'tpIgnoreAmount'];
    colorList = colorList || ['greenyellow','red','green','deepskyblue','red','skyblue','yellow','red','orange'];
    this.battler = battler;
    this._gaugeWidth = width;
    this._gaugeHeight = height;
    this._propertyList = propertyList;
    this._propertyMaxList = propertyMaxList;
    this._propertyIgnoreList = propertyIgnoreList;
    this._colorList = colorList;
    this._gaugeEdgeWidth = 2;
    this._created = false;
}

Sprite_GaugeLMBS.prototype.refresh = function() {
    this.initializeProperties();
    this.createBitmap();
    this._created = true;
}

Sprite_GaugeLMBS.prototype.initializeProperties = function() {
    this._current = [];
    this._max = [];
    this._diff = [];
    this._diffCount = [];
    this._diffDecCount = [];
    this._lastProperty = [];
    for (var i = 0; i < this._propertyList.length; i++) {
        this._current[i] = this.obtainProperty(this.battler, this._propertyList[i]);
        this._diff[i] = 0;
        this._diffCount[i] = 0;
        this._diffDecCount[i] = 0;
        this._max[i] = this.obtainProperty(this.battler, this._propertyMaxList[i]);
        this._lastProperty[i] = {c: -1, d: -1};
    }
}

Sprite_GaugeLMBS.prototype.obtainProperty = function(obj, name) {
    var ret = obj[name];
    if (typeof ret === 'function') {
        ret = ret();
    }
    return ret;
}

Sprite_GaugeLMBS.prototype.setProperty = function(obj, name, value) {
    if (obj[name] !== undefined) {
        obj[name] = value;
    }
}

Sprite_GaugeLMBS.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(this._gaugeWidth, this._gaugeHeight * this._current.length);
}

Sprite_GaugeLMBS.prototype.update = function() {
    Sprite.prototype.update.call(this);
    if (this._created) {
        this.updateProperty();
        this.updateBitmap();
    }
}

Sprite_GaugeLMBS.prototype.updateProperty = function() {
    for (var i = 0; i < this._current.length; i++) {
        var bc = this.obtainProperty(this.battler, this._propertyList[i]);
        var ignore = this.obtainProperty(this.battler, this._propertyIgnoreList[i]);
        if (bc - this._current[i] - ignore === 0) {
            this._current[i] = bc;
            this.setProperty(this.battler, this._propertyIgnoreList[i], 0);
        } else if (this._current[i] != bc) {
            this._diff[i] += this._current[i] - bc - ignore;
            this._current[i] = bc;
            this.setProperty(this.battler, this._propertyIgnoreList[i], 0);
            this._diffCount[i] = 30;
        }
        if (this._diffCount[i] > 0) {
            this._diffCount[i]--;
            if (this._diffCount[i] == 0) {
                this._diffDecCount[i] = 15;
            }
        } else {
            if (this._diff[i] != 0) {
                this._diff[i] -= this._diff[i] / this._diffDecCount[i];
                this._diffDecCount[i]--;
                if (this._diffDecCount[i] == 0) {
                    this._diff[i] = 0;
                }
            }
        }
    }
}

Sprite_GaugeLMBS.prototype.updateBitmap = function() {
    var gew = this._gaugeEdgeWidth;
    var gh = this._gaugeHeight;
    for (var i = 0; i < this._current.length; i++) {
        if (this._lastProperty[i].d != this._diff[i] || this._lastProperty[i].c != this._current[i]) {
            this._lastProperty[i].d = this._diff[i];
            this._lastProperty[i].c = this._current[i];
            var y = i * gh;
            this.bitmap.clearRect(0, y, this.bitmap.width, gh);
            this.bitmap.fillRect(0, y, this.bitmap.width, gh, "black");
            var gw = this._current[i] / this._max[i] * (this.bitmap.width-gew*2);
            this.bitmap.fillRect(gew, y+gew, gw, gh-gew*2, this._colorList[i*3]);
            var dw = this._diff[i] / this._max[i] * (this.bitmap.width-gew*2);
            this.bitmap.fillRect(gew+gw, y+gew, dw, gh-gew*2, this._diff[i] > 0 ? this._colorList[i*3+1] : this._colorList[i*3+2]);
            this.bitmap.checkDirty();
        }
    }
}
