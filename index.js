var fs = require('fs')
var path = require('path')


var item = function (packageName, relpath) {
	var p = path.join('bower_components', packageName, relpath)
	p = path.join(path.dirname(p), path.basename(p, path.extname(p))) // remove `.js` `.css`
	p = p.replace(/\\/g, '/') // normalize
	return p
}

var createConfigFile = function (config, filePath) {
	var code = 'require.config(' + JSON.stringify(config) + ')'
	fs.writeFileSync(filePath, code)
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
			config.paths[packageName] = item(packageName, main)
		} else { // array
			for (var j in main) {
				config.paths[packageName] = item(packageName, main[j])
			}
		}
	}

	// create the config code
	createConfigFile(config, configPath)
}

module.exports = generate

if (require.main == module) {
	var bowerPath = process.argv[2]
	var configPath = process.argv[3]
	generate(bowerPath, configPath)
}