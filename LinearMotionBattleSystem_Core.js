//=============================================================================
// LMBS Linear Motion Battle System Core
// LinearMotionBattleSystem_Core.js
// Version: 1.00
//=============================================================================
var Imported = Imported || {};
Imported.Kien_LMBS_Core = true;

var Kien = Kien || {};
Kien.LMBS_Core = {};
//=============================================================================
/*:
 * @plugindesc Tweek the battle system to LMBS battle system
 * @author Kien
 *
 * @param ===Battle Value Settings===
 * @desc 
 * @default 
 *
 * @param Battle Field Width
 * @desc Width of the battle field. Limit the movement of battlers
 * @default 816

 * @param Battle Field Ground Y
 * @desc the Y coordinate of ground 
 * @default 500
 *
 * @param Maximum Fall Speed
 * @desc the maximum distance characters falls each frame.
 * @default 6 
 *
 * @param Animation Speed
 * @desc The amount of frames an picture will show in character loop animation.
 * @default 4
 *
 * @param Damage Popup Offset X
 * @desc The offset of the damage pop display
 * @default 0
 *
 * @param Damage Popup Offset Y
 * @desc The offset of the damage pop display 
 * @default -40
 *
 * @param Turn Length
 * @desc The length of 1 turn in frame, use to process those turn-based features such
 * as states.
 * @default 60
 *
 * @param Jump Power
 * @desc Force of jump that characters will take. Affect height of jump.
 * @default 30
 *
 * @param Enemy X Start
 * @desc Starting coordinate of enemy troop. This value will add to coordinate
 * set in troop as actual coordinate in-game.
 * @default 520
 *
 * @param Battle End Wait Time
 * @desc Length in Frames to wait after the battle rewards are displayed.
 * Player can shorten this time to 1/4 by hold button.
 * @default 200
 *
 * @param Auto Guard Time After Guard
 * @desc Length in frames that character will automatically guard after successfully guard
 * an attack.
 * @default 15
 *
 * @param ===System Settings===
 * @desc 
 * @default 
 *
 * @param Enable Default
 * @desc enable the battle system by default.
 * @default true
 *
 * @param Debug Mode
 * @desc Shows the range of hitboxes with colored rects. Only works in Test
 * Mode.
 * @default false
 * 
 * @param Default Facing
 * @desc the facing of the characters in graphs. true is right, false is left.
 * @default false
 *
 * @param Double Tap Time
 * @desc The length of time between two input will be considered as double tap.
 * @default 15
 *
 * @param Can Move Through Ally
 * @desc Can battlers move through ally battlers.
 * @default true
 *
 * @param Can Move Through Enemy
 * @desc Can battlers move through enemy battlers.
 * @default false
 *
 * @param Can Dash Through Ally
 * @desc Can battlers dash through ally battlers. Only have effect when
 * Can Move Through Ally is false.
 * @default true
 *
 * @param Can Dash Through Enemy
 * @desc Can battlers dash through enemy battlers. Only have effect when
 * Can Move Through Enemy is false.
 * @default true
 *
 * @param Fix Character Size
 * @desc let the size of all pose of character same as "Stand" pose.
 * @default true
 *
 * @param Skill Set Left Right Act Same
 * @desc Let Right and Left skill use same skill in skill set.
 * @default true
 *
 * @param Delay for jump
 * @desc amount of frames wait when jump is inputed for player. to let
 * player able to cast skill assigned in up.
 * @default 6
 *
 * @param Pause Game While Event By Default
 * @desc pause the game or not while event is running by default. Can be triggered via
 * plugin command.
 * @default false
 *
 * @param ===Menu Settings===
 * @desc 
 * @default 
 *
 * @param Skill Set Name
 * @desc Name of the command for config skill cast.
 * @default Config
 *
 * @param Battle Skill Command Name
 * @desc Name of the command for skill in battle menu.
 * @default Skill/Magic
 *
 * @param Battle Item Command Name
 * @desc Name of the command for item in battle menu.
 * @default Item
 *
 * @param Battle Skill Icon
 * @desc Icon index of the 'Skill' in battle Menu
 * @default 76
 *
 * @param Battle Item Icon
 * @desc Icon index of the 'Item' in battle Menu
 * @default 176
 *
 * @param ===Camera Settings===
 * @desc 
 * @default 
 *
 * @param Max Camera Zoom
 * @desc Maximum maginification camera can be. Prevent the zoom becomes too big.
 * @default 1.25
 *
 * @param Min Camera Zoom
 * @desc Minimum maginification camera can be. Prevent the zoom becomes too small.
 * @default 0.90
 *
 * @param Camera Left Margin
 * @desc Amount of pixels camera will leave from the left-most of characters
 * @default 30
 *
 * @param Camera Right Margin
 * @desc Amount of pixels camera will leave from the right-most of characters
 * @default 30
 *
 * @help
 * ============================================================================
 * * Set Normal Attack Skill
 * ============================================================================
 *   Add <Attack Skill Set [dir]=[id]> in note to set the attack performed when 
 * pressed Attack button with d-key. 0 is neutral, 2,4,6,8 are four directions.
 *   When only 0 is set, then this skill will performed regardless the d-key
 * state.
 *   When set to Actor note, it will be first attack skill performed, when add
 * to skill note, it will be skill performed as chain skill. 
 * ===========================================================================
 * * Skill Settings
 * ===========================================================================
 *   <Aerial Cast:[id]> : set if the skill can cast in air. [id] is the skill id
 * will be casted when the skill is cast in air. 0 for the skill itself.
 * ===========================================================================
 * * Skill Priority
 * ===========================================================================
 *   Add <Skill Priority=[number]> to set priority of the skill. This affect
 * the skills that able or not to perform after a skill. The skill with lower
 * priority can't performed when a skill have higher priority is performing.
 *   number can be -1 to let the skill performed regardless the priority, and
 * -2 to let skill as -1 and let skill with all priority chained freely after 
 * this. Priority 0 is used for normal attacks, and can chain freely with each 
 * other.
 *  Note that enemy will also try to chain the skill with same rules. So make
 * sure to let skills that don't want to be chained have same priority.
 * ===========================================================================
 * * Skill Type
 * ===========================================================================
 *   As Tales Of Series do, This plugin separate skills to two categories. One
 * is skills, and another is magics. This is decided by the skills "Hit Type",
 * Where When skill has a physical Hit Type, it will be considered as Skill,
 * When skill has a magic Hit Type, it will be considered as Magic. Certain Hit
 * Hit type currently is not considered as either of it.
 *   In the plugin, Physical Skill are assumed as need to close to target, and 
 * Magic Skill are not. This speration is not to restrict the type of damage,
 * only the way AIs will handle it. Skills are those actions will cast near enemy,
 * magic are those skills cast at far position, and thus characters will try to
 * go back their initial position. Certain Hit hit type will be cast at where they
 * currently at.
 * ===========================================================================
 * * Set Skill Motion
 * ===========================================================================
 *   To set skill motion, add <Skill Motion> and </Skill Motion> at skill's
 * note. Lines between these will be the desciprtion of the skill motion. Or
 * can use <Skill Motion=filename> to determine a json file placed in
 * data/motions that descripting skill motion. Json Format will be described 
 * later.
 *   Lines will be processed one-by-one until there is some process need to
 * interupt the process.
 * ===========================================================================
 * * Skill Motion Lines
 * ===========================================================================
 *  ChangePose [posename] : Change the pose of the user to [posename].
 *  FrameForward : Change the frame number of the pose to next frame.
 *  FrameBackward : Change the frame number of the pose to previous frame.
 *  Move [dx],[dy],[dur] : Move the user's position for [dx],[dy] pixels in 
 *   [dur] duration. This will not pause the process of line.
 *  Wait [dur] : Abort and stop the process for [dur] frame.
 *  StartInput : Start to accept input. This Includes normal attack chain, and
 *   chain skill perform.
 *  EndInput : End Input accept.
 *  StartDamage [x],[y],[width],[height],[damagePercent],[knockx],[knocky],[knockdir]:
 *   Start to deal damage from this frame. x,y,width,height define a rect
 *   that represent the area that enemy will take damage. damgePercent will be the 
 *   percentage of damage calculated from skill formula,where 1 will be 100%, knockx,knocky,knockdir is
 *   the knockback strength and direction. knockdir should be 4,6 or 0. note that
 *   Each enemy only takes one time for each StartDamage.
 *  EndDamage: stop to deal damage.
 *  Projectile [classname],[parameters]: emit a projectile with [classname] class.
 *   [parameters] are a string passed into class's initializer. Detailed information
 *   listed in below section.
 *  LetFall: enable the gravity-pull falling in motion.
 *  NoFall: disable the gravity-pull falling.
 *  WaitFall: wait until the character touches the ground.
 *  ApplyDamage [damagePer],[knockx],[knocky],[knockdir]:
 *   Deal damage to target, damage is multiplied by [damagePer] and knockback by
 *   [knockx],[knocky],[knockdir]
 *  WaitCast [duration]: Chagne the pose to "Cast" and enable auto looping, wait
 *   for [duration] frames. this waiting is different with Wait [dur].
 *  Rotate [angle],[direction],[duration]: Rotate the character.
 *   [angle] is the target angle of the rotation. Specify the angle currently at
 *  will let character rotate one full circle.
 *   [direction] is the direction of the rotation. 4 is counter-clockwise, 6 is 
 *  clockwise.
 *   [duration] is the time this rotation will be process.
 * ===========================================================================
 * * JSON Skill Motion
 * ===========================================================================
 *   Skill motion can also be descripted by JSON file. These JSON file should 
 * placed in data/motions folder in project (Create the folder by yourself.),
 * and determine the skill use that file by add <Skill Motion=[filename]> to
 * skill. Note that filename should exclude .json extension.
 * ===========================================================================
 * * JSON Skill Motion format
 * ===========================================================================
 *   The file should be an array, each element of array represent a line of motion
 * in form of object. Please refference to documentations about JSON with this part
 * of help.
 *   All motion contains a property named "type", and its value will represent
 * the type of the motion. Object also contains type-specified properties 
 * describes how motion will look like.
 *   Following lines are the objects can be the parts for the motion list. Simply copy
 * the linee, replace the content enclosed by [](include brackets) with desired values and delete content
 * after double slash (include slashes).
 *  {"type": "pose", "name": "[name of the new pose]"} // change the pose of the battler
 *  {"type": "forward"} // Frame advance the pose animation.
 *  {"type": "backward"} // roll back to previous frame of the pose animation.
 *  {"type": "move", "dx": [amount in x-coordinate], "dy": [amount in y-coordinate], "dur": [length of frames movement take]} // move the battler with desired amount in desired time.
 *  {"type": "wait", "dur" : [duration of wait command]} // Pause the execution of the motion list and apply the executed motions in game.
 *  {"type" : "startinput"} // start to accept player/AI input
 *  {"type" : "endinput"} // stop to accept input
 *  {"type" : "startdamage", "rect" : 
        {"x": [x-coordinate of the damaging rect relate to user],"y": [y-coordinate of the damaging rect relate to user], "width": [width of the rect], "height": [height of rect]},
     "damage": [float value to multiply to the damage value],
     "knockback": {"x": [strength of knockback in x direction],"y": [strength of knockback in y direction]},
     "knockdir": [direction of knockback,can be 4,6,0. 0 means same to battler's facing]} // Start to deal damage in a specified rectangle. This Damage will only applied once per enemy.
     {"type" : "enddamage"} // Finish the Damage
     {"type" : "projectile", "classname" : [name of the projectiles's class name],"parameters": [parameters will pass to the class, see the later part for detail]} // Start to launch a projectile.
     {"type" : "letfall"} // Enable falling in motion. Disabled for default.
     {"type" : "nofall"} // Disable falling in motion.
     {"type" : "waitfall", "dur" : 1}  // Pause the process until the characfter touches ground.
     {"type" : "applydamage",
     {"damage" : [float value to multiply to the damage value],
      "knockback": {"x": [strength of knockback in x direction],"y": [strength of knockback in y direction]},
     "knockdir": [direction of knockback,can be 4,6,0. 0 means same to battler's facing]}// Deal the damage to target no matter where it is at.
     {"type" : "waitcast","dur" : [length of casting in frame]} // Change the pose into "Cast" and wait. 
 * ===========================================================================
 * * Projectiles
 * ===========================================================================
 *   Projectiles are a special Sprite_Base extended classes that represent some
 * non-player controllable objects that can do something.
 *   User can define self implemented Sprite classes use as projectiles. The 
 * required properties are following:
 *   _finish: boolean property, represents the projectile action is finished or not.
 * when action is finish, set this property to true and system will automatically
 * remove it from the game.
 *  update(): a function that update the actions.
 *  setupLMBS(sprite): a function that will called after initializer is called.
 * sprite is the user's sprite.
 *  removeLMBS(): a function that will called when the projectile will be removed. Use this
 * function to remove all resources.
 * ===========================================================================
 * * Provided Projectile
 * ===========================================================================
 *  Sprite_Projectile: A projectile that shoots a straight moving projectile.
 * parameters are : [filename],[framenumber],[animationspeed],[xspeed],[yspeed],[damagePer],
 * [knockbackx],[knockbacky],[knockbackdir].
 * filename is the name of graphics placed at img/projectile (create folder by yourself).
 * framenumber is the amount of frames in graph, animationspeed is the speed of frames pass.
 * xspeed and yspeed is the speed of projectile in each direction.
 * damagePer is the percentage of damage in the skill formula.
 * knockbackx,knockbacky,knockbackdir is smae as knockback related stuff in StartDamage
 * ---------------------------------------------------------------------------
 *  Sprite_AnimationLMBS: A projectile that shows an animation, with ability to deal
 * damage as desired through JSON descriptor.
 *  parameters are: [origin],[dx],[dy],[jsonname],[animationid],[delay],[mirror],[follow]
 *  origin,dx,dy is use to decide where the animation will be played. dx,dy is the coordinate
 * of the animation relate to origin. origin can be following values: 
 *      target: the target battler
 *      user: the user.
 *      screen: the upper-left of screen.
 *  jsonname is the name of json file placed in data/animations. This file contains the
 * information relate to damage action.
 *  animationid is the ID of the animation will be played.
 *  delay is the amount of frames the animation will wait before play.
 *  mirror is a boolean value (true/false) shows is the animation is being reverted or not.
 *  follow is a boolean value (true/false) shows that is the animation follows the origin.
 * ============================================================================
 * * Ai Settings
 * ============================================================================
 *  Actor's AI is defined by two parameter, which are "AI Type" and "Target Type".
 * Each is set through the note, by adding following line in note: 
 * <Attack Rate=[attackrate],[magicrate]> and and <Target Type=[typename]>
 *  Attack Rate is use to define the percentage of attacks/skills and magics actors will use
 * in battle. Note that when attacks and skills are chosen by AI, he will try to
 * use as much skills as he can by chaining more skills with higher priority 
 * after what he used, but he will not try to chain skill with priority -1. Vaues canbe
 * any whole number, ratio between values will become the ratio of attacks/skills and magic.
 *  Target type can have following typenames:
 *  Nearest: Will Target Enemy nearest to him.
 *  Farest: Will Target Enemy Farest to him
 *  HighestHP: Will Target Enemy have highest current HP.
 *  LowestHP: Will Target Enemy have lowest current HP.
 * Note that when actor had chosen to perform some action but the target is not reachable,
 * he will try to find another target that is reachable no matter the target type is.
 * ============================================================================
 * * Skill Range Setting
 * ============================================================================
 *  Skills can set its range by add <Skill Range=[distance]>. This range is only
 * used in AI.
 *  If this range is not set, AI will try to search the skill's motion, find first
 * damage action and read its rect to use as range.
 */

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
            var fn = obj.meta["skill Motion"];
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
    if(line.match(/StartDamage ([+-]?\d+)\,([+-]?\d+)\,(\d+)\,(\d+)\,(\d+(?:\.\d+)?)\,(\d+)\,(\d+)\,(\d+)/)) {
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
    if(line.match(/ApplyDamage (\d+(?:\.\d+)?)\,(\d+)\,(\d+)\,(\d+)/)){
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
            "rounds" : !!RegExp.$3 ? parseInt(RegExp.$4,10) : 0
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

//-----------------------------------------------------------------------------
// Array
//
// Define a utility Function.

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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
  };
};

