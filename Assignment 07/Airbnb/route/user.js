const express = require('express');
const db = require("../db");
const utils = require("../util");
const crypto=require('crypto-js');
const jwt=require('jsonwebtoken');
const config=require('../config');
const router = express.Router();

router.post('/login', (req, response) => {
    const { email, password } = req.body;
    const stmt = `select id, firstName,lastName,phoneNumber,isDeleted from user where email=? and password=?`;
    const encryptedpassword=String(crypto.SHA256(password))
    db.pool.query(stmt, [email, encryptedpassword], (err, users) => {

        if(err)
        {
            response.send(utils.createErrorResult(err));
                
            
        }
        else{
                if(users.length==0)
                {
                    response.send(utils.createErrorResult('user does not exist'))
                }

                else{
                    const user=users[0]
                    if(user.isDeleted){
                        response.send(utils.createErrorResult('your account is closed'))
                    }
                    else{
                        const payload={id:user.id}
                        const token=jwt.sign(payload,config.secret)
                        const userData={
                            token,
                            name:`${user['firstName']} ${user['lastName']}`,
                        }
                             response.send(utils.createSuccessResult(userData));
                    }
                }

           
        }

    })
})


/**--------------------register-------------------- */
router.post('/register',(req,res)=>{
    const{firstName,lastName,email,password,phoneNumber}=req.body
    const statement=`insert into user(firstName,lastName,email,password,phoneNumber) values(?,?,?,?,?)`;

    const encryptedpassword=String(crypto.SHA256(password))


    db.pool.execute(
        statement,
        [firstName,lastName,email,encryptedpassword,phoneNumber],
        (error,result)=>{
            res.send(utils.createResult(error,result))
        }
    )
})


//---------------------------update------------
router.put('/profile',(request,response)=>{
    const{firstName,lastName,phoneNumber}=request.body
    const statement=`update user set firstName=?,lastName=?,phoneNumber=? where id=?`
    db.pool.execute(
        statement,
        [firstName,lastName,phoneNumber,request.userId],
        (error,result)=>
        {
            response.send(utils.createResult(error,result))
        }
    )
})


//-----------------------------

router.get('/profile/',(request,response)=>{
    const statement=`select firstName,lastName,phoneNumber from user  where id=?`
    db.pool.execute(statement,[request.userId],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


router.get('/profile/:id',(request,response)=>{
    const statement=`select firstName,lastName,phoneNumber from user  where id=?`
    db.pool.execute(statement,[request.userId],(error,result)=>{
        response.send(utils.createResult(error,result))
    })
})


module.exports=router;