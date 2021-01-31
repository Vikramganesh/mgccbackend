const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection')
const communicate = require('../../emails/communicate')
const GenCsv = require('../../csvfiles/createcsvfile');
const logmsg = require('./../../logmessages')
/*================================Get All Community Data=================================*/
router.get('/communitydata', (req,res) =>{
    connection.query("SELECT * FROM sis_community", (err,rows)=> {
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error('No community data', err)
        }
    })
})

/*==========================COMMUNITY DATA BY ID=========================*/

router.get('/comunitydaatabyit/:id', (req,res)=>{
    id = req.params.id;
    connection.query("SELECT * FROM sis_community WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    })
})
/*------------------------VILLA OR APARTMENT-------------------------------------*/
router.get('/communitytypebyid/:id',(req,res)=>{
    id = req.params.id;
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            logmsg.logger.error('No details', err);
        }
    })
});

/*================================Community Type===========================================*/

router.get('/type',(req,res)=>{
    connection.query("SELECT sis_community_type_id,sis_community_type_name FROM sis_community_type",(err,rows,fields)=>{
        if(!err){
            //console.log(rows[1].e_id);
            res.send(rows);
        }else{
            logmsg.logger.error(err);
        }
    })
});


/*===================== Get Flats data from  sis_community_units table =============*/
router.get('/blocks/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT unit_id,blockflat_name,house_num FROM sis_community_units  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

/*--------------getblock data from  sis_community_blocks table----*/
router.get('/briks/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?", [id],(err,rows)=>{
        if(!err){
           // res.send(rows)
            typeid = rows[0].sis_community_type;
            console.log(typeid)
            if(typeid === 1){
                logmsg.logger.info('apartment')
                connection.query("SELECT * FROM sis_community_blocks  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
                    if(!err){
                        res.send(rows)
                    }else{
                        logmsg.logger.error(err)
                    }
                })
            }else if(typeid === 2){
                console.log('villa')
                connection.query("SELECT house_num,unit_id FROM sis_community_units  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
                    if(!err){
                        res.send(rows)
                    }else{
                        logmsg.logger.error(err)
                    }
                })
            }
        }else{
            res.send(err)
        }
    })
})

router.get('/ownertenantroles', (req,res) =>{
    connection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('2','3')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })

})    


/*=============================================get community roles===========================================*/
router.get('/communityroles', (req,res) =>{
    connection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('5','7','8','9','10','11','12')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })

})

/*======START============================get community id for input field display====================================*/
router.get('/communitytype/:id', (req,res)=>{
    id = req.params.id
    connection.query("SELECT unit_id FROM sis_community_owners WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })

})

/*======START============================get unit id for input field display====================================*/
router.get('/ownerdata/:id', (req,res)=>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community_owners WHERE unit_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })

})



/*========================COMMUNITY REGISTRATION=================================================================*/