if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
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
  };
};

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
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
  };
};

if (!Array.prototype.sample) {
    Array.prototype.sample = function() {
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
    };
};

if (!Array.prototype.clear) {
    Array.prototype.clear = function() {
        this.splice(0,this.length);
    }
}

//-----------------------------------------------------------------------------
// Rectangle
//
// Define a utility Function.
if (!Rectangle.prototype.cx) {
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

    Rectangle.prototype.overlap = function(other) {
        return (Math.abs(this.cx - other.cx) <= (this.width/2 + other.width/2)) && (Math.abs(this.cy - other.cy) <= (this.height/2 + other.height/2))
    };

    Rectangle.prototype.clone = function() {
        var rect = new Rectangle(0,0,0,0);
        rect.x = this.x;
        rect.y = this.y;
        rect.width = this.width;
        rect.height = this.height;
        return rect;
    };
}

//-----------------------------------------------------------------------------
// JSON
//
// Define a utility Function.

if (!window.JSON) {
  window.JSON = {
    parse: function(sJSON) { return eval('(' + sJSON + ')'); },
    stringify: (function () {
      var toString = Object.prototype.toString;
      var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
      var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
      var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
      var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
      return function stringify(value) {
        if (value == null) {
          return 'null';
        } else if (typeof value === 'number') {
          return isFinite(value) ? value.toString() : 'null';
        } else if (typeof value === 'boolean') {
          return value.toString();
        } else if (typeof value === 'object') {
          if (typeof value.toJSON === 'function') {
            return stringify(value.toJSON());
          } else if (isArray(value)) {
            var res = '[';
            for (var i = 0; i < value.length; i++)
              res += (i ? ', ' : '') + stringify(value[i]);
            return res + ']';
          } else if (toString.call(value) === '[object Object]') {
            var tmp = [];
            for (var k in value) {
              if (value.hasOwnProperty(k))
                tmp.push(stringify(k) + ': ' + stringify(value[k]));
            }
            return '{' + tmp.join(', ') + '}';
          }
        }
        return '"' + value.toString().replace(escRE, escFunc) + '"';
      };
    })()
  };
};

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

/**
 * A hash table to convert from a virtual key code to a mapped key name.
 *
 * @static
 * @property keyMapper
 * @type Object
 */
Input.keyMapper[67] = 'LMBSguard';

DataManager._databaseFiles.push({ name: '$dataLMBSCharacters',       src: 'characterList.json'       });

//-----------------------------------------------------------------------------
// ImageManager
//
// The static class that loads images, creates bitmap objects and retains them.

ImageManager.loadProjectile = function(filename, hue) {
    return this.loadBitmap('img/projectile/', filename, hue, false);
};

ImageManager.loadWeapon = function(filename) {
    return this.loadBitmap('img/weapons/', filename, 0, false);
};

//-----------------------------------------------------------------------------
// SceneManager
//
// The static class that manages scene transitions.

Kien.LMBS_Core.SceneManager_isNextScene = SceneManager.isNextScene;
SceneManager.isNextScene = function(sceneClass) {
    if (sceneClass === Scene_Battle) {
        return Kien.LMBS_Core.SceneManager_isNextScene.call(this, Scene_BattleLMBS) || Kien.LMBS_Core.SceneManager_isNextScene.call(this, sceneClass);
    };
    return Kien.LMBS_Core.SceneManager_isNextScene.call(this, sceneClass);
};

//-----------------------------------------------------------------------------
// BattleManager
//
// The static class that manages battle progress.

BattleManager._isEventRunning = false;

BattleManager.displayStartMessages = function() {
    // Maybe use to display enemy, but not as a message.
};

BattleManager.processVictory = function() {
    $gameParty.removeBattleStates();
    $gameParty.performVictory();
    this.playVictoryMe();
    this.replayBgmAndBgs();
    this.makeRewards();
    //this.displayVictoryMessage();
    //this.displayRewards();
    //this.gainRewards();
    this.endBattle(0);
};

BattleManager.processDefeat = function() {
    //this.displayDefeatMessage();
    this.playDefeatMe();
    if (this._canLose) {
        this.replayBgmAndBgs();
    } else {
        AudioManager.stopBgm();
    }
    this.endBattle(2);
};

BattleManager.hasObstacle = function(subject, object){
    var subx = subject.screenX();
    var objx = object.screenX();
    var members = null;
    if(!(Kien.LMBS_Core.moveThroughAlly || Kien.LMBS_Core.dashThroughAlly)) {
        members = subject.friendsUnit().members();
        if (members.findIndex(function(bat) {
            return Kien.LMBS_Core.inBetween(subx,objx,bat.screenX());
        }) != -1){
            return true;
        }
    }
    if(!(Kien.LMBS_Core.moveThroughEnemy || Kien.LMBS_Core.dashThroughEnemy)) {
        members = subject.opponentsUnit().members();
        if (members.findIndex(function(bat) {
            return Kien.LMBS_Core.inBetween(subx,objx,bat.screenX());
        }) != -1){
            return true;
        }
    }
    return false;
};

BattleManager.isEventRunning = function() {
    return this._isEventRunning;
}

BattleManager.isEventPausing = function() {
    return this.isEventRunning() && $gameSystem._LMBSBattleEventPauseGame;
}

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

//-----------------------------------------------------------------------------
// Game_System
//
// The game object class for the system data.

Kien.LMBS_Core.Game_System_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Kien.LMBS_Core.Game_System_initialize.apply(this);
    this._LMBSEnabled = Kien.LMBS_Core.enableDefault;
    this._LMBSBattleEventPauseGame = false;
}

//-----------------------------------------------------------------------------
// Game_Action
//
// The game object class for a battle action.

Kien.LMBS_Core.Game_Action_clear = Game_Action.prototype.clear;
Game_Action.prototype.clear = function() {
    Kien.LMBS_Core.Game_Action_clear.call(this);
    this._damagePercentage = 1;
};

Kien.LMBS_Core.Game_Action_makeDamageValue = Game_Action.prototype.makeDamageValue;
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var value = Kien.LMBS_Core.Game_Action_makeDamageValue.call(this,target,critical);
    value = Math.round(value * this._damagePercentage);
    return value
};

Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
    result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (!result.isHit()) {
        target._guard = true;
        result.missed = false;
        result.evaded = false;
    }
    if (this.item().damage.type > 0) {
        result.critical = (Math.random() < this.itemCri(target));
        var value = this.makeDamageValue(target, result.critical);
        this.executeDamage(target, value);
    }
    this.item().effects.forEach(function(effect) {
        this.applyItemEffect(target, effect);
    }, this);
    this.applyItemUserEffect(target);
};


//-----------------------------------------------------------------------------
// AbstractMotionDescriptor
//
// Base class for motion descriptor.

function AbstractMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

AbstractMotionDescriptor.prototype.initialize = function(battler) {
    this._battler = battler;
    this._finish = false;
    this._waitCount = 0;
}

AbstractMotionDescriptor.prototype.isWait = function() {
    if (this._waitCount > 0) {
        this._waitCount -= 1;
        return true;
    }
    return false;
}

AbstractMotionDescriptor.prototype.wait = function(duration) {
    this._waitCount = duration;
}

AbstractMotionDescriptor.prototype.isFinish = function() {
    return this._finish;
}

AbstractMotionDescriptor.prototype.release = function() {
    this._battler = null;
}

// Defined as a "Default" condition, override this function if needed.
AbstractMotionDescriptor.prototype.canUse = function(battler, obj) {
    var bool = false
    if(DataManager.isSkill(obj)){
        bool = battler.meetsSkillConditions(obj);
    } else if (DataManager.isItem(obj)){
        bool = battler.meetsItemConditions(obj);
    }
    if(!bool){
        return bool;
    }
    bool = (!battler.isMotion() || battler._waitInput);
    if(!bool){
        return bool;
    }
    bool = !battler.isKnockback() && !battler.isGuard();
    if (!bool) {
        return bool;
    }
    if(battler._actions[0] && battler.isMotion()){
        var now = battler._actions[0].item();
        var pri1 = Kien.LMBS_Core.getSkillPriority(now);
        var pri2 = Kien.LMBS_Core.getSkillPriority(obj);
        bool = (pri1 != -1 ) && ((pri1 == 0 && pri2 == 0) || (pri2 > pri1) || (pri2 < 0));
    }
    if (!bool){
        return bool;
    }
    if (!battler.isGround()) {
        bool = obj.meta["Aerial Cast"] ? true : false ;
    }
    return bool;
}

//-----------------------------------------------------------------------------
// DefaultMotionDescriptor
//
// Motion descriptor for default skill motions.

function DefaultMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

DefaultMotionDescriptor.prototype = Object.create(AbstractMotionDescriptor.prototype);
DefaultMotionDescriptor.prototype.constructor = DefaultMotionDescriptor;

DefaultMotionDescriptor.prototype.initialize = function (battler) {
    AbstractMotionDescriptor.prototype.initialize.apply(this,arguments);
    this._stoppedAi = false;
    this._childDescriptor = null;
    var item = this._battler._actions[0]._item.object();
    if (!this._battler.isGround()) {
        var id = parseInt(item.meta["Aerial Cast"],10);
        if (id > 0) {
            this._skillToBeCast = id;
            this._skillToBeCastIsItem = DataManager.isItem(item);
        }
    }
    this._processingMotionList = [];
    this._motionList = Kien.LMBS_Core.createMotionListFromNote(item);
    if (DataManager.isSkill(item)) {
        this._battler.paySkillCost(item);
    } else {
        this._battler.consumeItem(item);
    }
}

DefaultMotionDescriptor.prototype.update = function(){
    if (this._skillToBeCast) {
        this._finish = true;
        if (this._skillToBeCastIsItem) {
            this._battler.forceItemLMBS(this._skillToBeCast);
        } else {
            this._battler.forceSkill(this._skillToBeCast);
        }
        return;
    }
    if (this._childDescriptor != null) {
        this._childDescriptor.update();
        if (this._childDescriptor.isFinish()) {
            this._childDescriptor = null;
        } else {
            return;
        }
    }
    if (this._motionList.length > 0 && (!this.motionWaiting())){
        var obj = this._motionList.shift();
        while(obj){
            obj = (this.processMotion(obj) ? undefined : this._motionList.shift());
        }
    }
    this.updateProcessingMotion();
    if(this._motionList.length === 0 && this._processingMotionList.length === 0){
        this._finish = true;
    }
}

// Process motion executing in list
// returning true to abort process. Currently only occurs at "wait" command.
DefaultMotionDescriptor.prototype.processMotion = function(obj) {
    switch(obj.type){
        case "pose":
            this._battler._pose = obj.name;
            this._battler._patternIndex = 0;
            break;
        case "forward":
            this._battler._patternIndex++;
            break;
        case "backward":
            if (this._battler._patternIndex > 0){
                this._battler._patternIndex--;
            }
            break;
        case "move":
            this._processingMotionList.push(Object.create(obj));
            break;
        case "wait":
            this._processingMotionList.push(Object.create(obj));
            return true;
        case "startinput":
            this._battler._waitInput = true;
            break;
        case "endinput":
            this._battler._waitInput = false;
            break;
        case "startdamage":
            this._battler.startDamage(Object.create(obj));
            break;
        case "enddamage":
            this._battler.clearDamage();
            break;
        case "projectile":
            this._battler.registProjectile(Object.create(obj));
            break;
        case "letfall":
            this._battler._motionFall = true;
            break;
        case "nofall":
            this._battler._motionFall = false;
            break;
        case "waitfall":
            this._processingMotionList.push(Object.create(obj));
            return true;
        case "applydamage":
            if(this._battler._target){
                var oldd, oldk, oldkd, dmg;
                if (this._battler.isDamaging()){
                    dmg = true;
                    oldd = this._battler._actions[0]._damagePercentage;
                    oldk = this._battler._damageInfo.knockback;
                    oldkd = this._battler._damageInfo.knockdir;
                } else {
                    this._battler._damageInfo = {};
                    dmg = false;
                }
                this._battler._actions[0]._damagePercentage = obj.damage;
                this._battler._damageInfo.knockback = obj.knockback;
                this._battler._damageInfo.knockdir = obj.knockdir;
                this._battler.forceDamage(this._battler._target);
                if (dmg){
                    this._battler._actions[0]._damagePercentage = oldd;
                    this._battler._damageInfo.knockback = oldk;
                    this._battler._damageInfo.knockdir = oldkd;
                } else {
                    this._battler._actions[0]._damagePercentage = 1.0;
                    this._battler._damageInfo = null;
                }
            }
            break;
        case "waitcast":
            this._battler._pose = "Cast";
            this._battler._patternIndex = -1;
            this._processingMotionList.push(Object.create(obj));
            return true;
        case "rotation":
            var nobj = Object.create(obj);
            nobj.rotation = nobj.rotation % 360;
            this._battler._rotation = this._battler._rotation % 360;
            var dir = obj.dir > 0 ? 4 : 6;
            if (dir == 4) {
                while (this._battler._rotation <= nobj.rotation) {
                    this._battler._rotation += 360;
                }
                nobj.rotation -= 360 * nobj.rounds;
            } else if (dir == 6) {
                while (this._battler._rotation >= nobj.rotation) {
                    this._battler._rotation -= 360;
                }
                nobj.rotation += 360 * nobj.rounds;
            }
            this._processingMotionList.push(nobj);
            break;
        case "sethitstop":
            this._battler._hitStopLength = obj.length;
            break;
        case "stopallai":
            this._battler.friendsUnit().members().forEach(function(battler) {
                if (battler != this._battler){
                    battler._pauseAi = true;
                    battler._forceWaitCount = -1;
                }
            }.bind(this))
            this._battler.opponentsUnit().members().forEach(function(battler) {
                battler.endMotion();
                battler.clearAiData();
                battler._pauseAi = true;
            })
            this._stoppedAi = true;
            break;
        case "startallai":
            this.startAllAi();
            break;
        case "if":
        // Something similar to default damage formula :p
            var a = this._battler;
            var b = a._target;
            var v = $gameVariables._data;
            if (eval(obj.expression)){
                this._childDescriptor = new ChildDefaultMotionDescriptor(this._battler, obj.list);
            }
            break;
        case "endif":
        // Do nothing in DefaultMotionDescriptor, as this is not in a if statement.
            break;
        case "changeweapon":
            this._battler._weaponName = obj.name;
            break;
    }
    return false;
}

DefaultMotionDescriptor.prototype.startAllAi = function() {
    this._battler.friendsUnit().members().forEach(function(battler) {
        battler._forceWaitCount = 0;
        battler._pauseAi = false;
    });
    this._battler.opponentsUnit().members().forEach(function(battler) {
        battler._pauseAi = false;
    })
    this._stoppedAi = false;
}

DefaultMotionDescriptor.prototype.updateProcessingMotion = function() {
    this._processingMotionList.forEach(this.processProcessingMotion, this)
    var callback = function (obj){
        return obj.dur == 0;
    }
    var index = this._processingMotionList.findIndex(callback);
    while(index != -1){
        this._processingMotionList.splice(index,1);
        index = this._processingMotionList.findIndex(callback);
    }
}

// Process your motion need various frames at here
// Remember to include a "dur" property and set it to 0 when the process is finish.
DefaultMotionDescriptor.prototype.processProcessingMotion = function(obj) {
    switch(obj.type){
        case "wait":
            obj.dur--;
            break;
        case "move":
            var ddx = obj.dx / obj.dur;
            var ddy = obj.dy / obj.dur;
            this._battler.forceMoveWith(ddx * (this._battler._facing ? 1 : -1));
            this._battler._battleY += ddy;
            obj.dx -= ddx;
            obj.dy -= ddy;
            obj.dur--;
            break;
        case "rotation":
            var dr = obj.rotation - this._battler._rotation;
            this._battler._rotation += dr/obj.dur;
            obj.dur--;
            break;
        case "waitfall":
            if(this._battler.isGround() || !this._battler._motionFall){
                obj.dur = 0;
            }
            break;
        case "waitcast":
            obj.dur--;
            if(obj.dur == 0){
                this._battler._patternIndex = 0;
            }
            break;
    }
}

