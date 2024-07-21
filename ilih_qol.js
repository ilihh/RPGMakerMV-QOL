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
 * @param Volume Step
 * @parent ---Debug---
 * @type number
 * @desc Volume Step (default is 20).
 * Default: 5
 * @default 5
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
 * @param Cheat Skills
 * @parent ---Debug---
 * @type boolean
 * @on enable
 * @off disable
 * @desc Enable cheat skills? True/False
 * Default: enable
 * @default true
 *
 * @param Cheat Skills Type
 * @parent ---Debug---
 * @type number
 * @desc Cheat Skills Type ID.
 * Default: 1
 * @default 1
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
 * Version 1.02:
 * - added cheat skills
 *
 * Version 1.01:
 * - added volume step
 *
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

			this.volume_step = parseInt(parameters['Volume Step']);

			this.enable_cheat_skills = parameters['Cheat Skills'] === 'true';
			this.cheat_skills_type = parseInt(parameters['Cheat Skills Type']);

			this.cheat_skills = [
				{"id": null,"animationId":0,"damage":{"critical":false,"elementId":0,"formula":"0","type":0,"variance":20},"description":"","effects":[{"code":11,"dataId":0,"value1":1,"value2":0},{"code":12,"dataId":0,"value1":1,"value2":0}],"hitType":0,"iconIndex":0,"message1":"","message2":"","mpCost":0,"name":"Cheat Heal","note":"","occasion":0,"repeats":1,"requiredWtypeId1":0,"requiredWtypeId2":0,"scope":8,"speed":2000,"stypeId":1,"successRate":100,"tpCost":0,"tpGain":0},
				{"id": null,"animationId":0,"damage":{"critical":false,"elementId":0,"formula":"999999","type":1,"variance":0},"description":"","effects":[],"hitType":0,"iconIndex":0,"message1":"","message2":"","mpCost":0,"name":"Cheat Win","note":"","occasion":1,"repeats":1,"requiredWtypeId1":0,"requiredWtypeId2":0,"scope":2,"speed":2000,"stypeId":1,"successRate":100,"tpCost":0,"tpGain":0},
				{"id": null,"animationId":0,"damage":{"critical":false,"elementId":0,"formula":"999999","type":1,"variance":0},"description":"","effects":[],"hitType":0,"iconIndex":0,"message1":"","message2":"","mpCost":0,"name":"Cheat Lose","note":"","occasion":1,"repeats":1,"requiredWtypeId1":0,"requiredWtypeId2":0,"scope":8,"speed":2000,"stypeId":1,"successRate":100,"tpCost":0,"tpGain":0},
				// {"id": null,"animationId":0,"damage":{"critical":false,"elementId":0,"formula":"0","type":0,"variance":20},"description":"","effects":[],"hitType":0,"iconIndex":0,"message1":"","message2":"","mpCost":0,"name":"Test","note":"","occasion":0,"repeats":1,"requiredWtypeId1":0,"requiredWtypeId2":0,"scope":1,"speed":0,"stypeId":1,"successRate":100,"tpCost":0,"tpGain":0}
			];
			this.cheat_skills_ids = [];
		}

		toString()
		{
			let msg = 'Typing: ' + this.typing + '\n';
			msg += 'Fade Speed: ' + this.fade_speed + '\n';
			msg += 'Scene Transition: ' + this.scene_transition + '\n';

			msg += 'Debug Mode: ' + this.debug_mode + '\n';
			msg += 'Menu Always: ' + this.debug_menu_always + '\n';
			msg += 'Save Always: ' + this.debug_save_always + '\n';

			msg += 'Full Drop: ' + this.debug_full_drop + '\n';
			msg += 'Exp Rate: ' + this.debug_exp_rate + '\n';
			msg += 'Gold Rate: ' + this.debug_gold_rate + '\n';
			msg += 'Volume Step: ' + this.volume_step + '\n';

			return msg;
		}

		learnSkills(actor)
		{
			if (!actor)
			{
				return;
			}
			if (this.enable_cheat_skills)
			{
				this.cheat_skills_ids.forEach(x => actor.learnSkill(x));
			}
		}

		createSkills()
		{
			this.cheat_skills.forEach(skill => {
				skill.id = $dataSkills.length;
				this.cheat_skills_ids.push(skill.id);
				$dataSkills.push(skill);
			});
		}
	}

	const config = new QualityOfLife(PluginManager.parameters('ilih_qol'));

	const _Window_Message_updateShowFast = Window_Message.prototype.updateShowFast;
	Window_Message.prototype.updateShowFast = function() {
		_Window_Message_updateShowFast.call(this);

		if (!config.typing)
		{
			this._showFast = true;
		}
	};

	const _Game_Interpreter_fadeSpeed = Game_Interpreter.prototype.fadeSpeed;
	Game_Interpreter.prototype.fadeSpeed = function() {
		return config.fade_speed;
	};

	const _Scene_Base_startFadeIn = Scene_Base.prototype.startFadeIn;
	Scene_Base.prototype.startFadeIn = function(duration, white) {
		if (config.scene_transition === 0)
		{
			return;
		}

		_Scene_Base_startFadeIn.call(this, duration, white);
	};

	const _Scene_Base_startFadeOut = Scene_Base.prototype.startFadeOut;
	Scene_Base.prototype.startFadeOut = function(duration, white) {
		if (config.scene_transition === 0)
		{
			return;
		}

		_Scene_Base_startFadeOut.call(this, duration, white);
	};

	const _Scene_Map_isDebugCalled = Scene_Map.prototype.isDebugCalled;
	Scene_Map.prototype.isDebugCalled = function() {
		if (config.debug_mode)
		{
			return Input.isTriggered('debug');
		}

		return _Scene_Map_isDebugCalled.call(this);
	};

	const _Game_System_isMenuEnabled = Game_System.prototype.isMenuEnabled;
	Game_System.prototype.isMenuEnabled = function() {
		if (config.debug_menu_always)
		{
			return true;
		}

		return _Game_System_isMenuEnabled.call(this);
	};

	const _Window_MenuCommand_needsCommand = Window_MenuCommand.prototype.needsCommand;
	Window_MenuCommand.prototype.needsCommand = function(name) {
		if (config.debug_save_always && (name === 'save'))
		{
			return true;
		}

		return _Window_MenuCommand_needsCommand.call(this, name);
	};

	const _Game_System_isSaveEnabled = Game_System.prototype.isSaveEnabled;
	Game_System.prototype.isSaveEnabled = function() {
		if (config.debug_save_always)
		{
			return true;
		}

		return _Game_System_isSaveEnabled.call(this);
	};

	const _Game_Enemy_makeDropItems = Game_Enemy.prototype.makeDropItems;
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

	const _Game_Enemy_exp = Game_Enemy.prototype.exp;
	Game_Enemy.prototype.exp = function() {
		return config.debug_exp_rate * _Game_Enemy_exp.call(this);
	};

	const _Game_Enemy_gold = Game_Enemy.prototype.gold;
	Game_Enemy.prototype.gold = function() {
		return config.debug_gold_rate * _Game_Enemy_gold.call(this);
	};

	const _Window_Options_volumeOffset = Window_Options.prototype.volumeOffset;
	Window_Options.prototype.volumeOffset = function () {
		return config.volume_step;
	};

	const _Game_Actor_initSkills = Game_Actor.prototype.initSkills;
	Game_Actor.prototype.initSkills = function() {
		_Game_Actor_initSkills.call(this);

		config.learnSkills(this);
	};

	const _DataManager_extractSaveContents = DataManager.extractSaveContents;
	DataManager.extractSaveContents = function(contents) {
		_DataManager_extractSaveContents.call(DataManager, contents);

		$gameActors._data.forEach(x => config.learnSkills(x));
	};

	const _DataManager_onLoad = DataManager.onLoad;
	DataManager.onLoad = function(object) {
		if (object === $dataSkills)
		{
			config.createSkills();
		}

		_DataManager_onLoad.call(DataManager, object);
	};

	const _Game_BattlerBase_addedSkillTypes = Game_BattlerBase.prototype.addedSkillTypes;
	Game_BattlerBase.prototype.addedSkillTypes = function() {
		const types = _Game_BattlerBase_addedSkillTypes.call(this);
		if (!types.contains(config.cheat_skills_type))
		{
			types.push(config.cheat_skills_type);
		}

		return types;
	};
})();