router.post('/reg',(req,res)=>{
    let com = req.body;
    //console.log("request body",req.body)
    var datetime = new Date();
    //console.log(com);
    connection.query("INSERT INTO sis_community SET sis_community_name=?,sis_community_sname=?,sis_community_type=?,sis_community_locality=?,sis_community_city=?,sis_community_state=?,sis_community_pin=?,sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_total_units=?,sis_community_blocks=?,sis_community_status=?,sis_community_creation_date=?,sis_community_created_by=?",[com.comname,com.comshortname,com.type,com.locality,com.city,com.state,com.pin,com.spoc1_Name,com.spoc2_Name,com.spoc1_ph,com.spoc2_ph,com.spoc1_email,com.spoc2_email,com.villa,com.number_of_blocks,'1',datetime,"admin"], (err, result) =>{
        if(!err){
              com_id=result.insertId;
              console.log(result.insertId)
              logmsg.logger.info('data inserted into community table')
              //logmsg.logger.info({"communityname":com.comname,"person1":com.spoc1_email,"person2":com.spoc2_email,"blocks":com.number_of_blocks,"units":3})
              communicate.CommunityRegEmail(com.comname,com.spoc1_email,com.spoc2_email,com.number_of_blocks,3)
              if(com.type == '1'){
                com.blocks.forEach(function(value, index, array){
                    console.log('BLOCKS',value.block);
                    console.log('FLATS', value.flats);
                    flatnum = value.block + value.flats;
                    connection.query("INSERT INTO sis_community_blocks SET sis_community_id=?,block_name=?,no_of_units=?,blocks_created_by=?,blocks_modify_by=?,blocks_created_date=?,blocks_modify_date=?",[com_id,value.block,value.flats,"admin","admin",datetime,datetime],(err,result)=>{
                        if(!err){
                            logmsg.logger.info('Blocks Insert Success.')
                            blockid=result.insertId;
                            for(i=1;i<=value.flats;i++){
                                for(p=blockid;p<=blockid;p++){
                                    let j=i;
                                    function padDigits(number, digits) {
                                        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
                                    }
                                    fn = padDigits(i, 3);
                                    connection.query("INSERT INTO sis_community_units SET sis_community_id=?, block_id=?, flat_num=?,blockflat_name=?, unit_status=?, unit_created_by=?,unit_created_date=?",[com_id, p, fn, value.block+'-'+fn, 'pending','admin',datetime],(err,result)=>{
                                        if(!err){
                                            logmsg.logger.info('Units Insert Success.')
                                            unitid=result.insertId;
                                            connection.query("INSERT INTO sis_community_owneronbording SET sis_community_id=?,unit_id=?,role_id=?,owner_status=?,owner_created_date=?,owner_created_by=?",[com_id,unitid,"13","Not Submited",datetime,"admin"],(err, result) =>{
                                                if(!err){
                                                    logmsg.logger.info('records insert onboarding success.')
                                                    onboardingid=result.insertId;
                                                    connection.query("INSERT INTO sis_community_login SET sis_community_id=?,onboardid=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[com_id,onboardingid,com.comshortname+value.block+j,"12345","13","1","admin",datetime],(err, result) =>{
                                                        if(!err){
                                                            logmsg.logger.info('records insert into login success.')
                                                           
                                                        }else{
                                                            logmsg.logger.error('records not insert into login')
                                                        }
                                                    })
                                                }else{
                                                    logmsg.logger.error('Not Inserted into Onboarding.')
                                                }
                                            })
                                        }else{
                                            logmsg.logger.error('Units Not Inserted.')
                                        }
                                    })
                                }
                            }
                        }
                    })

                })
               // console.log({"communityname":com.comname,"person1":com.spoc1_email,"person2":com.spoc2_email,"blocks":com.number_of_blocks,"units":value.flats})

              } else if(com.type == '2'){
                for(i=1;i<=com.villa;i++){
                    let j=i;
                    function padDigits(number, digits) {
                        return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
                    }
                    fn = padDigits(i, 3);
                    connection.query("INSERT INTO sis_community_units SET sis_community_id=?, house_num=?, unit_status=?, unit_created_by=?,unit_created_date=?",[com_id,fn,'pending','admin',datetime],(err,result)=>{
                        if(!err){
                            logmsg.logger.info('Data Inserted into villa units success.')
                            unitid=result.insertId;
                            connection.query("INSERT INTO sis_community_owneronbording SET sis_community_id=?,unit_id=?,role_id=?,owner_status=?,owner_created_date=?,owner_created_by=?",[com_id,unitid,"13","Not Submited",datetime,"admin"],(err, result) =>{
                                if(!err){
                                    logmsg.logger.info('Data Inserted into villa onboarding success.')
                                    onboardingid=result.insertId;
                                    connection.query("INSERT INTO sis_community_login SET sis_community_id=?,onboardid=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[com_id,onboardingid,com.comshortname+j,"12345","13","1","admin",datetime],(err, result) =>{
                                        if(!err){
                                            logmsg.logger.info('Data Inserted into villa login success.')
                                        }else{
                                            logmsg.logger.error('Data Not Inserted into villa login')
                                        }
                                    }) 
                                }else{
                                    logmsg.logger.error('Data Not Inserted into villa onboarding')
                                }
                            })
                        }else{
                            logmsg.logger.error('Data Not Inserted into villa units')
                        }
                    })
                }
              }else{
                logmsg.logger.error('Data Not Inserted Into Any Table')
              }
             
        }else{
            logmsg.logger.error('Data not inserted into community table')
        }  
    })
    res.end()
})   


