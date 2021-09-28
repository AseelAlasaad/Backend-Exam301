'use strict';

const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const mongoose =require('mongoose');

main().catch(err=>console.log(err));

let FruitsModel;


async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    
 
    const  FruitsSchema = new mongoose.Schema({
        name:String,
        image:String,
        price:Number,
        email:String
      });

      FruitsModel = mongoose.model('Fruits', FruitsSchema );
  }
  class Fruits{
    constructor(item)
    {
        this.name=item.name,
        this.image=item.image,
        this.price=item.price
    }
}
  server.get('/getData',handelgetData);
//http://localhost:3002/getData
async function handelgetData(rea,res)
{ 
    let url="https://fruit-api-301.herokuapp.com/getFruit";
    let dataArr=[];
    axios.get(url)
    .then(result=>{
    let dataArr=result.data.fruits.map(item=>{
        return new Fruits(item);
    })
     res.send(dataArr)
    }).catch(err=>{
        res.status(500).send('error');
    })

}



  server.get('/test',testhome);
  function testhome(req,res){
      res.send('hello');
  }

//http://localhost:3002/addtofav
  server.post('/addtofav',handelAdd);
  function handelAdd(req,res){
      const{name,image,price,email}=req.body;
    FruitsModel.find({},(error,data)=>{
        if(error)
        {
            console.log('error');
        }
        else{
            let newFruit=new FruitsModel({
                name:name,
                image:image,
                price:price,
                email:email
            });
            newFruit.save();
            res.send(newFruit);
        }
      
    })

  }
//http://localhost:3002/getfav
server.get('/getfav',handelgetFav);
function handelgetFav(req,res)
{
    const email= req.query.email;
    FruitsModel.find({email:email},(error,data)=>{
        if(error)
        {
            console.log('Error');
        }
        else{
            res.send(data)
        }
    })
}

//http://localhost:3002/deletefav
server.delete('/deletefav/:id',handeldelete)
function handeldelete(req,res)
{
    const id=req.params.id;
    const email =req.query.email;
    FruitsModel.deleteOne({_id:id},(err,data)=>{
        FruitsModel.find({email:email},(error,data)=>{
            if(error)
            {
                console.log('Error');
            }
            else{
                res.send(data)
            }
        })
    })
}

//http://localhost:3002/updatefav
server.put('/updatefav/:id',handelupdate)
function handelupdate(req,res)
{
    const id=req.params.id;
    const{name,image,price,email}=req.body;
    FruitsModel.findByIdAndUpdate({id},{name,image,price,email},(err,data)=>{
        FruitsModel.find({email:email},(error,data)=>{
            if(error)
            {
                console.log('Error');
            }
            else{
                res.send(data)
            }
        })
    })
}




  server.listen(3002,()=>console.log('listining on 3002'));
