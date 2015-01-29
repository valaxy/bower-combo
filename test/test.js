var temp = require('temp')
var assert = require('assert')
var childProcess = require('child_process')
var async = require('async')
var fs = require('fs')
var path = require('path')
var generate = require('../index')


describe('generate', function () {
	it('a case', function (done) {
		var tempRoot = temp.mkdirSync('temp')
		var bowerPath = 'bower.json'
		var configPath = 'config.js'
		async.series([
			function (done) {
				// write bower to a temp dir
				var bower = {
					name: 'for-test',
					dependencies: {
						"timer": "valaxy/timer"
					}
				}
				process.chdir(tempRoot)
				fs.writeFileSync(bowerPath, JSON.stringify(bower))
				done()
			},
			function (done) {
				// download bower_components
				var p = childProcess.spawn('bower.cmd', ['install'], {
					cwd: tempRoot
				})
				p.stderr.on('data', function (data) {
					assert.ok(false)
					done(data)
				})
				p.stdout.on('data', function (data) {

				})
				p.on('close', function (code) {
					done()
				})
			},
			function (done) {
				// generate the config
				generate(bowerPath, configPath)
				var code = '' + fs.readFileSync(configPath)
				var config = {
					paths: {
						timer: 'bower_components/timer/src/timer'
					}
				}
				assert.equal(code, 'require.config(' + JSON.stringify(config) + ')')
				done()
			}
		], function (err) {
			if (err) {
				assert.ok(false)
			}
			done()
		})

	})
})

