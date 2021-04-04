const db = require('./db')

const signup = (req,res)=>{
    let email = req.body.email
    let password = req.body.password
    let username = req.body.username
    console.log(email,password,username)
    db.getDb().collection('users').findOne({'email':email},(err,result)=>{
        if (result){
            res.send({'status':0})
        }
        else{
            let token = 'kd'+(Math.floor(Math.random()*1000)).toString()+'abc'+(Math.floor(Math.random()*1000)).toString()
            db.getDb().collection('users').insertOne({'email':email,'password':password,'username':username,'userid':token})
            res.send({'status':1,'userid':token})
        }
    })
}
const login = (req,res)=>{
    let email=req.body.email
    let password = req.body.password
    db.getDb().collection('users').findOne({'email':email,'password':password},(err,result)=>{
        if(result){
            res.send({'status':1,'userid':result['userid'],'username':result['username']})
        }
        else{
            res.send({'status':0})
        }
    })
}
module.exports ={signup,login}

