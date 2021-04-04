var userdetails = {'name':0,'email':0,'userid':0}
var tags=[]
var settingWindow=0
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
    document.getElementById('account').style.color='#212121'
    document.getElementById('account').style.backgroundColor='#ECEFF1'
    document.getElementById('username').innerText = userdetails['name']
}
function displaySearchResults(result){

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
