const
AWS= require('aws-sdk'),
path= require('path'),
args= require('pico-args'),
dummyCB=()=>{},
addServices=function(aws,config){
	if (config.ses) aws.ses=new SES(config.ses)
}

function SES(config){
	this.ses=new AWS.SES(config)
	this.config=config
}

SES.prototype={
	send(to,subject,text,opt={},cb=dummyCB){
		if (!to || !to.length) return cb('no recipient')
		if (!subject || !text) return cb('no content')
		const
		cfg=this.config
		params={
			Destination: { /* required */
				ToAddresses: to,
				CcAddresses: opt.cc,
				BccAddresses: opt.bcc
			},
			Message: { /* required */
				Body: { /* required */
					Text:{Data:text,Charset:'utf-8'}
				},
				Subject: { /* required */
					Data: subject, /* required */
					Charset: 'utf-8'
				}
			},
			Source: cfg.sender, /* required */
			ReplyToAddresses: opt.reply,
			ReturnPath: cfg.bounce,
			ReturnPathArn: cfg.retARN || cfg.srcARN,
			SourceArn: cfg.srcARN
		}
		if (opt.html) params.Message.Body.Html={Data:opt.html,Charset:'utf-8'}
		this.ses.sendEmail(params,cb)
	}
}

module.exports={
    create:function(appConfig, libConfig, next){
        let config={
			credPath:'',
			apiVersions:{
				ses:'2010-12-01'
			}
        }

        args.print('SES Options',Object.assign(config,libConfig))

		AWS.config.loadFromPath(path.resolve(appConfig.path,config.credPath))
		AWS.config.apiVersions=config.apiVersions

		let aws={}
		addServices(aws,config)

        return next(null, aws)
    }
}
