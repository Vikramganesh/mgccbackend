const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection');
const { Router } = require('express');
const logmsg = require("../../logmessages");
const { countBy } = require('underscore');
/*============================ADD EMPLOYEE=======================================*/

router.post('/saddemployee',(req,res)=>{
    date = new Date()
    d = req.body;
    // console.log(d);
    connection.query("INSERT INTO sis_community_employees SET sis_community_id=?,role_id=?,emp_name=?,emp_phone=?,emp_status=?,vendor_id=?,empmnt_type=?,emp_created_by=?,emp_created_date=?",[d.cid,'6',d.name,d.phone,'1',d.vendorid,d.emptype,"supervisor",date], (err, rows, fields ) => {   
        if (!err){
            logmsg.logger.info('employee data enter success...');
              res.send(rows)
          } else{
            logmsg.logger.error(err);
              res.send(err)
          }   
      })
})

/*=============================GET EMP BY ID FOR SUPERVISOR========================================*/
router.get('/getsuperemployeedata/:id', (req,res) =>{
    id = req.params.id
    date = req.params.date
    connection.query("SELECT * FROM sis_community_employees  WHERE sis_community_id=? AND role_id=?",[id,'6'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.post('/seditemployee', (req,res)=>{
    d = req.body;
    date = req.params.date
    // console.log(d)
    connection.query("UPDATE sis_community_employees SET emp_name=?,emp_phone=?,emp_modify_by=?,emp_modify_date=? WHERE emp_id=?",[d.ename,d.ephone,'supervisor',date,d.eid],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.post('/addvendor',(req,res)=>{
    var datetime = new Date();
    let vendor= req.body;
    // console.log(vendor)
    connection.query("INSERT INTO sis_community_vendors SET sis_community_id=?,vendor_name=?,vendor_phone=?,vendor_email=?,vendor_address=?,created_by=?,created_date=?",[vendor.communityid,vendor.vendorname,vendor.phone,vendor.email,vendor.address,"supervisor",datetime], (err, rows, fields ) => {   
      if (!err){
            res.send(rows)
        } else{
            res.send(err)
        }   
    })
});

router.get('/allcommvendors/:id', (req,res) =>{
    id = req.params.id
    // console.log(id);
    connection.query("SELECT * FROM sis_community_vendors  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    });

})

router.post('/editvendor', (req,res)=>{
    date = new Date();
    d = req.body;
    //console.log(d);
    connection.query("UPDATE sis_community_vendors SET vendor_name=?,vendor_phone=?,vendor_email=?,vendor_address=?,modify_by=?,modify_date=? WHERE vendor_id=?",[d.evendorname,d.ephone,d.eemail,d.eaddress,"supervisor",date,d.evendorid],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
})

router.get('/scomplaintsbyid/:id', (req,res) =>{
    id = req.params.id;
    connection.query("SELECT * FROM sis_community_complaints  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
        }
    });
})
/*=============================GET EMP BY ID FOR SUPERVISOR========================================*/
router.get('/getsuperemployeedata/:id', (req,res) =>{
    id = req.params.id
    date = req.params.date
    connection.query("SELECT * FROM sis_community_employees  WHERE sis_community_id=? AND role_id=?",[id,'6'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/tasklist', (req,res) =>{
    id = req.params.id
    //console.log(id);
    
    connection.query("SELECT * FROM sis_community_tasklist",(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            logmsg.logger.error(err)
        }
    });

})

router.post('/addtaskdaily',(req,res)=>{
    var datetime = new Date();
    let complaint= req.body;
    //console.log(complaint)
    connection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,complaint=?,complaint_date=?,emp_id=?,status=?,created_by=?,created_date=?",[complaint.communityid,complaint.atask,datetime,complaint.aempid,"NOT YET STARTED","supervisor",datetime], (err, rows, fields ) => {   
      if (!err){
            res.send(rows)
        } else{
            res.send(err);
        }   
    })
})

router.get('/sallunitsbyid/:id',(req,res)=>{
    id = req.params.id;
    connection.query("SELECT sis_community_type FROM sis_community  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            type = rows[0].sis_community_type
            // console.log(rows[0].sis_community_type);
            if(type === 1){
                // console.log('apartment')
                connection.query("SELECT unit_id,blockflat_name FROM sis_community_units WHERE sis_community_id=?",[id],(err,rows)=>{
                    if(!err){
                        data = rows;
                        res.json({"type":type,"data":data})
                    }else{
                        res.send(err)
                    }
                })
            }else if(type === 2) {
                // console.log('villa')
                connection.query("SELECT unit_id,house_num FROM sis_community_units WHERE sis_community_id=?",[id],(err,rows)=>{
                    if(!err){
                        data = rows;
                        res.json({"type":type,"data":data})
                    }else{
                        res.send(err)
                    }
                })
            } else{
                logmsg.logger.error(err)
            }
        }else{
            res.send(err);
        }
    });

})

/*------------------------VILLA OR APARTMENT-------------------------------------*/
router.get('/communitytypebyid/:id',(req,res)=>{
    id = req.params.id;
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            logmsg.logger.error(err);
        }
    })
});
/*-------------------------------------------------------------*/

router.post('/addcomplaints',(req,res)=>{
    datetime = new Date();
    c= req.body;
   // console.log(c)
    if(c.unitid === null){
        // console.log('unitid')
        connection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,unit_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,created_by=?,created_date=?",[c.communityid,c.hunitid,c.complaint,c.description,c.comments,datetime,c.urgent,"supervisor",datetime], (err, rows, fields ) => {   
            if (!err){
                logmsg.logger.info('success...hunitid');
            } else{
                logmsg.logger.error(err);
            }   
        })
    }else{
        connection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,unit_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,created_by=?,created_date=?",[c.communityid,c.unitid,c.complaint,c.description,c.comments,datetime,c.urgent,"supervisor",datetime], (err, rows, fields ) => {   
            if (!err){
                logmsg.logger.info('success...');
            } else{
                logmsg.logger.error(err);
            }   
        })
    }
    res.end();
})

