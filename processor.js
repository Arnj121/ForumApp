const db = require('./db')

const postquestion = (req,res)=>{
    let qt = req.body.qt
    let qb=req.body.qb
    let tags = req.body.tags
    let userid = req.body.userid
    let name = req.body.name
    let d = new Date()
    db.getDb().collection('questions').insertOne({'title':qt,'body':qb,'tags':tags,'asked':userid,'upvotes':0,'downvotes':0,'time':d,'name':name,'answer':0})
    res.send({'status':1})
}

const getMyQuestions =  (req,res)=>{
    let userid = req.query.userid
    db.getDb().collection('questions').find({'asked':userid}).toArray((err,result)=>{
        if (result) {
            let JSONresponse = []
            for(let i=0;i<result.length;i++){
                JSONresponse.push(result[i])
            }
            res.send({'status':1,'response':JSONresponse})
        }
        else{
            res.send({'status':0})
        }
    })
}

const getStarred = (req,res)=>{
    let userid = req.query.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let starred = result['starred']
        if(starred.length){
            res.send({'status':1,'starred':starred})
        }
        else{
            res.send({'status':0})
        }
    })
}
const getFlagged =(req,res)=>{
    let userid = req.query.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let starred = result['flag']
        if(starred.length){
            res.send({'status':1,'flag':starred})
        }
        else{
            res.send({'status':0})
        }
    })
}
const getAccount = (req,res)=>{

}
const viewQuestion = (req,res)=>{
    let qid =req.params.qid
    let key = db.getprimaryKey(qid)
    db.getDb().collection('questions').findOne({'_id':key},(err,result)=>{
        let jsonres = {}
        jsonres['q'] = result
        db.getDb().collection('answers').find({'postid':qid}).toArray((err,result)=>{
            if(result){
                jsonres['answers']=result
                console.log(jsonres)
                res.render('index',jsonres)
            }
            else{
                res.render('index',jsonres)
            }
        })
    })

}
const submitanswer =(req,res)=>{
    let answer= req.body.answer
    let postid = req.body.postid
    let userid = req.body.userid
    let name = req.body.name
    let d = new Date()
    let id
    db.getDb().collection('answers').insertOne({'answer':answer,'postid':postid,'time':d,
        'answeredby':userid,'upvotes':0,'downvotes':0,'name':name},).then(result=>{
            id = result.insertedId
            db.getDb().collection('questions').updateOne({'_id':db.getprimaryKey(postid)},{$inc:{"answer":1}})
            res.send({'status':1,'id':id})
        }
    )
}
const upvote = (req,res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let upvoted = result.upvoted
        let downvoted = result.downvoted
        if(downvoted.indexOf(postid) !=-1){
            downvoted = downvoted.slice(0,downvoted.indexOf(postid)).concat(downvoted.slice(downvoted.indexOf(postid)+1,))
            upvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('questions').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'upvotes':1,'downvotes':-1}})
            res.send({'status':1})
        }
        else if(upvoted.indexOf(postid)!=-1){
            res.send({'status':0})
        }
        else{
            upvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('questions').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'upvotes':1}})
            res.send({'status':2})
        }

    })
}
const downvote = (req,res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let upvoted = result.upvoted
        let downvoted = result.downvoted
        if(upvoted.indexOf(postid) !=-1){
            upvoted = downvoted.slice(0,downvoted.indexOf(postid)).concat(downvoted.slice(downvoted.indexOf(postid)+1,))
            downvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('questions').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'downvotes':1,'upvotes':-1}})
            res.send({'status':1})
        }
        else if(downvoted.indexOf(postid)!=-1){
            res.send({'status':0})
        }
        else{
            downvoted.push(postid)
            db.getDb().findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('questions').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'downvotes':1}})
            res.send({'status':2})
        }
    })
}
const starred = (req,res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$push:{'starred':postid}})
    res.send({'status':1})
}
const flag = (req,res)=>{
    let postid = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$push:{'flag':postid}})
    res.send({'status':1})
}
const getanswered = (req,res)=>{
    let userid = req.query.userid
    db.getDb().collection('answers').find({'answeredby':userid}).toArray((err,result)=>{
        if(result.length){
            res.send({'status':1,'response':result})
        }
        else{
            res.send({'status':0})
        }
    })
}
const idtoquest = (req,res)=>{
    let postid = req.query.postid
    db.getDb().collection('questions').findOne({'_id':db.getprimaryKey(postid)},(err,result)=>{
        res.send({'response':result})
    })

}

