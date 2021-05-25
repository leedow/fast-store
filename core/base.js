const fs = require('fs')
const path = require('path')

module.exports = class Base {
  constructor(options={}) {
  	this.path = options.path||''
  }

  log(content) {
    console.log(content)
  }

  error(content) {
    console.error(content)
  }

  get fullPath() {
  	return this.path
  }

  filePath(fileName) {
    return `${this.fullPath}/${fileName}.json`
  }
 
  /*
   *
   */
  _read(fileName) {
  	try {
      	let file = JSON.parse(fs.readFileSync(this.filePath(fileName)))
      	return file
  	} catch(e) {
  		//this.error(`${this.filePath(fileName)} do not exsit!`)
      return null
  	}
  }

  _save(fileName, file) {
  	try{
      let pathes = this.fullPath.split('/')
 
  		if(!fs.existsSync(this.fullPath)) {
	      fs.mkdirSync(this.fullPath)
	    }
	     fs.writeFileSync(this.filePath(fileName), JSON.stringify(file))
       return true
  	} catch(e) {
  		this.error(e)
  		return false
  	}

  	return true
  }

 

}