router.post('/supdatecomplaint',(req,res)=>{
    datetime = new Date();
    complaint= req.body;
    logmsg.logger.info(complaint)
    connection.query("UPDATE sis_community_complaints SET start_date=?,emp_id=?,status=?,modify_by=?,modify_date=? WHERE comp_id=?",[complaint.startdate,complaint.empid,complaint.status,'supervisor',datetime,complaint.compid],(err, rows, fields)=>{
        if (!err){
            logmsg.logger.info('update in complaints table');
            connection.query("INSERT INTO sis_complaint_history SET complaint_id =?,date=?,sup_comments=?,status=?,created_by=?,created_date=?",[complaint.compid,datetime,complaint.supcomments,complaint.status,"supervisor",datetime],(err, rows, fields)=>{
                if (!err){
                    logmsg.logger.info('complaint enter into history table');
                    res.send(rows);
                } else{
                    logmsg.logger.error('Error at complaint enter into history table', err);
                    res.send(err);
                } 
            })
        } else{
            logmsg.logger.error('error at update complaint');
        }    
    })
})

router.get('/history/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT * FROM sis_complaint_history  WHERE complaint_id=?",[id],(err,rows,fields)=>{
        if(!err){
            res.send(rows);
        }else{
            res.send(err);
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

router.post('/attendence', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    logmsg.logger.info(att);
    att.empl.forEach(function(value, index, array){
        console.log(value.id);
        connection.query("INSERT INTO sis_community_attendence SET sis_community_id=?,date=?,emp_id=?,in_time=?,attendence_status=?",[att.com_id,att.date,value.id,value.in_time,value.status],(err,rows,fields)=>{
            if(!err){
               // res.send(rows)
            }else{
              //  res.send(err);
            }
        })
   })
   res.end();
})

router.post('/attendenceupdate', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    //console.log(att);
    att.empl.forEach(function(value, index, array){
        connection.query("UPDATE sis_community_attendence SET out_time=? WHERE attendence_id=?",[value.out_time,value.id],(err,rows,fields)=>{
            if(!err){
               // res.send(rows)
            }else{
              //  res.send(err);
            }
        })
   })
   res.end();
})