DefaultMotionDescriptor.prototype.release = function() {
    if (this._stoppedAi) {
        this.startAllAi();
    }
    AbstractMotionDescriptor.prototype.release.call(this);
}

DefaultMotionDescriptor.prototype.motionWaiting = function() {
    return (this._processingMotionList.find(function(obj){
        return obj.type.match(/wait/) != null;
    }) !== undefined);
}

//-----------------------------------------------------------------------------
// ChildDefaultMotionDescriptor
//
// Base class for motion descriptor.

function ChildDefaultMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

ChildDefaultMotionDescriptor.prototype = Object.create(DefaultMotionDescriptor.prototype);
ChildDefaultMotionDescriptor.prototype.constructor = ChildDefaultMotionDescriptor;

ChildDefaultMotionDescriptor.prototype.initialize = function (battler, list) {
    AbstractMotionDescriptor.prototype.initialize.apply(this,arguments);
    this._stoppedAi = false;
    this._processingMotionList = [];
    this._motionList = list;
    this._childDescriptor = null;
}

ChildDefaultMotionDescriptor.prototype.processMotion = function(obj) {
    switch(obj.type){
        case "endif":
            this._finish = true;
            break;
    }
    return DefaultMotionDescriptor.prototype.processMotion.call(this, obj);
}

//-----------------------------------------------------------------------------
// Game_Battler
//
// The superclass of Game_Actor and Game_Enemy. It contains methods for sprites
// and actions.

Kien.LMBS_Core.Game_Battler_InitMembers = Game_Battler.prototype.initMembers;
Game_Battler.prototype.initMembers = function(){
	Kien.LMBS_Core.Game_Battler_InitMembers.call(this);
	this._battleX = 0;
	this._battleY = 0; // 0: at ground. positive: at sky
	this._floatY = 0; // The height those people floating should be
	this._fallCount = 0;
    this._knockback = {
        "x": 0,
        "y": 0
    };
    this._knockdir = 0;
    this._moveSpeed = 4;
    this._facing = true; // true: inverse direction(right), false: not inverse(left)
    this._dash = false; // true when dashing, change the pose to "dash"
    this._jumpData = {
        "dur": 0, // Jump continues for 15 frames
        "sideSpeed": 0, // Speed moving horizontal plain.
        "falling": false // graph after jumping will be falling.
    };
    this._projectiles = []; // Projectile objects created by this battler.
    this._motionFall = true; // Allowed falling in skill motion
    this._target = null; // targeting battler
    this._guard = false; // Is guarding. when guarding, damage will reduced and knockback will not take place.
    this._guardDuration = 0; // length of guard left, used for AI
    this._moveTarget = 0 // X coordinate of target position. Y will only change when jumping.
    this._movedX = 0; // Use to revert moving.
    this._battleRect = null; // Rectangle provided by sprite. This will used as movement detection.
    this._attackRect = null; // Rectangle provided by sprite when this battler is attacking.
    this._skillMotionDescriptor = null;
    this.endMotion(); // Initialize Motion variables
    this._debugRects = []; // Additional colored rectangles drawn in screen for debug purpose
    this._rotation = 0; // rotation angle in degree.
    this._battleStart = false; // is the battle started or not
    this._forcePose = null; // pose that is forced
    this._forceWaitCount = 0; // count for hit-stop.
    this._hitStopLength = 15; // Length of hit-stop.
    this._knockbacking = false; // Is knockback or not
    ; // Weapon name specified by skill motion.
};


Game_Battler.prototype.update = function(){
    this._debugRects.clear();
    if (this._forceWaitCount > 0) {
        this._forceWaitCount--;
    }
	this.updateGravity();
    this.updateKnockback();
    this.updateGuard();
    this.updateMotion();
    if(!this.isMotion()){
        this.updatePose();
    }
    this.updateDamaging();
    this.updateJump();
    this.updateCollide();
    this.updateMoving();
};

Game_Battler.prototype.isGround = function(){
	if (this._battleY == this._floatY){
		return true;
	}
	return false;
};

Game_Battler.prototype.isFloat = function(){
	return false;
};


Game_Battler.prototype.isGuard = function() {
    return this._guard;
};

Game_Battler.prototype.isKnockback = function(){
    return this._knockbacking;
};

Game_Battler.prototype.isVerticalKnockback = function(){
    return !(this._knockback.y === 0);
};

Game_Battler.prototype.isMotion = function() {
    return this._skillMotionDescriptor !== null;
};

Game_Battler.prototype.isMotionLetFall = function() {
    return this._motionFall;
};

Game_Battler.prototype.isWaitInput = function() {
    return this._waitInput;
};

Game_Battler.prototype.isDamaging = function() {
    return !!this._damageInfo;
};

Game_Battler.prototype.isMoving = function() {
    return this._battleX != this._moveTarget;
};

Game_Battler.prototype.isJumping = function() {
    return this._jumpData.dur > 0;
};

Game_Battler.prototype.isFalling = function() {
    return this._jumpData.falling;
};

Game_Battler.prototype.isDashing = function() {
    return this.isMoving() && this._dash;
};

Game_Battler.prototype.isJumpProcess = function() {
    return this.isJumping() || this.isFalling();
};

Game_Battler.prototype.isForceWaiting = function() {
    return this._forceWaitCount != 0;
}

Game_Battler.prototype.isIdle = function() {
    return !this.isJumpProcess() && !this.isMotion() && !this.isMoving() && !this.isFalling() && !this.isKnockback() && !this.isDead() && !this.isForceWaiting();
};

Game_Battler.prototype.isActable = function() {
    return !this.isJumpProcess() && !this.isMotion() && !this.isKnockback() && !this.isDead() && !this.isForceWaiting();
}

Game_Battler.prototype.isAttacking = function() {
    return this._attackRect;
};

Game_Battler.prototype.isHit = function() {
    return this.isMotion() && this.isDamaging() && this._damageList.length > 0;
}

Game_Battler.prototype.hasProjectile = function() {
    return this._projectiles.length > 0;
};

Game_Battler.prototype.screenX = function(){
    return this._battleX;
};

Game_Battler.prototype.isOpaque = function() {
    return this._battleRect != null && !this.isDead();
};

Game_Battler.prototype.screenY = function(){
    return Kien.LMBS_Core.battleY - this._battleY;
};

Kien.LMBS_Core.Game_Battler_refresh = Game_Battler.prototype.refresh;
Game_Battler.prototype.refresh = function() {
    Kien.LMBS_Core.Game_Battler_refresh.call(this);
    if (this.isDead() && $gameParty.inBattle()){
        this.endMotion();
        this.clearAiData();
    }
};

Game_Battler.prototype.updateGravity = function(){
	if (!this.isGround() && !this.isFloat() && !this.isVerticalKnockback() && !this.isJumping() && (!this.isMotion() || this.isMotionLetFall()) && !this.isForceWaiting()) {
		var fv = Math.pow(this._fallCount,1)
		fv = Math.min(fv,Kien.LMBS_Core.fallMaxSpeed,(this._battleY-this._floatY));
		this._battleY -= fv;
        if(this._jumpData.sideSpeed != 0){
            this.moveWith(this._jumpData.sideSpeed);
        }
        this._fallCount++;
        if (this.isGround()){
            this._fallCount = 0;
            this._jumpData.falling = false;
            this._jumpData.sideSpeed = 0;
        }
	}
};

Game_Battler.prototype.updateDamaging = function() {
    if (this.isDamaging()){
        var nrect = this._damageInfo.rect;
        var attackRect = new Rectangle(nrect.x,nrect.y,nrect.width,nrect.height);
        if(this._facing){
            attackRect.x += this.screenX();
        } else {
            attackRect.x = this.screenX() - attackRect.x;
            attackRect.x -= attackRect.width;
        }
        attackRect.y += this.screenY() - attackRect.height;
        var memb = [];
        if (this.currentAction().isForFriend()){
            memb = this.friendsUnit().members();
        } else if (this.currentAction().isForOpponent()){
            memb = this.opponentsUnit().members();
        }
        memb.forEach(function(enemy){
            if (enemy.isAppeared() && (this.currentAction().isForDeadFriend() == enemy.isDead()) && enemy._battleRect.overlap(attackRect)){
                this.dealDamage(enemy);
            }
        }, this);
    }
}

Game_Battler.prototype.moveTo = function(target) {
    this._moveTarget = Math.round(target);
    this._moveTarget = Math.max(0,Math.min(Kien.LMBS_Core.battleWidth,this._moveTarget));
}

Game_Battler.prototype.moveWith = function(dx) {
    this.moveTo(this._battleX + dx);
}

Game_Battler.prototype.forceMove = function(target) {
    this._battleX = this._moveTarget = Math.round(target);
    this._moveTarget = this._battleX = Math.max(0,Math.min(Kien.LMBS_Core.battleWidth,this._battleX));
}

Game_Battler.prototype.forceMoveWith = function(dx) {
    this.forceMove(this._battleX + dx);
}

Game_Battler.prototype.jump = function(dir) {
    this._jumpData.dur = 15;
    this._jumpData.sideSpeed = this.moveSpeed() * (dir == 4 ? -1 : dir == 6 ? 1 : 0) ;
}

Game_Battler.prototype.knockback = function(knockback, knockdir){
    if (!this._guard){
        this._knockback.x = knockback.x;
        this._knockback.y = knockback.y;
        this._knockdir = knockdir;
        this._knockbacking = true;
    } else {
        if (this._guardDuration < Kien.LMBS_Core.autoGuardDuration) {
            this._guardDuration = Kien.LMBS_Core.autoGuardDuration;
        }
        this._knockback.x = 0;
        this._knockback.y = 0;
        this._knockdir = 0;
        this._knockbacking = false;
    }
}

Game_Battler.prototype.updateKnockback = function() {
    if(this.isKnockback() && !this.isForceWaiting()){
        if (this._knockback.x != 0 || this._knockback.y != 0){
            var dir = this._knockdir-5;
            this.forceMoveWith(this._knockback.x * dir);
            this._battleY += this._knockback.y;
            this._knockback.x = this._knockback.x * 3 / 4;
            this._knockback.y = this._knockback.y * 3 / 4;
            if (this._knockback.x < 0.05){
                this._knockback.x = 0;
            }
            if (this._knockback.y < 0.05){
                this._knockback.y = 0;
            }
        }
        if (this.isGround()) {
            this._knockbacking = false;
        }
    }
}

Game_Battler.prototype.updateGuard = function() {
    if (this._guard && !this.isForceWaiting()) {
        if (this._guardDuration > 0) {
            this._guardDuration--;
            if (this._guardDuration == 0) {
                this._guard = false;
            }
        }
    }
}

Game_Battler.prototype.updateMotion = function() {
    if (this.isMotion() && !this.isForceWaiting()) {
        if (this._skillMotionDescriptor.isFinish()) {
            this.endMotion();
        } else {
            this._skillMotionDescriptor.update();
        }
    }
}

Game_Battler.prototype.startDamage = function(obj) {
    this.clearDamage();
    obj.rect = new Rectangle(obj.rect.x,obj.rect.y,obj.rect.width,obj.rect.height);
    this._damageInfo = obj;
    if(this._actions[0]){
        this._actions[0]._damagePercentage = obj.damage;
    }
}

Game_Battler.prototype.registProjectile = function(obj) {
    this._projectiles.push(obj);
}

Game_Battler.prototype.shiftProjectile = function() {
    return this._projectiles.shift();
}

Game_Battler.prototype.updateMoving = function() {
    if(this.isMoving() && !this.isForceWaiting()){
        var mdir = (this._battleX - this._moveTarget) > 0 ? -1 : 1;
        var dx = Math.min(Math.abs(this._battleX - this._moveTarget),this.moveSpeed()) * mdir;
        this._movedX = dx;
        this.checkCollide();
        this._battleX += this._movedX;
        if (this._movedX != dx) {
            this._moveTarget = this._battleX;
        }
        if (mdir > 0){
            this._facing = true;
        } else {
            this._facing = false;
        }
    }
}

Game_Battler.prototype.checkCollide = function() {
    var newrect = this._battleRect.clone();
    newrect.x += this._movedX;
    var members = null;
    while (true) {
        if (this._movedX == 0){
            break;
        }
        if(!Kien.LMBS_Core.moveThroughAlly && !(Kien.LMBS_Core.dashThroughAlly && this.isDashing())){
            members = this.friendsUnit().members();
            if (members.findIndex(function(obj) {
                return obj.isOpaque() && newrect.overlap(obj._battleRect);
            }) != -1 ){
                this._movedX += this._movedX > 0 ? -1 : 1;
                newrect = this._battleRect.clone();
                newrect.x += this._movedX;
                continue;
            }
        }
        if(!Kien.LMBS_Core.moveThroughEnemy && !(Kien.LMBS_Core.dashThroughEnemy && this.isDashing())){
            members = this.opponentsUnit().members();
            if (members.findIndex(function(obj) {
                return obj.isOpaque() && newrect.overlap(obj._battleRect);
            }) != -1 ){
                this._movedX += this._movedX > 0 ? -1 : 1;
                newrect = this._battleRect.clone();
                newrect.x += this._movedX;
                continue;
            }
        }
        break;
    }

}

Game_Battler.prototype.moveSpeed = function() {
    return this._moveSpeed * (this._dash ? 2 : 1);
}

Game_Battler.prototype.updateJump = function() {
    if(this.isJumping() && !this.isForceWaiting()){
        this._battleY += Math.round(Kien.LMBS_Core.jumpPower * Math.pow(4/5,15-this._jumpData.dur));
        this.moveWith(this._jumpData.sideSpeed);
        this._jumpData.dur--;
        if(this._jumpData.dur == 0){
            this._jumpData.falling = true;
        }
    }
}

Game_Battler.prototype.updateCollide = function() {
    if (this.isForceWaiting()) {
        return;
    }
    var newrect = this._battleRect;
    if(!Kien.LMBS_Core.moveThroughAlly && !(Kien.LMBS_Core.dashThroughAlly && this.isDashing())){
        members = this.friendsUnit().members();
        var index = members.findIndex(function(obj) {
            return  obj != this && (obj.isOpaque() && newrect.overlap(obj._battleRect)) && (!Kien.LMBS_Core.dashThroughAlly || !obj.isDashing());
        });
        if (index != -1 ){
            var bat = members[index]._battleRect;
            if (bat.x == newrect.x) {
                this.forceMoveWith(-2);
                other.forceMoveWith(2);
            } else if (bat.x >= newrect.x){
                this.forceMoveWith(-4);
                //other.forceMoveWith(4);
            } else {
                this.forceMoveWith(4);
                //other.forceMoveWith(-4);
            }
            return;
        }
    }
    if(!Kien.LMBS_Core.moveThroughEnemy && !(Kien.LMBS_Core.dashThroughEnemy && this.isDashing())){
        members = this.opponentsUnit().members();
        var index = members.findIndex(function(obj) {
            return obj.isOpaque() && newrect.overlap(obj._battleRect) && (!Kien.LMBS_Core.dashThroughEnemy || !obj.isDashing());
        });
        if (index != -1 ){
            var bat = members[index]._battleRect;
            var other = members[index];
            if (bat.x == newrect.x) {
                this.forceMoveWith(-2);
                other.forceMoveWith(2);
            } else if (bat.x >= newrect.x){
                this.forceMoveWith(-4);
                //other.forceMoveWith(4);
            } else {
                //other.forceMoveWith(-4);
                this.forceMoveWith(4);
            }
            return;
        }
    }
}

