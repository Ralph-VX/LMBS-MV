//=============================================================================
// Kien Library
// KienLib.js
// Version: 1.00
//=============================================================================
var Imported = Imported || {};
Imported.Kien_Lib = true;

var Kien = Kien || {};
Kien.lib = {};


Kien.lib.pluginCommands = {};

Kien.lib.addPluginCommand = function(command, func) {
    Kien.lib.pluginCommands[command] = func;
}

Kien.lib.addPluginCommands = function(obj) {
    for (var name in obj) {
        Kien.lib.pluginCommands[name] = obj[name];
    }
}

// Script
Game_Interpreter.prototype.command355 = function() {
    var script = this.currentCommand().parameters[0] + '\n';
    while (this.nextEventCode() === 655 || this.nextEventCode() === 355) {
        this._index++;
        script += this.currentCommand().parameters[0] + '\n';
    }
    eval(script);
    return true;
};

Kien.lib.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    var func = Kien.lib.pluginCommands[command];
    if (!!func) {
        func.call(this, args);
    } else {
        Kien.lib.Game_Interpreter_pluginCommand.call(this, command, args);
    }
};

//-----------------------------------------------------------------------------
// Rectangle
//
// Define a utility Function.
if (!Rectangle.prototype.cx) {

    Object.defineProperty(Rectangle.prototype, 'left', {
        get: function() {
            return this.x;
        },
        set: function(value) {
            var dx = value - this.x;
            if (dx <= this.width) {
                this.x += dx;
                this.width -= dx;
            } else {
                this.x = this.width;
                this.width = dx - this.width;
            }
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'right', {
        get: function() {
            return this.x + this.width;
        },
        set: function() {
            var dx = value - this.x+this.width;
            if (value >= this.x) {
                this.width += dx;
            } else {
                var lx = this.x;
                this.x += value;
                this.width = lx - this.x;
            }
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'top', {
        get: function() {
            return this.y;
        },
        set: function(value) {
            var dy = value - this.y;
            if (dy <= this.height) {
                this.y += dy;
                this.height -= dy;
            } else {
                this.y = this.height;
                this.height = dy - this.height;
            }
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'bottom', {
        get: function() {
            return this.y + this.height;
        },
        set: function() {
            var dy = value - this.y+this.width;
            if (value >= this.y) {
                this.width += dy;
            } else {
                var ly = this.y;
                this.y += value;
                this.width = ly - this.y;
            }
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'cx', {
        get: function() {
            return this.x + this.width/2;
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'cy', {
        get: function() {
            return this.y + this.height/2;
        },
        configurable: true
    });

    Object.defineProperty(Rectangle.prototype, 'radius', {
        get: function() {
            return Math.sqrt(Math.pow(this.cx-this.x,2) + Math.pow(this.cy-this.y,2));
        },
        configurable: true
    })

    Rectangle.prototype.side = function(direction) {
        switch(direction) {
            case 2:
                return [new Point(this.left, this.bottom), new Point(this.right, this.bottom)];
            case 4:
                return [new Point(this.left, this.top), new Point(this.left, this.bottom)];
            case 6:
                return [new Point(this.right, this.top), new Point(this.right, this.bottom)];
            case 8:
                return [new Point(this.left, this.top), new Point(this.right, this.top)];
        }
        return [new Point(this.cx, this.cy)];
    }

    Rectangle.prototype.overlap = function(other) {
        return this.x > (other.left - this.width) && this.x < (other.right) && this.y > (other.top - this.height) && this.y < other.bottom;
    };

    Rectangle.prototype.clone = function() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    Rectangle.fromString = function(string) {
        var arr = string.split(',');
        try {
            return new Rectangle(parseFloat(arr[0]),parseFloat(arr[1]),parseFloat(arr[2]),parseFloat(arr[3]));
        } catch (e) {
            return null;
        }
    }
}


//-----------------------------------------------------------------------------
// Range
//
// Represents a range of values.

Kien.Range = function(a, b) {
    this.a = a || 0;
    this.b = b || 0;
}

Kien.Range.prototype.include = function(v) {
    return v > this.a && v < this.b;
}

Kien.Range.prototype.overlap = function(other) {
    return this.b > other.a && this.a < other.b;
}

Kien.Range.prototype.overlapAmount = function(other) {
    if (this.overlap(other)) {
        if (this.b > other.a) {
            return this.b - other.a;
        } else if (this.a < other.b) {
            return other.b - this.a;
        }
    }
    return 0;
}

Kien.Range.prototype.overlapRange = function(other) {
    if (this.overlap(other)) {
        return new Kien.Range(Math.max(this.a, other.a), Math.min(this.b, other.b));
    } else {
        return null;
    }
}

Kien.Range.prototype.movingOverlapRange = function(other, move) {
    var st = 0;
    var ed = 1;
    if (move == 0) {
        if (this.overlap(other)) {
            return new Kien.Range(0, 1)
        } else {
            return null;
        }
    } else if (move > 0) {
        if (this.overlap(other)) {
            st = 0;
            ed = (other.b - this.a) / move;
        } else if (this.b <= other.a) {
            st = (other.a - this.b) / move;
            ed = (other.b - this.a) / move;
        } else {
            return null;
        }
    } else {
        if (this.overlap(other)) {
            st = 0;
            ed = (other.a - this.b) / move;
        } else if (this.a >= other.b) {
            st = (other.b - this.a) / move;
            ed = (other.a - this.b) / move;
        } else {
            return null;
        }
    }
    return new Kien.Range(st, ed);
}

Kien.Range.prototype.moveRange = function(d) {
    this.a += d;
    this.b += d;
    return this;
}

//-----------------------------------------------------------------------------
// Vector2D
//
// A vector object in 2d space.

if (!Kien.Vector2D) {
    Kien.Vector2D = function () {
        this.initialize.apply(this, arguments);
    }

    Kien.Vector2D.prototype.initialize = function(x,y) {
        if (x !== undefined && y === undefined) {
            this._x = x.x;
            this._y = x.y;
        } else {
            this._x = x || 0;
            this._y = y || 0;
        }
    }

    Object.defineProperty(Kien.Vector2D.prototype, 'x', {
        get: function() {return this._x;},
        set: function(v) {this._x = v;},
        configurable: true
    });

    Object.defineProperty(Kien.Vector2D.prototype, 'y', {
        get: function() {return this._y;},
        set: function(v) {this._y = v;},
        configurable: true
    });

    Object.defineProperty(Kien.Vector2D.prototype, 'magnitude', {
        get: function() {return this._magnitude()},
        set: function(value) {this.setMagnitude(value)},
        configurable: true
    });

    Kien.Vector2D.prototype.clone = function() {
        var n = new Kien.Vector2D();
        n.x = this._x;
        n.y = this._y;
        return n;
    }

    Kien.Vector2D.prototype.copy = function(other) {
        this.x = other.x;
        this.y = other.y;
    }

    Kien.Vector2D.prototype._magnitude = function() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    Kien.Vector2D.prototype.applyMagnitude = function(mag) {
        this.x *= mag;
        this.y *= mag;
        return this;
    }

    Kien.Vector2D.prototype.dot = function(other) {
        return this.x*other.x + this.y*other.y;
    }

    Kien.Vector2D.prototype.clockwise = function(other) {
        return this.y*other.x > this.x*other.y ? -1 : 1;
    }

    Kien.Vector2D.prototype.crossProduct = function() {
        var vec = this.clone();
        vec.x = this.y;
        vec.y = -this.x;
        return vec;
    }

    Kien.Vector2D.prototype.angleBetween = function(other) {
        if (this.magnitude === 0 || other.magnitude === 0) {
            return 0;
        }

        var val = this.dot(other) / (this.magnitude * other.magnitude);
        return Math.acos(Math.max(Math.min(1, val), -1));
    }

    Kien.Vector2D.prototype.setMagnitude = function(mag) {
        if (this.magnitude != 0) {
            return this.applyMagnitude(1/this.magnitude).applyMagnitude(mag);
        } else {
            return this;
        }
    }

    Kien.Vector2D.prototype.unit = function() {
        if (this.magnitude !== 0) {
            return this.clone().applyMagnitude(1/this.magnitude);
        } else {
            return this.clone();
        }
    }

    Kien.Vector2D.prototype.set = function(x,y) {
        this.x = x;
        this.y = y;
        return this;
    }

    Kien.Vector2D.prototype.translate = function(x, y) {
        this.x += x;
        this.y += y;
        return this;
    }
    Kien.Vector2D.prototype.translatePoint = function(point) {
        point.x += this.x;
        point.y += this.y;
        return point;
    }

    Kien.Vector2D.prototype.setAngle = function(angle) {
        var mag = this.magnitude;
        this.x = Math.cos(angle);
        this.y = Math.sin(angle);
        return this.setMagnitude(mag);
    }

    Kien.Vector2D.prototype.turn = function(angle, dir) {
        var mag = this.magnitude
        var c = Math.cos(angle);
        var s = Math.sin(angle) * (!!dir ?  dir : 1);
        var x = this.x;
        var y = this.y;
        this.x = Math.roundAt(c * x - s * y, 5);
        this.y = Math.roundAt(s * x + c * y, 5);
        this.setMagnitude(mag);
        return this;
    }

    Kien.Vector2D.prototype.subtract = function(other) {
        return new Kien.Vector2D(this.x - other.x, this.y - other.y);
    }

    Kien.Vector2D.prototype.add = function(other) {
        return new Kien.Vector2D(this.x + other.x, this.y + other.y);
    }

    Kien.Vector2D.prototype.turnTo = function(other) {
        var mag = this.magnitude;
        var tu = this.unit();
        var ou = other.unit();
        var c = tu.dot(other);
        var s = tu.x*ou.y - ou.x*tu.y;
        var x = this.x;
        var y = this.y;
        this.x = Math.roundAt(c * x - s * y, 5);
        this.y = Math.roundAt(s * x + c * y, 5);
        return this;
    }

    Kien.Vector2D.prototype.getMainDirection = function() {
        if (Math.abs(this.x) > Math.abs(this.y)) {
            return this.x > 0 ? 6 : 4;
        } else {
            return this.y > 0 ? 2 : 8;
        }
    }

    Kien.Vector2D.getDisplacementVector = function(w,x,y,z) {
        if (y === undefined && z === undefined) {
            z = x.x;
            y = x.y;
            x = w.y;
            w = w.x;
        }
        return (new Kien.Vector2D(y-w, z-x));
    }
    
    Kien.Vector2D.getDirectionVector = function(w,x,y,z) {
        return this.getDisplacementVector(w,x,y,z).unit();
    }

    Kien.Vector2D.getVectorFromDirection = function(d) {
        return new Kien.Vector2D(d === 4 ? -1 : d === 6 ? 1 : 0, d === 2 ? 1 : d === 8 ? -1 : 0);
    }

    Kien.Vector2D.getVectorFrom2Direction = function(horz, vert) {
        return new Kien.Vector2D(horz === 4 ? -1 : horz === 6 ? 1 : 0, vert === 2 ? 1 : vert === 8 ? -1 : 0);
    }
    

    Kien.Vector2D.xUnitVector = new Kien.Vector2D(1,0);
    Kien.Vector2D.yUnitVector = new Kien.Vector2D(0,1);


}


Kien.MovingRectangle = function() {
    this.initialize.apply(this, arguments);
}

Kien.MovingRectangle.prototype = Object.create(Rectangle.prototype);
Kien.MovingRectangle.prototype.constructor = Kien.MovingRectangle;

Kien.MovingRectangle.prototype.initialize = function(x,y,width,height) {
    Rectangle.prototype.initialize.apply(this, arguments);
    this._vec = new Kien.Vector2D(0, 0);
    this._rotation = 0;
    this._rotationMatrix = new PIXI.Matrix();
    this.anchor = new Point(0,0);
    this._displacementSubjects = {
        'x' : 0,
        'y' : 0,
        'ax' : 0,
        'ay' : 0,
        'rotation' : 0
    };
    this.calculateRotationMatrix();
}

Object.defineProperty(Kien.MovingRectangle.prototype, "vector", {
    get : function() { return this._vec; },
    set : function(value) { this._vec = value; },
    configurable : true
});

Object.defineProperty(Kien.MovingRectangle.prototype, 'rotation', {
    get : function() { return this._rotation; },
    set : function(value) { this._rotation = value; this.calculateRotationMatrix(); },
    configurable : true
})

Object.defineProperty(Kien.MovingRectangle.prototype, 'ul', {
    get: function() {
        this.calculateMatrixDisplacement();
        return this._rotationMatrix.apply({'x' : 0, 'y' : 0}, new Kien.Vector2D(0,0));
    },
    configurable: true
})

Object.defineProperty(Kien.MovingRectangle.prototype, 'ur', {
    get: function() {
        this.calculateMatrixDisplacement();
        return this._rotationMatrix.apply({'x' : this.width, 'y' : 0}, new Kien.Vector2D(0,0));
    },
    configurable: true
})

Object.defineProperty(Kien.MovingRectangle.prototype, 'bl', {
    get: function() {
        this.calculateMatrixDisplacement();
        return this._rotationMatrix.apply({'x' : 0, 'y' : this.height}, new Kien.Vector2D(0,0));
    },
    configurable: true
})

Object.defineProperty(Kien.MovingRectangle.prototype, 'br', {
    get: function() {
        this.calculateMatrixDisplacement();
        return this._rotationMatrix.apply({'x' : this.width, 'y' : this.height}, new Kien.Vector2D(0,0));
    },
    configurable: true
})

Kien.MovingRectangle.prototype.translate = function(x,y) {
    if (!y) {
        y = x.y;
        x = x.x;
    }
    this.x += x;
    this.y += y;
    return this;
}

Kien.MovingRectangle.prototype.calculateRotationMatrix = function() {
    this._rotationMatrix.a = Math.cos(this._rotation);
    this._rotationMatrix.b = Math.sin(this._rotation);
    this._rotationMatrix.c = -Math.sin(this._rotation); // cos, added PI/2
    this._rotationMatrix.d = Math.cos(this._rotation); // sin, added PI/2
    this.calculateMatrixDisplacement();
}

Kien.MovingRectangle.prototype.calculateMatrixDisplacement = function() {
    if (    this._displacementSubjects.x != this.x ||
            this._displacementSubjects.y != this.y ||
            this._displacementSubjects.ax != this.anchor.x ||
            this._displacementSubjects.ay != this.anchor.y || 
            this._displacementSubjects.rotation != this._rotation) {
        this._rotationMatrix.tx = this.x - (this.anchor.x * this._rotationMatrix.a * this.width + this.anchor.y * this._rotationMatrix.c * this.height);
        this._rotationMatrix.ty = this.y - (this.anchor.x * this._rotationMatrix.b * this.width + this.anchor.y * this._rotationMatrix.d * this.height);
        this._displacementSubjects = {
            'x' : this.x,
            'y' : this.y,
            'ax' : this.anchor.x,
            'ay' : this.anchor.y,
            'rotation' : this._rotation
        };
    }
}

Kien.MovingRectangle.prototype.clone = function() {
    var obj = new Kien.MovingRectangle(this.x, this.y, this.width, this.height);
    obj.vector = this.vector.clone();
    return obj;
}

Kien.MovingRectangle.prototype.copy = function(other) {
    var obj = Rectangle.prototype.copy.call(this, other);
    if (other.vector) {
        this.vector = other.vector.clone();
    }
    return obj;
}

// Overlap Non Rotation
Kien.MovingRectangle.prototype._oldoverlap = function(other) {
    var tvec = this.vector || (new Kien.Vector2D(0, 0));
    var ovec = other.vector || (new Kien.Vector2D(0, 0));
    var lb = other.clone();
    var rv = tvec.subtract(ovec);
    lb.left -= this.width;
    lb.top -= this.height;
    if (this.x > lb.left && this.x < lb.right) {
        if (this.y > lb.top && this.y < lb.bottom) {
            return true;
        }
    }
    if (rv.x != 0) {

        var xSide = rv.x > 0 ? lb.left : lb.right;
        var t = (xSide - this.x) / rv.x;
        if (t >= 0 && t < 1) {
            var yd = this.y + rv.y * t;
            if (yd >= lb.top && yd < lb.bottom) {
                return true;
            }
        }
    }

    if (rv.y != 0) {
        var ySide = rv.y > 0 ? lb.top : lb.bottom;
        var t = (ySide - this.y) / rv.y;
        if (t >= 0 && t < 1) {
            var xd = this.x + rv.x * t;
            if (xd >= lb.left && xd < lb.right) {
                return true;
            }
        }
    }

    return false;
}

Kien.MovingRectangle.prototype.getAllAxes = function(){
    var ret = [this.ul.subtract(this.ur)];
    ret[1] = ret[0].crossProduct();
    return ret;
}

Kien.MovingRectangle.prototype.getProjection = function(axis) {
    var vert = this.getAllVertices();
    var max = axis.dot(vert[0]);
    var min = max;
    for (var i = 1; i < vert.length; i++) {
        var v = axis.dot(vert[i]);
        if (v < min) {
            min = v;
        } else if (v > max) {
            max = v
        }
    }
    return new Kien.Range(min, max);
}

Kien.MovingRectangle.prototype.getAllVertices = function() {
    return [this.ul, this.ur, this.br, this.bl]
}

Kien.MovingRectangle.prototype.getMaxNonCollideVector = function(other) {
    return this.checkSATCollide(other).minVec;
}

Kien.MovingRectangle.prototype.overlap = function(other) {
    return this.checkSATCollide(other).collide;
}


/* return value:
    {
    'collide' : boolean, is collided or not,
    'minVec' : Kien.Vector2D, minimum vector that avoid collision,
    'axis' : Kien.Vector2D, axis vector that object is collided, if exists,
    'overlap' : float, amount of projected overlap in provided axis, if exists
    }
*/
Kien.MovingRectangle.prototype.checkSATCollide = function(other) {
    var axes1 = this.getAllAxes();
    var axes2 = other.getAllAxes();
    var vec = this.vector.clone();
    var trange = new Kien.Range(0, 1);
    var ret = {
        'collide' : false,
        'minVec' : this.vector.clone(),
        'axis' : null,
        'overlap' : Infinity
    }
    var axeoverps = [];
    if (other.vector){
        vec.subtract(other.vector);
    }
    for (var ai = 0; ai < axes1.length; ai++) {
        var axis = axes1[ai];
        var r1 = this.getProjection(axis);
        var r2 = other.getProjection(axis);
        var v1 = axis.dot(vec);
        axeoverps.push([r1,r2,v1]);
        var tr = r1.movingOverlapRange(r2, v1);
        if (tr == null) {
            ret.axis = null;
            return ret;
        } else {
            trange = trange.overlapRange(tr);
            if (trange == null) {
                ret.axis = null;
                return ret;
            }
        }
    }
    for (var ai = 0; ai < axes2.length; ai++) {
        var axis = axes2[ai];
        var r1 = this.getProjection(axis);
        var r2 = other.getProjection(axis);
        var v1 = axis.dot(vec);
        axeoverps.push([r1,r2,v1]);
        var tr = r1.movingOverlapRange(r2, v1);
        if (tr == null) {
                ret.axis = null;
                return ret;
        } else {
            trange = trange.overlapRange(tr);
            if (trange == null) {
                ret.axis = null;
                return ret;
            }
        }
    }
    for (var i = 0; i < axeoverps.length; i++) {
        var r1 = axeoverps[i][0].moveRange(axeoverps[i][2] * tr.a);
        var r2 = axeoverps[i][1];
        var o = r1.overlapAmount(r2);
        if (o < ret.overlap) {
            ret.overlap = o;
            ret.axis = i < axes1.length ? axes1[i] : axes2[i-axes1.length];
        }
    }
    ret.collide = true
    ret.minVec.applyMagnitude(tr.a);
    return ret;
}

Kien.MovingRectangle.prototype._oldgetMaxNonCollideVector = function(other) {
    var tvec = this.vector || (new Kien.Vector2D(0, 0));
    var ovec = other.vector || (new Kien.Vector2D(0, 0));
    var lb = other.clone();
    var rv = tvec.subtract(ovec);
    lb.left -= this.width;
    lb.top -= this.height;
    if (this.x >= lb.left && this.x < lb.right) {
        if (this.y >= lb.top && this.y < lb.bottom) {
            return new Kien.Vector2D(0,0);;
        }
    }
    if (rv.x != 0) {

        var xSide = rv.x > 0 ? lb.left : lb.right;
        var t = (xSide - this.x) / rv.x;
        if (t >= 0 && t < 1) {
            var yd = this.y + rv.y * t;
            if (yd >= lb.top && yd < lb.bottom) {
                return new Kien.Vector2D(tvec.x * t, tvec.y);
            }
        }
    }

    if (rv.y != 0) {
        var ySide = rv.y > 0 ? lb.top : lb.bottom;
        var t = (ySide - this.y) / rv.y;
        if (t >= 0 && t < 1) {
            var xd = this.x + rv.x * t;
            if (xd >= lb.left && xd < lb.right) {
                return new Kien.Vector2D(tvec.x, tvec.y * t);
            }
        }
    }

    return tvec.clone();
}

Kien.MovingRectangle.fromRectangle = function(rect) {
    return new Kien.MovingRectangle(rect.x, rect.y, rect.width, rect.height);
}


//-----------------------------------------------------------------------------
// Array
//
// Define a utility Function.

if (!Array.prototype.find) {

    Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, "findIndex", {
        value: function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.findIndex called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return i;
                }
            }
        return -1;
        }
    });
}

if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.find called on null or undefined');
            }
            if (typeof predicate !== 'function') {
                throw new TypeError('predicate must be a function');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var thisArg = arguments[1];
            var value;

            for (var i = 0; i < length; i++) {
                value = list[i];
                if (predicate.call(thisArg, value, i, list)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

if (!Array.prototype.sample) {
    Object.defineProperty(Array.prototype, "sample", {
        value: function(predicate) {
            if (this === null) {
                throw new TypeError('Array.prototype.sample called on null or undefined');
            }
            var list = Object(this);
            var length = list.length >>> 0;
            var value;
            if (length === 0){
                return undefined;
            }
            var index = Math.floor( Math.random() * length);
            return list[index];
        }
    });
}

if (!Array.prototype.clear) {
    Object.defineProperty(Array.prototype, "clear", {
        value: function() {
            this.splice(0,this.length);
        }
    });
}


if (!Math.deg2Rad) {
    Math.deg2Rad = function(degree) {
        return (((degree % 360) + 360) % 360) * Math.PI / 180;
    }
}

if (!Math.rad2Deg) {
    Math.rad2Deg = function(radian) {
        return ((((radian / Math.PI) * 180) % 360 ) + 360) % 360;
    }
}

if (!Math.roundAt) {
    Math.roundAt = function(num, digit) {
        return Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit);
    }
}

if (!Number.prototype.between) {
	Number.prototype.between = function(a, b, inclusive) {
	  var min = Math.min(a, b),
	    max = Math.max(a, b);

	  return inclusive ? this >= min && this <= max : this > min && this < max;
	}
}

if (!Kien.cloneEvent) {
	// from http://stackoverflow.com/questions/12593035/cloning-javascript-event-object
	Kien.cloneEvent = function(e) {
	    if (e===undefined || e===null) return undefined;
	    function ClonedEvent() {};  
	    var clone = new ClonedEvent();
	    for (var p in e) {
	        var d = Object.getOwnPropertyDescriptor(e, p);
	        if (d && (d.get || d.set)) Object.defineProperty(clone, p, d); else clone[p] = e[p];
	    }
	    Object.setPrototypeOf(clone, e);
	    return clone;
	}
}


//-----------------------------------------------------------------------------
/**
 * The basic object that represents an image.
 *
 * @class Bitmap
 * @constructor
 * @param {Number} width The width of the bitmap
 * @param {Number} height The height of the bitmap
 */

Bitmap.prototype.drawLine = function(x1, y1, x2, y2, color, width) {
    var context = this._context;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = width || 1;
    context.beginPath();
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.restore();
    this._setDirty();
};

Bitmap.prototype.fillShape = function(coords, color) {
    if (coords.length < 3) {
        return;
    }
    var context = this._context;
    context.save();
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(coords[0].x, coords[0].y);
    for (var i = 1; i < coords.length; i++) {
        context.lineTo(coords[i].x,coords[i].y);
    }
    context.closePath();
    context.fill();
    context.restore();
    this._setDirty();
};

if (!Kien.HashMap) {

    Kien.HashMap = function() {
        this.hashes = {};
        this._keys = [];
    }

    Kien.HashMap.prototype.put = function( key, value ) {
        if (value === null || value === undefined) {
            this.remove(key);
        } else {
            if (!this._keys.contains(key)) {
                this._keys.push(key);
            }
            this.hashes[key] = value;
        }
    }

    Kien.HashMap.prototype.get = function(key) {
        return this.hashes[key];
    },

    Kien.HashMap.prototype.keys = function() {
        return this._keys.clone();
    },

    Kien.HashMap.prototype.remove = function(key) {
        if (this._keys.contains(key)) {
            this._keys.splice(this._keys.indexOf(key), 1);
            delete this.hashes[key];
        }
    }
}

Kien.Boundary = function() {
    this._boundboxes = [];
}

Kien.Boundary.prototype.collided = function(rect) {
    for (var i = 0; i < this._boundboxes.length; i++) {
        if (rect.overlap(this._boundboxes[i])) {
            return true;
        }
    }
    return false;
}

Kien.Boundary.prototype.addBoundbox = function(box) {
    this._boundboxes.push(box);
}

Kien.Boundary.prototype.getMaxNonCollideVector = function(rect) {
    if (!rect.vector) {
        return null;
    }
    var vec = rect.vector.clone();
    for (var i = 0; i < this._boundboxes.length; i++) {
        var nvec = rect.getMaxNonCollideVector(this._boundboxes[i]);
        if (nvec.magnitude < vec.magnitude) {
            vec = nvec;
        }
    }
    return vec;
}

Kien.parseInt = function(string) {
    return parseInt(string, 10);
}