/*=============================GET EMP BY ID FOR SUPERVISOR========================================*/
router.get('/getsuperemployeedata/:id', (req,res) =>{
    id = req.params.id
    date = req.params.date
    connection.query("SELECT * FROM sis_community_employees  WHERE sis_community_id=? AND role_id=?",[id,'6'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.get('/gettodayemps/:id/:date', (req,res) =>{
    id = req.params.id
    date = req.params.date
    //console.log(date);
    connection.query("SELECT * FROM sis_community_attendence JOIN sis_community_employees ON sis_community_attendence.emp_id=sis_community_employees.emp_id  WHERE sis_community_attendence.sis_community_id=? AND sis_community_attendence.date=?",[id,date],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})


/*--------------getblock data from  sis_community_blocks table----*/
router.get('/blocksdata/:id', (req,res) =>{
    id = req.params.id
    connection.query("SELECT sis_community_type FROM sis_community WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            logmsg.logger.info(rows[0].sis_community_type);
            type = rows[0].sis_community_type;
            if(type === 1){
                connection.query("SELECT block_id,block_name FROM sis_community_blocks  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
                    if(!err){
                        res.json({'type':type,'data':rows})
                    }else{
                        logmsg.logger.error('error to getting blocks')
                    }
                })
            }else if(type === 2){
                connection.query("SELECT unit_id,house_num FROM sis_community_units  WHERE sis_community_id=?",[id],(err,rows,fields)=>{
                    if(!err){
                         res.json({'type':type,'data':rows})
                    }else{
                        logmsg.logger.error('error to getting house numbers',err)
                    }
                })
            }else{

            }

        }else{
            logmsg.logger.error('both not working')
        }
    })
})
/*-------------------------------------------------------------*/


router.post('/commmaintenance',(req,res)=>{
    datetime = new Date();
    men = req.body;
    //console.log('MMMMM',men);
    connection.query("SELECT * FROM sis_community  WHERE sis_community_id=?",[men.communityid],(err,rows,fields)=>{
        if(!err){
            logmsg.logger.info('community type select success',rows[0].sis_community_type)
              if(rows[0].sis_community_type=='1'){
                    connection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND block_id=? AND maintanance_month=?",[men.communityid,men.block_id,men.date],(err,rows,fields)=>{
                       if(!err){
                            logmsg.logger.info('community maintenance select success-1',rows)
                           // res.send(rows);
                           if(_.isEmpty(rows) === true) {
                                connection.query("SELECT sis_community_maintenance,sis_community_maintenance_type FROM sis_community  WHERE sis_community_id=? ",[men.communityid],(err,results,fields)=>{
                                    if(!err){
                                        logmsg.logger.info('community maintenance amount select success',results[0].sis_community_maintenance)
                                        maintenancetype = results[0].sis_community_maintenance_type;
                                        maintenance = results[0].sis_community_maintenance
                                                connection.query("SELECT * FROM sis_community_units  WHERE sis_community_id=? AND block_id=?",[men.communityid,men.block_id],(err,result,fields)=>{
                                                    if(!err){
                                                        logmsg.logger.info('UNIT-ID', result)
                                                        result.forEach(function(key,value)
                                                        {
                                                            if(maintenancetype === 1){
                                                                logmsg.logger.info('KEYS',key.unit_id)
                                                                connection.query("INSERT INTO sis_community_maintenance SET sis_community_id=?,unitid=?,block_id=?,flat_num=?,maintanance_month=?,maintenance_amt=?,main_created_by=?,main_created_date=?",[men.communityid,key.unit_id,key.block_id,key.flat_num,men.date,maintenance,"admin",datetime], (err, rows, fields ) => {   
                                                                    if (!err){
                                                                        logmsg.logger.info('maintenance enter into table succes type-1')
                                                                        connection.query("SELECT * FROM sis_community_maintenance WHERE sis_community_id=?,block_id=?",[men.communityid,men.block_id],(err,rows)=>{
                                                                            if(!err){
                                                                                res.send(rows)
                                                                            }else{
                                                                                logmsg.logger.error('error at select maintenance-1')
                                                                            }
                                                                        })
                                                                    } else{
                                                                        logmsg.logger.error('error at maintenance table ',err);

                                                                    }   
                                                                })
                                                            //console.log("object-loop")
                                                            }else if(maintenancetype === 2){
                                                                carpetarea = key.carpet_area;
                                                                total_maintenance = maintenance*carpetarea;
                                                                //console.log(total_maintenance);
                                                                 connection.query("INSERT INTO sis_community_maintenance SET sis_community_id=?,unitid=?,block_id=?,flat_num=?,maintanance_month=?,maintenance_amt=?,main_created_by=?,main_created_date=?",[men.communityid,key.unit_id,key.block_id,key.flat_num,men.startdate,total_maintenance,"admin",datetime], (err, rows, fields ) => {   
                                                                    if (!err){
                                                                        logmsg.logger.info('maintenance enter into table succes type-2')
                                                                        connection.query("SELECT * FROM sis_community_maintenance WHERE sis_community_id=?,block_id=?",[men.communityid,men.block_id],(err,rows)=>{
                                                                            if(!err){
                                                                                res.send(rows)
                                                                            }else{
                                                                                logmsg.logger.error('error at select maintenance-2')
                                                                            }
                                                                        })
                                                                    } else{
                                                                        logmsg.logger.error('error at maintenance table ',err);

                                                                    }   
                                                                })

                                                            } else{
                                                                logmsg.logger.error('maintenance not specified')
                                                            }
                                                        })

                                                    }else{
                                                        logmsg.logger.error(err)
                                                    }
                                                })
                                    }else{
                                        logmsg.logger.error('community maintenance amount select error')
                                    }
                                })
                                          
                            }else{
                                res.send(rows);  
                           }

                       }else{
                        logmsg.logger.error('community maintenance select error-1')
                       }
                   })
              }else if(rows[0].sis_community_type=='2'){
                //console.log('g', rows[0].sis_community_type)
                  connection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND maintanance_month=?",[men.communityid,men.date],(err,rows,fields)=>{
                       if(!err){
                           logmsg.logger.info('community maintenance select success-2',rows)
                           res.send(rows);
                           if(_.isEmpty(rows) === true) {
                                connection.query("SELECT * FROM sis_community  WHERE sis_community_id=? ",[men.communityid],(err,results,fields)=>{
                                    if(!err){
                                        logmsg.logger.info('community maintenance amount select success',results[0].sis_community_maintenance)
                                        maintenancetype = results[0].sis_community_maintenance_type;
                                        maintenance = results[0].sis_community_maintenance
                                                connection.query("SELECT * FROM sis_community_units  WHERE sis_community_id=?",[men.communityid],(err,result,fields)=>{
                                                    if(!err){
                                                        logmsg.logger.info('VILLA-RESULT', result)
                                                        result.forEach(function(key,value)
                                                        {
                                                            if(maintenancetype === 1){
                                                                logmsg.logger.info('KEYS',key.unit_id)
                                                                connection.query("INSERT INTO sis_community_maintenance SET sis_community_id=?,unitid=?,house_num=?,maintanance_month=?,maintenance_amt=?,main_created_by=?,main_created_date=?",[men.communityid,key.unit_id,key.house_num,men.date,maintenance,"admin",datetime], (err, rows, fields ) => {   
                                                                    if (!err){
                                                                        logmsg.logger.info('maintenance enter into table succes-2')
                                                                        //res.send(rows)
                                                                    } else{
                                                                        logmsg.logger.error('error at maintenance table ',err);

                                                                    }   
                                                                })

                                                            }else if(maintenancetype === 2){
                                                                 carpetarea = key.carpet_area;
                                                                 total_maintenance = maintenance*carpetarea;
                                                                    connection.query("INSERT INTO sis_community_maintenance SET sis_community_id=?,unitid=?,house_num=?,maintanance_month=?,maintenance_amt=?,main_created_by=?,main_created_date=?",[men.communityid,key.unit_id,key.house_num,men.date,total_maintenance,"admin",datetime], (err, rows, fields ) => {   
                                                                    if (!err){
                                                                        logmsg.logger.info('maintenance enter into table succes-2')
                                                                       // res.send(rows)
                                                                    } else{
                                                                        logmsg.logger.error('error at maintenance table ',err);

                                                                    }   
                                                                })

                                                            }else{
                                                                logmsg.logger.error('maintenance not spefied at villa')
                                                            }
                                                            
                                                            //console.log("object-loop")
                                                        })

                                                    }else{
                                                        logmsg.logger.error(err)
                                                    }
                                                })
                                    }else{
                                        logmsg.logger.error('community maintenance amount select error')
                                    }
                                })
                                            

                           }else{

                           }

                       }else{
                        logmsg.logger.error('community maintenance select error-1')
                       }
                   })


              }else{
                logmsg.logger.error('error at community type-2')
              }
        }else{
            logmsg.logger.error('error at selecting community type-1')
        }
    })        
})

