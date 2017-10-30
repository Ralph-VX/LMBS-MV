//-----------------------------------------------------------------------------
// AbstractMotionDescriptor
//
// Base class for motion descriptor.

function AbstractMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

AbstractMotionDescriptor.prototype.initialize = function(target, item) {
    this._target = target;
    this._finish = false;
    this._waitCount = 0;
    this._item = item;
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
    this._target = null;
}

//-----------------------------------------------------------------------------
// BasicMotionDescriptor
//
// Motion descriptor contains only basic movements.

//-----------------------------------------------------------------------------
// DefaultMotionDescriptor
//
// Motion descriptor for default skill motions.

function DefaultMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

DefaultMotionDescriptor.prototype = Object.create(AbstractMotionDescriptor.prototype);
DefaultMotionDescriptor.prototype.constructor = DefaultMotionDescriptor;

DefaultMotionDescriptor.prototype.initialize = function (battler, item) {
    AbstractMotionDescriptor.prototype.initialize.apply(this,arguments);
    this._battler = this._target;
    this._stoppedAi = false;
    this._childDescriptor = null;
    this._showingMessage = [];
    this._skillVariables = {};
    var item = this._item;
    if (!this._battler.isGround()) {
        var id = parseInt(item.meta["Aerial Cast"],10);
        if (id > 0) {
            this._skillToBeCast = id;
            this._skillToBeCastIsItem = DataManager.isItem(item);
        }
    }
    this._processingMotionList = [];
    this._motionIndex = 0;
    this._motionList = Kien.LMBS_Core.createMotionListFromNote(item);
    if (!this._skillToBeCast) {
        if (DataManager.isSkill(item)) {
            this._battler.paySkillCost(item);
        } else {
            this._battler.consumeItem(item);
        }
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
    if (this._motionList.length > this._motionIndex && (!this.motionWaiting())){
        var obj = Object.create(this._motionList[this._motionIndex]);
        while(obj){
            if (this.processMotion(obj)) {
                this._motionIndex++;
                obj = undefined;
            } else {
                if (this._motionList[++this._motionIndex]) {
                    obj = Object.create(this._motionList[this._motionIndex]);
                } else {
                    obj = undefined;
                }
            }
        }
    }
    this.updateProcessingMotion();
    if(!this.isProcessing()){
        this._finish = true;
    }
}

DefaultMotionDescriptor.prototype.isProcessing = function() {
    return this._motionList.length > this._motionIndex || this._processingMotionList.length > 0 ||
        this._childDescriptor;
}

DefaultMotionDescriptor.prototype.processMotionCommandpose = function(obj) {
    this._battler._pose = obj.name;
    this._battler._patternIndex = 0;
}

DefaultMotionDescriptor.prototype.processMotionCommandforward = function(obj) {
    this._battler._patternIndex++;
}

DefaultMotionDescriptor.prototype.processMotionCommandbackward = function(obj) {
    if (this._battler._patternIndex > 0){
        this._battler._patternIndex--;
    }
}

DefaultMotionDescriptor.prototype.processMotionCommandmove = function(obj) {
    this._processingMotionList.push(Object.create(obj));
}

DefaultMotionDescriptor.prototype.processMotionCommandwait = function(obj) {
    this._processingMotionList.push(Object.create(obj));
    return true;
}

DefaultMotionDescriptor.prototype.processMotionCommandstartinput = function(obj) {
    this._battler._waitInput = true;
}

DefaultMotionDescriptor.prototype.processMotionCommandendinput = function(obj) {
    this._battler._waitInput = false;
}

DefaultMotionDescriptor.prototype.processMotionCommandstartdamage = function(obj) {
    this._battler.startDamage(Object.create(obj));
}

DefaultMotionDescriptor.prototype.processMotionCommandenddamage = function(obj) {
    this._battler.clearDamage();
}

DefaultMotionDescriptor.prototype.processMotionCommandprojectile = function(obj) {
    var nobj = Object.create(obj);
    nobj.item = this._item;
    this._battler.registProjectile(nobj);
}

DefaultMotionDescriptor.prototype.processMotionCommandletfall = function(obj) {
    this._battler._motionFall = true;
}

DefaultMotionDescriptor.prototype.processMotionCommandnofall = function(obj) {
    this._battler._motionFall = false;
}

DefaultMotionDescriptor.prototype.processMotionCommandwaitfall = function(obj) {
    this._processingMotionList.push(Object.create(obj));
    return true;
}

DefaultMotionDescriptor.prototype.processMotionCommandapplydamage = function(obj) {
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
        this._battler._damageInfo.knocklength = obj.knocklength;
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
}

DefaultMotionDescriptor.prototype.processMotionCommandwaitfall = function(obj) {
    this._processingMotionList.push(Object.create(obj));
    return true;
}

DefaultMotionDescriptor.prototype.processMotionCommandwaitcast = function(obj) {
    this._battler._pose = "Cast";
    this._battler._patternIndex  = -1;
    this._processingMotionList.push(Object.create(obj));
    return true;
}

DefaultMotionDescriptor.prototype.processMotionCommandrotation = function(obj) {
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
}

DefaultMotionDescriptor.prototype.processMotionCommandsethitstop = function(obj) {
    this._battler._hitStopLength = obj.length;
}

DefaultMotionDescriptor.prototype.processMotionCommandstopallai = function(obj) {
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
}

DefaultMotionDescriptor.prototype.processMotionCommandstartallai = function(obj) {
    this.startAllAi();
}

DefaultMotionDescriptor.prototype.processMotionCommandif = function(obj) {
    // Something similar to default damage formula :p
    var thisObj = this._battler.getEvaluateObjects()
    if (Kien.LMBS_Core.executeWithEnvironment(obj.expression, thisObj)){
        this._childDescriptor = new ChildDefaultMotionDescriptor(this._battler, this._item, obj.list);
        this._childDescriptor.parent = this;
        return true;
    } else {
        var elseindex = obj.list.findIndex(function(command) {
            return command.type === "else";
        })
        if (elseindex >= 0) {
            var elselist = obj.list.filter(function(c,i) {
                return i > elseindex;
            })
            this._childDescriptor = new ChildDefaultMotionDescriptor(this._battler, this._item, elselist);
            this._childDescriptor.parent = this;
            return true;
        }
    }
}

DefaultMotionDescriptor.prototype.processMotionCommandend = function(obj) {
}

DefaultMotionDescriptor.prototype.processMotionCommandchangeweapon = function(obj) {
    this._battler._weaponName = obj.name;
}

DefaultMotionDescriptor.prototype.processMotionCommandmoveweapon = function(obj) {
    this._processingMotionList.push(obj);
}

DefaultMotionDescriptor.prototype.processMotionCommandrotateweapon = function(obj) {
    var nobj = Object.create(obj);
    nobj.rotation = nobj.rotation % 360;
    this._battler._weaponProperty.rotation = this._battler._weaponProperty.rotation % 360;
    var dir = obj.dir > 0 ? 4 : 6;
    if (dir == 4) {
        while (this._battler._weaponProperty.rotation <= nobj.rotation) {
            this._battler._weaponProperty.rotation += 360;
        }
        nobj.rotation -= 360 * nobj.rounds;
    } else if (dir == 6) {
        while (this._battler._weaponProperty.rotation >= nobj.rotation) {
            this._battler._weaponProperty.rotation -= 360;
        }
        nobj.rotation += 360 * nobj.rounds;
    }
    this._battler._weaponProperty.overrideRotation = true;
    this._processingMotionList.push(nobj);
}

DefaultMotionDescriptor.prototype.processMotionCommandresetweapon = function(obj) {
    this._battler.clearWeaponProperty();
}

DefaultMotionDescriptor.prototype.processMotionCommandshowskillname = function(obj) {
    var channel = this._battler.isActor() ? 0 : 1;
    var string = this._item.name;
    $gameTemp.setBattleMessage(channel, string);
    this._showingMessage[channel] = string;
}

DefaultMotionDescriptor.prototype.processMotionCommandshowmessage = function(obj) {
    $gameTemp.setBattleMessage(obj.channel, obj.string);
    this._showingMessage[obj.channel] = obj.string;
}

DefaultMotionDescriptor.prototype.processMotionCommandhidemessage = function(obj) {
            if ($gameTemp.getBattleMessage(obj.channel) == this._showingMessage[obj.channel]) {
                $gameTemp.removeBattleMessage(obj.channel);
            }
            delete this._showingMessage[obj.channel];
}

DefaultMotionDescriptor.prototype.processMotionCommandevaluate = function(obj) {
    Kien.LMBS_Core.executeWithEnvironment(obj.expression, this._Battler.getEvaluateObjects());
}

// Process motion executing in list
// returning true to abort process. Currently only occurs at "wait" command.
DefaultMotionDescriptor.prototype.processMotion = function(obj) {
    var name = "processMotionCommand" + obj.type;
    if (this[name]) {
        return this[name](obj) || false;
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

DefaultMotionDescriptor.prototype.processProcessingCommandwait = function(obj) {
    obj.dur--;
}

DefaultMotionDescriptor.prototype.processProcessingCommandmove = function(obj) {
    var ddx = obj.dx / obj.dur;
    var ddy = obj.dy / obj.dur;
    this._battler.forceMoveWith(ddx * (this._battler._facing ? 1 : -1));
    this._battler._battleY += ddy;
    obj.dx -= ddx;
    obj.dy -= ddy;
    obj.dur--;
}

DefaultMotionDescriptor.prototype.processProcessingCommandrotation = function(obj) {
    var dr = obj.rotation - this._battler._rotation;
    this._battler._rotation += dr/obj.dur;
    obj.dur--;
}

DefaultMotionDescriptor.prototype.processProcessingCommandwaitfall = function(obj) {
    if(this._battler.isGround() || !this._battler._motionFall){
        obj.dur = 0;
    }
}

DefaultMotionDescriptor.prototype.processProcessingCommandwaitcast = function(obj) {
    obj.dur--;
    if(obj.dur == 0){
        this._battler._patternIndex = 0;
    }
}

DefaultMotionDescriptor.prototype.processProcessingCommandmoveweapon = function(obj) {
    var ddx = obj.dx / obj.dur;
    var ddy = obj.dy / obj.dur;
    this._battler._weaponProperty.dx += ddx;
    this._battler._weaponProperty.dy += ddy;
    obj.dx -= ddx;
    obj.dy -= ddy;
    obj.dur--;
}

DefaultMotionDescriptor.prototype.processProcessingCommandrotateweapon = function(obj) {
    var dr = obj.rotation - this._battler._weaponProperty.rotation;
    this._battler._weaponProperty.rotation += dr / obj.dur;
    obj.dur--;
}

// Process your motion need various frames at here
// Remember to include a "dur" property and set it to 0 when the process is finish.
DefaultMotionDescriptor.prototype.processProcessingMotion = function(obj) {
    var name = "processProcessingCommand" + obj.type;
    if (this[name]) {
        this[name](obj);
    } else {
        obj.dur = 0;
    }
}

DefaultMotionDescriptor.prototype.release = function() {
    if (this._stoppedAi) {
        this.startAllAi();
    }
    this.clearBattleMessage();
    AbstractMotionDescriptor.prototype.release.call(this);
}

DefaultMotionDescriptor.prototype.clearBattleMessage = function() {
    for (var channel = 0; channel < this._showingMessage.length; channel++) {
        if (this._showingMessage[channel] == $gameTemp.getBattleMessage(channel)) {
            $gameTemp.removeBattleMessage(channel);
        }
    }
}

DefaultMotionDescriptor.prototype.motionWaiting = function() {
    return (this._processingMotionList.find(function(obj){
        return obj.type.match(/wait/) != null;
    }) !== undefined);
}

// Defined as a "Default" condition, override this function if needed.
DefaultMotionDescriptor.prototype.canUse = function(battler, obj) {
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
// ChildDefaultMotionDescriptor
//
// Base class for motion descriptor.

function ChildDefaultMotionDescriptor() {
    this.initialize.apply(this, arguments);
}

ChildDefaultMotionDescriptor.prototype = Object.create(DefaultMotionDescriptor.prototype);
ChildDefaultMotionDescriptor.prototype.constructor = ChildDefaultMotionDescriptor;

Object.defineProperty(ChildDefaultMotionDescriptor.prototype, "_skillVariables" ,{
    get: function() {
        if (this.parent) { 
            return this.parent._skillVariables;
        } else {
            return {};
        }
    }
});

ChildDefaultMotionDescriptor.prototype.initialize = function (battler, item, list) {
    AbstractMotionDescriptor.prototype.initialize.apply(this,arguments);
    this._battler = battler;
    this._stoppedAi = false;
    this._processingMotionList = [];
    this._motionList = list;
    this._childDescriptor = null;
    this._motionIndex = 0;
    this.parent = null;
}

DefaultMotionDescriptor.prototype.processMotionCommandend = function(obj) {
    this._finish = true;
}

DefaultMotionDescriptor.prototype.processMotionCommandelse = function(obj) {
    this._finish = true;
}

ChildDefaultMotionDescriptor.prototype.clearBattleMessage = function() {
    for (var channel = 0; channel < this._showingMessage.length; channel++) {
        if (this._showingMessage[channel]) {
            this.parent._showingMessage[channel] = this._showingMessage[channel];
        }
    }
}