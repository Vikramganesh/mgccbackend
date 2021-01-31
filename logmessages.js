const log4js = require('log4js');
log4js.configure({
    appenders: { 
        info: { 
            type: "file", 
            filename: "./logs/alllogs.log" ,
            maxLogSize: 20480,
            backups: 5
        },
        error: { 
            type: "file", 
            filename: "./logs/alllogs.log" ,
            maxLogSize: 20480,
            backups: 5
        } 
    },
    categories: { 
        default: { appenders: ["info"], level: "info" } ,
        info: { appenders: ["info"], level: "info" } ,
        error: { appenders: ['error'], level: 'error' },
    }
});

const logger= log4js.getLogger();

module.exports= {
    logger,
}