router.post('/addotherdues', (req,res) =>{
    let main = req.body;
    var datetime = new Date();
    //console.log(main);
    main.amountm.forEach(function(value, index, array){
        total = (value.maintenance_amt)+(value.due)+(value.others)-(value.discounts)
        //console.log(typeof((value.discounts)));
        //console.log('total',total)
        connection.query("UPDATE sis_community_maintenance SET otherdues=?,discounts=?,total=? WHERE invoice_id=?",[value.others,value.discounts,total,value.id],(err,rows,fields)=>{
            if(!err){
                // res.send(rows)
            }else{
                logmsg.logger.error(err)
            }
        })
    })
    res.send();
})

router.post('/paymentmaintenance', (req,res) =>{
    men = req.body;
    // console.log(men)
    connection.query("SELECT * FROM sis_community  WHERE sis_community_id=?",[men.communityid],(err,rows,fields)=>{
        if(!err){
            if(rows[0].sis_community_type=='1')
            {
                connection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND block_id=? AND maintanance_month=?",[men.communityid,men.block_id,men.date],(err,rows,fields)=>{
                    if(!err){
                        res.send(rows);
                    }else{
                        logmsg.logger.error(err)
                    }
                })
            }
            else if(rows[0].sis_community_type=='2')
            {
                connection.query("SELECT * FROM sis_community_maintenance  WHERE sis_community_id=? AND maintanance_month=?",[men.communityid,men.date],(err,rows,fields)=>{
                    if(!err){
                        res.send(rows);
                    }else{
                        logmsg.logger.error(err)
                    }
                })  
            }
        }else{
            logmsg.logger.error(err)
        }
    });
})


