//-----------------------------------------------------------------------------
// Kien.LMBS_Core
//
// Parameters and utilities

Kien.LMBS_Core.parameters = PluginManager.parameters("LinearMotionBattleSystem_Core");
Kien.LMBS_Core.battleWidth = parseInt(Kien.LMBS_Core.parameters["Battle Field Width"],10);
Kien.LMBS_Core.battleY = parseInt(Kien.LMBS_Core.parameters["Battle Field Ground Y"],10);
Kien.LMBS_Core.fallMaxSpeed = parseInt(Kien.LMBS_Core.parameters["Maximum Fall Speed"],10);
Kien.LMBS_Core.animationSpeed = parseInt(Kien.LMBS_Core.parameters["Animation Speed"],10);
Kien.LMBS_Core.debugMode = eval(Kien.LMBS_Core.parameters["Debug Mode"]);
Kien.LMBS_Core.defaultFacing = eval(Kien.LMBS_Core.parameters["Default Facing"]);
Kien.LMBS_Core.damageOffsetX = eval(Kien.LMBS_Core.parameters["Damage Popup Offset X"]);
Kien.LMBS_Core.damageOffsetY = eval(Kien.LMBS_Core.parameters["Damage Popup Offset Y"]);
Kien.LMBS_Core.turnLength = eval(Kien.LMBS_Core.parameters["Turn Length"]);
Kien.LMBS_Core.doubleTapDur = eval(Kien.LMBS_Core.parameters["Double Tap Time"]);
Kien.LMBS_Core.jumpPower = eval(Kien.LMBS_Core.parameters["Jump Power"]);
Kien.LMBS_Core.moveThroughAlly = eval(Kien.LMBS_Core.parameters["Can Move Through Ally"]);
Kien.LMBS_Core.moveThroughEnemy = eval(Kien.LMBS_Core.parameters["Can Move Through Enemy"]);
Kien.LMBS_Core.dashThroughAlly = eval(Kien.LMBS_Core.parameters["Can Dash Through Ally"]);
Kien.LMBS_Core.dashThroughEnemy = eval(Kien.LMBS_Core.parameters["Can Dash Through Enemy"]);
Kien.LMBS_Core.fixCharacterSize = eval(Kien.LMBS_Core.parameters["Fix Character Size"]);
Kien.LMBS_Core.enemyXStart = eval(Kien.LMBS_Core.parameters["Enemy X Start"]);
Kien.LMBS_Core.skillTypeName = Kien.LMBS_Core.parameters["Skill Set Name"];
Kien.LMBS_Core.skillSetRightLeft = eval(Kien.LMBS_Core.parameters["Skill Set Left Right Act Same"]);
Kien.LMBS_Core.inputDelay = parseInt(Kien.LMBS_Core.parameters["Delay for jump"]);
Kien.LMBS_Core.defaultBattleEventPause = parseInt(Kien.LMBS_Core.parameters["Pause Game While Event By Default"]);
Kien.LMBS_Core.gaurdKey = parseInt(Kien.LMBS_Core.parameters["Guard Key"]);
Kien.LMBS_Core.previousTargetKey = parseInt(Kien.LMBS_Core.parameters["Previous Target Key"]);
Kien.LMBS_Core.nextTargetKey = parseInt(Kien.LMBS_Core.parameters["Next Target Key"]);
Kien.LMBS_Core.autoGuardDuration = parseInt(Kien.LMBS_Core.parameters["Auto Guard Time After Guard"]);
Kien.LMBS_Core.maxCameraZoom = parseFloat(Kien.LMBS_Core.parameters["Max Camera Zoom"]);
Kien.LMBS_Core.minCameraZoom = parseFloat(Kien.LMBS_Core.parameters["Min Camera Zoom"]);
Kien.LMBS_Core.leftCameraMargin = parseInt(Kien.LMBS_Core.parameters["Camera Left Margin"]);
Kien.LMBS_Core.rightCameraMargin = parseInt(Kien.LMBS_Core.parameters["Camera Right Margin"]);
Kien.LMBS_Core.battleSkillIcon = parseInt(Kien.LMBS_Core.parameters["Battle Skill Icon"]);
Kien.LMBS_Core.battleItemIcon = parseInt(Kien.LMBS_Core.parameters["Battle Item Icon"]);
Kien.LMBS_Core.battleSkillName = (Kien.LMBS_Core.parameters["Battle Skill Command Name"]);
Kien.LMBS_Core.battleItemName = (Kien.LMBS_Core.parameters["Battle Item Command Name"]);
Kien.LMBS_Core.battleEndWaitTime = parseInt(Kien.LMBS_Core.parameters["Battle End Wait Time"]);
Kien.LMBS_Core.autoGuardDuration = parseInt(Kien.LMBS_Core.parameters["Auto Guard Time After Guard"]);
Kien.LMBS_Core.enableDefault = eval(Kien.LMBS_Core.parameters["Enable Default"]);

