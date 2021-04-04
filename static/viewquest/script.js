var userdetails = {'name':0,'email':0,'userid':0}
var tags=[]
var settingWindow=0, editmode=0,editing=0
init()
function init(){
    let d = document.cookie
    console.log(d)
    let ds = d.split(';')
    for(let i=0;i<ds.length;i++){
        let v = ds[i].split('=')
        if(v[0] == ' username'){
            userdetails['name'] = v[1]
        }
        if(v[0]==' userid' ){
            userdetails['userid'] = v[1]
        }
        if (v[0]=='email'){
            userdetails['email'] = v[1]
        }
    }
    document.getElementById('username').innerText = userdetails['name']
    let owner = document.getElementById('owner').innerText
    if(userdetails['userid']==owner){
        document.getElementById('answer-input').setAttribute('placeholder','You cannot answer your own question. that\'d be insane')
        document.getElementById('answer-input').setAttribute('disabled','true')
    }
}

function displaySearchResults(result){

}
function addanswer(answer,id){
    let main = document.createElement('div')
    main.className = 'answer'

    let user = document.createElement('div')
    user.className = 'user-profile'

    let icon = document.createElement('i')
    let name = document.createElement('label')
    icon.className = 'fas fa-user fa-3x icon'
    name.innerText = userdetails['name']
    name.className = 'name'
    user.append(icon,name)

    let ansmain = document.createElement('div')
    ansmain.className = 'actual-answer'
    let ans = document.createElement('p')
    ans.innerText = answer
    ans.style.margin = '5px 10px'

    let date  = document.createElement('label')
    date.innerText='Answered '+ new Date().toDateString().substring(4,)
    date.className = 'date'
    ansmain.append(ans,date)
    console.log(ansmain.innerHTML)
    ansmain.innerHTML+="<div style=\"display:flex;flex-direction: row;padding: 0 0 5px 0\">\n" +
        `                 <label class=\"vote\"><i class=\"fal fa-caret-up\" style=\"margin-right: 5px\" id='${id}u' onclick='upvotea(event)'></i><label id='${id}uv'>0</label></label>\n` +
        `                 <label class=\"vote\"><i class=\"fal fa-caret-down\" style=\"margin-right: 5px\" id='${id}d' onclick='downvotea(event)'></i><label id='${id}dv'>0</label></label>\n` +
        "              </div>"
    main.append(user,ansmain)
    document.getElementById('answers').append(main)
}

document.getElementById('search-input').oninput = (e)=>{
    let s = e.target.value
    let xhr  = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState === 4){
            let res = JSON.parse(xhr.response)
            displaySearchResults(res)
        }
    }
    xhr.open('GET', `http://localhost:2000/search?s=${s}`)
    xhr.send()
}


document.getElementById('home').onclick =()=>{
    location.replace('http://forum.com:2000/home')
}