/*==============================================ADMIN APROVAL DISPLAY ON UI============================================================*/
router.post('/allonboarding', (req,res)=>{
    d = req.body
  //  console.log(d);
    connection.query("SELECT * FROM sis_community_owneronbording WHERE sis_community_id=? AND owner_status=?",[d.community,d.status], (err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
});

router.get('/empsuproles', (req,res) =>{
    connection.query("SELECT * FROM sis_community_roles WHERE sis_community_role_id IN ('4','6')", (err,rows,fields)=> {
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })

})   


router.post('/addemployeesupervisor',(req,res)=>{
    var datetime = new Date();
    let d = req.body;
    // console.log(d);
    connection.query("INSERT INTO sis_community_employees SET sis_community_id=?,role_id=?,emp_name=?,emp_phone=?,emp_email=?,emp_username=?,emp_password=?,emp_status=?,emp_created_by=?,emp_created_date=?",[d.commid,d.roleid,d.empname,d.empphone,d.empphone,d.username,d.password,'1',"admin",datetime], (err, rows, fields ) => {   
      if (!err){
        logmsg.logger.info('data enter into employee table..')
            connection.query("INSERT INTO sis_community_login SET sis_community_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[d.commid,d.username,d.password,'4','1','admin',datetime],(err,rows)=>{
                if(!err){
                    logmsg.logger.info('emp data into login table')
                }else{
                    logmsg.logger.error('error at emp data')
                }
            })
        } else{
            logmsg.logger.error(err);
        }   
    })
    res.end();
});

/*============================================GET ID FROM UI AND CHANGE STATUS OF OWNER===================================================================*/
router.get('/aprovedata/:id',(req,res)=>{
    id = req.params.id;
    console.log(id)
    connection.query("UPDATE sis_community_owneronbording SET owner_status=? WHERE owner_id=?", ['approved',id],(err,rows)=>{
        if(!err){
            logmsg.logger.info('data update into onboarding with approved')
            connection.query("UPDATE sis_community_owners SET role_id=? WHERE onboard_id=?", ['2',id],(err,rows)=>{
                if(!err){
                    logmsg.logger.info('data update in owners with roleid')
                    connection.query("UPDATE sis_community_login SET role_id=?,login_status=? WHERE owner_id=?",['2','1',id],(err,rows)=>{
                        if(!err){
                            logmsg.logger.info('new record insert into login')
                            // write query for email using id and select data from owner table.
                            connection.query("SELECT sis_community_id,owner_email FROM sis_community_owners WHERE onboard_id=?",[id],(err,result)=>{
                                if(!err){
                                    email = result[0].owner_email;
                                    cid = result[0].sis_community_id;
                                    //logmsg.logger.info(result)
                                    connection.query("SELECT sis_community_name FROM sis_community WHERE sis_community_id=?",[cid],(err,result)=>{
                                        cname = result[0].sis_community_name;
                                        if(!err){
                                            connection.query("SELECT login_username,login_password FROM sis_community_login WHERE owner_id=?",[id],(err,result)=>{
                                                uname = result[0].login_username;
                                                psw = result[0].login_password;
                                                communicate.AdminAproveOwnerEmail(cname,email,uname,psw);
                                            })
                                        }else{
                                            logmsg.logger.error('error at getting data from community table-2')
                                        }
                                    })
                                }else{
                                    logmsg.logger.error('error at getting data from community table')
                                }
                            })
                        }else{
                            logmsg.logger.error(err.code)
                        }
                    })
                }else{
                    logmsg.logger.error(err.code)
                }
            });
        }else{
            logmsg.logger.error(err.code)
        }
    })
    res.send();

})
/*===============================================================================================================*/


/*===========================ADD BOARDMEMBERS==============================================*/

router.post('/addboardmembers', (req,res)=>{
    date = new Date()
    data = req.body;
    //logmsg.logger.info(data);
    logmsg.logger.info('LENGTH', data.boardmembers.length);
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[data.commid],(err,rows)=>{
        if(!err){
            logmsg.logger.info('community id get success', rows[0].sis_community_type)
            const type = rows[0].sis_community_type;
            if(type == 1 ){ // apartment = 1
                data.boardmembers.forEach(function(value,index,array){
                    //console.log('UNITS',value.unit);
                        connection.query("INSERT INTO sis_community_boardmembers SET sis_community_id=?,unit_id=?,bm_designation=?,bm_name=?,bm_phone=?,bm_email=?,bm_startdate=?,bm_enddate=?,bm_status=?,bm_created_by=?,bm_created_date=?",[data.commid,value.unit,value.designation,value.bmname,value.phone,value.email,data.startdate,data.enddate,'1',"admin",date],(err,rows)=>{
                            if(!err){
                                logmsg.logger.info('success-apparments bm')
                            }else{
                                logmsg.logger.error('error at addnig boardmember from apartments')
                            }
                        })
                }) 
            }else if(type == 2) { // villa = 2
                data.boardmembers.forEach(function(value,index,array){
                    //console.log('UNITS',value.unit);
                        connection.query("INSERT INTO sis_community_boardmembers SET sis_community_id=?,unit_id=?,bm_designation=?,bm_name=?,bm_phone=?,bm_email=?,bm_startdate=?,bm_enddate=?,bm_status=?,bm_created_by=?,bm_created_date=?",[data.commid,value.h_unitid,value.designation,value.bmname,value.phone,value.email,data.startdate,data.enddate,'1',"admin",date],(err,rows)=>{
                            if(!err){
                                logmsg.logger.info('success-villa bm')
                            }else{
                                logmsg.logger.error('error at addnig boardmember from villas')
                            }
                        })
                }) 
        
            }
        }else{
            logmsg.logger.error('error at getting community id')
        }
    })
   
    res.end(); 
})