Kien.LMBS_Core.battleTopMessageWindowColors = (function(param) {
    var ret = [];
    var reg = /\(([+-]?\d+)\,([+-]?\d+)\,([+-]?\d+)\)/g;
    var execret;
    while ((execret = reg.exec(param)) != null) {
        ret.push({
            "r" : parseInt(execret[1]),
            "g" : parseInt(execret[2]),
            "b" : parseInt(execret[3])
        });
    }
    if (ret.length == 0) {
        ret.push({
            "r" : -68,
            "g" : 102,
            "b" : 255
        })
    }
    if (ret.length == 1) {
        ret.push({
            "r" : 153,
            "g" : -53,
            "b" : -204
        })
    }
    return ret;
})(Kien.LMBS_Core.parameters["Battle Message Window Color"]);


if (!Imported.Kien_Lib) {
    throw new Error("Library Plugin Not Found.\n Please put KienLib.js above this plugin.");
}


// From https://github.com/buzzfeed/libgif-js/blob/master/libgif.js
// License Information:
/*Copyright (c) 2011 Shachaf Ben-Kiki

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
// WIP
if (!Kien.gifReader){
    Kien.gifReader = {};
    Kien.gifReader.bitsToNum = function (ba) {
        return ba.reduce(function (s, n) {
            return s * 2 + n;
        }, 0);
    };

    Kien.gifReader.byteToBitArr = function (bite) {
        var a = [];
        for (var i = 7; i >= 0; i--) {
            a.push( !! (bite & (1 << i)));
        }
        return a;
    };


    Kien.gifReader.Stream = function (data) {
        this.data = data;
        this.len = this.data.length;
        this.pos = 0;

        this.readByte = function () {
            if (this.pos >= this.data.length) {
                throw new Error('Attempted to read past end of stream.');
            }
            if (data instanceof Uint8Array)
                return data[this.pos++];
            else
                return data.charCodeAt(this.pos++) & 0xFF;
        };

        this.readBytes = function (n) {
            var bytes = [];
            for (var i = 0; i < n; i++) {
                bytes.push(this.readByte());
            }
            return bytes;
        };

        this.read = function (n) {
            var s = '';
            for (var i = 0; i < n; i++) {
                s += String.fromCharCode(this.readByte());
            }
            return s;
        };

        this.readUnsigned = function () { // Little-endian.
            var a = this.readBytes(2);
            return (a[1] << 8) + a[0];
        };
    };

    Kien.gifReader.lzwDecode= function (minCodeSize, data) {
        // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
        var pos = 0; // Maybe this streaming thing should be merged with the Stream?
        var readCode = function (size) {
            var code = 0;
            for (var i = 0; i < size; i++) {
                if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                    code |= 1 << i;
                }
                pos++;
            }
            return code;
        };

        var output = [];

        var clearCode = 1 << minCodeSize;
        var eoiCode = clearCode + 1;

        var codeSize = minCodeSize + 1;

        var dict = [];

        var clear = function () {
            dict = [];
            codeSize = minCodeSize + 1;
            for (var i = 0; i < clearCode; i++) {
                dict[i] = [i];
            }
            dict[clearCode] = [];
            dict[eoiCode] = null;

        };

        var code;
        var last;

        while (true) {
            last = code;
            code = readCode(codeSize);

            if (code === clearCode) {
                clear();
                continue;
            }
            if (code === eoiCode) break;

            if (code < dict.length) {
                if (last !== clearCode) {
                    dict.push(dict[last].concat(dict[code][0]));
                }
            }
            else {
                if (code !== dict.length) throw new Error('Invalid LZW code.');
                dict.push(dict[last].concat(dict[last][0]));
            }
            output.push.apply(output, dict[code]);

            if (dict.length === (1 << codeSize) && codeSize < 12) {
                // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
                codeSize++;
            }
        }

        // I don't know if this is technically an error, but some GIFs do it.
        //if (Math.ceil(pos / 8) !== data.length) throw new Error('Extraneous LZW bytes.');
        return output;
    };

    Kien.gifReader.readHeader = function(st) {
        obj = {};
        obj.headName = st.readBytes(3);
        if (obj.headName !== "GIF") {
            return null;
        }
        obj.ver = st.readBytes(3);
        obj.scrWidth = st.readUnsigned();
        obj.scrHeight = st.readUnsigned();
        var flags = Kien.gifReader.byteToBitArr(st.readByte());
        obj.gctf = obj.flags.shift();
    }
    
    Kien.gifReader.parseGIF = function (st) {
        obj = {};
    }

    Kien.gifReader.loadGif = function(filename){

    }

}

//(function() {
// It seems use strict mode will be better, so I use it.
//"use strict"
// But as if we do it, then we can't call new classes with eval(), so I stop to use it.

Kien.LMBS_Core.createMotionListFromNote = function(obj) {
    if(obj.note === undefined || obj.note === null){
        throw new TypeError('obj is not a proper Object');
    }
    var array = [];
    var list = [];
    var start = false;
    obj.note.split("\n").forEach(function(line){
        if(line.match(/\<Skill Motion\>/)){
            start = true;
        } else if(line.match(/\<\/Skill Motion\>/)){
            start = false;
        } else if(start){
            array.push(line);
        }
    });
    if(array.length === 0){
        if (obj.meta["Skill Motion"]){
            var fn = obj.meta["Skill Motion"];
            var fpath = "data/motions/" + fn + ".json";
            var xhr = new XMLHttpRequest();
            var url = fpath;
            xhr.open('GET', url, false);
            xhr.overrideMimeType('application/json');
            xhr.onload = function() {
                if (xhr.status < 400) {
                    list = JSON.parse(xhr.responseText);
                }
            };
            xhr.onerror = function() {
                DataManager._errorUrl = DataManager._errorUrl || url;
            };
            xhr.send();
        }
    } else {
        Kien.LMBS_Core.loadMotionList(array,list);
    }
    return list;
};

Kien.LMBS_Core.createAnimationTimingFromName = function(filename) {
    if (filename === "null") {
        return {};
    }
    var fpath = "data/animations/" + filename + ".json";
    var obj = {};
    var xhr = new XMLHttpRequest();
    var url = fpath;
    xhr.open('GET', url, false);
    xhr.overrideMimeType('application/json');
    xhr.onload = function() {
        if (xhr.status < 400) {
            obj = JSON.parse(xhr.responseText);
        }
    };
    xhr.onerror = function() {
        DataManager._errorUrl = DataManager._errorUrl || url;
    };
    xhr.send();
    return obj;
};

Kien.LMBS_Core.getSkillPriority = function(obj) {
    if(obj.note === undefined || obj.note === null){
        throw new TypeError('obj is not a proper Object');
    }
    if(obj.meta["Skill Priority"]){
        return parseInt(obj.meta["Skill Priority"],10);
    }
    return 0;
};

Kien.LMBS_Core.getSkillRange = function(obj) {
    if(obj.note === undefined || obj.note === null){
        throw new TypeError('obj is not a proper Object');
    }
    if(obj.meta["Skill Range"]){
        return parseInt(obj.meta["Skill Range"],10);
    }
    var list = Kien.LMBS_Core.createMotionListFromNote(obj);
    for (var index = 0; index < list.length; index++){
        obj = list[index];
        if (obj.type == "startdamage") {
            var x = obj.rect.x;
            var w = obj.rect.width;
            return x+w/2;
        }
    }
    return 20
};

Kien.LMBS_Core.isTest = function() {
    return Utils.isOptionValid('test') && Kien.LMBS_Core.debugMode;
};

Kien.LMBS_Core.inBetween = function(a, b, value) {
    if (a > b){
        return (value >= b) && (value < a);
    } else {
        return (value >= a) && (value < b);
    }
};

Kien.LMBS_Core.loadMotionList = function(array, list) {
    var tree = [];
    var cur = {"list" : list, "newDepth" : false, "finish" : false};
    for (var index = 0; index < array.length; index++){
        line = array[index];
        Kien.LMBS_Core.loadMotionLine(line, cur);
        if (cur.newDepth) {
            cur.newDepth = false;
            tree.push(cur);
            cur = {"list" : cur.list[cur.list.length - 1].list || [], "newDepth" : false, "finish" : false};
        } else if (cur.finish) {
            if (tree.length > 0) {
                cur = tree.pop();
            } else {
                console.log("Skill Motion have extra EndIf statement, ignoring it.");
            }
        }
    }
    if (tree.length > 0) {
        console.log("Error! Skill Motion have too little EndIf statement! Something will go wrong.")
    }
}

Kien.LMBS_Core.loadMotionLine = function(line,cur) {
    var list = cur.list;
    if(line.match(/ChangePose (.+)/)) {
        list.push({
            "type" : "pose",
            "name" : RegExp.$1
        });
    }
    if(line.match(/FrameForward/)) {
        list.push({
            "type" : "forward"
        });
    }
    if(line.match(/FrameBackward/)) {
        list.push({
            "type" : "backward"
        });
    }
    if(line.match(/Move ([+-]?\d+)\,([+-]?\d+)\,(\d+)/)) {
        list.push({
            "type" : "move",
            "dx"   : parseInt(RegExp.$1,10),
            "dy"   : parseInt(RegExp.$2,10),
            "dur"  : parseInt(RegExp.$3,10)
        });
    }
    if(line.match(/Wait (\d+)/)) {
        list.push({
            "type" : "wait",
            "dur"  : parseInt(RegExp.$1)
        });
    }
    if(line.match(/StartInput/)) {
        list.push({
            "type" : "startinput"
        });
    }
    if(line.match(/EndInput/)) {
        list.push({
            "type" : "endinput"
        });
    }
    if(line.match(/StartDamage ([+-]?\d+)\,([+-]?\d+)\,(\d+)\,(\d+)\,(\d+(?:\.\d+)?)\,(\d+(?:\.\d+)?)\,(\d+(?:\.\d+)?)\,(\d+)/)) {
        list.push({
            "type" : "startdamage",
            "rect" : {"x":     parseFloat(RegExp.$1,10),
                      "y":     parseFloat(RegExp.$2,10),
                      "width": parseFloat(RegExp.$3,10),
                      "height":parseFloat(RegExp.$4,10)},
            "damage": parseFloat(RegExp.$5),
            "knockback": {"x": parseFloat(RegExp.$6,10),"y": parseFloat(RegExp.$7,10)},
            "knockdir": RegExp.$8 ? parseInt(RegExp.$8,10) : 0
        });
    }
    if(line.match(/EndDamage/)) {
        list.push({
            "type" : "enddamage"
        });
    }
    if(line.match(/Projectile (.+?)\,(.+)/)) {
        list.push({
            "type" : "projectile",
            "classname" : RegExp.$1,
            "parameters": RegExp.$2
        });
    }
    if(line.match(/LetFall/)) {
        list.push({
            "type" : "letfall"
        });
    }
    if(line.match(/NoFall/)) {
        list.push({
            "type" : "nofall"
        });
    }
    if(line.match(/WaitFall/)) {
        list.push({
            "type" : "waitfall",
            "dur" : 1
        });
    }
    if(line.match(/ApplyDamage (\d+(?:\.\d+)?)\,(\d+(?:\.\d+)?)\,(\d+(?:\.\d+)?)\,(\d+)/)){
        list.push({
            "type" : "applydamage",
            "damage" : parseFloat(RegExp.$1),
            "knockback": {"x" : parseFloat(RegExp.$2,10), "y" : parseFloat(RegExp.$3,10)},
            "knockdir" : parseInt(RegExp.$4,10)
        });
    }
    if(line.match(/WaitCast (\d+)/)){
        list.push({
            "type" : "waitcast",
            "dur" : parseInt(RegExp.$1,10)
        });
    }
    if(line.match(/Rotation (\d+)\,([+-]?\d+)\,(\d+)(?:\,(\d+))?/)){
        list.push({
            "type" : "rotation",
            "rotation" : parseInt(RegExp.$1,10) % 360,
            "dir" : parseInt(RegExp.$2,10),
            "dur" : parseInt(RegExp.$3,10),
            "rounds" : !!RegExp.$4 ? parseInt(RegExp.$4,10) : 0
        });
    }
    if(line.match(/SetHitStop (\d+)/)) {
        list.push({
            "type" : "sethitstop",
            "length" : parseInt(RegExp.$1,10)
        });
    }
    if(line.match(/StopAllAi/)) {
        list.push({
            "type" : "stopallai"
        });
    }
    if(line.match(/StartAllAi/)) {
        list.push({
            "type" : "startallai"
        });
    }
    if (line.match(/^If (.+)/)){
        list.push({
            "type" : "if",
            "expression" : RegExp.$1,
            "list" : []
        });
        cur.newDepth = true;
    }
    if (line.match(/^EndIf/)){
        list.push({
            "type" : "endif"
        });
        cur.finish = true;
    }
    if(line.match(/(?:ChangeWeapon$|(?:ChangeWeapon[ ]?(.+)))/)) {
        list.push({
            "type" : "changeweapon",
            "name" : RegExp.$1
        });
    }
    if (line.match(/MoveWeapon (\d+)\,(\d+),(\d+)/)) {
        list.push({
            "type" : "moveweapon",
            "dx" : parseInt(RegExp.$1),
            "dy" : parseInt(RegExp.$2),
            "dur": parseInt(RegExp.$3)
        })
    }
    if (line.match(/RotateWeapon (\d+),(\d+),(\d+)(?:\,(\d+))?/)) {
        list.push({
            "type" : "rotateweapon",
            "rotation" : parseInt(RegExp.$1,10) % 360,
            "dir" : parseInt(RegExp.$2,10),
            "dur" : parseInt(RegExp.$3,10),
            "rounds" : !!RegExp.$4 ? parseInt(RegExp.$4,10) : 0
        })
    }
    if (line.match(/ResetWeapon/)) {
        list.push({
            "type" : "resetweapon"
        })
    }
    if (line.match(/ShowSkillName/)) {
        list.push({
            "type" : "showskillname"
        })
    }
    if (line.match(/ShowMessage (\d+)\,(.+)/)) {
        list.push({
            "type" : "showmessage",
            "channel" : parseInt(RegExp.$1, 10),
            "string" : RegExp.$2
        })
    }
    if (line.match(/HideMessage (\d+)/)) {
        list.push({
            "type" : "hidemessage",
            "channel" : parseInt(RegExp.$1, 10)
        })
    }
    Kien.LMBS_Core.loadExtraLine(line,cur);
}

Kien.LMBS_Core.loadExtraLine = function(line, cur) {

}

Kien.LMBS_Core.loadMotionDescriptorClass = function(obj) {
    if (obj.meta["Motion Descriptor"]) {
        return eval(obj.meta["Motion Descriptor"]);
    }
    return DefaultMotionDescriptor;
}