document.getElementById('questions').onclick =()=>{
    location.replace('http://forum.com:2000/myquestions')
}
document.getElementById('answered').onclick =()=>{
    location.replace('http://forum.com:2000/answered')
}
document.getElementById('starred').onclick =()=>{
    location.replace('http://forum.com:2000/starred')
}
document.getElementById('flagged').onclick =()=>{
    location.replace('http://forum.com:2000/flagged')
}
document.getElementById('settings').onclick =()=> {
    if (settingWindow == 1) {
        settingWindow=0
        document.getElementById('settings-window').style.animationName = 'hide-settings'
        document.getElementById('settings-window').style.display = 'none'
    } else {
        settingWindow = 1
        document.getElementById('settings-window').style.display = 'flex'
        document.getElementById('settings-window').style.animationName = 'show-settings'
    }
}
document.getElementById('sign-out').onclick = ()=>{
    let d = new Date()
    d.setMonth(d.getMonth(),d.getMonth()-1)
    document.cookie = `email=;expires=${d};path=/home`
    document.cookie = `userid=;expires=${d};path=/home`
    document.cookie = `username=;expires=${d};path=/home`
    document.cookie = `password=;expires=${d};path=/home`
    console.log()
    location.replace('http://forum.com:2000/login')
}
document.getElementById('account').onclick = ()=>{
    location.replace('http://forum.com:2000/account')
}
document.getElementById('submit').onclick = ()=>{
    let answer = document.getElementById('answer-input').value
    let postid = document.getElementById('post-id').innerText
    if(editmode == 0) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res['status'] == 1) {
                    document.getElementById('notify').style.display = 'inline'
                    addanswer(answer, res['id'])
                    document.getElementById('answer-input').value = ''
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/submitanswer')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'answer': answer, 'postid': postid, 'userid': userdetails['userid'], 'name': userdetails['name']}))
    }
    else{
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res['status'] == 1) {
                    document.getElementById('notify').style.display = 'inline'
                    document.getElementById(editing+'a').innerText = document.getElementById('answer-input').value
                    document.getElementById('answer-input').value = ''
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/editanswer')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'answer': answer, 'postid': editing}))
    }
}
function upvote(e) {
    let owner = document.getElementById('owner').innerText
    if(userdetails['userid']!=owner) {
        let postid = document.getElementById('post-id').innerText
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res.status == 1) {
                    document.getElementById('uc').innerText = parseInt(document.getElementById('uc').innerText) + 1;
                    document.getElementById('dc').innerText = parseInt(document.getElementById('dc').innerText)-1;
                }
                else if(res.status == 2)
                    document.getElementById('uc').innerText = parseInt(document.getElementById('uc').innerText) + 1;
                else{
                    console.log(152);
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/upvote')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userdetails['userid']}))
    }

}
function downvote(e) {
    let owner = document.getElementById('owner').innerText
    if(userdetails['userid']!=owner) {
        let postid = document.getElementById('post-id').innerText
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res.status == 1) {
                    document.getElementById('dc').innerText = parseInt(document.getElementById('dc').innerText) + 1
                    document.getElementById('uc').innerText = parseInt(document.getElementById('uc').innerText) - 1
                }
                else if(res.status == 2)
                    document.getElementById('dc').innerText = parseInt(document.getElementById('dc').innerText) + 1
                else{
                    console.log(177);
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/downvote')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userdetails['userid']}))
    }
}
function starred(e) {
    let owner = document.getElementById('owner').innerText
    if(userdetails['userid']!=owner) {
        let postid = document.getElementById('post-id').innerText
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                document.getElementById(postid + 'star').classList.remove('fal')
                document.getElementById(postid + 'star').classList.add('fas')
            }
        }
        xhr.open('POST', 'http://localhost:2000/starred')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userdetails['userid']}))
    }
}
function flag(e){
    let owner = document.getElementById('owner').innerText
    if(userdetails['userid']!=owner) {
        let postid = document.getElementById('post-id').innerText
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                document.getElementById(postid + 'flag').classList.remove('fal')
                document.getElementById(postid + 'flag').classList.add('fas')
            }
        }
        xhr.open('POST', 'http://localhost:2000/flag')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userdetails['userid']}))
    }
}

function upvotea(event) {
    let id = event.target.id
    let postid = id.substring(0,id.length-1)
    let userid = userdetails['userid']
    let owner = document.getElementById(postid+'o').innerText
    if(owner!=userdetails['userid']) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res.status == 1) {
                    document.getElementById(postid + 'uv').innerText = parseInt(document.getElementById(postid + 'uv').innerText) + 1
                    document.getElementById(postid + 'dv').innerText = parseInt(document.getElementById(postid + 'dv').innerText) - 1
                } else if (res.status == 2)
                    document.getElementById(postid + 'uv').innerText = parseInt(document.getElementById(postid + 'uv').innerText) + 1
                else {
                    console.log(234)
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/upvotea')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userid}))
    }
    else{
        console.log(262)
    }
}
function downvotea(e) {
    let id = e.target.id
    let postid = id.substring(0,id.length-1)
    let userid = userdetails['userid']
    let owner = document.getElementById(postid+'o').innerText
    if(owner!=userdetails['userid']) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let res = JSON.parse(xhr.response)
                if (res.status == 1) {
                    document.getElementById(postid + 'dv').innerText = parseInt(document.getElementById(postid + 'dv').innerText) + 1
                    document.getElementById(postid + 'uv').innerText = parseInt(document.getElementById(postid + 'uv').innerText) - 1

                } else if (res.status == 2)
                    document.getElementById(postid + 'dv').innerText = parseInt(document.getElementById(postid + 'dv').innerText) + 1
                else {
                    console.log(259);
                }
            }
        }
        xhr.open('POST', 'http://localhost:2000/downvotea')
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
        xhr.send(JSON.stringify({'postid': postid, 'userid': userid}))
    }
    else{
        console.log(291);
    }
}

function edit(e) {
    let id = e.target.id
    let postid =id.substring(0,id.length-1)
    let owner = document.getElementById(postid+'o').innerText
    if(owner == userdetails['userid']){
            editmode = 1
            let response = document.getElementById(postid+'a').innerText
            editing = postid
            document.getElementById('answer-input').innerText = response
    }
    else{
        console.log(276);
    }
}

function displaypopup(msg){

}
