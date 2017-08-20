//-----------------------------------------------------------------------------
// Scene_Boot
//
// The scene class for initializing the entire game.

Kien.LMBS_Core.Scene_Boot_create = Scene_Boot.prototype.create;
Scene_Boot.prototype.create = function() {
	this.tryCreateCharacterList();
	Kien.LMBS_Core.Scene_Boot_create.call(this);
};

Scene_Boot.prototype.tryCreateCharacterList = function() {
	if (Utils.isNwjs() && Utils.isOptionValid('test')) {
		var obj = {};
		var fs = require("fs");
		var loc = window.location.pathname;
		var projdir = loc.substring(1, loc.lastIndexOf('/'));
		var basedir = projdir + "/img/sv_actors";
		var dirs = fs.readdirSync(basedir).filter(function(name) {
			return fs.lstatSync(basedir+"/"+name).isDirectory();
		});
		dirs.forEach(function(dir){
			var names = [];
			var files = fs.readdirSync(basedir+"/"+dir);
			files.forEach(function(filename) {
				if (fs.lstatSync(basedir + "/" + dir + "/" + filename).isFile()) {
					var exts = filename.split(/(.+)\./);
					if (exts[exts.length - 1] === "png") {
						names.push(RegExp.$1);
					}
				}
			})
			if (names.contains("Stand")) {
				obj[dir] = names;
			}
		})
		console.log(JSON.stringify(obj));
		fs.writeFileSync(projdir + "/data/characterList.json",JSON.stringify(obj));
	}
}