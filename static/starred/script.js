var userdetails = {'name':0,'email':0,'userid':0}
var tags=[]
var settingWindow=0
init()
getstarred()
function init(){
    let d = document.cookie
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
    document.getElementById('starred').style.backgroundColor='#ECEFF1'
    document.getElementById('starred').style.color='#212121'
    document.getElementById('username').innerText = userdetails['name']
}
function displaySearchResults(result){

}
function displaystarred(response) {
    for(let i=0;i<response.length;i++){
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange= function () {
            if(xhr.readyState == 4){
                let res = JSON.parse(xhr.response)['response']
                let main = document.createElement('div')
                main.className = 'starred-question'
                let title = document.createElement('label')
                title.innerText = res['title']
                title.className = 'title'
                title.id = res['_id']
                title.onclick = (e)=>{
                    location.replace(`http://localhost:2000/questions/${e.target.id}`)
                }
                let body = document.createElement('p')
                body.className = 'body'
                body.innerText = res['body']

                let date = document.createElement('label')
                date.className = 'date'
                let d = res['time']
                date.innerText = 'asked '+d.substring(8,10)+'-'+d.substring(5,7)+'-'+d.substring(0,4);

                let votes = document.createElement('div')
                votes.style.margin = '10px 0 0 20px'
                votes.style.display = 'flex'
                votes.style.flexDirection = 'row'

                let upv = document.createElement('label')
                let upic = document.createElement('i')
                upic.className = 'fal fa-caret-up'
                upic.style.marginRight= '5px'
                upv.innerHTML = upic.outerHTML + res['upvotes']
                upv.style.margin = '10px'

                let dov = document.createElement('label')
                let doic = document.createElement('i')
                doic.className = 'fal fa-caret-down'
                doic.style.marginRight = '5px'
                dov.innerHTML = doic.outerHTML + res['downvotes']
                dov.style.margin = '10px'
                votes.append(upv,dov)

                let star = document.createElement('i')
                star.className = 'fas fa-star'
                star.style.margin = 'auto 10px'
                star.id = res['_id']+'s'
                star.onclick = (e)=>{
                    let p = e.target.id.substring(0,e.target.id.length-1)
                    let xhr = new XMLHttpRequest()
                    xhr.onreadystatechange = function () {
                        if(xhr.readyState == 4){
                            document.getElementById('middle-bar').removeChild(document.getElementById(p).parentElement)
                        }
                    }
                    xhr.open('POST','http://localhost:2000/destar')
                    xhr.setRequestHeader('Content-Type','application/json;charset=UTf-8')
                    xhr.send(JSON.stringify({'postid':p,'userid':userdetails['userid']}))
                }
                votes.append(star)
                main.append(title,body,date,votes)
                document.getElementById('middle-bar').append(main)
            }

        }
        xhr.open('GET',`http://localhost:2000/idToQuest?postid=${response[i]}`)
        xhr.send()
    }
}

function displayNothing() {
    let ele = "<div style='margin: 10px auto'>" +
        "<label><i class='fas fa-meh fa-2x' style='margin-right: 10px'></i>Nothing to see here</label>"
    document.getElementById('middle-bar').innerHTML= ele
}
function getstarred(){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            let response = JSON.parse(xhr.response)
            if(response.status == 1)
                displaystarred(response['starred'])
            else
                displayNothing()
        }
    }
    xhr.open('GET',`http://localhost:2000/getstarred?userid=${userdetails['userid']}`)
    xhr.send()
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
