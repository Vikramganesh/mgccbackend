const opt = require('./email');
const fs = require('fs');
const Hogan = require('hogan.js')


// broadcast emails
BroadCastEmails = (e) => {
    console.log('Broadcast-emails', e.emails)
    e.emails.forEach(function(value, index, array){
        console.log(value.owner_email,e.subject,e.message);
        opt.options(value.owner_email,e.subject,e.message);  
    })
}
module.exports.broadcastmails = BroadCastEmails;

BroadCastEmailsToTenants = (e) => {
    console.log('Broadcast-emails', e.emails)
    e.emails.forEach(function(value, index, array){
        //console.log(value.tent_email,e.subject,e.message);
        opt.options(value.tent_email,e.subject,e.message);  
    })
}
module.exports.broadcastmailsToTenants = BroadCastEmailsToTenants;

// send email at the time of community registration.

// template

const template1 = fs.readFileSync('emails/templates/regsuccess.html','utf-8');
const compiledTemplet1 = Hogan.compile(template1)


CommunityRegEmail = (communityname,email1,email2,blocks,units) => {
    temp1 = compiledTemplet1.render({'commname': communityname,'blocks':blocks,'units':units })
   // console.log('communityReg-emails',e.emails)
    opt.options(email1,'Community-Registration','Hello',temp1)
    opt.options(email2,'Community-Registration','hello',temp1)
}
module.exports.CommunityRegEmail = CommunityRegEmail;


// send email at admin add owner.

// template

const template2 = fs.readFileSync('emails/templates/adminaddowner.html','utf-8');
const compiledTemplet2 = Hogan.compile(template2)



AdminAddOwnerEmail = (email,username,password) =>{
    temp2 = compiledTemplet2.render({'username': username,'password':password})
    opt.options(email,'Resident Registration – Successful','Hello',temp2)
}
module.exports.AdminAddOwnerEmail = AdminAddOwnerEmail;



// send email at admin aprove owner.

// template

const template3 = fs.readFileSync('emails/templates/adminapproveowner.html','utf-8');
const compiledTemplet3 = Hogan.compile(template3)

AdminAproveOwnerEmail = (cname,email,uname,psw) => {
    temp3 = compiledTemplet3.render({'communityname':cname, 'username': uname,'password':psw})
    opt.options(email,'Resident Approval – Successful','Hello',temp3)
}
module.exports.AdminAproveOwnerEmail = AdminAproveOwnerEmail;


AdminAddSupervisorEmail = () => {

}

OwnerAddTenantEmail = () => {

}


const template4 = fs.readFileSync('emails/templates/regsuccess.html','utf-8');
const compiledTemplet4 = Hogan.compile(template4)


CommunityTriggerEmail = (cname,ctype,blocks,email1,email2,path) => {
    temp4 = compiledTemplet4.render({'commname': cname, 'commtype': ctype, 'blocks':blocks})
    opt.options2(email1,'Community-Registration','Hello',temp4,path)
    opt.options2(email2,'Community-Registration','Hello',temp4,path)
}
module.exports.CommunityTriggerEmail = CommunityTriggerEmail;


