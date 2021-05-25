const Base = require('./base')
const Bonetime = require('bone-time')

module.exports = class Store extends Base{
	constructor(options={}) {
		super(options)

		this.fileSaveMode = 'day' // 文件分割存储模式，默认以天为单位
		this._currentFile = null
	}

	/*
	 * 根据时间获取存储文件名
	 */
	_getFileName(time) {
		let day = new Date(time)
		day.setHours(0,0,0,0)
		return new Bonetime(day).format('yyyy_MM_dd')
	}

	/*
	 * 获取目标file的操作对象
	 * 如果目标文件已读取，直接返回内存对象
	 * 如果目标文件未读取但已存在，则读取后返回内存对象
	 * 如果目标文件未读取且未创建，则创建file后返回内存对象
	 * 文件数据结构：{name, startTime, endTime, datas:{time:{key:val}}}
	 */
	_getFile(time) {
		if(this._currentFile) {
			if( 
				time >= this._currentFile.startTime && 
				(time <= this._currentFile.endTime) ) {
				// 文件已读取
				return this._currentFile
			} else {
				// 文件需要更换
				this._saveFile()
				return this._createFile(time)
			}
		} else { // 文件未读取
			return this._createFile(time)
		}
	}

	/*
	 * 创建一个新文件，如果已存在则返回原文件
	 */
	_createFile(time) {
		let day = new Date(time)
		day.setHours(0,0,0,0)
		let fileName = this._getFileName(time)
		let file = this._read(fileName)
		if(file) {
			this._currentFile = file
			return this._currentFile
		} else {
			this._save(fileName, {
				name: fileName,
				startTime: day.getTime(),
				endTime: day.getTime() + 24*3600*1000,
				datas: {}
			})
			return this._createFile(time)
		}
	}

	/*
	 * 获取指定时间的数据值
	 * @time 单位ms的时间戳
	 */
	getKey(time, key) {
		try{
			this._getFile(time)
			if(this._currentFile && this._currentFile.datas && this._currentFile.datas[time]) {
				return this._currentFile.datas[time][key]
			} else {
				return undefined
			}
		} catch(e) {
			return undefined
		}	
	}

	/*
	 * 保存数据
	 * @time 单位ms的时间戳
	 * @keys {key:val}
	 */
	saveKeys(time, keys) {
		try{
			let handle = this._getFile(time) 
			if(typeof handle.datas[time] == 'undefined') handle.datas[time] = {}
			Object.keys(keys).forEach(key => {
				handle.datas[time][key] = keys[key]
			})
			return true
		} catch(e) {
			console.error(e)
			return false
		}
	}

	saveKey(time, key, val) {
		try{
			let handle = this._getFile(time) 
			if(typeof handle.datas[time] == 'undefined') handle.datas[time] = {}

			handle.datas[time][key] = val
			return true
		} catch(e) {
			console.error(e)
			return false
		}
	}

	/*
	 * 重置
	 */
	reset() {
		this._currentFile = null
	}


	/*
	 * 结束使用，保存数据
	 */
	close() {
		this._saveFile()
		this._currentFile = null
	}

	/*
	 * 将当前数据保存到硬盘
	 */
	_saveFile() {
		this._save(this._currentFile.name, this._currentFile)
	}

}