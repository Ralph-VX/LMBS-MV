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
 * @default 10
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
 * @default 20
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
 * @param Input Keep Time
 * @desc Time the input from player will be keep for triggering next action.
 * @default 10
 *
 * @param Cursor Animation Speed
 * @desc Speed of cursor animation of Targetting Cursor.
 * @default 8
 *
 * @param Cursor Frame Count
 * @desc Amount of frame of Targetting Cursor.
 * @default 4
 *
 * @param ===Key Settings===
 * @desc 
 * @default 
 *
 * @param Guard Key
 * @desc virtual key code of the key for Guarding.
 * @default 67
 *
 * @param Previous Target Key
 * @desc virtual key code of the key for selecting Previous Target.
 * @default 65
 *
 * @param Next Target Key
 * @desc virtual key code of the key for selecting Next Target.
 * @default 83
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
 * @param Battle Message Window Color
 * @desc Set the window color of skill name window. Atleast need 2 brackets for
 * Player/Enemy's Window.
 * @default (-68,102,255),(153,-53,-204)
 *
 * @param ===Camera Settings===
 * @desc 
 * @default 
 *
 * @param Max Camera Zoom
 * @desc Maximum maginification camera can be. Prevent the zoom becomes too big.
 * @default 2
 *
 * @param Min Camera Zoom
 * @desc Minimum maginification camera can be. Prevent the zoom becomes too small.
 * @default 0.7
 *
 * @param Camera Left Margin
 * @desc Amount of pixels camera will leave from the left-most of characters
 * @default 100
 *
 * @param Camera Right Margin
 * @desc Amount of pixels camera will leave from the right-most of characters
 * @default 100
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