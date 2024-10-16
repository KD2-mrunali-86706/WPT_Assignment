const express=require('express');
const db=require('../db');
const utils=require('../util');

//import multer to add images
const multer=require('multer');
//create object to create files the upload here is middle ware


const upload=multer({dest:'images'})

const router=express.Router()

router.get('/',(request,response) => {
    const statement=`select id,title,details,image from category`;
    db.pool.query(statement,(error,categories)=>{
        response.send(utils.createResult(error,categories))
    })
})

//----------------------------------------image post--------------



router.post('/',upload.single('icon'),(request,response)=>{
    const {title,details}=request.body


    //get the name of uploaded file
    const fileName=request.file.filename
    const statement=`insert into category(title,details,image) values (?,?,?)`
    db.pool.execute(statement,
        [title,details,fileName],
        (error,categories)=>{
            response.send(utils.createResult(error,categories))
        }
    )
})




module.exports=router;