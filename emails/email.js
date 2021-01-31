const express = require('express');
const bodyparser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const Hogan = require('hogan.js');
const { pathToFileURL } = require('url');
const app = express();

// create a transporter 465,587
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth:{
        type: 'login',
        user: 'dgaanesh3@gmail.com',
        pass: 'ganesh369'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// template

// const template = fs.readFileSync('./templates/regsuccess.html','utf-8');
// const compiledTemplet = Hogan.compile(template)


// options
Options = (tomail,subject,message,tmp) => {
    const options = {
        from: 'mgc team',
        to: tomail,
        subject: subject,
        text: message,
        html: tmp,
    }
    send(options)
}
module.exports.options = Options;


// options
Options2 = (tomail,subject,message,tmp,filepath) => {
    const options2 = {
        from: 'mgc team',
        to: tomail,
        subject: subject,
        text: message,
        html: tmp,
        attachments: [
            { path: `csvfiles/files/${filepath}`},
            { path: 'emails/templates/mgclogo.png',
              cid: 'logo'}
        
        ]
    }
    send(options2)
}
module.exports.options2 = Options2;

// send email

send = (o) => {
    transport.sendMail(o, (err, info)=>{
        if(err){
            console.log('ERROR',err);
        }else{
            console.log('email sent');
            console.log('INFORMATION', info);
        }
    
    })
}