Game_Battler.prototype.updatePose = function() {
    if (!!this._forcePose){
        this._pose = this._forcePose;
        return;
    }
    if(this.isDead()){
        this._pose = "Dead";
        return;
    }
    if(this.isJumping()){
        this._pose = "Jump";
        return;
    }
    if(this.isFalling()){
        this._pose = "Fall";
        return;
    }
    if(this.isDashing()){
        this._pose = "Dash";
        return;
    }
    if(this.isMoving()){
        this._pose = "Walk";
        return;
    }
    if(this.isKnockback()){
        this._pose = "Damage";
        return;
    }
    if(this.isGuard()){
        this._pose = "Guard";
        return;
    }
    this._pose = "Stand";
}

Kien.LMBS_Core.Game_Battlre_clearMotion = Game_Battler.prototype.clearMotion;
Game_Battler.prototype.clearMotion = function() {
	Kien.LMBS_Core.Game_Battlre_clearMotion.call(this);
	this._pose = "Stand";
};

Kien.LMBS_Core.Game_Battler_onBattleEnd = Game_Battler.prototype.onBattleEnd;
Game_Battler.prototype.onBattleEnd = function() {
    Kien.LMBS_Core.Game_Battler_onBattleEnd.call(this);
    this._battleRect = null;
    this._battleStart = false;
    this._forcePose = null;
};

Kien.LMBS_Core.Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
Game_Battler.prototype.onBattleStart = function() {
    Kien.LMBS_Core.Game_Battler_onBattleStart.call(this);
    this._battleStart = true;
    this._forcePose = null;
    this.initBattlePosition();
};

Game_Battler.prototype.initBattlePosition = function() {
    
}

Game_Battler.prototype.endMotion = function() {
    if (this._skillMotionDescriptor !== null) {
        this._skillMotionDescriptor.release();
    }
    this._skillMotionDescriptor = null; // Skill motion descriptor for current motion.
    this._patternIndex = -1;
    this._pose = "Stand";
    this._weaponName = null;
    this._waitInput = false; // accepting input.
    this._motionFall = true;
    this._rotation = 0;
    this._hitStopLength = 15;
    this.clearDamage();
}

Game_Battler.prototype.clearDamage = function() {
    // _damageList: a list of enemies that has been damage through this dmaage process
    // will refresh every time enddamage is called.
    this._damageList = [];
    // _damageInfo:
    // an object contains information that used for calculating damage
    // this object contains following properties:
    // type: not really have meaning in this use
    // rect: an area that damage occurs. x,y coordinate is a relative coordinate from the character coordinate
    // damage: an value multiplied to item/skill damage. 1 will be 100%
    // knockback: strength of knockback applied to targets. A Point object which describes x and y direction's strength.
    this._damageInfo = null;
}

Game_Battler.prototype.loadMotionFromObject = function(obj) {
    this.endMotion();
    var klass = Kien.LMBS_Core.loadMotionDescriptorClass(obj);
    if (klass) {
        this._skillMotionDescriptor = new klass(this);
    }
}

Game_Battler.prototype.useSkill = function(skillId){
    var skill = $dataSkills[skillId];
    if (skill && this.canUseLMBS(skill)){
        var action = new Game_Action(this);
        action.setSkill(skillId);
        this.setAction(0,action);
        this.loadMotionFromObject(skill);
        BattleManager.refreshStatus();
    }
}

// Force the skill to be casted, without checkign the condition.
Game_Battler.prototype.forceSkill = function(skillId){
    var skill = $dataSkills[skillId];
    if (skill){
        var action = new Game_Action(this);
        action.setSkill(skillId);
        this.setAction(0,action);
        this.loadMotionFromObject(skill);
        BattleManager.refreshStatus();
    }
}

Game_Battler.prototype.useItemLMBS = function(itemId){
    var item = $dataItems[itemId];
    if (item && this.canUseLMBS(item)){
        var action = new Game_Action(this);
        action.setItem(itemId);
        this.setAction(0,action);
        this.loadMotionFromObject(item);
        BattleManager.refreshStatus();
    }
}

Game_Battler.prototype.forceItemLMBS = function(itemId){
    var item = $dataItems[itemId];
    if (item){
        var action = new Game_Action(this);
        action.setItem(itemId);
        this.setAction(0,action);
        this.loadMotionFromObject(item);
        BattleManager.refreshStatus();
    }
}

Game_BattlerBase.prototype.canUseLMBS = function(obj) {
    var klass = Kien.LMBS_Core.loadMotionDescriptorClass(obj);
    if (klass) {
        return klass.prototype.canUse(this, obj);
    } else {
        return AbstractMotionDescriptor.prototype.canUse(this, obj);
    }
};

Game_Battler.prototype.dealDamage = function(target) {
    if(this._damageList.indexOf(target) == -1){
        this._actions[0].apply(target);
        var dir = this._damageInfo.knockdir ? (this._facing ? 4 : 6) : (this._facing ? 6 : 4);
        target.startDamagePopup();
        if (this._actions[0].isDamage() || this._actions[0].isDrain()){
            target.endMotion();
            target.knockback(this._damageInfo.knockback, dir);
        }
        BattleManager.refreshStatus();
        this._damageList.push(target);
        this._forceWaitCount = this._hitStopLength;
        target._forceWaitCount = this._hitStopLength;
    }
}

Game_Battler.prototype.forceDamage = function(target) {
    this._actions[0].apply(target);
    var dir = this._damageInfo.knockdir ? (this._facing ? 4 : 6) : (this._facing ? 6 : 4);
    target.knockback(this._damageInfo.knockback, dir);
    target.startDamagePopup();
    if (this._actions[0].isDamage() || this._actions[0].isDrain()){
        target.endMotion();
    }
    BattleManager.refreshStatus();
}

Game_Battler.prototype.getWeaponName = function() {
    return this._weaponName;
}

//-----------------------------------------------------------------------------
// Game_LMBSAiBase
//
// The superclass of AI Action.
// required property for setup
// battler: battler who this ai object is controlling.

function Game_LMBSAiBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiBase.prototype.initialize = function() {
}

Game_LMBSAiBase.prototype.setup = function(obj){
    this._battler = obj.battler
}

Game_LMBSAiBase.prototype.isFinish = function() {
    return true;
}

Game_LMBSAiBase.prototype.update = function() {
    if (this._battler.isKnockback() || this._battler.isGuard()){
        if (!this.isFinish){
            this.setFinish();
            this._battler.pushAi(Game_LMBSAiIdleAction,{'duration':5});
            this._battler.pushAiWaitIdle();
        }
    }
}

Game_LMBSAiBase.prototype.setFinish = function() {

}

//-----------------------------------------------------------------------------
// Game_LMBSAiWaitIdle
//
// The superclass of AI Action.

function Game_LMBSAiWaitIdle() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiWaitIdle.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiWaitIdle.prototype.constructor = Game_LMBSAiWaitIdle;

Game_LMBSAiWaitIdle.prototype.isFinish = function() {
    return this._battler.isIdle();
}

//-----------------------------------------------------------------------------
// Game_LMBSAiMoveTo
//
// The superclass of AI Action.
// required properties in setup:
//  target: move target for battler, need property _battleX.
//  battler: battler who is 

function Game_LMBSAiMoveTo() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiMoveTo.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiMoveTo.prototype.constructor = Game_LMBSAiMoveTo;

Game_LMBSAiMoveTo.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiMoveTo.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiMoveTo.prototype.setFinish = function() {
    this._finish = true;
}

Game_LMBSAiMoveTo.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._target = obj.target;

}

Game_LMBSAiMoveTo.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    if (!!this._target && !!this._battler && !this._finish){
        var tx = this._target._battleX;
        var dir = tx > this._battler._battleX ? 1 : -1;
        var dx = tx - this._battler._battleX;
        this._battler._dash = true;
        if (dx == 0) {
            this._finish = true;
            this._battler._dash = false;
            return;
        }
        this._battler.moveWith(Math.min(this._battler.moveSpeed(),Math.abs(dx))*dir);
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiAttackMove
//
// Ai Action to move and detect enemy in range.

function Game_LMBSAiAttackMove() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiAttackMove.prototype = Object.create(Game_LMBSAiMoveTo.prototype);
Game_LMBSAiAttackMove.prototype.constructor = Game_LMBSAiAttackMove;

Game_LMBSAiAttackMove.prototype.initialize = function() {
    Game_LMBSAiMoveTo.prototype.initialize.apply(this,arguments);
}

Game_LMBSAiAttackMove.prototype.setup = function(obj) {
    Game_LMBSAiMoveTo.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiAttackMove.prototype.update = function() {
    if (!!this._target && !!this._battler && !this._finish) {
        var dist = this._distance;
        var newRect = this._battler._battleRect.clone();
        if (!this._battler._facing){
            newRect.x -= dist;
        } else {
            newRect.x += newRect.width
        }
        newRect.width = dist;
        this._battler._debugRects.push(newRect);
        if (this._battler.opponentsUnit().members().findIndex(function(enemy){
            return enemy._battleRect.overlap(newRect);
        }) != -1){
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._finish = true;
            return;
        }
    }
    Game_LMBSAiMoveTo.prototype.update.apply(this);
}

function Game_LMBSAiCertainAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiCertainAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiCertainAction.prototype.constructor = Game_LMBSAiCertainAction;

Game_LMBSAiCertainAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiCertainAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiCertainAction.prototype.isFinish = function() {
    return this._phase == 1;
}

Game_LMBSAiCertainAction.prototype.setFinish = function() {
    this._phase = 1;
}


Game_LMBSAiCertainAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            if (this._battler._aiData.readySkillIsItem) {
                this._battler.useItemLMBS(this._battler._aiData.readySkill.id);
            } else {
                this._battler.useSkill(this._battler._aiData.readySkill.id);
            }
            this._phase = 1;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorChainSkill
//
// Ai Action to chain skill automatically

function Game_LMBSAiActorChainSkill() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorChainSkill.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorChainSkill.prototype.constructor = Game_LMBSAiActorChainSkill;

Game_LMBSAiActorChainSkill.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiActorChainSkill.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiActorChainSkill.prototype.setFinish = function() {
    this._finish = true;
}

Game_LMBSAiActorChainSkill.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    if (!!this._battler && !this._finish) {
            if (this._battler.isMotion()){
                if (this._battler.isWaitInput()){
                    var avail = this._battler.chooseAvailableSkills(this._battler._availableAttacks);
                    if (avail.length > 0){
                        var skill = avail.sample();
                        this._battler.useSkill(skill.id);
                    } else {
                        var pri = Kien.LMBS_Core.getSkillPriority(this._battler._actions[0].item());
                        var highpri = this._battler.highestSkillPriority();
                        if (pri == highpri || pri < 0) {
                            this.updateAiAttackNegativePriority();
                        } else {
                            var n = 1;
                            var skill = this._battler.attackSkills().filter(function(s) {
                                return Kien.LMBS_Core.getSkillPriority(s) == (pri + n) && this._battler.canUseLMBS(s);
                            }, this).sample();
                            while (!skill && pri+n <= highpri){
                                n++;
                                skill = this._battler.attackSkills().filter(function(s) {
                                return Kien.LMBS_Core.getSkillPriority(s) == (pri + n) && this._battler.canUseLMBS(s);
                                }, this).sample();
                            }
                            if (skill) {
                                this._battler.useSkill(skill.id);
                            } else {
                                this.updateAiAttackNegativePriority();
                            }
                        }
                    }
                }
            } else {
                this._finish = true;
            }
    }
}

Game_LMBSAiActorChainSkill.prototype.updateAiAttackNegativePriority = function() {
    var pri = Kien.LMBS_Core.getSkillPriority(this._battler._actions[0].item());
    if (pri != -1) {
        var skill = this._battler.attackSkills().filter(function(s) {
            return Kien.LMBS_Core.getSkillPriority(s) == -2 && this._battler.canUseLMBS(s);
        }, this).sample();
        if (!skill) {
            skill = this._battler.attackSkills().filter(function(s) {
                return Kien.LMBS_Core.getSkillPriority(s) == -1 && this._battler.canUseLMBS(s);
            }, this).sample();
        }
        if (skill) {
            this._battler.useSkill(skill.id);
        } else {
            this._finish = true;
        }
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorPhysicalAction
//
// Ai Action to chain skill automatically

function Game_LMBSAiActorPhysicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorPhysicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorPhysicalAction.prototype.constructor = Game_LMBSAiActorPhysicalAction;

Game_LMBSAiActorPhysicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorPhysicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiActorPhysicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiActorPhysicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiActorPhysicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase) {
        case 0:
            this._battler.pushAi(Game_LMBSAiAttackMove,{'dist': this._distance,'target': this._battler._target});
            this._phase = 1;
            break;
        case 1:
            this._battler.startAiIdle(true);
            this._battler.pushAi(Game_LMBSAiActorChainSkill);
            this._phase = 2;
            break;
        }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorMagicAction
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiActorMagicAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorMagicAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorMagicAction.prototype.constructor = Game_LMBSAiActorMagicAction;

Game_LMBSAiActorMagicAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorMagicAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiActorMagicAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiActorMagicAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiActorMagicAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0:// Back to initial position, and use the skill
            var tx = $gameParty.battlerPosition(this._battler);
            this._battler.pushAi(Game_LMBSAiMoveTo, {'target': {'_battleX':tx}});
            this._phase = 1;
            return;
        case 1: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiIdleAction
//
// Ai Action to be idle between actions

function Game_LMBSAiIdleAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiIdleAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiIdleAction.prototype.constructor = Game_LMBSAiIdleAction;

Game_LMBSAiIdleAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
}

Game_LMBSAiIdleAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._duration = obj.duration;
    this._dir = obj.dir;
    this._moveDur = obj.moveDur;
}

Game_LMBSAiIdleAction.prototype.isFinish = function() {
    return this._duration <= 0;
}

Game_LMBSAiIdleAction.prototype.setFinish = function() {
    this._duration = 0;
}

Game_LMBSAiIdleAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    this._duration--;
    this._battler._dash = false;
    if(this._dir && this._moveDur > 0){
        this._battler.moveWith(this._battler.moveSpeed()*this._dir);
        this._moveDur--;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiForceActionFinish
//
// Ai Action to be idle between actions

function Game_LMBSAiForceActionFinish() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiForceActionFinish.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiForceActionFinish.prototype.constructor = Game_LMBSAiForceActionFinish;

Game_LMBSAiForceActionFinish.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._finish = false;
}

Game_LMBSAiForceActionFinish.prototype.isFinish = function() {
    return this._finish;
}

Game_LMBSAiForceActionFinish.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    this._battler._aiData.forceAi = false;
    this._battler._aiData.readySkillIsItem = false;
    this._finish = true;
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorBase
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiActorBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiActorBase.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiActorBase.prototype.constructor = Game_LMBSAiActorBase;

Game_LMBSAiActorBase.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiActorBase.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiActorBase.prototype.isFinish = function() {
    // As the basic Ai for battlers, this Ai will never finish.
    //To Pause Ai just do nothing in its update, or push Game_LMBSAiIdleAction.
    return false;
}