/*-----------------------RESIDENT REGISTARTION--------------------------------------*/

router.post('/adminadresedent', (req,res)=>{
    data = req.body;
    date = new Date();
    role = data.role;
    //console.log(data)
    console.log(data.hnumunitid)
    if(data.hnumunitid === null){
        logmsg.logger.info('ap')
        if(role === '2'){ // owner
            logmsg.logger.info('ap-owner')
            connection.query("SELECT owner_id FROM sis_community_owners WHERE unit_id=?", [data.unitid],(err,rows)=>{
                if(!err){
                    ownerid = rows[0].owner_id
                    logmsg.logger.info('owner-id',ownerid)
                    // console.log('ap')
                    connection.query("UPDATE sis_community_units SET unit_status=? WHERE unit_id=?",['pending',data.unitid],(err,result)=>{
                        if(!err){
                           // res.send(result)
                           logmsg.logger.info('sis community units updated..')
                            connection.query("UPDATE sis_community_login SET login_status=? WHERE owner_id=?",['0',ownerid],(err,rows)=>{
                                if(!err){
                                    logmsg.logger.info('login table updated')
                                    connection.query("UPDATE sis_community_owners SET owner_status=? WHERE unit_id=?",['0',data.unitid], (err,rows)=>{
                                        if(!err){
                                            logmsg.logger.info('owner status updated..')
                                            connection.query("INSERT INTO sis_community_owneronbording SET sis_community_id=?,unit_id=?,role_id=?,owner_name=?,owner_phone=?,owner_email=?,owner_status=?,owner_created_date=?,owner_created_by=?",[data.communityid,data.unitid,'13',data.name,data.phone,data.email,'Not Submited','admin',date],(err,result)=>{
                                                onboardid = result.insertId;
                                                if(!err){
                                                    connection.query("INSERT INTO sis_community_login SET sis_community_id=?,onboardid=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[data.communityid,onboardid,data.username,data.password,"13","1","admin",date],(err, result) =>{
                                                        if(!err){
                                                            logmsg.logger.info('data inserted into login table for apartments');
                                                            communicate.AdminAddOwnerEmail(data.email,data.username,data.password);
                                                        }else{
                                                            logmsg.logger.error('data not inserted into login table')
                                                        }
                                                    });
                                                }
                                            })

                                        }else{
                                            logmsg.logger.error('error at owner table-ap')
                                        }
                                    })
                                }else{
                                    logmsg.logger.error('error at login table-ap')
                                }
                            })
                        }else{
                            logmsg.logger.error('error at community units updated-ap')
                        }
                    })
                }else{
                    logmsg.logger.error('error at owner id-ap')
                }
            })

        } else { // tenant
            logmsg.logger.info('ap-tenant')
            connection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,unit_id=?,role_id=?,tent_name=?,tent_email=?,tent_phone=?,tent_username=?,tent_password=?,tent_status=?,tent_occupency=?,tent_created_by=?,tent_created_date=?",[data.communityid,data.unitid,'3',data.name,data.email,data.phone,data.username,data.password,'1',data.startdate,'admin',date],(err,rows)=>{
                if(!err){
                    logmsg.logger.info('tenant add success-ap')
                }else{
                    logmsg.logger.error('error at tenant adding-ap')
                }
            })
        }
    }else{
        logmsg.logger.info('vl')
        if(role === '2'){ // owner
            logmsg.logger.info('vl-owner')
            connection.query("SELECT owner_id FROM sis_community_owners WHERE unit_id=?", [data.hnumunitid],(err,rows)=>{
                if(!err){
                    ownerid = rows[0].owner_id
                    logmsg.logger.info('owner-id',rows[0].owner_id)
                    // console.log('ap')
                    connection.query("UPDATE sis_community_units SET unit_status=? WHERE unit_id=?",['pending',data.hnumunitid],(err,result)=>{
                        if(!err){
                           // res.send(result)
                           logmsg.logger.info('sis community units updated..')
                            connection.query("UPDATE sis_community_login SET login_status=? WHERE owner_id=?",['0',ownerid],(err,rows)=>{
                                if(!err){
                                    logmsg.logger.info('login table updated')
                                    connection.query("UPDATE sis_community_owners SET owner_status=? WHERE unit_id=?",['0',data.hnumunitid], (err,rows)=>{
                                        if(!err){
                                            logmsg.logger.info('owner status updated..')
                                            connection.query("INSERT INTO sis_community_owneronbording SET sis_community_id=?,unit_id=?,role_id=?,owner_name=?,owner_phone=?,owner_email=?,owner_status=?,owner_created_date=?,owner_created_by=?",[data.communityid,data.hnumunitid,'13',data.name,data.phone,data.email,'Not Submited','admin',date],(err,result)=>{
                                                onboardid = result.insertId;
                                                if(!err){
                                                    connection.query("INSERT INTO sis_community_login SET sis_community_id=?,onboardid=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[data.communityid,onboardid,data.username,data.password,"13","1","admin",date],(err, result) =>{
                                                        if(!err){
                                                            logmsg.logger.info('data inserted into login table for apartments-vl');
                                                            communicate.AdminAddOwnerEmail(data.email,data.username,data.password);
                                                        }else{
                                                            logmsg.logger.error('data not inserted into login table-vl')
                                                        }
                                                    });
                                                }else{

                                                }
                                            })

                                        }else{
                                            logmsg.logger.error('error at owner table-vl')
                                        }
                                    })
                                }else{
                                    logmsg.logger.error('error at login table-vl')
                                }
                            })
                        }else{
                            logmsg.logger.error('error at community units updated-vl')
                        }
                    })
                }else{
                    logmsg.logger.error('error at owner id-vl')
                }
            })
        } else { // tenant
            logmsg.logger.info('vl-tenant')
            connection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,unit_id=?,role_id=?,tent_name=?,tent_email=?,tent_phone=?,tent_username=?,tent_password=?,tent_status=?,tent_occupency=?,tent_created_by=?,tent_created_date=?",[data.communityid,data.hnumunitid,'3',data.name,data.email,data.phone,data.username,data.password,'1',data.startdate,'admin',date],(err,rows)=>{
                if(!err){
                    logmsg.logger.info('tenant add success-vl')
                }else{
                    logmsg.logger.error('error at tenant adding-vl')
                }
            })
        }
    }
    res.end();
})

