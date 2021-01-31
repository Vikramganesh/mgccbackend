const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection')
const logmsg = require("../../logmessages")

/*=========================OWNER UNIT DETAILS BY ID================================================*/
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
/*=========================================================================*/

router.post('/tentcomplaint',(req,res)=>{
    var datetime = new Date();
    complaint= req.body;
    // console.log("COMPLAINT",complaint)
    connection.query("INSERT INTO sis_community_complaints SET sis_community_id=?,owner_id=?,unit_id=?,tent_id=?,complaint=?,complaint_description=?,owner_comments=?,complaint_date=?,urgent=?,status=?,created_by=?,created_date=?",[complaint.communityid,complaint.ownerid,complaint.unitid,complaint.tent_id,complaint.complaint,complaint.description,complaint.comments,datetime,complaint.urgent,"NOT YET STARTED","owner",datetime], (err, rows, fields ) => {   
      if (!err){
            res.send(rows);
        } else{
            res.send(err);
        }   
    })
})

router.get('/tentallcomplaints/:com_id/:tent_id/:owner_id/:unit_id', (req,res) =>{
    com_id = req.params.com_id
    owner_id = req.params.owner_id
    unit_id = req.params.unit_id
    tent_id = req.params.tent_id
    // console.log(com_id,owner_id,unit_id);
    connection.query("SELECT * FROM sis_community_complaints WHERE sis_community_id=? AND owner_id=? AND unit_id=? AND tent_id=?",[com_id,owner_id,unit_id,tent_id],(err,rows,fields)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
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

router.get('/datatent/:id',(req,res)=>{
    id = req.params.id;
    //console.log(id);
    connection.query("SELECT tent_name, tent_email,tent_phone FROM sis_community_tenant WHERE unit_id=?",[id],(err,rows,result)=>{
        if(!err){   
            tentdetails = result;
            //console.log(tentdetails);
            res.send(rows);
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
             //console.log(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})

router.post('/getMaintenancebydate',(req,res)=>{
    d = req.body;
    connection.query("SELECT * FROM sis_community_maintenance WHERE sis_community_id=? AND unitid=? AND maintanance_month BETWEEN ? AND ? ",[d.commid,d.unitid,d.startdate,d.enddate], (err,rows)=>{
        if(!err){
            //console.log('Rows', rows);
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
             //console.log(rows)
        }else{
            logmsg.logger.error(err)
        }
    })
})



module.exports = router;