Game_LMBSAiActorBase.prototype.update = function() {
    if (this._battler.isMotion()) {
        this._battler.pushAiWaitIdle();
        if (this._battler._actions[0].isPhysical()){
            this._battler.pushAi(Game_LMBSAiActorChainSkill);
        }
        return;
    }
    var max = this._battler._aiData.attackRate + this._battler._aiData.magicRate;
    var ran = Math.randomInt(max);
    if (ran < this._battler._aiData.attackRate || this._battler.magicSkills().length == 0) {
        // When chosen the normal attack, or there have no magic skills.
        this._battler._aiData.actionType = 'attack';
        this._battler._aiData.readySkill = this._battler.chooseAvailableSkills(this._battler._availableAttacks).sample();
        if(this._battler._aiData.readySkill) {
            this._battler.chooseTarget();
            if (this._battler._target) {
                var dist = Kien.LMBS_Core.getSkillRange(this._battler._aiData.readySkill);
                this._battler.pushAi(Game_LMBSAiActorPhysicalAction,{'dist': dist});
            } else {
                this._battler.startAiIdle(false);
            }
        } else {
            this._battler.startAiIdle(false);
        }
    } else {
        // When chosen the magic attack.
        this._battler._aiData.actionType = 'magic';
        this._battler._aiData.readySkill = this._battler.chooseRandomSkill(this._battler.chooseAvailableSkills(this._battler.magicSkills()));
        if (this._battler._aiData.readySkill) {
            this._battler.chooseTarget();
            if (this._battler._target){
                this._battler.pushAi(Game_LMBSAiActorMagicAction);
            } else {
                this._battler.startAiIdle(false);
            }
        } else {
            this._battler.startAiIdle(false);
        }
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiForceAction
//
// Ai Action which cast or uses a determined Skill/Item.

function Game_LMBSAiForceAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiForceAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiForceAction.prototype.constructor = Game_LMBSAiForceAction;

Game_LMBSAiForceAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._item = obj.item;
    this._target = obj.target;
    this._oldTarget = null;
    this._phase = 0;
}

Game_LMBSAiForceAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiForceAction.prototype.update = function() {
    switch(this._phase){
        case 0: 
            this._oldTarget = this._battler._target;
            this._battler._target = this._target;
            this._battler._aiData.readySkill = this._item;
            this._battler._aiData.readySkillIsItem = DataManager.isItem(this._item);
            if (this._battler._aiData.readySkillIsItem) {
                this._battler.pushAi(Game_LMBSAiCertainAction);
            } else if (this._item.hitType == Game_Action.HITTYPE_PHYSICAL){
                var dist = Kien.LMBS_Core.getSkillRange(this._battler._aiData.readySkill);
                this._battler.pushAi(Game_LMBSAiActorPhysicalAction,{'dist': dist});
            } else if (this._item.hitType == Game_Action.HITTYPE_MAGICAL) {
                this._battler.pushAi(Game_LMBSAiActorMagicAction);
            } else {
                this._battler.startAiIdle(true);
                this._battler.pushAiWaitIdle();
                this._battler.pushAi(Game_LMBSAiCertainAction);
            }
            this._phase = 1;
            break;
        case 1:
            this._battler._target = this._oldTarget;
            this._phase = 2;
            break;
    }
}

//-----------------------------------------------------------------------------
// Game_Actor
//
// The game object class for an actor.

Kien.LMBS_Core.Game_Actor_initMembers = Game_Actor.prototype.initMembers;
Game_Actor.prototype.initMembers = function() {
    Kien.LMBS_Core.Game_Actor_initMembers.call(this);
    this._attackSets = {}; // Preloaded Attack Motion Sets. ["dir"] shows different direction.
    this._skillSets = {}; // Skills can performed with skill button. ["dir"] shows different direction.
    this._inputData = {};
    this._inputData.lastDir = 0;
    this._inputData.lastDirPast = 0;
    this._inputData.reservedInput = null;
    this._inputData.reservedInputDir = 0;
    this._inputData.jumpInputDur = 0;
}

Kien.LMBS_Core.Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
    Kien.LMBS_Core.Game_Actor_setup.call(this, actorId);
    this.loadBaseAiClass();
    this.loadVictorySkill();
    this.loadMoveSpeed();
    this.clearAiData();
}

Game_Actor.prototype.loadBaseAiClass = function() {
    this._aiData = {};
    if (this.actor().meta["Attack Rate"]){
        var subs = this.actor().meta["Attack Rate"].split(",");
        this._aiData.attackRate = parseInt(subs[0],10);
        this._aiData.magicRate = parseInt(subs[1],10);
    } else {
        this._aiData.attackRate = 50;
        this._aiData.magicRate = 50;
    }
    if (this.actor().meta["Target Type"]){
        this.loadTargetType(this.actor().meta["Target Type"]);
    } else {
        this._aiData.targetType = "nearest";
    }
    this._aiData.classname = "Game_LMBSAiActorBase";
    if (this.actor().meta["Ai Class"]) {
        this._aiData.classname = his.actor().meta["Ai Class"];
    }
}

Game_Actor.prototype.loadVictorySkill = function() {
    this._victorySkillId = -1;
    if (this.actor().meta["Victory Skill"]){
        this._victorySkillId = parseInt(this.actor().meta["Victory Skill"],10);
    }
}

Game_Actor.prototype.loadMoveSpeed = function() {
    if (this.actor().meta["Move Speed"]){
        this._moveSpeed = parseInt(this.actor().meta["Move Speed"],10);
    }
}

Game_Actor.prototype.clearAiData = function() {
    this._pauseAi = false;
    this._aiTree = [];
    this._aiData.readySkill = null; // Skill that character Ai is trying to use.
    this._aiData.forceAi = false; // Force to move by AI even the player is controlling it
    if ($gameParty.inBattle()) {
        var ai = eval(this._aiData.classname);
        this.pushAi(ai);
    }
}

Game_Actor.prototype.resetAi = function() {
    this.clearAiData();
}

Game_Actor.prototype.pushAi = function(aiClass, obj) {
    var ai = new aiClass();
    if (!obj) {
        obj = {};
    }
    obj.battler = this;
    ai.setup(obj);
    this._aiTree.push(ai);
}

Kien.LMBS_Core.Game_Actor_shouldDisplayLevelUp = Game_Actor.prototype.shouldDisplayLevelUp;
Game_Actor.prototype.shouldDisplayLevelUp = function() {
    if ($gameParty.inBattle()){
        return false;
    }
    return Kien.LMBS_Core.Game_Actor_shouldDisplayLevelUp.call(this);
};

Game_Actor.prototype.pushAiWaitIdle = function() {
    this.pushAi(Game_LMBSAiWaitIdle);
}

Game_Actor.prototype.forceAi = function(aiClass,obj) {
    this.clearAiData();
    this._aiData.forceAi = true;
    this.pushAi(Game_LMBSAiForceActionFinish);
    this.pushAi(aiClass,obj);
    this.pushAiWaitIdle();
}

Game_Actor.prototype.forceActionLMBS = function(obj,target) {
    this.forceAi(Game_LMBSAiForceAction,{'item': obj,'target': target});
}

Game_Actor.prototype.loadTargetType = function(string) {
    switch(string){
        case "Nearest":
        case "Farest":
        case "HighestHP":
        case "LowestHP":
            this._aiData.targetType = string.toLowerCase();
            return;
    }
    this._aiData.targetType = "nearest";
}

Game_Actor.prototype.highestSkillPriority = function() {
    var array = this.attackSkills();
    var pri = 0;
    for (var i = 0; i < array.length; i++){
        var pri2 = Kien.LMBS_Core.getSkillPriority(array[i]);
        if (pri2 > pri){
            pri = pri2;
        }
    }
    return pri;
}

Game_Actor.prototype.lowestSkillPriority = function() {
    var array = this.attackSkills();
    var pri = 0;
    for (var i = 0; i < array.length; i++){
        var pri2 = Kien.LMBS_Core.getSkillPriority(array[i]);
        if (pri2 < pri){
            pri = pri2;
        }
    }
    return pri;
}

Kien.LMBS_Core.Game_Actor_initImage = Game_Actor.prototype.initImages;
Game_Actor.prototype.initImages = function() {
	Kien.LMBS_Core.Game_Actor_initImage.call(this);
	var actor = this.actor();
	if(actor.meta["Battler Name"]){
		this._battlerName = actor.meta["Battler Name"];
	}
};

Game_Actor.prototype.onBattleStart = function() {
    Game_Battler.prototype.onBattleStart.call(this);
    this.resetAi();
    this.initAttackSkills();
};

Game_Actor.prototype.onBattleEnd = function() {
    Game_Battler.prototype.onBattleEnd.call(this);
    this.resetAi();
};

Game_Actor.prototype.update = function() {
    Game_Battler.prototype.update.call(this);
    if (BattleManager.isBattleEnd() || !this._battleStart) {
        this._battleStart = false;
        return;
    }
    if (!this.isDead()) {
        if (this.isPlayerActor() && !this.isAiForcing()) {
            this.updateInputGuard();
            this.updateInputAttack();
            this.updateInputSkill();
            if (!this.isMotion() && !this.isGuard()) {
                this.updateInputDash();
                if(this._inputData.lastDir != 0){
                    this._inputData.lastDirPast++;
                    if (this._inputData.lastDirPast > Kien.LMBS_Core.doubleTapDur){
                        this._inputData.lastDir = 0;
                        this._inputData.lastDirPast = 0;
                    }
                }
                this.updateInputJump();
                this.updateInputMovement();
            }
        } else if (((this.isAiActing() && !this.isPlayerActor()) || this.isAiForcing())) {
            this.updateAi();
        } else if (!this.isAiActing()) {
            this.clearAiData();
        }
    }
}

Game_Actor.prototype.updateInputGuard = function() {
    if(Input.isPressed('LMBSguard') && !this.isMotion()){
        this._guard = true;
        this._guardDuration = 2;
    }
}

Game_Actor.prototype.updateInputAttack = function() {
    if(Input.isPressed('ok')){
        this.useNormalAttack(Input.dir4);
    }
}

Game_Actor.prototype.updateInputSkill = function() {
    if(Input.isPressed('cancel')){
        var d4 = Input.dir4;
        if(d4 == 4){
            d4 = (this._facing ? 4 : 6)
        } else if (d4 == 6){
            d4 = (this._facing ? 6 : 4)
        }
        this.useRegistedSkill(d4);
    }
}

Game_Actor.prototype.updateInputMovement = function() {
    if(this.isActable()){
        if(Input.isPressed('left')){
            this.moveWith(-(this.moveSpeed()));
        } else if (Input.isPressed('right')){
            this.moveWith(this.moveSpeed());
        } else {
            this._dash = false;
        }
    }
}

Game_Actor.prototype.updateInputJump = function() {
    if(Input.isPressed('up') && this.isActable()){
        this._inputData.jumpInputDur++;
        if (this._inputData.jumpInputDur == Kien.LMBS_Core.inputDelay){
            var dir = Input.isPressed('left') ? 4 : Input.isPressed('right') ? 6 : 0
            this.jump(dir);   
        }
    } else {
        this._inputData.jumpInputDur = 0;
    }
}

Game_Actor.prototype.updateInputDash = function() {
    if (Input.isTriggered('left')){
        if(this._inputData.lastDir == 4){
            this._dash = true
        } else {
            this._inputData.lastDir = 4;
            this._inputData.lastDirPast = 0;
        }
    }
    if (Input.isTriggered('right')){
        if(this._inputData.lastDir == 6){
            this._dash = true;
        } else {
            this._inputData.lastDir = 6;
            this._inputData.lastDirPast = 0;
        }
    }
}

Game_Actor.prototype.updatePose = function() {
    if (!this._battleStart){
        return;
    }
    Game_Battler.prototype.updatePose.apply(this);
}

Game_Actor.prototype.isPlayerActor = function() {
    return BattleManager.actor() == this;
}

Game_Actor.prototype.isAiActing = function() {
    return (this._aiTree.filter(function(obj) {
        return !obj.isFinish();
    }).length !== 0 );
}

Game_Actor.prototype.isAiForcing = function() {
    return this._aiData.forceAi;
}

Game_Actor.prototype.magicSkills = function() {
    return this.skills().filter(function(skill) {
        return skill.hitType === Game_Action.HITTYPE_MAGICAL
    })
}

Game_Actor.prototype.attackSkills = function() {
    return this.skills().filter(function(skill) {
        return skill.hitType === Game_Action.HITTYPE_PHYSICAL
    })
}

Game_Actor.prototype.updateAi = function() {
    if (this._pauseAi) {
        return;
    }
    var ai = this._aiTree[this._aiTree.length - 1];
    while (true){
        if (ai && ai.isFinish()){
            this._aiTree.pop();
            ai = this._aiTree[this._aiTree.length - 1];
        } else {
            break;
        }
    }
    if (ai){
        ai.update();
    }
}

Game_Actor.prototype.startAiIdle = function(canMove) {
    var obj = {'duration' :Math.randomInt(90) + 60};
    if(canMove){
        obj.moveDur = Math.randomInt(15) + 15;
        obj.dir = Math.randomInt(2) == 0 ? -1 : 1;
    }
    this.pushAi(Game_LMBSAiIdleAction, obj);
}

Game_Actor.prototype.chooseAvailableSkills = function(skills) {
    return skills.filter(function(skill){
        return this.canUseLMBS(skill);
    }, this);
}

Game_Actor.prototype.chooseRandomSkill = function(skills) {
    return skills[Math.randomInt(skills.length)];
}

Game_Actor.prototype.chooseTarget = function() {
    this._target = null;
    switch (this._aiData.targetType){
        case "nearest":
            this.chooseNearestTarget();
            break;
        case "farest":
            this.chooseFarestTarget();
            break;
        case "highesthp":
            this.chooseHighestHpTarget();
            break;
        case "lowesthp":
            this.chooseLowestHpTarget();
            break;
    }
    if (this._target == null) {
        this.chooseNearestTarget();
    }
}

Game_Actor.prototype.chooseNearestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Actor.prototype.chooseFarestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Actor.prototype.chooseHighestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Actor.prototype.chooseLowestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameTroop.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Actor.prototype.initBattlePosition = function() {
    this._battleX = $gameParty.battlerPosition(this);
    this._moveTarget = this._battleX;
    this._target = $gameTroop.members()[0];
    this._battleY = 0;
}

Game_Actor.prototype.initAttackSkills = function() {
    this.loadAttackSkills(this.actor());
}

Game_Actor.prototype.loadAttackSkills = function(noteObject) {
    this._attackSets = {};
    this._availableAttacks = [];
    if(noteObject && noteObject.note){
        var dirs = [0,2,4,6,8];
        for (var i = 0; i < dirs.length ; i++) {
            var dir = dirs[i]
            if (noteObject.meta["Attack Skill Set "+dir]) {
                this._attackSets[""+dir] = parseInt(noteObject.meta["Attack Skill Set "+dir],10);
                var skill = $dataSkills[parseInt(noteObject.meta["Attack Skill Set "+dir],10)];
                if (skill){
                    this._availableAttacks.push(skill);
                }
            }
        }
        if (this._attackSets["0"] && !this._attackSets["2"] && !this._attackSets["4"] && !this._attackSets["6"] && !this._attackSets["8"]){
            this._attackSets["2"] = this._attackSets["4"] = this._attackSets["6"] = this._attackSets["8"] = this._attackSets["0"];
        }
    }
}

Game_Actor.prototype.useSkill = function(skillId){
    Game_Battler.prototype.useSkill.call(this,skillId);
    var skill = $dataSkills[skillId];
    // Want some way to confirm useSkill in Game_Battler is succeed or not...
    if (this._actions[0] && this._actions[0].item() == skill){
        this.loadAttackSkills(skill);
    }
}

Game_Actor.prototype.endMotion = function() {
    var opose,opi;
    if (BattleManager.isBattleEnd() || !this._battleStart) {
        opose = this._pose;
        opi = this._patternIndex;
    }
    Game_Battler.prototype.endMotion.call(this);
    this.initAttackSkills();
     if (BattleManager.isBattleEnd() || !this._battleStart) {
        this._pose = opose;
        this._patternIndex = opi;
     }
}

Game_Actor.prototype.useNormalAttack = function(dir) {
    var id = this._attackSets[dir.toString()];
    if(id){
        this.useSkill(id);
    }
}

Game_Actor.prototype.useRegistedSkill = function(dir) {
    var id = this._skillSets[dir.toString()];
    if(id){
        this.useSkill(id);
    }
}

Game_Actor.prototype.performVictorySkill = function() {
    if (this._victorySkillId >= 0){
        var action = new Game_Action(this);
        action.setSkill(this._victorySkillId);
        this.setAction(0,action);
        this.loadMotionFromObject($dataSkills[this._victorySkillId]);
    } else {
        this._forcePose = 'Victory';
    }
}


Game_Actor.prototype.getWeaponName = function() {
    if (this._weaponName) {
        return weaponName;
    }
    if (this.weapons()[0] && this.weapons()[0].meta["Weapon Name"]) {
        return this.this.weapons()[0].meta["Weapon Name"];
    }
    if (this.currentClass() && this.currentClass().meta["Weapon Name"]) {
        return this.currentClass().meta["Weapon Name"];
    }
    if (this.actor() && this.actor().meta["Weapon Name"]) {
        return this.actor().meta["Weapon Name"];
    }
    return "";
}