const upvotea = (req,res)=>{
    let postid= req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let upvoted = result.upvoted
        let downvoted = result.downvoted
        if(downvoted.indexOf(postid) !=-1){
            downvoted = downvoted.slice(0,downvoted.indexOf(postid)).concat(downvoted.slice(downvoted.indexOf(postid)+1,))
            upvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('answers').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'upvotes':1,'downvotes':-1}})
            res.send({'status':1})
        }
        else if(upvoted.indexOf(postid)!=-1){
            res.send({'status':0})
        }
        else{
            upvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('answers').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'upvotes':1}})
            res.send({'status':2})
        }

    })
}
const downvotea = (req,res)=>{
    let postid= req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let upvoted = result.upvoted
        let downvoted = result.downvoted
        if(upvoted.indexOf(postid) !=-1){
            upvoted = downvoted.slice(0,downvoted.indexOf(postid)).concat(downvoted.slice(downvoted.indexOf(postid)+1,))
            downvoted.push(postid)
            db.getDb().collection('users').findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('answers').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'downvotes':1,'upvotes':-1}})
            res.send({'status':1})
        }
        else if(downvoted.indexOf(postid)!=-1){
            res.send({'status':0})
        }
        else{
            downvoted.push(postid)
            db.getDb().findOneAndUpdate({'userid':userid},{$set:{'downvoted':downvoted,'upvoted':upvoted}})
            db.getDb().collection('answers').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$inc:{'downvotes':1}})
            res.send({'status':2})
        }
    })
}
const search = (req,res)=>{
    let s = req.query.s
    let ss = s.split(' ')
    let regex = ss.join('.*')
    let target = req.query.target
    let jsonres = []
    if (target == 'home')
        db.getDb().collection('questions').find({'title': {$regex: regex, $options: 'i'}}).toArray((err, result)=> {
            if (result.length) {
                for (let i = 0; i < result.length; i++) {
                    jsonres[i] ={'title': result[i].title, 'postid': result[i]._id}
                }
                res.send({'status': 1, "response": jsonres})
            } else {
                res.send({'status': 0})
            }
        })
    else if (target == 'myquest') {
        let userid = req.query.userid
        db.getDb().collection('questions').find({
            'title': {$regex: regex, $options: 'i'},
            'asked': userid
        }).toArray((err, result) => {
            if (result.length) {
                for (let i = 0; i < result.length; i++) {
                    jsonres[i] = {'title': result[i].title, 'postid': result[i]._id}
                }
                res.send({'status': 1, "response": jsonres})
            } else {
                res.send({'status': 0})
            }
        })
    } else if (target == 'answer') {
        let userid = req.query.userid
        db.getDb().collection('answers').find({'answer': {$regex: regex, $options: 'i'}, 'answeredby': userid}).toArray((err, result) => {
            if (result && result.length) {
                res.send({'status':2,'response':result})
            }
            else{
                res.send({'status':0})
            }
        })
    }
    else if(target == 'starred'){
        let userid = req.query.userid
        db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
            let starred = result.starred
            res.send({'status':2,'response':starred})

        })
    } else if(target == 'starred'){
        let userid = req.query.userid
        db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
            let starred = result.flag
            res.send({'status':2,'response':starred})

        })
    }
}
const destar = (req,res)=>{
    let p = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let starred = result.starred
        starred = starred.slice(0,starred.indexOf(p)).concat(starred.slice(starred.indexOf(p)+1,))
        db.getDb().collection('users').updateOne({'userid':userid},{$set:{'starred':starred}})
        res.send({'status':'1'})
    })
}
const deflag = (req,res)=>{
    let p = req.body.postid
    let userid = req.body.userid
    db.getDb().collection('users').findOne({'userid':userid},(err,result)=>{
        let starred = result.flag
        starred = starred.slice(0,starred.indexOf(p)).concat(starred.slice(starred.indexOf(p)+1,))
        db.getDb().collection('users').updateOne({'userid':userid},{$set:{'flag':starred}})
        res.send({'status':'1'})
    })
}
const editanswer= (req,res)=>{
    let postid = req.body.postid
    let answer = req.body.answer
    db.getDb().collection('answers').findOneAndUpdate({'_id':db.getprimaryKey(postid)},{$set:{'answer':answer}})
    res.send({'status':1})
}
module.exports = {postquestion,getAccount,submitanswer,getanswered,idtoquest,upvotea,downvotea,destar,
    getMyQuestions,getFlagged,getStarred,viewQuestion,upvote,downvote,starred,flag,search,deflag,editanswer}
