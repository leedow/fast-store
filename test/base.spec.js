const assert = require('assert')
const Base = require('../core/base')
const path = require('path')

describe('测试base',function(){
	let base = null

	it('对象创建',function(){
		base = new Base({
			path: `${path.resolve(__dirname, '..')}/tmp`
		})
		assert.deepEqual( base.path, `${path.resolve(__dirname, '..')}/tmp`)
	})

	it('save',function(){
		assert.equal( base._save('test', {test:1}), true)
	})

	it('read',function(){
		assert.deepEqual( base._read('test'), {test:1})
	})

})