//-----------------------------------------------------------------------------
// Game_LMBSAiActorPhysicalAction
//
// Ai Action to chain skill automatically

function Game_LMBSAiEnemyPhysicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyPhysicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyPhysicalAction.prototype.constructor = Game_LMBSAiEnemyPhysicalAction;

Game_LMBSAiEnemyPhysicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyPhysicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
    this._distance = obj.dist;
}

Game_LMBSAiEnemyPhysicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiEnemyPhysicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiEnemyPhysicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase) {
        case 0:
            this._battler.pushAi(Game_LMBSAiAttackMove,{'dist': this._distance,'target': this._battler._target});
            this._phase = 1;
            break;
        case 1:
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            break;
        }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiEnemyMagicalAction
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiEnemyMagicalAction() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyMagicalAction.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyMagicalAction.prototype.constructor = Game_LMBSAiEnemyMagicalAction;

Game_LMBSAiEnemyMagicalAction.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyMagicalAction.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiEnemyMagicalAction.prototype.isFinish = function() {
    return this._phase == 2;
}

Game_LMBSAiEnemyMagicalAction.prototype.setFinish = function() {
    this._phase = 2;
}

Game_LMBSAiEnemyMagicalAction.prototype.update = function() {
    Game_LMBSAiBase.prototype.update.call(this);
    switch (this._phase){
        case 0:// Back to initial position, and use the skill
            var tx = Kien.LMBS_Core.enemyXStart + this._battler._screenX;
            this._battler.pushAi(Game_LMBSAiMoveTo, {'target': {'_battleX':tx}});
            this._phase = 1;
            return;
        case 1: 
            this._battler._moveTarget = this._battler._battleX;
            this._battler._facing = (this._battler._target._battleX > this._battler._battleX);
            this._battler.useSkill(this._battler._aiData.readySkill.id);
            this._battler.startAiIdle(true);
            this._battler.pushAiWaitIdle();
            this._phase = 2;
            return;
    }
}

//-----------------------------------------------------------------------------
// Game_LMBSAiCertainAction
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

//-----------------------------------------------------------------------------
// Game_LMBSAiActorBase
//
// Ai Action use Magic Skills at a certain position.
// What this action do is:
//  1. move actor to its initial position
//  2. Let him cast the skill.
//  3. Wait him finish his skill.
// and then handout the control of actor to its parent AI.

function Game_LMBSAiEnemyBase() {
    this.initialize.apply(this,arguments);
}

Game_LMBSAiEnemyBase.prototype = Object.create(Game_LMBSAiBase.prototype);
Game_LMBSAiEnemyBase.prototype.constructor = Game_LMBSAiEnemyBase;

Game_LMBSAiEnemyBase.prototype.initialize = function() {
    Game_LMBSAiBase.prototype.initialize.apply(this,arguments);
    this._phase = 0;
}

Game_LMBSAiEnemyBase.prototype.setup = function(obj) {
    Game_LMBSAiBase.prototype.setup.apply(this,arguments);
}

Game_LMBSAiEnemyBase.prototype.isFinish = function() {
    // As the basic Ai for battlers, this Ai will never finish.
    //To Pause Ai just do nothing in its update.
    return false;
}

Game_LMBSAiEnemyBase.prototype.update = function() {
    var actionList = this._battler.availableActions();
    if (actionList.length > 0 && this._battler._target !== null) {
        var ratingZero = this._battler.actionListRatingMax(actionList) - 3;
        var action = this._battler.selectAction(actionList,ratingZero);
        if (action) {
            var skill = $dataSkills[action.skillId];
            if (skill.hitType == Game_Action.HITTYPE_MAGICAL){
                this._battler._aiData.actionType = 'magic';
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.pushAi(Game_LMBSAiEnemyMagicalAction);
            } else if (skill.hitType == Game_Action.HITTYPE_PHYSICAL) {
                this._battler._aiData.actionType = 'attack';
                var dist = Kien.LMBS_Core.getSkillRange(skill);
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.pushAi(Game_LMBSAiEnemyPhysicalAction,{'dist': dist });
            } else {
                this._battler._aiData.actionType = 'certain';
                this._battler._aiData.readySkill = skill;
                this._battler.chooseTarget();
                this._battler.startAiIdle(true);
                this._battler.pushAiWaitIdle();
                this._battler.pushAi(Game_LMBSAiCertainAction);
            }
        } else {
            this._battler.startAiIdle();
        }
    } else {
        this._battler.startAiIdle();
    }
}

//-----------------------------------------------------------------------------
// Game_Enemy
//
// The game object class for an enemy.

//Kien.LMBS_Core.Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
//Game_Enemy.prototype.initMembers = function() {
//   Kien.LMBS_Core.Game_Enemy_initMembers.call(this);
//}

Game_Enemy.prototype.clearAiData = function() {
    this._aiTree = [];
    this._aiData.readySkill = null; // Skill Id that character Ai is trying to use.
    this._pauseAi = false;
    var ai = eval(this._aiData.classname);
    this.pushAi(ai);
}

Game_Enemy.prototype.resetAi = function() {
    this.clearAiData();
}

Game_Enemy.prototype.pushAi = function(aiClass, obj) {
    var ai = new aiClass();
    if (!obj) {
        obj = {};
    }
    obj.battler = this;
    ai.setup(obj);
    this._aiTree.push(ai);
}

Game_Enemy.prototype.pushAiWaitIdle = function() {
    this.pushAi(Game_LMBSAiWaitIdle);
}

Game_Enemy.prototype.forceAi = function(aiClass,obj) {
    this.clearAiData();
    this.pushAi(aiClass,obj);
    this.pushAiWaitIdle();
}

Game_Enemy.prototype.screenX = function(){
    return $gameSystem._LMBSEnabled ? this._battleX : this._screenX;
};

Game_Enemy .prototype.screenY = function(){
    return $gameSystem._LMBSEnabled ? Kien.LMBS_Core.battleY - this._battleY : this._screenY;
};

Kien.LMBS_Core.Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
    Kien.LMBS_Core.Game_Enemy_setup.apply(this,arguments);
    this._aiData = {};
    if (this.enemy().meta["Target Type"]){
        this.loadTargetType(this.enemy().meta["Target Type"]);
    } else {
        this._aiData.targetType = "nearest";
    }
    if (this.enemy().meta["Ai Class"]){
        this._aiData.classname = this.enemy().meta["Ai Class"];
    } else {
        this._aiData.classname = 'Game_LMBSAiEnemyBase';
    }
    if (this.enemy().meta["Move Speed"]){
        this._moveSpeed = parseInt(this.enemy().meta["Move Speed"],10);
    }
    this.clearAiData();
};

Game_Enemy.prototype.loadTargetType = function(string) {
    switch(string){
        case "Nearest":
        case "Farest":
        case "HighestHP":
        case "LowestHP":
            this._aiData.targetType = string.toLowerCase();
            return;
    }
    this._aiData.targetType = "nearest";
}

Game_Enemy.prototype.chooseTarget = function() {
    this._target = null;
    switch (this._aiData.targetType){
        case "nearest":
            this.chooseNearestTarget();
            break;
        case "farest":
            this.chooseFarestTarget();
            break;
        case "highesthp":
            this.chooseHighestHpTarget();
            break;
        case "lowesthp":
            this.chooseLowestHpTarget();
            break;
    }
    if (this._target == null) {
        this.chooseNearestTarget();
    }
}

Game_Enemy.prototype.chooseNearestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseFarestTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = Math.abs(n._battleX-thisx);
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseHighestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist < dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.chooseLowestHpTarget = function() {
    var thisx = this._battleX;
    var enemies = $gameParty.aliveMembers();
    var dist = 0;
    for (var index = 0; index < enemies.length; index++) {
        var n = enemies[index];
        var dx = n.hp;
        if (!this._target || dist > dx){
            if(!(this._aiData.actionType == "attack") || !BattleManager.hasObstacle(this,n)) {
                this._target = n;
                dist = dx;
            }
        }
    }
}

Game_Enemy.prototype.isAiActing = function() {
    return (this._aiTree.filter(function(obj) {
        return !obj.isFinish();
    }).length !== 0 );
}

Game_Enemy.prototype.availableActions = function() {
    return this.enemy().actions.filter(function(a) {
            return this.isActionValid(a);
        }, this);
}

Game_Enemy.prototype.actionListRatingMax = function(actionList) {
    return Math.max.apply(null, actionList.map(function(a) {
        return a.rating;
    }));
}

Game_Enemy.prototype.actionsToSkills = function(actionList) {
    return actionList.map(function(a) {
        return $dataSkills[a.skillId];
    })
}

Kien.LMBS_Core.Game_Enemy_battlerName = Game_Enemy.prototype.battlerName;
Game_Enemy.prototype.battlerName = function() {
    if (!$gameSystem._LMBSEnabled) {
        return Kien.LMBS_Core.Game_Enemy_battlerName.call(this);
    }
    if(typeof this._battlerName == "undefined"){
    	if(this.enemy().meta["Battler Name"]){
    		this._battlerName = this.enemy().meta["Battler Name"];
    	} else {
    		this._battlerName = null;
    	}
    }
    return this._battlerName || Kien.LMBS_Core.Game_Enemy_battlerName.call(this);
}

Game_Enemy.prototype.initBattlePosition = function(){
    this._battleX = Kien.LMBS_Core.enemyXStart + this._screenX;
    this._moveTarget = this._battleX;
    this._target = $gameParty.members()[0];
    this._battleY = 0;
    this._facing = false;
}

Game_Enemy.prototype.update = function() {
    Game_Battler.prototype.update.call(this);
    if (BattleManager.isBattleEnd() || this._battleStart) {
        this._battleStart = false;
        return;
    }
    if (!this.isDead()){
        this.updateAiAction();
    }
}

Game_Enemy.prototype.updateAiAction = function() {
    if (this._pauseAi) {
        return;
    }
    var ai = this._aiTree[this._aiTree.length - 1];
    while (true){
        if (ai && ai.isFinish()){
            this._aiTree.pop();
            ai = this._aiTree[this._aiTree.length - 1];
        } else {
            break;
        }
    }
    if (ai){
        ai.update();
    }
}

Game_Enemy.prototype.startAiIdle = function(canMove) {
    var obj = {'duration' :Math.randomInt(90) + 60};
    if(canMove){
        obj.moveDur = Math.randomInt(15) + 15;
        obj.dir = Math.randomInt(2) == 0 ? -1 : 1;
    }
    this.pushAi(Game_LMBSAiIdleAction, obj);
}

Game_Enemy.prototype.getWeaponName = function() {
    if (this._weaponName) {
        return this.weaponName;
    }
    if (this.enemy().meta["Weapon Name"]) {
        return this.enemy().meta["Weapon Name"];
    }
    return "";
}

//-----------------------------------------------------------------------------
// Game_Unit
//
// The superclass of Game_Party and Game_Troop.

Game_Unit.prototype.update = function(){
    this.members().forEach(function(battler){
        battler.update();
    })
}

//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Kien.LMBS_Core.Game_Party_initialize = Game_Party.prototype.initialize;
Game_Party.prototype.initialize = function() {
    Kien.LMBS_Core.Game_Party_initialize.apply(this);
    this._lastBattleActorIndexLMBS = 0;
};
//-----------------------------------------------------------------------------
// Game_Party
//
// The game object class for the party. Information such as gold and items is
// included.

Game_Party.prototype.battlerPosition = function(battler){
	return 100 + this.battleMembers().indexOf(battler) * 80;
}

//-----------------------------------------------------------------------------
// Game_Interpreter
//
// The interpreter for running event commands.

// Battle Processing
Kien.LMBS_Core.Game_Interpreter_command301 = Game_Interpreter.prototype.command301;
Game_Interpreter.prototype.command301 = function() {
    if (!$gameParty.inBattle()) {
        if (!$gameSystem._LMBSEnabled) {
            return Kien.LMBS_Core.Game_Interpreter_command301.call(this);
        }
        var troopId;
        if (this._params[0] === 0) {  // Direct designation
            troopId = this._params[1];
        } else if (this._params[0] === 1) {  // Designation with a variable
            troopId = $gameVariables.value(this._params[1]);
        } else {  // Same as Random Encounter
            troopId = $gamePlayer.makeEncounterTroopId();
        }
        if ($dataTroops[troopId]) {
            BattleManager.setup(troopId, this._params[2], this._params[3]);
            BattleManager.setEventCallback(function(n) {
                this._branch[this._indent] = n;
            }.bind(this));
            $gamePlayer.makeEncounterCount();
            SceneManager.push(Scene_BattleLMBS);
        }
    }
    return true;
}

Game_Interpreter.prototype.setEventPause = function(args) {
    if (args[0] == "true") {
        $gameSystem._LMBSBattleEventPauseGame = true;
    } else if (args[0] == "false") {
        $gameSystem._LMBSBattleEventPauseGame = false;
    }
}

Kien.lib.addPluginCommand("PauseBattle",Game_Interpreter.prototype.setEventPause);

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

Kien.LMBS_Core.Window_SkillType_makeCommandList = Window_SkillType.prototype.makeCommandList;
Window_SkillType.prototype.makeCommandList = function() {
    Kien.LMBS_Core.Window_SkillType_makeCommandList.call(this);
    if (this._actor && !$gameParty.inBattle()){
        this.addCommand(Kien.LMBS_Core.skillTypeName, 'config', true);
    }
};

//-----------------------------------------------------------------------------
// Window_SkillType
//
// The window for selecting a skill type on the skill screen.

function Window_SkillConfig() {
    this.initialize.apply(this, arguments);
}

Window_SkillConfig.prototype = Object.create(Window_Command.prototype);
Window_SkillConfig.prototype.constructor = Window_SkillConfig;

Window_SkillConfig.prototype.initialize = function(x, y) {
    Window_Command.prototype.initialize.call(this, x, y);
    this._actor = null;
}

Window_SkillConfig.prototype.windowWidth = function() {
    return 240;
};

Window_SkillConfig.prototype.setActor = function(actor) {
    if (this._actor !== actor) {
        this._actor = actor;
        this.refresh();
    }
};

Window_SkillConfig.prototype.numVisibleRows = function() {
    return Kien.LMBS_Core.skillSetRightLeft ? 4 : 5;
};

Window_SkillConfig.prototype.makeCommandList = function() {
    if (!this._actor){
        return;
    }
    var lsit = [];
    var string = [];
    if (Kien.LMBS_Core.skillSetRightLeft) {
        list = ["0","8","4","2"];
        strings = ["X","↑X","←→X","↓X"];
    } else {
        list = ["0","8","4","6","2"];
        strings = ["X","↑X","←X","→X","↓X"];
    }
    for (var index = 0;index < list.length; index++) {
        this.addCommand(strings[index],'skill',true,list[index]);
    }
};

Window_SkillConfig.prototype.drawItem = function(index) {
    Window_Command.prototype.drawItem.call(this,index);
    if (this._actor){
    var rect = this.itemRectForText(index);
    var skill = $dataSkills[this._actor._skillSets[this._list[index].ext]];
        if (skill){
            this.drawText(skill.name, rect.x, rect.y, rect.width, "right");
        }
    }
};

//-----------------------------------------------------------------------------
// Window_BattleStatusLMBS
//
// Window Use to show Battler Status.

function Window_BattleStatusLMBS() {
    this.initialize.apply(this, arguments);
}

Window_BattleStatusLMBS.prototype = Object.create(Window_Selectable.prototype);
Window_BattleStatusLMBS.prototype.constructor = Window_BattleStatusLMBS;

Window_BattleStatusLMBS.prototype.initialize = function() {
    Window_Selectable.prototype.initialize.call(this,0,0,0,0);
    var h = this.lineHeight()+12+this.standardPadding()*2;
    var w = Graphics.boxWidth;
    var y = Graphics.boxHeight - h;
    this.deactivate();
    this.width = w;
    this.height = h;
    this.y = y;
    //this.backOpacity = 0;
    this.opacity = 0;
    this.createContents();
    this.refresh();
};

