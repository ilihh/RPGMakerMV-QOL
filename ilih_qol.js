//=============================================================================
// Quality of Life: disables text typing, reduces fade speed and scene transition time, enables debug mode, and other things.
// ilih_qol.js
//=============================================================================

/*:
 * @plugindesc Quality of Life: disables text typing, reduces fade speed and
 * scene transition time; enables: debug mode, save always, full drop,
 * experience multiplier, and gold multiplier.
 * @author ilih
 *
 * @param Text Typing
 * @type boolean
 * @on enable
 * @off disable
 * @desc Enable Text Typing? True/False
 * Default: disable
 * @default false
 *
 * @param Fade Speed
 * @type number
 * @desc Fade Speed (original speed is 24, 0 is instant, more is slower).
 * Default: 1
 * @default 1
 *
 * @param Scene Transition
 * @type number
 * @desc Scene Transition (0 is instant, more is slower)
 * Default: 1
 * @default 1
 *
 * @param ---Debug---
 * @default
 *
 * @param Debug Window
 * @parent ---Debug---
 * @type boolean
 * @on enable
 * @off disable
 * @desc Enable Debug Window? (F9 to show)
 * Default: enable
 * @default true
 *
 * @param Menu Always
 * @parent ---Debug---
 * @type boolean
 * @on enable
 * @off disable
 * @desc Allow opening menu always.
 * Default: enable
 * @default true
 *
 * @param Save Always
 * @parent ---Debug---
 * @type boolean
 * @on enable
 * @off disable
 * @desc Allow to save always? (only if menu enabled)
 * Default: enable
 * @default true
 *
 * @param Full Drop
 * @parent ---Debug---
 * @type boolean
 * @on enable
 * @off disable
 * @desc Enemies drop all items? True/False
 * Default: enable
 * @default true
 *
 * @param Experience Multiplier
 * @parent ---Debug---
 * @type number
 * @desc Earned experience multiplier (default is 1).
 * Default: 10
 * @default 10
 *
 * @param Gold Multiplier
 * @parent ---Debug---
 * @type number
 * @desc Earned gold multiplier (default is 1).
 * Default: 10
 * @default 10
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Quality of Life: disables text typing, reduces fade speed and scene
 * transition time, enables debug mode, and other things.
 * 
 * Free for commercial and non-commercial projects.
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.00:
 * - initial release
 */

(function() {
	class QualityOfLife
	{
		constructor(parameters)
		{
			this.typing = parameters['Text Typing'] === 'true';
			this.fade_speed = parseInt(parameters['Fade Speed']);
			this.scene_transition = parseInt(parameters['Scene Transition']);

			this.debug_mode = parameters['Debug Window'] === 'true';
			this.debug_menu_always = parameters['Menu Always'] === 'true';
			this.debug_save_always = parameters['Save Always'] === 'true';

			this.debug_full_drop = parameters['Full Drop'] === 'true';
			this.debug_exp_rate = parseInt(parameters['Experience Multiplier']);
			this.debug_gold_rate = parseInt(parameters['Gold Multiplier']);
		}

		toString()
		{
			let msg = 'Typing: ' + config.typing + '\n';
			msg += 'Fade Speed: ' + config.fade_speed + '\n';
			msg += 'Scene Transition: ' + config.scene_transition + '\n';

			msg += 'Debug Mode: ' + config.debug_mode + '\n';
			msg += 'Menu Always: ' + config.debug_menu_always + '\n';
			msg += 'Save Always: ' + config.debug_save_always + '\n';

			msg += 'Full Drop: ' + config.debug_full_drop + '\n';
			msg += 'Exp Rate: ' + config.debug_exp_rate + '\n';
			msg += 'Gold Rate: ' + config.debug_gold_rate + '\n';

			return msg;
		}
	}

	const config = new QualityOfLife(PluginManager.parameters('ilih_qol'));

	let _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
	Window_Message.prototype.updateShowFast = function() {
		_Window_Message_updateShowFast.call(this);

		if (!config.typing)
		{
			this._showFast = true;
		}
	};

	let _Game_Interpreter_fadeSpeed = Game_Interpreter.prototype.fadeSpeed;
	Game_Interpreter.prototype.fadeSpeed = function() {
		return config.fade_speed;
	};

	let _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;
	Scene_Base.prototype.startFadeIn = function(duration, white) {
		if (config.scene_transition === 0)
		{
			return;
		}

		_Scene_Base_startFadeIn.call(this, duration, white);
	};

	let _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut;
	Scene_Base.prototype.startFadeOut = function(duration, white) {
		if (config.scene_transition === 0)
		{
			return;
		}

		_Scene_Base_startFadeOut.call(this, duration, white);
	};

	let _Scene_Map_isDebugCalled = Scene_Map.prototype.isDebugCalled;
	Scene_Map.prototype.isDebugCalled = function() {
		if (config.debug_mode)
		{
			return Input.isTriggered('debug');
		}

		return _Scene_Map_isDebugCalled.call(this);
	};

	let _Game_System_enableMenu = Game_System.prototype.enableMenu;
	Game_System.prototype.enableMenu = function() {
		if (config.debug_menu_always)
		{
			return true;
		}

		return _Game_System_enableMenu.call(this);
	};

	let _Window_MenuCommand_needsCommand = Window_MenuCommand.prototype.needsCommand;
	Window_MenuCommand.prototype.needsCommand = function(name) {
		if (config.debug_save_always && (name === 'save'))
		{
			return true;
		}

		return _Window_MenuCommand_needsCommand.call(this, name);
	};

	let _Game_System_isSaveEnabled = Game_System.prototype.isSaveEnabled;
	Game_System.prototype.isSaveEnabled = function() {
		if (config.debug_save_always)
		{
			return true;
		}

		return _Game_System_isSaveEnabled.call(this);
	};

	let _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
	Game_Enemy.prototype.makeDropItems = function() {
		if (config.debug_full_drop)
		{
			return this.enemy().dropItems.reduce(function(r, di) {
				if (di.kind > 0) {
					return r.concat(this.itemObject(di.kind, di.dataId));
				} else {
					return r;
				}
			}.bind(this), []);
		}

		return _Game_Enemy_makeDropItems.call(this);
	};

	let _Game_Enemy_exp = Game_Enemy.prototype.exp;
	Game_Enemy.prototype.exp = function() {
		return config.debug_exp_rate * _Game_Enemy_exp(this);
	};

	let _Game_Enemy_gold = Game_Enemy.prototype.gold;
	Game_Enemy.prototype.gold = function() {
		return config.debug_gold_rate * _Game_Enemy_gold(this);
	};
})();