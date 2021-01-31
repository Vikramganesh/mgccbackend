const express = require('express');
const cors = require('cors');
const { connection } = require('./dbconnection');
const log4js = require('log4js');
const app = express();
const PORT = 5000;
const login = require("./routers/login/login");
const onboard = require("./routers/onboard/onboard");
const admin = require("./routers/admin/admin");
const owner = require("./routers/owner/owner");
const supervisor = require("./routers/supervisor/supervisor");
const tenant = require("./routers/tenant/tenant");
const logmsg = require("./logmessages")



connection.connect((err)=>{
    if(!err){
        // console.log('Connection Success...');
        logmsg.logger.info('Connection Success...')
       
    }else{
         // console.log('Connection failed \n Error : '+JSON.stringify(err,undefined,2));
         logmsg.logger.error('Connection failed \n Error : '+JSON.stringify(err,undefined,2));
    }

});
app.use(cors());
app.use(express.json()) // for parsing application/json
app.use('/login',login);
app.use('/onboard',onboard);
app.use('/admin',admin);
app.use('/owner',owner);
app.use('/supervisor',supervisor);
app.use('/tenant',tenant);
// if route match the /admin it will redirect to admin.js file for admin routes.


app.listen(PORT, ()=> logmsg.logger.info(`Server is running on ${PORT}`))
