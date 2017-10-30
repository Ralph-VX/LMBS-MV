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
 * @requiredAssets img/system/cursorLMBS
 *
 * @param ===System Settings===
 * @desc 
 * @default 
 *
 * @param Enable Default
 * @desc enable the battle system by default.
 * @default true
 * @type boolean
 *
 * @param Debug Mode
 * @desc Shows the range of hitboxes with colored rects. Only works in Test
 * Mode.
 * @default false
 * @type boolean
 * 
 * @param Battle Field Width
 * @desc Width of the battle field. Limit the movement of battlers
 * @default 816
 * @type number

 * @param Battle Field Ground Y
 * @desc the Y coordinate of ground 
 * @default 500
 * @type number
 *
 * @param Maximum Fall Speed
 * @desc the maximum distance characters falls each frame.
 * @default 10
 * @type number
 *
 * @param Animation Speed
 * @desc The amount of frames an picture will show in character loop animation.
 * @default 4
 * @type number
 *
 * @param Damage Popup Offset X
 * @desc The offset of the damage pop display
 * @default 0
 * @type number
 * @min -99999999
 *
 * @param Damage Popup Offset Y
 * @desc The offset of the damage pop display 
 * @default -40
 * @type number
 * @min -9999999
 *
 * @param Turn Length
 * @desc The length of 1 turn in frame, use to process those turn-based features such
 * as states.
 * @default 60
 * @type number
 *
 * @param Jump Power
 * @desc Force of jump that characters will take. Affect height of jump.
 * @default 20
 * @type number
 *
 * @param Enemy X Start
 * @desc Starting coordinate of enemy troop. This value will add to coordinate
 * set in troop as actual coordinate in-game.
 * @default 520
 * @type number
 *
 * @param Battle End Wait Time
 * @desc Length in Frames to wait after the battle rewards are displayed.
 * Player can shorten this time to 1/4 by hold button.
 * @default 200
 * @type number
 *
 * @param Auto Guard Time After Guard
 * @desc Length in frames that character will automatically guard after successfully guard
 * an attack.
 * @default 15
 * @type number
 *
 * @param Default Facing
 * @desc the facing of the characters in graphs. true is right, false is left.
 * @default false
 * @type boolean
 *
 * @param Double Tap Time
 * @desc The length of time between two input will be considered as double tap.
 * @default 15
 * @type number
 *
 * @param Can Move Through Ally
 * @desc Can battlers move through ally battlers.
 * @default true
 * @type boolean
 *
 * @param Can Move Through Enemy
 * @desc Can battlers move through enemy battlers.
 * @default false
 * @type boolean
 *
 * @param Can Dash Through Ally
 * @desc Can battlers dash through ally battlers. Only have effect when
 * Can Move Through Ally is false.
 * @default true
 * @type boolean
 *
 * @param Can Dash Through Enemy
 * @desc Can battlers dash through enemy battlers. Only have effect when
 * Can Move Through Enemy is false.
 * @default true
 * @type boolean
 *
 * @param Fix Character Size
 * @desc let the size of all pose of character same as "Stand" pose.
 * @default true
 * @type boolean
 *
 * @param Skill Set Left Right Act Same
 * @desc Let Right and Left skill use same skill in skill set.
 * @default true
 * @type boolean
 *
 * @param Delay for jump
 * @desc amount of frames wait when jump is inputed for player. to let
 * player able to cast skill assigned in up.
 * @default 6
 * @type number
 *
 * @param Pause Game While Event By Default
 * @desc pause the game or not while event is running by default. Can be triggered via
 * plugin command.
 * @default false
 * @type boolean
 *
 * @param Input Keep Time
 * @desc Time the input from player will be keep for triggering next action.
 * @default 10
 * @type number
 *
 * @param Cursor Animation Speed
 * @desc Speed of cursor animation of Targetting Cursor.
 * @default 8
 * @type number
 *
 * @param Cursor Frame Count
 * @desc Amount of frame of Targetting Cursor.
 * @default 4
 * @type number
 *
 * @param Default Hitstop Length
 * @desc Amount of frame battler will stop after hit/get hitted.
 * @default 7
 * @type number
 *
 * @param ===Key Settings===
 * @desc 
 * @default 
 *
 * @param Guard Key
 * @desc virtual key code of the key for Guarding.
 * @default 67
 * @type number
 *
 * @param Previous Target Key
 * @desc virtual key code of the key for selecting Previous Target.
 * @default 65
 * @type number
 *
 * @param Next Target Key
 * @desc virtual key code of the key for selecting Next Target.
 * @default 83
 * @type number
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
 * @type number
 *
 * @param Battle Item Icon
 * @desc Icon index of the 'Item' in battle Menu
 * @default 176
 * @type number
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
 * @type number
 * @decimal 4
 *
 * @param Min Camera Zoom
 * @desc Minimum maginification camera can be. Prevent the zoom becomes too small.
 * @default 0.7
 * @type number
 * @decimal 4
 *
 * @param Camera Left Margin
 * @desc Amount of pixels camera will leave from the left-most of characters
 * @default 100
 * @type number
 *
 * @param Camera Right Margin
 * @desc Amount of pixels camera will leave from the right-most of characters
 * @default 100
 * @type number
 *
 * @param ===File Settings===
 * @desc 
 * @default 
 *
 * @param Used Image Files
 * @desc Choose Image files to avoid these file being removed by "remove unused" option.
 * @default 
 * @type file[]
 * @require 1
 *
 * @help
 * WIP
 * ==============================================================================
 * * List of Skill Motion Command
 * ==============================================================================
 * Format is:
 * * Command Name in LMBS Editor
 * - Line used in Note section of a skill with parameters enclosed in []
 * - Description of Command and parameters.
 * Few Instruction:
 * - User represents battler who used the skill.
 * - Target represents battler who is targeted by the skill, defined by system.
 * - Unless described, coordinate system in this section is like this:
 *   - Origin placed on the user.
 *   - Positive X coordinate going toward user's facing.
 *   - Positive Y coordinate going up.

 * * Change Pose
 * - ChangePose [posename]
 * - Chagne the User's Pose to [posename].

 * * Frame Forward
 * - FrameForward
 * - Increment the User's current Pose Animation's frame count. Will Take no effect
 * if current frame is the last frame.

 * * Frame Backward
 * - FrameBackward
 * - Decrement the User's current Pose Animation's frame count. Will take no effect
 * if current frame is the first frame.

 * * Move
 * - Move [dx],[dy],[duration]
 * - Move the User [dx] pixels in x-coordinate, [dy] pixels in y-coordinate. This 
 * Movement will take for [duration] frames to finish.

 * * Wait
 * - Wait [duration]
 * - Pause the command processing for [duration] frames. If this command is not
 * called, system will keep process the command, and all movements/pose changes
 * will not take effect.

 * * Start Input
 * - StartInput
 * - Allow player to input for attack/skill keys to chain another skill. Current
 * skill will terminate instantly, and all changes to User except movements will
 * reset to default state (weapon image, pose, etc.)

 * * Start Damage
 * - StartDamage [x],[y],[width],[height],[damage],[knockbackx],[knockbacky],[knockbackdir]
 * - Command User to apply skill effect damage to any enemy battler goes into the rectangle
 * - represented by [x], [y], [width], [height]. 
 *   [damage] is the value that will be multiplied on the damage value calculated 
 *   from skill's Damage Formula, where 1 represents full damage, 0.5 represents 
 *   half damage, 2 represents double damage.
 *   [knockbackx] and [knockbacky] represents the power of knockback will
 *   apply to the target. higher the value, longer the knockback distance.
 *   [knockbackdir] represents this knockback's x direction will be inverted or
 *   not. Value of Knockbackx will not be inverted if this is 0, and will be
 *   inverted if this is 1.
 *   Same Enemy will only be effected by this command once per execution.

 * * End Damage
 * - EndDamage
 * - Finish the last Start Damage Call. If no command was called, no effect.
 * - You Don't need to call this if you want to instantly call another
 * - Start Damage command.

 * * Projectile
 * - Projectile [projectileclassname],[parameters]
 * - Create a Projectile sprite that is described by [projectileclassname]
 * and [parameters]. See Projectile Section below for detailed information.

 * * Allow Falling
 * - LetFall
 * - Let user be affected by gravity. 
 *   This is the default state, Use NoFall to prevevent falling.
 * 
 * * Not Allow Fall
 * - NoFall
 * - Let User not affected by gravity.

 * * Wait Until Fallling End
 * - WaitFall
 * - Pause the command processing until User touch the ground.
 * - Remember to call Allow Falling before this command is called.

 * * Apply Damage
 * - ApplyDamage [damage],[knockbackx],[knockbacky],[knockbackdir]
 * - Apply the skill affect to target. 
 *   [damage] is the value that will be multiplied on the damage value calculated 
 *   from skill's Damage Formula, where 1 represents full damage, 0.5 represents 
 *   half damage, 2 represents double damage.
 *   [knockbackx] and [knockbacky] represents the power of knockback will
 *   apply to the target. higher the value, longer the knockback distance.
 *   [knockbackdir] represents this knockback's x direction will be inverted or
 *   not. Value of Knockbackx will not be inverted if this is 0, and will be
 *   inverted if this is 1.

 * * Wait Cast
 * - WaitCast [duration]
 * - Same as Wait, except this will also change the pose of User to "Cast".
 *
 * * Rotation
 * - Rotation [angle],[rotationdirection],[duration],[rounds]
 * - Let User begin to Rotate. [angle] represents the angle in degree of User after the
 * Rotation is finish, [rotationdirection] is the direction the rotation will take,
 * 4 for counter-clockwise, 6 for clockwise. [duration] is the time in frame
 * this rotation will took. [rounds] used when you want to rotate over 360 degrees.
 * when [rounds] is 1, [angle] is 90, User will turn 1 rounds and then stop at 90,
 * and so on.

 * Set Hit Stop
 * - SetHitStop [length]
 * - Change the hit stop when User sucsessfully deal damage to any enemy. [length]
 * is the hit stop length in frame. Value will be reset after the skill is finish.

 * * Stop All Ai
 * - StopAllAi
 * - Stop All battler's movement and AI execution except the User. if an AI
 * controlled battler calls this command, Player character will also stop
 * and not controllable until Start All Ai command is called or skill finish.

 * * Start All Ai
 * - StartAllAi
 * - Start all battler's movement and AI execution that is stopped by
 * previous Stop All Ai call.

 * * If
 * - If [expression]
 * - if the evaluation result of javascript expression described by [expression]
 * reutrns true, process the lines after this command. If the return value is false,
 * skip all lines after this command and before next End If line.

 * * End
 * - End
 * - Represents the end of If and other control sequence command. 
 & See corresponding commands for detail.
 
 * * Change Weapon
 * - ChangeWeapon [weaponname]
 * - Change the User's Weapon sprite into [weaponname]. if the line only contains 
 * "ChangeWeapon", then it will set User's Weapon sprite back to default.

 * * Move Weapon
 * - MoveWeapon [dx],[dy],[duration]
 * - Move User's weapon sprite for [dx] pixels in x-coordinates and [dy] pixels in y-coordinates,
 * for [duration] frames.

 * * Rotate Weapon
 * - RotateWeapon [angle],[rotationdirection],[duration],[rounds]
 * - Let User's weapon begin to Rotate. [angle] represents the angle in degree of User after the
 * Rotation is finish, [rotationdirection] is the direction the rotation will take,
 * 4 for counter-clockwise, 6 for clockwise. [duration] is the time in frame
 * this rotation will took. [rounds] used when you want to rotate over 360 degrees.
 * when [rounds] is 1, [angle] is 90, User will turn 1 rounds and then stop at 90,
 * and so on.

 * * Reset Weapon
 * - ResetWeapon
 * - Reset all changes done to User's weapon sprite, except weapon name.
 * You don't need to call this command manually when the skill is finish.

 * * Show Skill Name
 * - ShowSkillName
 * - Show the skill name in the User's default channel.
 *  About channel, see Battle Message Channel at below. 

 * * Show Message
 * - ShowMessage [channel],[message]
 * - Show A line of string represented by [message] in window described by [channel].
 * if [channel] is displaying a string when this command is executed, then last
 * string will be replaced by new message. About channel, see Battle Message Channel
 * at below.

 * * Hide Message
 * - HideMessage [channel]
 * - Instantly hide the displaying string that is showing in [channel].
 * About channel, see Battle Message Channel at below.
 * ==============================================================================
 * * List of Projectile
 * ==============================================================================
 * Format is:
 * * Projectile's Classname
 * - parameters
 * - Description about projectile and parameters.
 * Few Instruction:
 * - User represents battler who used the skill.
 * - Target represents battler who is targeted by the skill, defined by system.
 * - Unless described, coordinate system in this section is like this:
 *   - Origin placed on the user.
 *   - Positive X coordinate going toward user's facing.
 *   - Positive Y coordinate going up.
 *
 * * Sprite_ProjectileLMBS
 * - [json property file name]
 * - Create a projectile that move straight to specified direction. json property file
 * is placed under data/projectiles/ directory. For detailed information about json
 * file, see ProjectileTemplate.json and ProjectileSchema.json.
 
 * * Sprite_GravityProjectileLMBS
 * - [json property file name]
 * - Create a projectile that move toward a initial direction and affected by a specified
 * gravity while travelling.json property file is placed under data/projectiles/ directory.
 * For detailed information about json * file, see GravityProjectileTemplate.json and 
 * GravityProjectileSchema.json.

 * * Sprite_AnimationLMBS
 * - [origin],[dx],[dy],[timingFileName],[animationId],[animatinoDelay],[animationMirror],[followOrigin]
 * - Create a projectile plays animation in a specified position that can damage target
 * in rects described in a json file. [origin] can be one of the following: user, target and
 * screen. user set the coordinate space's (0,0) position on the user of skill, and target
 * set the origin on the target of user, and screen set the origin at 0,0 of the battle field.
 * Also, y-coordinate is going down in screen mode.
 * [dx],[dy] refers to the displacement of animation from the origin. [timingFileName] is the
 * json file that contains information of rectangles that represents the damaging area of
 * the animation. File is placed under data/animations/, and is created through LMBS-Editor.
 * [animationId] is the id of animation, [animationDelay] refers to the frames this animation
 * will wait to display, [animationMirror] refers to do this animation is played as mirrored.
 * [followOrigin] means do this animation will change its position when origin's coordinate
 * is changed.
 */