Window_BattleStatusLMBS.prototype.maxCols = function() {
    return 4;
};

Window_BattleStatusLMBS.prototype.maxItems = function() {
    return $gameParty.battleMembers().length;
}

Window_BattleStatusLMBS.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
    var fillW = Math.floor(width * rate);
    var gaugeY = y;
    this.contents.fillRect(x, gaugeY, width, 6, this.gaugeBackColor());
    this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
};

Window_BattleStatusLMBS.prototype.drawItem = function(index) {
    var actor = $gameParty.battleMembers()[index];
    this.clearItem(index);
    var tw = Graphics.boxWidth / 4;
    var tx = tw * index + 15;
    this.drawText(actor.name(),tx,0,tw-30);
    this.changeTextColor(this.hpGaugeColor1());
    this.drawText(actor.hp.toString(),tx,0,tw-30,'right');
    this.resetTextColor();
    this.drawGauge(tx, this.lineHeight(), tw-30, actor.mpRate(), this.mpGaugeColor1(), this.mpGaugeColor2());
    this.drawGauge(tx, this.lineHeight()+6, tw-30, actor.tpRate(), this.tpGaugeColor1(), this.tpGaugeColor2());
}

Window_BattleStatusLMBS.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    rect.width = this.width / 4;
    rect.x = rect.width * index + 15;
    rect.height = this.height;
    return rect;
}

Window_BattleStatusLMBS.prototype.clearItem = function(index) {
    var width = this.width / 4;
    var x = width * index;
    this.contents.clearRect(x,0,width,this.height);
}

Window_BattleStatusLMBS.prototype.selectLast = function() {
    this.select($gameParty._lastBattleActorIndexLMBS);
}

Window_BattleStatusLMBS.prototype.actor = function() {
    return $gameParty.battleMembers()[this.index()];
}

Window_BattleStatusLMBS.prototype.isCurrentItemEnabled = function() {
    return this.isEnabled(this.actor());
};

Window_BattleStatusLMBS.prototype.isEnabled = function(actor) {
    return true;
}

//-----------------------------------------------------------------------------
// Window_EquipCommand
//
// The window for selecting a command on the equipment screen.

function Window_BattleCommandLMBS() {
    this.initialize.apply(this, arguments);
}

Window_BattleCommandLMBS.prototype = Object.create(Window_HorzCommand.prototype);
Window_BattleCommandLMBS.prototype.constructor = Window_BattleCommandLMBS;

Window_BattleCommandLMBS.prototype.initialize = function(x, y) {
    this._windowWidth = 128;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
    var maxwidth = Math.max(this.textWidth(Kien.LMBS_Core.battleSkillName),this.textWidth(Kien.LMBS_Core.battleItemName));
    this.width = maxwidth * 2 + this.textPadding()*4+this.standardPadding()*2;
    this.createContents();
    this.refresh();
    this.deactivate();
    this.openness = 0;
};

Window_BattleCommandLMBS.prototype.windowWidth = function() {
    return 1;
};

Window_BattleCommandLMBS.prototype.maxCols = function() {
    return 2;
};

Window_BattleCommandLMBS.prototype.makeCommandList = function() {
    this.addCommand(Kien.LMBS_Core.battleSkillName, 'skill', true, Kien.LMBS_Core.battleSkillIcon);
    this.addCommand(Kien.LMBS_Core.battleItemName, 'item', true, Kien.LMBS_Core.battleItemIcon);
};

// Window_BattleCommandLMBS.prototype.drawItem = function(index) {
//     var rect = this.itemRectForText(index);
//     var align = this.itemTextAlign();
//     this.resetTextColor();
//     this.changePaintOpacity(this.isCommandEnabled(index));
//     this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
//     this.drawIcon(this._list[index].ext, rect.x,0);
// };

// Window_BattleCommandLMBS.prototype.itemRectForText = function(index) {
//     var rect = this.itemRect(index);
//     rect.x += 32;
//     rect.width -= 32;
//     return rect;
// };

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
    this._lastBattleEventPause = false;
    this._autoMessageSkippingDuration = 120;
};

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
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].weaponX;
    }
    return 0;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponY = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].weaponY;
    }
    return 0;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponAngle = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].weaponAngle;
    }
    return 0;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponHide = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].hideWeapon;
    }
    return false;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponBack = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].weaponBack;
    }
    return false;
}

Sprite_BattlerLMBS.prototype.getCurrentWeaponMirror = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].weaponMirror;
    }
    return false;
}

Sprite_BattlerLMBS.prototype.getCurrentBoxWidth = function() {
    if (this.currentBitmapCache().json) {
        var pi = this._battler._patternIndex >= 0 ? this._battler._patternIndex : parseInt(this._animationCount / Kien.LMBS_Core.animationSpeed,10);
        return this.currentBitmapCache().json.frames[pi].width;
    } else {
        return this.currentBitmapCache().boxwidth;
    }
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
        var sprite = new (eval(obj.classname))(obj.parameters, this);
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
    this._weaponSprite._hide = this.getCurrentWeaponHide();
    this._weaponSprite._angle = this.getCurrentWeaponAngle() ? this.getCurrentWeaponAngle() : 0;
    this._weaponParentSprite.scale.x = this.getCurrentWeaponMirror() ? -1 : 1;
    this._weaponSprite.update();
}

