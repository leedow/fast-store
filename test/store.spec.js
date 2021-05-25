const assert = require('assert')
const Store = require('../core/store')
const path = require('path')
const Bonetime = require('bone-time')
const fs = require('fs')


function delDir(path){
    let files = [];
    if(fs.existsSync(path)){
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()){
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
 
delDir(`${path.resolve(__dirname, '..')}/tmp/`)

 
describe('测试store',function(){
	let store = null

	it('对象创建',function(){
		store = new Store({
			path: `${path.resolve(__dirname, '..')}/tmp/test`
		})
		assert.deepEqual( store.path, `${path.resolve(__dirname, '..')}/tmp/test`)
	})

	it('save',function(){
		assert.equal( store._save('test_store', {test:1}), true)
	})

	it('read',function(){
		assert.deepEqual( store._read('test_store'), {test:1})
	})

	it('_createFile',function(){
		let time = Date.now()
		let day = new Date(time)
		day.setHours(0,0,0,0)

		assert.deepEqual( store._createFile(time), {
			name: new Bonetime(day).format('yyyy_MM_dd'),
			startTime: day.getTime(),
			endTime: day.getTime() + 24*3600*1000,
			datas: {}
		})
	})

	it('_getFile',function() {
		store._currentFile = null

		let time = Date.now()
		let day = new Date(time)
		day.setHours(0,0,0,0)

		assert.deepEqual( store._getFile(time), {
			name: new Bonetime(day).format('yyyy_MM_dd'),
			startTime: day.getTime(),
			endTime: day.getTime() + 24*3600*1000,
			datas: {}
		})

		day.setDate(day.getDate()+2)


		assert.deepEqual( store._getFile(day.getTime()), {
			name: new Bonetime(day).format('yyyy_MM_dd'),
			startTime: day.getTime(),
			endTime: day.getTime() + 24*3600*1000,
			datas: {}
		})

 
		assert.deepEqual( store._getFile(day.getTime()+1), {
			name: new Bonetime(day).format('yyyy_MM_dd'),
			startTime: day.getTime(),
			endTime: day.getTime() + 24*3600*1000,
			datas: {}
		})
	})
 

	it('saveKeys',function(){
		let time = Date.now()
		let day = new Date(time)
		day.setHours(0,0,0,0)
		assert.deepEqual( store.saveKeys(time, {
			a: 1,
			b: 2
		}), true)

		assert.deepEqual( store.getKey(time, 'a'), 1)
		assert.deepEqual( store.getKey(time, 'b'), 2)
		assert.deepEqual( store.getKey(time, 'f'), undefined)


	})

	it('saveKey',function(){
		let time = Date.now()+1000
		let day = new Date(time)
		day.setHours(0,0,0,0)
		assert.deepEqual( store.saveKey(time, 'c',3), true)

		assert.deepEqual( store.getKey(time, 'a'), undefined)
		assert.deepEqual( store.getKey(time, 'b'), undefined)
		assert.deepEqual( store.getKey(time, 'c'), 3)
		assert.deepEqual( store.getKey(time, 'f'), undefined)
	})

	it('跨天保存和读取',function(){
		let day1 = new Date()
		let day2 = new Date()
		day2.setDate(day1.getDate()+2)

		let day3 = new Date()
		day3.setDate(day1.getDate()+4)

		let time1 = day1.getTime()
		let time2 = day2.getTime()
		let time3 = day3.getTime()

		assert.deepEqual( store.saveKey(time1, 'time1',1), true)
		assert.deepEqual( store.saveKey(time2, 'time2',2), true)
		assert.deepEqual( store.saveKey(time3, 'time3',3), true)


		assert.deepEqual( store.getKey(time1, 'time1'), 1)
		assert.deepEqual( store.getKey(time2, 'time2'), 2)
		assert.deepEqual( store.getKey(time3, 'time3'), 3)




	})

})