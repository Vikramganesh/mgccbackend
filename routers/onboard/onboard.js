const express = require('express');
const router = express.Router();
const _ = require('underscore');
const { connection } = require('../../dbconnection')
const logmsg = require("../../logmessages")

/*==========================owner one time registration=============================================================*/

router.post('/regonboard',(req,res)=>{
    d = req.body;
    let datetime = new Date();
    //console.log(d);
    connection.query("UPDATE sis_community_owneronbording SET owner_name=?, owner_phone=?, owner_email=?,owner_status=?,owner_modify_date=?,owner_modify_by=? WHERE sis_community_id=? AND owner_id=? AND unit_id=?",[d.name,d.phone,d.email,'pending',datetime,d.name,d.community_id,d.owner_id,d.unitid],(err, result) =>{
        if(!err){
            logmsg.logger.info('data inserted into owner onboarding')
            connection.query("UPDATE sis_community_login SET login_status=?  WHERE sis_community_id=? AND onboardid=?", ['0',d.community_id,d.owner_id], (err,rows)=>{
            if(!err){
                logmsg.logger.info('data inserted into login')
                connection.query("UPDATE sis_community_units SET house_num=?, block_id=?, flat_num=?,unit_status=?, carpet_area=?,type=?, no_of_lights=?,no_of_fans=?,no_of_bedrooms=?,halls=?, kitchen=?,no_of_ac=?,poojaroom=?,dyningroom=?,balcony=?,bathroom=?,unit_modify_by=?,unit_modify_date=? WHERE sis_community_id=? AND unit_id=?",[d.housenum,d.block_id,d.flat,'approved',d.carpet_area,d.h_type,d.lights,d.fans,d.bedrooms,d.halls,d.kitchen,d.ac,d.poojaroom,d.dyninghall,d.balcony,d.bothroom,d.name,datetime,d.community_id,d.unitid],(err,rows)=>{
                    if(!err){
                        logmsg.logger.info('data enter into units')
                    connection.query("INSERT INTO sis_community_owners SET sis_community_id=?,unit_id=?,onboard_id=?,role_id=?,owner_name=?,owner_phone=?, owner_email=?,owner_status=?,occupancy=?,owner_modify_date=?,owner_modify_by=?",[d.community_id,d.unitid,d.owner_id,'2',d.name,d.phone,d.email,'1',d.occupancy,datetime,d.name],(err,rows)=>{
                        if(!err){
                            logmsg.logger.info('data inserted into owners')
                            connection.query("INSERT INTO sis_community_login SET sis_community_id=?,owner_id=?,login_username=?,login_password=?,login_modify_by=?,login_modify_date=?",[d.community_id,d.owner_id,d.username,d.password,d.name,datetime], (err,rows)=>{
                                if(!err){
                                    logmsg.logger.info('data inserted into login table');
                                }else{
                                    logmsg.logger.error(err);
                                }
                            })
                        }else{
                            logmsg.logger.error(err);
                        }
                    })
                    }else{
                        logmsg.logger.error(err)
                    }
                })
            }else{
                logmsg.logger.error(err)
            }
            })
        }else{
            logmsg.logger.error(err)
        }
    });
    res.end();
       
})

/*==============================GET UNITS DATA FOR ONBOARDING =====================================*/
router.get('/unitsdata/:id', (req,res)=>{
    id = req.params.id; 
    // query="SELECT sis_community_units.house_num,sis_community_units.flat_num, sis_community_blocks.block_name FROM sis_community_blocks INNER JOIN sis_community_owneronbording ON sis_community_owneronbording.owner_id = ? INNER JOIN sis_community_units ON sis_community_blocks.block_id = sis_community_units.block_id"
    query="SELECT unit_id FROM sis_community_owneronbording WHERE owner_id=?"
    connection.query(query,[id],(err,rows)=>{
        if(!err){
           // res.send(rows)
           // console.log(rows[0].unit_id)
            unitid=rows[0].unit_id;
            //console.log('UNIT', unitid);
            connection.query("SELECT house_num,block_id,flat_num FROM sis_community_units WHERE unit_id=?",[unitid],(err,result)=>{
                if(!err){
                    housenum = result[0].house_num;
                    if(result[0].house_num === null){
                        flatnum = result[0].flat_num;
                        blockid = result[0].block_id;
                        connection.query("SELECT block_name FROM sis_community_blocks WHERE block_id=?",[blockid],(err,result)=>{
                            if(!err){
                                bname = result[0].block_name;
                                res.send({unitid:unitid,block_id:blockid, blockname: bname, flat: flatnum})
                            }else{
                                res.send(err)
                            }
                            
                        })  
                    }else{
                        res.send({unitid:unitid, housenum: housenum})
                    }
                }else{
                    res.send(err)
                }
            })
        }else{
            res.send(err)
        }
    })
})
/*===================================================================*/


/*======START============================get  block number  for input field display====================================*/
router.get('/communityblocknumber/:id', (req,res)=>{
    id = req.params.id
   // console.log(id)
    connection.query("SELECT flat_num FROM sis_community_units WHERE block=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })

})


/*======START============================get community block for input field display====================================*/
router.get('/communityblock/:id', (req,res)=>{
    id = req.params.id
    connection.query("SELECT block_id,block_name FROM sis_community_blocks WHERE sis_community_id=?",[id],(err,rows)=>{
        if(!err){
            res.send(rows)
        }else{
            res.send(err)
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

/*===============================================================================================================*/


module.exports = router;