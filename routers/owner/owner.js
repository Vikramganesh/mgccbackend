const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection')
const logmsg = require("../../logmessages")
/*================================get owner data by id===========================================*/
router.get('/owdata/:id',(req,res)=>{
    id = req.params.id;
    //console.log(id);
    connection.query("SELECT owner_name, owner_email,owner_phone FROM sis_community_owners WHERE unit_id=?",[id],(err,result)=>{
        if(!err){   
            ownerdetails = result;
            //console.log(ownerdetails);
            connection.query("SELECT * FROM sis_community_units WHERE unit_id=?",[id],(err,result)=>{
                if(!err){
                    unitdetails = result;
                    //console.log(unitdetails);
                    res.json([{ownerdetails},{unitdetails}]);
                }else{
                    logmsg.logger.error(err);
                }
            })
        }else{
            logmsg.logger.error(err)
        }
    })
})


router.get('/getcomdata/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/getunitname/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/getownerbyid/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community_owners  WHERE owner_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/ounitdetails/:id',(req,res)=>{
    id = req.params.id;
    connection.query("SELECT * FROM sis_community_units WHERE unit_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

/*=============================TENANT BY ID============================================*/
router.get('/ttenantbyid/:id',(req,res)=>{
    id = req.params.id;
    connection.query("SELECT * FROM sis_community_tenant WHERE unit_id=? AND tent_status=?",[id,'Active'],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post('/fixturedata',(req,res)=>{
    d = req.body;
    //console.log(d);
    connection.query("UPDATE sis_community_units SET type=?, no_of_lights=?, no_of_fans=?, no_of_ac=? WHERE unit_id=?",[d.h_type,d.lights,d.fans,d.ac,d.uid],(err,rows)=>{
        if(!err){
            connection.query("UPDATE sis_community_owners SET occupancy=? WHERE owner_id=?",[d.occupancy,d.ownerid],(err,rows)=>{
                if(!err){
                    res.send(rows)
                }else{
                    res.send(err)
                }
            })
        }else{
            res.send(err)
        }
    })
})

router.post('/ownermember',(req,res)=>{
    d = req.body;
    date = new Date();
    connection.query("INSERT INTO sis_community_owner_members SET sis_community_id=?,unit_id=?,owner_id=?,m_name=?,m_email=?,m_phone=?,created_by=?,created_date=?",[d.communityid,d.unitid,d.ownerid,d.name,d.email,d.phone,'owner',date],(err,rows)=>{
        if(!err){
            res.send(rows);
            logmsg.logger.info('member register success')
        }else{
            res.send(err);
            logmsg.logger.error('error at member registration',err)
        }
    })
})

router.get('/omember/:cid/:uid/:oid',(req,res)=>{
    cid = req.params.cid;
    uid = req.params.uid;
    oid = req.params.oid;
    connection.query("SELECT * FROM sis_community_owner_members WHERE sis_community_id=? AND unit_id=? AND owner_id=?",[cid,uid,oid],(err,rows)=>{
        if(!err){
            if(_.isEmpty(rows) === true) {
                res.send('nodata');
            }else{
                res.send(rows)
            }
        }else{
            res.send(err)
            logmsg.logger.error(err)
        }
    })
    
})

/*==============================OWNER ADD TENANT===========================================*/
router.post('/oaddtenant',(req,res)=>{
    var datetime = new Date();
    let d = req.body;
    //console.log(d)
    connection.query("SELECT * FROM sis_community_tenant WHERE sis_community_id=? AND unit_id=? AND owner_id=? AND tent_status=? ",[d.communityid,d.unitid,d.ownerid,"Active"],(err,rows,result)=>{
        if(!err){
            console.log('rows-1', rows);
           if(_.isEmpty(rows) === true)
           {
                connection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,unit_id=?,owner_id=?,role_id=?,tent_name=?,tent_email=?,tent_phone=?,tent_username=?,tent_password=?,tent_status=?,tent_occupency=?,tent_created_by=?,tent_created_date=?",[d.communityid,d.unitid,d.ownerid,"3",d.name,d.email,d.phone,d.username,d.password,"Active",d.startdate,'owner',datetime], (err, rows, fields ) => {   
                    if (!err){
                            console.log('tenant data enter success...1');
                            tentid=result.insertId;
                            if(d.acheck === true)
                            {
                            connection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[d.communityid,d.ownerid,d.username,d.password,"3","1","admin",datetime],(err, rows) =>{
                                if(!err){
                                    res.send(rows)   
                                    logmsg.logger.info('tenant login data enter success...1');
                                }else{
                                    res.send(err)
                                }
                            });
                            }
                        } else{
                            logmsg.logger.error(err);
                        }   
                })
           }else if(rows.tent_releving<d.startdate) {
                    connection.query("INSERT INTO sis_community_tenant SET sis_community_id=?,unit_id=?,owner_id=?,role_id=?,tent_name=?,tent_email=?,tent_phone=?,tent_username=?,tent_password=?,tent_status=?,tent_occupency=?,tent_created_by=?,tent_created_date=?",[d.communityid,d.unitid,d.ownerid,"3",d.name,d.email,d.phone,d.username,d.password,"Active",d.startdate,'owner',datetime], (err, rows, fields ) => {   
                        if (!err){
                                logmsg.logger.info('tenant data enter success...2');
                                tentid=result.insertId;
                            if(d.acheck==true){
                                connection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[d.communityid,d.ownerid,d.username,d.password,"3","1","admin",datetime],(err, rows) =>{
                                    if(!err){
                                        res.send(rows)
                                        logmsg.logger.info('tenant login data enter success...2');
                                    }else{
                                        res.send(err)
                                    }
                                })
                            }
                        } else{
                            logmsg.logger.error(err);
                        }   
                    })
           }else{
            logmsg.logger.info('tenant already exist')
               res.send('tenant-exist')
           }
         // console.log(rows);
        }else{
            logmsg.logger.error(err) 
        }
    })
})

/*===================================DISPLAY TENANT======================================*/
router.get('/alltenants/:id', (req,res)=>{
    id = req.params.id;
    connection.query("SELECT * FROM sis_community_tenant WHERE unit_id=?",[id], (err,result)=>{
        if(!err){
            if(_.isEmpty(result) === true){
                res.send(err).end
            }else{
                res.send(result).end()
            }
        }else{
            logmsg.logger.error(err)
            res.send(err).end()
        }
    })
})

/*===================================UPDATE TENANT BY ID======================================*/
router.post('/editttenants', (req,res)=>{
    date = new Date();
    td = req.body;
    //console.log(td);
    connection.query("UPDATE sis_community_tenant SET tent_username=?,tent_password=?, tent_status=?,tent_releving=?, tent_modify_by=?, tent_modify_date=? WHERE tent_id=?",[td.uname,td.password,td.status,td.vdate,'owner',date,td.tid],(err,rows)=>{
        if(!err){
           //  res.send(rows)
           connection.query("INSERT INTO sis_community_login SET sis_community_id=?,login_username=?,login_password=?,role_id=?,login_status=?,login_created_by=?,login_created_date=?",[td.comid,td.uname,td.password,'3','1','owner',date],(err,rows)=>{
               if(!err){
                   res.send(rows)
                   //console.log(rows);
               }else{
                   res.send(err)
               }
           })
        }else{
            res.send(err)
        }
    })
})

/*=========================BOARDMEMBERS BY ID================================================*/
router.get('/allboardmemberss/:id',(req,res)=>{
    id = req.params.id;
    //console.log(id);
    connection.query("SELECT * FROM sis_community_boardmembers WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post('/ownercomplaint',(req,res)=>{
    var datetime = new Date();
    complaint= req.body;
    // console.log("COMPLAINT",complaint)
    connection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,owner_id=?,unit_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,status=?,created_by=?,created_date=?",[complaint.communityid,complaint.ownerid,complaint.unitid,complaint.complaint,complaint.description,complaint.comments,datetime,complaint.urgent,"NOT YET STARTED","owner",datetime], (err, rows, fields ) => {   
      if (!err){
            res.send(rows);
        } else{
            res.send(err);
        }   
    })
})

router.get('/ownerallcomplaints/:com_id/:owner_id/:unit_id', (req,res) =>{
    com_id = req.params.com_id
    owner_id = req.params.owner_id
    unit_id = req.params.unit_id
    // console.log(com_id,owner_id,unit_id);
    connection.query("SELECT * FROM sis_community_complaints WHERE sis_community_id=? AND owner_id=? AND unit_id=?",[com_id,owner_id,unit_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post('/updateownercomplaint', (req,res) =>{
    c = req.body;
    // console.log(c);
    connection.query("UPDATE sis_community_complaints SET complaint=?, complaint_description=?, owner_comments=? WHERE comp_id=?",[c.ecomplaint,c.edescription,c.ecomments,c.etid],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    });
})


router.post('/cancelownercomplaint/:id', (req,res) =>{
    id = req.params.id;
    // console.log(id);
    connection.query("UPDATE sis_community_complaints SET status=? WHERE comp_id=?",["CANCELED",id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    });
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

router.get('/getMaintenancedata/:id',(req,res)=>{
    id = req.params.id;
    //console.log(id);
    connection.query("SELECT * FROM sis_community_maintenance WHERE unitid=?",[id],(err,rows,result)=>{
        if(!err){   
           
            res.send(rows);
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/getPaymentsdata/:id', (req,res) =>{
    id = req.params.id;
    //console.log(id);
    connection.query("SELECT * FROM sis_community_payments JOIN sis_community_maintenance ON sis_community_payments.invoice_id = sis_community_maintenance.invoice_id  WHERE sis_community_maintenance.unitid=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
            logmsg.logger.info(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.post('/getMaintenancebydate',(req,res)=>{
    d = req.body;
    connection.query("SELECT * FROM sis_community_maintenance WHERE sis_community_id=? AND unitid=? AND maintanance_month BETWEEN ? AND ? ",[d.commid,d.unitid,d.startdate,d.enddate], (err,rows)=>{
        if(!err){
            logmsg.logger.info('Rows', rows);
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post('/getPaymentsdatabysearch',(req,res)=>{
    d = req.body;
    connection.query("SELECT * FROM sis_community_payments JOIN sis_community_maintenance ON sis_community_payments.invoice_id = sis_community_maintenance.invoice_id  WHERE sis_community_maintenance.unitid=? AND sis_community_maintenance.sis_community_id=? AND sis_community_maintenance.invoice_id=? OR sis_community_maintenance.maintanance_month BETWEEN ? AND ?",[d.unitid,d.commid,d.receiptid,d.startdate,d.enddate],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
            logmsg.logger.info(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/getMaintenanceapproval/:id',(req,res)=>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community_maintenance WHERE sis_community_id=? ",[id], (err,rows)=>{
        if(!err){
            //console.log(rows);
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.get('/getPaymentsapproval/:id',(req,res)=>{
    id = req.params.id
    connection.query("SELECT * FROM sis_community_payments JOIN sis_community_maintenance ON sis_community_payments.invoice_id = sis_community_maintenance.invoice_id  WHERE sis_community_maintenance.sis_community_id=? AND sis_community_payments.payment_status=?",[id,'2'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
             //console.log(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})


module.exports = router;