router.get('/paymentmode', (req,res) =>{
    connection.query("SELECT * FROM sis_community_payment_mode  WHERE mode_status=? ",['1'],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            logmsg.logger.error(err)
        }
    })

})

router.post('/payment', (req,res) =>{
    let pay = req.body;
    //console.log(pay);
    var datetime = new Date();
    if(pay.mode_id=='1'){
            connection.query("INSERT INTO sis_community_payments SET invoice_id=?,paid_amt=?,payment_mode=?,payment_status=?,payment_created_by=?,payment_created_date=?",[pay.invid,pay.total_amt,pay.mode_id,'Paid',"supervisor",datetime],(err,rows,fields)=>{
                if(!err){
                    res.send(rows)
                    //console.log(rows);
                }else{
                    res.send(err)
                    //console.log(err)
                }
            })
    }else if(pay.mode_id=='2'){
        connection.query("INSERT INTO sis_community_payments SET invoice_id=?,paid_amt=?,payment_mode=?,payment_status=?,payment_created_by=?,payment_created_date=?",[pay.invid,pay.total_amt,pay.mode_id,'Pending On Approval',"supervisor",datetime],(err,rows,fields)=>{
            if(!err){
                res.send(rows)
                //console.log(rows);
            }else{
              res.send(err)
              //console.log(err)
            }
        })
    }else{
        logmsg.logger.error('no mode selected')
    }
})