/*=============================SEND EMAIL============================================*/
router.post('/sendmailtoresidents',(req,res)=>{
    data = req.body;
    if(data.to === 'owners'){
        connection.query("SELECT owner_email FROM sis_community_owners",(err,result)=>{
            if(!err){
               // res.send(rows)
                // console.log({"emails":result,"subject":data.subject,"message":data.message})
                communicate.broadcastmails({"emails":result,"subject":data.subject,"message":data.message})
                res.end();
            }else{
                res.send(err)
            }
        })
    } else if (data.to === 'tenants'){
        connection.query("SELECT tent_email FROM sis_community_tenant",(err,result)=>{
            if(!err){
                //res.send(rows)
                communicate.broadcastmailsToTenants({"emails":result,"subject":data.subject,"message":data.message})
                logmsg.logger.info(result)
                res.end();
            }else{
                res.send(err)
            }
        })

    } else if (data.to === 'all'){
        connection.query("SELECT owner_email FROM sis_community_owners",(err,result)=>{
            if(!err){
                logmsg.logger.info('owner emails', result)
            }else{
                res.send(err)
            }
        })
        connection.query("SELECT tent_email FROM sis_community_tenant",(err,result)=>{
            if(!err){
                logmsg.logger.info('tenant emails',result)
            }else{
                res.send(err)
            }
        })

    } else{
        res.end();
        logmsg.logger.info('No emails select')
    }
})

