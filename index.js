var fs = require('fs')
var path = require('path')


var getconfig = function (packageName, relpath) {
	var p = path.join('bower_components', packageName, relpath)
	return p.replace(/\\/g, '/')
}


var generate = function (bowerPath, configPath) {
	// read bower package
	var componentDir = path.join(process.cwd(), 'bower_components')
	var bowerPath = path.join(process.cwd(), bowerPath)
	var configPath = path.join(process.cwd(), configPath)
	var bower = JSON.parse(fs.readFileSync(bowerPath))

	// create a requirejs config
	var config = {
		paths: {}
	}

	// iterate the bower_components
	var deps = bower.dependencies
	for (var packageName in deps) {
		var packageBowerPath = path.join(componentDir, packageName, 'bower.json')
		var packageBower = JSON.parse(fs.readFileSync(packageBowerPath))
		var main = packageBower.main
		if (typeof main == 'string') {
			config.paths[packageName] = getconfig(packageName, main)
		} else { // array
			for (var j in main) {
				config.paths[packageName] = getconfig(packageName, main[j])
			}
		}
	}

	// create the config code
	var code = JSON.stringify(config)
	return code
}

module.exports = generate

if (require.main == module) {
	var bowerPath = process.argv[2]
	var configPath = process.argv[3]
	generate(bowerPath, configPath)
}