router.post('/recipt', (req,res) =>{
    let men = req.body;
    connection.query("SELECT * FROM sis_community_payments JOIN sis_community_maintenance ON sis_community_payments.invoice_id = sis_community_maintenance.invoice_id  WHERE sis_community_maintenance.sis_community_id=?",[men.communityid],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
            // console.log(rows)
        }else{
            logmsg.logger.error(err)
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

router.post('/emp_salary', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    logmsg.logger.info(att);
    att.vendor.forEach(function(value, index, array){
        console.log(value.id);
        connection.query("INSERT INTO sis_community_emp_vendors_payments SET sis_community_id=?,emp_id=?,payment_month=?,payment_amt=?,payment_created_by=?,payment_created_date=?",[att.com_id,value.id,att.date,value.payment,'supervisor',datetime],(err,rows,fields)=>{
            if(!err){
                //res.send(rows)
            }else{
                res.send(err);
            }
        })
   })
   res.end();
})

router.post('/ven_payment', (req,res) =>{
    let att = req.body;
    var datetime = new Date();
    logmsg.logger.info(att);
    att.vendor.forEach(function(value, index, array){
        console.log(value.id);
        connection.query("INSERT INTO sis_community_emp_vendors_payments SET sis_community_id=?,vendor_id=?,payment_month=?,payment_amt=?,payment_created_by=?,payment_created_date=?",[att.com_id,value.id,att.date,value.payment,'supervisor',datetime],(err,rows,fields)=>{
            if(!err){
                //res.send(rows)
            }else{
                console.log(err);
            }
        })
   })
   res.end();
})


router.post('/superemployeesalarycal', (req,res) =>{
    let data = req.body;
    var datetime = new Date();
    console.log(data);
    connection.query("SELECT * FROM sis_community_employees  WHERE sis_community_id=? AND role_id=?",[data.com_id,'6'],(err,result,rows,fields)=>{
        if(!err){
           
           
            var month = data.date.slice(5, 7);
            var year = data.date.slice(0, 4);
            var days = new Date(year, month, 0).getDate();
            console.log('days:',days);
            console.log(month,year);
            result.forEach(function(key,value){
                console.log(key.emp_id) ;
                connection.query("SELECT * FROM sis_community_attendence  WHERE emp_id=? AND date_format(date, '%c')=? AND date_format(date, '%Y')=? AND attendence_status=?",[key.emp_id,month,year,'Leave'],(err,results,rows,fields)=>{
                    if(!err){
                    console.log(rows);
                   var n_of_w_d=days-results.length;
                   console.log('wd',n_of_w_d);
                   console.log(key.employee_salary);
                   var sal_of_oneday=key.employee_salary/days;
                   var this_salary=key.employee_salary-(sal_of_oneday*rows.length);
                   console.log('this month sal:',this_salary);
                   connection.query("INSERT INTO sis_community_emp_vendors_payments SET sis_community_id=?,emp_id=?,vendor_id=?,payment_month=?,num_working_days=?,leaves=?,payment_amt=?,payment_created_by=?,payment_created_date=?",[data.com_id,key.emp_id,key.vendor_id,data.date,n_of_w_d,results.length,this_salary,'supervisor',datetime], (err, rows, fields ) => {   
                    if (!err){
                        //logmsg.logger.info('employee data enter success...');
                         // res.send(rows)
                         connection.query("SELECT * FROM sis_community_emp_vendors_payments JOIN sis_community_employees ON sis_community_emp_vendors_payments.emp_id=sis_community_employees.emp_id WHERE sis_community_emp_vendors_payments.sis_community_id=? AND sis_community_emp_vendors_payments.payment_month=?",[data.com_id,data.date],(err,rows,fields)=>{
                            if(!err){
                                res.send(rows)
                            }else{
                                res.send(err)
                                logmsg.logger.error(err)
                            }
                        })
                      } else{
                        //logmsg.logger.error(err);
                          res.send(err)
                      }   
                  })
                    }else{
                        logmsg.logger.error(err)
                    }
                })
            })
           
          // res.send(rows);
        }else{
            logmsg.logger.error(err)
        }
    })
})

module.exports = router;