router.post('/adminownerreports', (req,res) =>{
    let owner= req.body;
    logmsg.logger.info('owner reports', owner)
    connection.query("SELECT * FROM sis_community_owners  WHERE sis_community_id=?",[owner.community],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            logmsg.logger.error(err)
        }
    });
})

router.post('/admintenantreports', (req,res) =>{
    let tenant= req.body;
    logmsg.logger.info(tenant)
   
    connection.query("SELECT * FROM sis_community_tenant  WHERE sis_community_id=?",[tenant.community],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            logmsg.logger.error(err)
        }
    });

})


router.post('/adminresidentreports',(req,res)=>{
    let resi= req.body;
    logmsg.logger.info(resi);
    let x=[];
    connection.query("SELECT * FROM sis_community_units  WHERE sis_community_id=?",[resi.community],(err,rows,fields)=>{
        if(!err){
            //res.send(rows);
            rows.forEach(function(value, index, array){
                logmsg.logger.info(value.unit_id);
                connection.query("SELECT * FROM sis_community_owners JOIN sis_community_tenant ON sis_community_owners.unit_id=sis_community_tenant.unit_id WHERE sis_community_owners.unit_id=?",[value.unit_id],(err,row,fields)=>{
                    if(!err){
                        let otj = row;
                        logmsg.logger.info('JOIN', otj);
                        
                        // res.send(row);
                        if(_.isEmpty(row) === true) {
                            connection.query("SELECT * FROM sis_community_owners  WHERE unit_id=? AND owner_status=?",[value.unit_id,'1'],(err,rows,fields)=>{
                                if(!err){
                                    //logmsg.logger.info("owner",rows);
                                   x.push(rows);
                                   //logmsg.logger.info("X",x);
                                    res.send(x);
                                    res.end();
                                }else{
                                    logmsg.logger.error(err)
                                }
                            });
                        }
                        else{
                            x.push(row);
                        }
                    }else{
                        logmsg.logger.error(err)
                    }
                });       
            })
            
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/allcommunities',(req,res)=>{
    connection.query("SELECT * FROM sis_community", (err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.get('/maintenancetype',(req,res)=>{
    connection.query("SELECT * FROM sis_community_maintenance_type",(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

/*==========================COMMUNITY EDIT=========================*/

router.post('/communityedit', (req,res)=>{
    date = new Date()
    d = req.body;
    // console.log(d);
    connection.query("UPDATE sis_community SET sis_community_spoc1_name=?,sis_community_spoc2_name=?,sis_community_spoc1_ph=?,sis_community_spoc2_ph=?,sis_community_spoc1_email=?,sis_community_spoc2_email=?,sis_community_maintenance_type=?,sis_community_maintenance=?,sis_community_modify_date=?,sis_community_modify_by=? WHERE sis_community_id=?",[d.persononename,d.persontwoname,d.persononephone,d.persontwophone,d.persononeemail,d.persontwoemail,d.indicator,d.amount,date,'admin',d.comid],(err,rows)=>{
        if(!err){
            res.send(rows)
            logmsg.logger.info('community update success')
        }else{
            res.send(err)
        }
    })
})

router.post('/boardmemberssearch',(req,res)=>{
    d = req.body;
    connection.query("SELECT * FROM sis_community_boardmembers WHERE sis_community_id=? AND bm_startdate=? AND bm_enddate=?",[d.commid,d.startdate,d.enddate], (err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})


/*===========================ADMIN EDIT EMPLOYEES==================================================*/
router.post('/admineditemployee', (req,res)=>{
    d = req.body;
    //console.log(d);
    connection.query("SELECT emp_id,emp_name,emp_email,emp_phone FROM sis_community_employees WHERE sis_community_id=? AND role_id=?",[d.commid,d.roleid],(err,result)=>{
        if(!err){
            res.send(result)
        }else{
            logmsg.logger.error('error at get emp data')
        }
    })
})

/*===========================ADMIN EDIT EMPLOYEES BY ID==================================================*/
router.post('/admineditemployeebyid', (req,res)=>{
    d = req.body;
    console.log(d);
    connection.query("UPDATE sis_community_employees SET emp_name=?,emp_phone=?,emp_email=? WHERE emp_id=?",[d.ename,d.ephone,d.eemail,d.eid],(err,result)=>{
        if(!err){
            res.send()
        }else{
            logmsg.logger.error('Error updating emp')
        }
    })
    
})
router.get('/triggercommunity/:id',(req,res)=>{
    id = req.params.id;
    //console.log(id)
    connection.query("UPDATE sis_community SET sis_onboard_trigger=? WHERE sis_community_id=?",['0',id],(err,row)=>{
        if(!err){
            logmsg.logger.info('community onboard trigger updated...')
        }else{
            logmsg.logger.error('community onboard trigger not updated...')
        }
    })
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[id],(err,row)=>{
        if(!err){
            //console.log(row[0].sis_community_type)
            type = row[0].sis_community_type
            if(type === 1){
                c_type = 'Apartment'
                connection.query("SELECT sis_community_name,sis_community_spoc1_email,sis_community_spoc2_email,sis_community_blocks FROM sis_community WHERE sis_community_id=?",[id],(err,rows)=>{
                    if(!err){
                        //console.log(rows)
                        c_details = rows;
                        query=`SELECT sis_community_owneronbording.unit_id,sis_community_login.login_username,sis_community_login.login_password FROM sis_community_login
                               JOIN sis_community_owneronbording
                               ON sis_community_owneronbording.owner_id = sis_community_login.onboardid 
                               WHERE sis_community_owneronbording.sis_community_id=?`,
                            connection.query(query,[id],(err,rows)=>{
                                if(!err){
                                    const creditionals = rows;
                                    //res.json({"c_type":c_type,"c_details":c_details, "ownerdata": creditionals})
                                    GenCsv.CreateCsvFile({"c_type":c_type,"c_details":c_details, "ownerdata": creditionals}); 
                                    res.send();
                                }else{
                                    res.send(err);
                                }
                            })
                    }else{
                        logmsg.logger.error('error at select community data')
                    }

                })

                
            }else if(type === 2){
                c_type = 'Villa'
                connection.query("SELECT sis_community_name,sis_community_spoc1_email,sis_community_spoc2_email,sis_community_total_units FROM sis_community WHERE sis_community_id=?",[id],(err,rows)=>{
                    if(!err){
                        //console.log(rows)
                        c_details = rows;
                        query=`SELECT sis_community_owneronbording.unit_id,sis_community_login.login_username,sis_community_login.login_password FROM sis_community_login
                               JOIN sis_community_owneronbording
                               ON sis_community_owneronbording.owner_id = sis_community_login.onboardid 
                               WHERE sis_community_owneronbording.sis_community_id=?`,
                            connection.query(query,[id],(err,rows)=>{
                                if(!err){
                                    const creditionals = rows;
                                    
                                    //res.json({"c_type":c_type,"c_details":c_details, "ownerdata": creditionals})
                                    GenCsv.CreateCsvFile({"c_type":c_type,"c_details":c_details, "ownerdata": creditionals});
                                    res.send(); 
                                }else{
                                    res.send(err);
                                }
                            })
                    }else{
                        logmsg.logger.error('error at select community data')
                    }

                })
                
            }else{
                logmsg.logger.error('No community type specified...')
            }
        }else{
            logmsg.logger.error(err)
        }
    })  
})




module.exports = router;

// this 'router' called as admin in app.js file.