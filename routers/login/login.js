const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection')
const logmsg = require("../../logmessages")
/*===============================LOGIN====================================*/


router.post('',(req,res)=>{
    login = req.body;
    logmsg.logger.info(login);
    connection.query("SELECT * FROM sis_community_login  WHERE login_username=? AND login_password=?",[login.username,login.password],(err,result,fields)=>{
        logmsg.logger.info('LOGIN RESULT',result);
        if(_.isEmpty(result) === true) {
            logmsg.logger.error('wrong input values');
            res.status(400).send('Bad Request')
        }else{
            if(!err){
                if(result[0].role_id == 1){
                    res.send(result);
                    logmsg.logger.info('admin login success');
                } else if(result[0].role_id == 2 ) {
                    logmsg.logger.info('owner login success');
                    communityid=result[0].sis_community_id;
                    onboardid=result[0].owner_id;
                    connection.query("SELECT  role_id,owner_id,sis_community_id,unit_id,owner_name FROM sis_community_owners WHERE onboard_id=? AND sis_community_id=?",[onboardid,communityid],(err,rows)=>{
                        if(!err){
                            uid = rows[0].unit_id
                            // console.log('UID', rows[0].unit_id)
                            ownerdetails = rows;
                            // connection.query("SELECT bm_designation FROM  sis_community_boardmembers WHERE unit_id=? AND bm_status=?",[uid,'1'],(err,rows)=>{
                            //     if(!err){
                            //         bmdata = rows;
                            //         res.json({ownerdata: ownerdetails, boardmemberdata: bmdata})
                                    
                            //     }else{
                            //         console.log('Error at select bm designation')
                            //     }
                            // })
                            res.send(rows)
                        }else{
                            res.send(err)
                        }
                    })
                } else if(result[0].role_id == 3 ) {
                    roleid=result[0].role_id;
                    username=result[0].login_username;
                    logmsg.logger.info('tenant login success');
                    connection.query("SELECT * FROM sis_community_tenant  WHERE role_id=? AND tent_username=?",[roleid,username],(err,rows,fields)=>{
                        if(!err){
                            res.send(rows);
                        }else{
                            logmsg.logger.error(err);
                        }
                    } );
                } else if(result[0].role_id == 4 ) {
                    roleid=result[0].role_id;
                    username=result[0].login_username;
                    logmsg.logger.info('supervisor login success');
                    connection.query("SELECT * FROM sis_community_employees  WHERE role_id=? AND emp_username=? ",[roleid,username],(err,rows,fields)=>{
                        if(!err){
                            res.send(rows);
                        }else{
                            res.send(err);
                        }
                    } );   
                } else if(result[0].role_id == 13 && result[0].login_status === 1){
                    roleid=result[0].role_id;
                    res.send(result);
                    logmsg.logger.info('Result', result);
                    logmsg.logger.info('onboard login success');
                } else {
                    res.status(400).send('Bad Request')
                    logmsg.logger.error('onboard error', err);
                }
            } else{
               
                res.send(err);
                logmsg.logger.error('error', err);
            }
        }   
    });   
});



module.exports = router;