Sprite_BattlerLMBS.prototype.setupDamagePopup = function() {
    if (this._battler.isDamagePopupRequested()) {
        var sprite = new Sprite_Damage();
        sprite.x = this.x + this.damageOffsetX();
        sprite.y = this.y + this.damageOffsetY();
        sprite.setup(this._battler);
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
        return null;
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
//-----------------------------------------------------------------------------
// Sprite_ActorLMBS
//
// Add some Player specified methods, such as collapse effect.

function Sprite_ActorLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_ActorLMBS.prototype = Object.create(Sprite_BattlerLMBS.prototype);
Sprite_ActorLMBS.prototype.constructor = Sprite_ActorLMBS;

Sprite_ActorLMBS.prototype.initialize = function(battler){
    Sprite_BattlerLMBS.prototype.initialize.call(this,battler);
}

//-----------------------------------------------------------------------------
// Sprite_EnemyLMBS
//
// Add some Enemy specified methods, such as collapse effect.

function Sprite_EnemyLMBS() {
    this.initialize.apply(this, arguments);
}



Sprite_EnemyLMBS.prototype = Object.create(Sprite_BattlerLMBS.prototype);
Sprite_EnemyLMBS.prototype.constructor = Sprite_EnemyLMBS;

Sprite_EnemyLMBS.prototype.initialize = function(battler){
    Sprite_BattlerLMBS.prototype.initialize.call(this,battler);
}

Sprite_EnemyLMBS.prototype.initMembers = function(battler) {
    Sprite_BattlerLMBS.prototype.initMembers.call(this,battler);
    this._effectDuration = 0;
    this._collapsed = false;
}

Sprite_EnemyLMBS.prototype.update = function() {
    Sprite_BattlerLMBS.prototype.update.call(this);
    this.updateCollapseEffect();
}

Sprite_EnemyLMBS.prototype.updateCollapseEffect = function() {
    if(!this._collapsed && this._battler.isDead()){
        this._collapsed = true;
        this._effectDuration = 32;
    }
    if (this._collapsed && this._effectDuration > 0){
        this._effectDuration--;
        this.updateCollapse();
        if(this._effectDuration == 0){
            this.visible = false;
        }
    }
}

Sprite_EnemyLMBS.prototype.updateCollapse = function() {
    this.blendMode = Graphics.BLEND_ADD;
    this.setBlendColor([255, 128, 128, 128]);
    this.opacity *= this._effectDuration / (this._effectDuration + 1);
};

//-----------------------------------------------------------------------------
// Sprite_WeaponLMBS
//
// use to show weapon image. Properties should be set correctly by battler sprite.

function Sprite_WeaponLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_WeaponLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_WeaponLMBS.prototype.constructor = Sprite_WeaponLMBS;

Sprite_WeaponLMBS.caches = {};

Sprite_WeaponLMBS.prototype.initialize = function(parentSprite){
    Sprite_Base.prototype.initialize.call(this);
    parentSprite.addChild(this);
    this._angle = 0;
    this._hide = false;
    this._prop = null;
    this._name = "";
}

Sprite_WeaponLMBS.prototype.setup = function(filename) {
    this._name = filename;
    if (filename.length === 0) {
        this.bitmap = null;
        this._prop = null;
        return;
    }
    this.bitmap = ImageManager.loadWeapon(filename);
    this._prop = Sprite_WeaponLMBS.caches[filename];
    if (!this._prop) {
        var xhr = new XMLHttpRequest();
        var url = 'img/weapons/'+filename+'.json';
        xhr.open('GET', url, false);
        xhr.overrideMimeType('application/json');
        xhr.onload = function() {
            if (xhr.status < 400) {
                this._prop = JSON.parse(xhr.responseText);
                this.onLoadFinish();
            }
        }.bind(this);
        xhr.onerror = function() {
            this._prop = {};
            this._prop.ox = 0;
            this._prop.oy = 0;
            this._prop.angle = 0;
            this.onLoadFinish();
        }.bind(this);
        xhr.send();
    } else {
        this.onLoadFinish();
    }
}

Sprite_WeaponLMBS.prototype.update = function() {
    if (this._prop) {
        this.updateAngle();
        this.updateVisible();
        this.updateAnchor();
    }
}

Sprite_WeaponLMBS.prototype.updateAngle = function() {
    this.rotation = Math.deg2Rad(this._prop.angle + this._angle);
}

Sprite_WeaponLMBS.prototype.updateVisible = function() {
    this.visible = !this._hide;
}

Sprite_WeaponLMBS.prototype.updateAnchor = function() {
    this.anchor.x = 0.5 + this._prop.ox / this.bitmap.width;
    this.anchor.y = 0.5 + this._prop.oy / this.bitmap.height;
}

Sprite_WeaponLMBS.prototype.onLoadFinish = function() {
    Sprite_WeaponLMBS.caches[this._name] = this._prop;
}

//-----------------------------------------------------------------------------
// Sprite_ProjectileLMBS
//
// Basic Projectile class.

function Sprite_ProjectileLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_ProjectileLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_ProjectileLMBS.prototype.constructor = Sprite_ProjectileLMBS;

Sprite_ProjectileLMBS.prototype.initialize = function(parameters, sprite){
    Sprite_Base.prototype.initialize.call(this);
    if(parameters.match(/(.+)\,(\d+)\,(\d+)\,([+-]?\d+)\,([+-]?\d+)\,(\d+(?:\.\d+)?)\,(\d+)\,(\d+)\,(\d+)/)){
        var filename = RegExp.$1;
        var framenumber = parseInt(RegExp.$2);
        var animationSpeed = parseInt(RegExp.$3);
        var xspeed = parseInt(RegExp.$4);
        var yspeed = parseInt(RegExp.$5);
        var damagePer = parseFloat(RegExp.$6);
        var knockbackx = parseInt(RegExp.$7);
        var knockbacky = parseInt(RegExp.$8);
        var knockbackdir = parseInt(RegExp.$9);
    }
    this._xspeed = xspeed || 3;
    this._yspeed = yspeed || 0;
    this._damagePer = damagePer || 1;
    this._frameNumber = framenumber || 1;
    this._animationSpeed = animationSpeed || 1;
    this._bitmapName = filename || "";
    this._knockbackx = knockbackx || 5;
    this._knockbacky = knockbacky || 5;
    this._knockbackdir = knockbackdir || 0;
    this._direction = 0;
    this._finish = false;
    this._animationCount = 0;
    this._hit = false;
    this.visible = false;
    this.updateBitmap();
    this.x = sprite._battler.screenX();
    this.y = sprite._battler.screenY();
    this._userSprite = sprite;
    this.anchor.x = 0.5;
    this.anchor.y = 1;
    this.visible = true;
    this._battler = sprite._battler;
    this._direction = (this._battler._facing ? 1 : -1);
    this.scale.x = this._direction * (Kien.LMBS_Core.defaultFacing ? 1 : -1);
    this._action = new Game_Action(this._battler);
    this._action.setSkill(this._battler._actions[0].item().id);
    this._action._damagePercentage = this._damagePer;
}

Sprite_ProjectileLMBS.prototype.updateBitmap = function() {
    if(!this.bimtap){
        this.bitmap = ImageManager.loadProjectile(this._bitmapName);
    }
}

Sprite_ProjectileLMBS.prototype.removeLMBS = function() {

}

Sprite_ProjectileLMBS.prototype.update = function() {
    if (!this._finish){
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
    var pn = Math.floor(this._animationCount / this._animationSpeed);
    var pw = Math.floor(this.bitmap.width / fn);
    var px = pw * pn;
    this.setFrame(px,0,pw,this.bitmap.height);
}

Sprite_ProjectileLMBS.prototype.updateDamage = function() {
    if (this._userSprite){
        var rect = this.boundRect();
        var memb = this._userSprite.oppositeMembers();
        memb.forEach(function(enemy){
            if(!enemy._battler.isDead() && enemy.battlerBox().overlap(rect) && !this._hit){
                this._action.apply(enemy._battler);
                var dir = this._knockbackdir ? ( 5 - this._direction ) : ( 5 + this._direction );
                enemy._battler.knockback({"x": this._knockbackx, "y": this._knockbacky},dir);
                enemy._battler.endMotion();
                enemy._battler.startDamagePopup();
                this._hit = true;
            }
        }, this);
        if(this._hit){
            this.visible = false;
            this._finish = true;
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
    return (this.x < 0 || this.x > Kien.LMBS_Core.battleWidth || this.y < 0 || this.y > Graphics.height);
}


//-----------------------------------------------------------------------------
// Sprite_AnimationLMBS
//
// The sprite for displaying an animation.
// Extends from Sprite_Animation, with ability to load json timing and
// process it.

function Sprite_AnimationLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_AnimationLMBS.prototype = Object.create(Sprite_Animation.prototype);
Sprite_AnimationLMBS.prototype.constructor = Sprite_AnimationLMBS;

Sprite_AnimationLMBS.prototype.initialize = function(parameters, sprite){
    Sprite_Animation.prototype.initialize.call(this);
    //                    origin,    dx,         dy,    jsoname   id,  delay,      mirror,          follow
    if (parameters.match(/(.+?)\,([+-]?\d+)\,([+-]?\d+)\,(.+?)\,(\d+)\,(\d+)\,(true|false|null)\,(true|false)/)){
        var origin = RegExp.$1;
        var dx = parseInt(RegExp.$2,10);
        var dy = parseInt(RegExp.$3,10);
        var filename = RegExp.$4;
        var obj = Kien.LMBS_Core.createAnimationTimingFromName(filename);
        var animationId = parseInt(RegExp.$5,10);
        var delay = parseInt(RegExp.$6,10);
        var mirror = eval(RegExp.$7);
        var follow = eval(RegExp.$8);
    }
    this._timingArray = obj || {};
    this._originName = origin || "target";
    this._dx = dx || 0;
    this._dy = dy || 0;
    this._animation = $dataAnimations[animationId] || null;
    this._delay = delay || 0;
    this._mirror = mirror
    this._follow = follow || false;
    this._targetSprite = null;
    this._finish = false;
    this._userSprite = sprite;
    this._battler = sprite._battler;
    this._targetSprite =  sprite.targetSprite();
    this._animationPosition = {
        "x" : this.animationX(),
        "y" : this.animationY(),
        "height" : this._targetSprite.height
    }
    this._action = new Game_Action(this._battler);
    this._action.setSkill(this._battler._actions[0].item().id);
    if (this._mirror === null) {
        this._mirror = !this._battler._facing;
    }
    if(this._targetSprite && this._animation){
        if (this._mirror){
           this.scale.x = -1;
        }
        this.setup(this._targetSprite , this._animation, this._mirror, this._delay);
    } else {
        this._finish = true;
    }
}

Sprite_AnimationLMBS.prototype.updateCellSprite = function(sprite, cell) {
    var pattern = cell[0];
    if (pattern >= 0) {
        var sx = pattern % 5 * 192;
        var sy = Math.floor(pattern % 100 / 5) * 192;
        var mirror = this._mirror;
        sprite.bitmap = pattern < 100 ? this._bitmap1 : this._bitmap2;
        sprite.setFrame(sx, sy, 192, 192);
        sprite.x = cell[1];
        sprite.y = cell[2];
        sprite.rotation = cell[4] * Math.PI / 180;
        sprite.scale.x = cell[3] / 100;
        if (cell[5]) {
            sprite.scale.x *= -1;
        }
        sprite.scale.y = cell[3] / 100;
        sprite.opacity = cell[6];
        sprite.blendMode = cell[7];
        sprite.visible = this._target.visible;
    } else {
        sprite.visible = false;
    }
};

Sprite_AnimationLMBS.prototype.initMembers = function() {
    Sprite_Animation.prototype.initMembers.call(this);
    this._timingArray = {};
    this._processingTiming = [];
}


Sprite_AnimationLMBS.prototype.animationX = function() {
    switch (this._originName) {
        case "target":
            return (this._targetSprite._battler.screenX() + this._dx);
        case "user":
            return (this._userSprite._battler.screenX() + this._dx);
        case "screen":
            return (this._dx);
    }
    return 0;
}

Sprite_AnimationLMBS.prototype.animationY = function() {
    switch (this._originName) {
        case "target":
            return (this._targetSprite._battler.screenY() + this._dy);
        case "user":
            return (this._userSprite._battler.screenY() + this._dy);
        case "screen":
            return (this._dy);
    }
    return 0;
}

Sprite_AnimationLMBS.prototype.removeLMBS = function() {
    this.remove();
}


Sprite_AnimationLMBS.prototype.updateMain = function() {
    Sprite_Animation.prototype.updateMain.call(this);
    this.updateTestData();
    if (this.isPlaying() && this.isReady() && this._delay == 0) {
        this.updateDamage();
    }
    if(!this.isPlaying()){
        this._finish = true;
    }
}

Sprite_AnimationLMBS.prototype.updateTestData = function() {
    if(Kien.LMBS_Core.isTest() && SceneManager._scene._testBitmap){
        var color = "rgba(0,255,0,0.5)";
        for (var i = 0; i < this._processingTiming.length; i++) {
            var obj = this._processingTiming[i];
            var rectsource = obj.rect;
            var rect = new Rectangle(rectsource.x,rectsource.y,rectsource.width,rectsource.height);
            rect.x += this.x;
            rect.y += this.y;
            SceneManager._scene._testBitmap.fillRect(rect.x,rect.y,rect.width,rect.height,color);
        }
    }
}

Sprite_AnimationLMBS.prototype.updateDamage = function() {
    var memb = this._userSprite.oppositeMembers();
    var func = function(enemy){
        if(!enemy._battler.isDead() && enemy.battlerBox().overlap(rect) && obj.hitted.indexOf(enemy) == -1){
            this._action.apply(enemy._battler);
            var dir = obj.knockdir ? (this._battler._facing ? 4 : 6) : (this._battler._facing ? 6 : 4);
            enemy._battler.knockback(obj.knockback,dir);
            enemy._battler.endMotion();
            enemy._battler.startDamagePopup();
            BattleManager.refreshStatus();
            obj.hitted.push(enemy);
        }
    };
    for (var i = 0; i < this._processingTiming.length; i++) {
        var obj = this._processingTiming[i];
        var rectsource = obj.rect;
        this._action._damagePercentage = obj.damagePer;
        var rect = new Rectangle(rectsource.x,rectsource.y,rectsource.width,rectsource.height);
        rect.x += this.x;
        rect.y += this.y;
        memb.forEach(func, this);
    }
}

Sprite_AnimationLMBS.prototype.updatePosition = function() {
    Sprite_Animation.prototype.updatePosition.call(this);
    if (this._follow) {
        this._animationPosition.x = this.animationX();
        this._animationPosition.y = this.animationY();
    }
    this.x = this._animationPosition.x;
    this.y = this._animationPosition.y;
    if (this._animation.position == 0){
        this.y -= this._animationPosition.height;
    }
    if (this._animation.position == 1){
        this.y -= this._animationPosition.height/2
    }

};

Sprite_AnimationLMBS.prototype.updateFrame = function() {
    Sprite_Animation.prototype.updateFrame.call(this);
    if (this._duration > 0) {
        this.updateTiming();
        this.updateProcessingTiming();
    }
}

Sprite_AnimationLMBS.prototype.updateTiming = function() {
    var index = this.currentFrameIndex().toString();
    if(this._timingArray[index]){
        var array = this._timingArray[index];
        for (var i = 0; i < array.length;i++){
            var obj = Object.create(array[i]);
            obj.hitted = [];
            if (obj.knockdir == 0){
                obj.knockdir = this._battler._facing ? 6 : 4;
            }
            this._processingTiming.push(obj);
        }
    }
}

Sprite_AnimationLMBS.prototype.updateProcessingTiming = function() {
    for (var i = 0; i<this._processingTiming.length; i++) {
        this._processingTiming[i].dur--;
    }
    var func = function(obj) {
        return obj.dur == 0;
    };
    var index = this._processingTiming.findIndex(func)
    while(index >= 0){
        this._processingTiming.splice(index,1);
        index = this._processingTiming.findIndex(func);
    }
}


//-----------------------------------------------------------------------------
// Sprite_BattleRewardLMBS
//
// Sprite use to show rewards in battle result.

function Sprite_BattleRewardLMBS() {
    this.initialize.apply(this, arguments);
}

Sprite_BattleRewardLMBS.prototype = Object.create(Sprite_Base.prototype);
Sprite_BattleRewardLMBS.prototype.constructor = Sprite_BattleRewardLMBS;

Sprite_BattleRewardLMBS.prototype.initialize = function(parameters){
    Sprite_Base.prototype.initialize.call(this);
    this.bitmap = new Bitmap(1,1);
    this.x = 100;
    this.y = (Graphics.boxHeight-200)/2;
    this.sprites = [];
    this._count = 0;
    this._start = false;
    this._finish = false;
    this._itemNum = 0;
}

Sprite_BattleRewardLMBS.prototype.isFinish = function() {
    return this._finish;
}

Sprite_BattleRewardLMBS.prototype.start = function() {
    this._start = true;
}

Sprite_BattleRewardLMBS.prototype.update = function() {
    if (this._start){
        this.updateMain();
        if((Input.isLongPressed('ok') || TouchInput.isLongPressed())){
            this.updateMain();
            this.updateMain();
            this.updateMain();
        }
    }
}

Sprite_BattleRewardLMBS.prototype.updateMain = function() {
    if (this._count == 0) {
        this.createExpPart();
    } else if (this._count == 30) {
        this.createGoldPart();
    } else if (this._count == 60) {
        this.createItemPart();
    } else if (this._count == (60 + this._itemNum*30) + Kien.LMBS_Core.battleEndWaitTime) {
        this._finish = true;
        this._start = false;
    }
    this.updateAllParts();
    this._count++;
}

Sprite_BattleRewardLMBS.prototype.createExpPart = function() {
    var sprite = new Sprite();
    var string = TextManager.exp + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var y = this.y;
    var height = this.bitmap.fontSize+12;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.visible = true;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var valueSprite = new Sprite();
    x = x + width + 16;
    string = BattleManager._rewards.exp.toString();
    width = this.bitmap.measureTextWidth(string);
    valueSprite.bitmap = new Bitmap(width,height);
    valueSprite.bitmap.drawText(string,0,0,width,height,'right')
    valueSprite.opacity = 0;
    valueSprite.x = x + 80;
    valueSprite.y = y;
    valueSprite.moveTargetX = x;
    valueSprite.moveCount = 20;
    valueSprite.visible = true;
    this.parent.addChild(valueSprite);
    this.sprites.push(valueSprite);
}

Sprite_BattleRewardLMBS.prototype.createGoldPart = function() {
    var sprite = new Sprite();
    var string = TextManager.currencyUnit + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var height = this.bitmap.fontSize+12;
    var y = this.y + height;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var valueSprite = new Sprite();
    x = x + width + 16;
    string = BattleManager._rewards.gold.toString();
    width = this.bitmap.measureTextWidth(string);
    valueSprite.bitmap = new Bitmap(width,height);
    valueSprite.bitmap.drawText(string,0,0,width,height,'right')
    valueSprite.opacity = 0;
    valueSprite.x = x + 80;
    valueSprite.y = y;
    valueSprite.moveTargetX = x;
    valueSprite.moveCount = 20;
    this.parent.addChild(valueSprite);
    this.sprites.push(valueSprite);
}

Sprite_BattleRewardLMBS.prototype.createItemPart = function() {
    var sprite = new Sprite();
    sprite.bitmap = new Bitmap(1,1);
    var string = TextManager.item + ":";
    var width = this.bitmap.measureTextWidth(string);
    var x = this.x + 60;
    var height = this.bitmap.fontSize+12;
    var y = this.y + height * 2;
    sprite.bitmap = new Bitmap(width,height);
    sprite.x = x;
    sprite.y = y;
    sprite.bitmap.drawText(string,0,0,width,height);
    this.parent.addChild(sprite);
    this.sprites.push(sprite);
    var basex = x + width + 16;
    var basey = y;
    var lastwidth = 0;
    var items = BattleManager._rewards.items;
    this._itemNum = items.length;
    if (items.length > 0){
        for (var i = 0; i < items.length; i++){
            var item = items[i];
            var valueSprite = new Sprite();
            string = item.name;
            width = this.bitmap.measureTextWidth(string) + 36;
            valueSprite.bitmap = new Bitmap(width,height);
            this.drawIconTo(valueSprite.bitmap,item.iconIndex,0,0);
            valueSprite.bitmap.drawText(string,0,0,width,height,'right')
            valueSprite.opacity = 0;
            valueSprite.x = basex + (i.mod(2) == 1 ? lastwidth : 0) + 80;
            valueSprite.y = basey + parseInt(i/2) * height;
            lastwidth = width;
            valueSprite.moveTargetX = basex + (i.mod(2) == 1 ? lastwidth : 0);
            valueSprite.moveCount = 20;
            valueSprite.waitCount = i * 30;
            this.parent.addChild(valueSprite);
            this.sprites.push(valueSprite);
        }
    }
}
Sprite_BattleRewardLMBS.prototype.drawIconTo = function(target,iconIndex,x,y){
    var bitmap = ImageManager.loadSystem('IconSet');
    var pw = Window_Base._iconWidth;
    var ph = Window_Base._iconHeight;
    var sx = iconIndex % 16 * pw;
    var sy = Math.floor(iconIndex / 16) * ph;
    target.blt(bitmap, sx, sy, pw, ph, x, y);
}
Sprite_BattleRewardLMBS.prototype.updateAllParts = function() {
    for (var i = 0 ; i < this.sprites.length ; i++){
        var sprite = this.sprites[i];
        sprite.visible = true;
        if (sprite.waitCount && sprite.waitCount > 0) {
            sprite.waitCount--;
        } else if (sprite.moveCount && sprite.moveCount > 0) {
            if (sprite.moveCount == 0) {
                AudioManager.playSe({'name': 'Absorb1', 'pitch' : 150, 'volume' : 60});
            }
            sprite.x += (sprite.moveTargetX - sprite.x) / sprite.moveCount;
            sprite.opacity += (255 - sprite.opacity) / sprite.moveCount;
            sprite.moveCount--;
        }
    }
}

function Sprite_EscapeGauge() {
    this.initialize.apply(this, arguments);
}

Sprite_EscapeGauge.prototype = Object.create(Sprite_Base.prototype);
Sprite_EscapeGauge.prototype.constructor = Sprite_EscapeGauge;

Sprite_EscapeGauge.prototype.initialize = function() {
    Sprite_Base.prototype.initialize.apply(this, arguments);
    this.createBitmap();
}

Sprite_EscapeGauge.prototype.createBitmap = function() {
    this.bitmap = new Bitmap(Graphics.width, 30);
}

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

//-----------------------------------------------------------------------------
// Scene_Map
//
// The scene class of the map screen.


Kien.LMBS_Core.Scene_Map_updateEncounter = Scene_Map.prototype.updateEncounter;
Scene_Map.prototype.updateEncounter = function() {
    if (!$gameSystem._LMBSEnabled){
        Kien.LMBS_Core.Scene_Map_updateEncounter.call(this);
        return;
    }
    if ($gamePlayer.executeEncounter()) {
        SceneManager.push(Scene_BattleLMBS);
    }
};

//-----------------------------------------------------------------------------
// Scene_Skill
//
// The scene class of the skill screen.

Kien.LMBS_Core.Scene_Skill_createSkillTypeWindow = Scene_Skill.prototype.createSkillTypeWindow;
Scene_Skill.prototype.createSkillTypeWindow = function() {
    Kien.LMBS_Core.Scene_Skill_createSkillTypeWindow.call(this);
    this._skillTypeWindow.setHandler('config', this.commandConfig.bind(this));
};

Scene_Skill.prototype.commandConfig = function() {
    SceneManager.push(Scene_SkillConfig);
    //this._skillTypeWindow.activate();
}

//-----------------------------------------------------------------------------
// Scene_SkillConfig
//
// The scene class for 

function Scene_SkillConfig() {
    this.initialize.apply(this, arguments);
}

Scene_SkillConfig.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SkillConfig.prototype.constructor = Scene_SkillConfig;

Scene_SkillConfig.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SkillConfig.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createAllWindow();
    this.refreshActor();
};

Scene_SkillConfig.prototype.createAllWindow = function() {
    var y = this._helpWindow.height;
    this._skillConfigWindow = new Window_SkillConfig(0,y);
    this._skillConfigWindow.setHandler('skill', this.commandSkillConfig.bind(this));
    this._skillConfigWindow.setHandler('cancel',   this.popScene.bind(this));
    this._skillConfigWindow.setHandler('pagedown', this.nextActor.bind(this));
    this._skillConfigWindow.setHandler('pageup',   this.previousActor.bind(this));
    this.addWindow(this._skillConfigWindow);
    var wx = this._skillConfigWindow.width;
    var wy = this._helpWindow.height;
    var ww = Graphics.boxWidth - wx;
    var wh = this._skillConfigWindow.height;
    this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);

    this.addWindow(this._statusWindow);
    wx = 0;
    wy = this._statusWindow.y + this._statusWindow.height;
    ww = Graphics.boxWidth;
    wh = Graphics.boxHeight - wy;
    this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
    this._itemWindow.setHelpWindow(this._helpWindow);
    // dynamically override the includes function.
    // Yeah a easy way to prevent so many similar classes.
    this._itemWindow.includes = function(item) {return !!item};
    this._itemWindow.isEnabled = function(item) {return true};
    this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
    this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
    this.addWindow(this._itemWindow);
}

Scene_SkillConfig.prototype.commandSkillConfig = function() {
    this._itemWindow.activate();
    this._itemWindow.selectLast();
}

Scene_SkillConfig.prototype.item = function() {
    return this._itemWindow.item();
};
Scene_SkillConfig.prototype.onItemOk = function() {
    this.actor().setLastMenuSkill(this.item());
    var ext = this._skillConfigWindow.currentExt();
    if (ext){
        this.actor()._skillSets[ext] = this.item().id;
        if (Kien.LMBS_Core.skillSetRightLeft && ext === "4"){
            this.actor()._skillSets["6"] = this.item().id;
        }
        this._skillConfigWindow.refresh();
    }
    this.onItemCancel();
};

Scene_SkillConfig.prototype.onItemCancel = function() {
    this._itemWindow.deselect();
    this._skillConfigWindow.activate();
};

Scene_SkillConfig.prototype.refreshActor = function() {
    var actor = this.actor();
    this._skillConfigWindow.setActor(actor);
    this._statusWindow.setActor(actor);
    this._itemWindow.setActor(actor);
};


Scene_SkillConfig.prototype.onActorChange = function() {
    this.refreshActor();
    this._skillConfigWindow.activate();
};

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

//})();