const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const communicate = require('../emails/communicate')
var path = require('path');


CreateCsvFile = (data) => {
    const csvWriter = createCsvWriter({
        path: `csvfiles/files/details.csv`,
        header: [
          {id: 'unit_id', title: 'UNIT-ID'},
          {id: 'login_username', title: 'USER NAME'},
          {id: 'login_password', title: 'PASSWORD'}
        ]
      });
    //console.log('DATA', data.ownerdata)
    //console.log('EMAILS', data.c_details[0].sis_community_name)
    communityname = data.c_details[0].sis_community_name;
    communitytype = data.c_type;
    console.log('COMM TYPE',data.c_type)
    hnumbers = data.c_details[0].sis_community_total_units;
    blocks = data.c_details[0].sis_community_blocks;
    mail1 = data.c_details[0].sis_community_spoc1_email;
    mail2 = data.c_details[0].sis_community_spoc2_email;
    csvWriter.writeRecords(data.ownerdata)
        .then(()=> console.log('The CSV file was written successfully'));

    var filepath = path.basename('/csvfiles/files/details.csv');
    console.log('PATH', filepath)
    if(data.c_type === 'Villa'){
        communicate.CommunityTriggerEmail(communityname,communitytype,hnumbers,mail1,mail2,filepath)
    }else {
        communicate.CommunityTriggerEmail(communityname,communitytype,blocks,mail1,mail2,filepath) 
    }      
}

 
module.exports.CreateCsvFile = CreateCsvFile;

