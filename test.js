const
pico=require('pico-common/pico-cli'),
ensure= pico.export('pico/test').ensure,
aws=require('./index')

let client

ensure('ensure aws loaded', function(cb){
	cb(null, !!aws)
})
ensure('ensure aws create', function(cb){
	aws.create({path:'',env:'pro'},{},(err, cli)=>{
		if (err) return cb(err)
		client=cli
		cb(null, !!client)
	})
})
