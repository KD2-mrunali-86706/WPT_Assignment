const express=require('express');
const userrouter=require("./route/user");
const prouter=require("./route/property");
const crouter=require("./route/category");
const config = require('./config');
const jwt=require('jsonwebtoken');
const utils=require('./util');
const brouter=require('./route/booking');

const app=express();
app.use(express.json());




//middleware to verify token------
app.use((request,response,next)=>
{
    if(
        request.url==='/user/login' ||
        request.url==='/user/register' ||
        request.url==='/user/profile/:id' ||
        request.url.startsWith('/image/')
    )
    {
        //skip verifying the token
        next()
    }
    else{
        //get the token 
        const token=request.headers['token']
        if(!token || token.length===0){
            response.send(utils.createErrorResult('missing token'))
        }
        else{
            try{
                //verify token
                const payload=jwt.verify(token,config.secret)
                //add user id to the request

                request.userId=payload['id']

                //todo expiry logic


                //call the real route
                next()
            }
            catch(ex){
                response.send(utils.createErrorResult('invalid token'))
            }
        }

    }
})

app.use("/user",userrouter);
app.use("/property",prouter);
app.use("/category",crouter);
app.use("/bookings",brouter);

app.listen(9999, ()=>{console.log("server started at port no 9999")})
