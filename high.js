const Store = require('./core/store')
const path = require('path')

let store = new Store({
			path: `${path.resolve(__dirname, '')}/tmp/high`
		})


let total = 10000

let start = Date.now()
 

for (var i = 0; i < total; i++) {
	for (var n = 0; n <50; n++) {
			//store.saveKey(start+i*60000, `a${n}`, Math.random()) 

			store.getKey(start+i*60000, `a${n}`, Math.random()) 

	}
	 
}

//store.close()


console.log(Date.now()-start)