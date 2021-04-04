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
    document.getElementById('home').style.backgroundColor='#ECEFF1'
    document.getElementById('home').style.color='#212121'
    document.getElementById('username').innerText = userdetails['name']
}

function clearSearchResults() {
    document.getElementById('search-window').removeChild(document.getElementById('search-results'))
    let d = document.createElement('div')
    d.id = 'search-results'
    document.getElementById('search-window').append(d)
    document.getElementById('search-input').style.borderRadius = '5px'
}
function displaySearchResults(result){
    clearSearchResults()
    for(let i=0;i<result.length;i++){
        let ele = document.createElement('label')
        ele.className = 'search-results-obj'
        ele.innerText = result[i]['title']
        ele.id = result[i]['postid']
        ele.onclick = (e)=>{
            location.replace(`http://forum.com:2000/questions/${e.target.id}`)
        }
        document.getElementById('search-results').append(ele)
    }
    document.getElementById('search-input').style.borderRadius = '5px 5px 0 0'
    document.getElementById('search-results').style.display = 'flex'
}

document.getElementById('search-input').oninput = (e)=>{
    let s = e.target.value
    if(s.length>=3) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let res = JSON.parse(xhr.response)
                if(res['status']==1)
                    displaySearchResults(res['response'])
                else
                    clearSearchResults()
            }
        }
        xhr.open('GET', `http://localhost:2000/search?s=${s}&target=home`)
        xhr.send()
    }
    else{
        clearSearchResults()
    }

}


document.getElementById('post-parent').onclick = ()=>{
    let qt = document.getElementById('question-input-title').value
    let qb = document.getElementById('question-input-body').value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        document.getElementById('notification').innerText = 'Question has been posted'
        setTimeout(()=>{
            document.getElementById('notification').innerText = ''
        },3000)
        document.getElementById('question-input-title').value =''
        document.getElementById('question-input-body').value = ''
    }
    xhr.open('POST','http://localhost:2000/postquestion')
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify({'qt':qt,'qb':qb,'tags':tags,'userid':userdetails['userid'],'name':userdetails['name']}))
    tags = []
}
document.getElementById('add-tag').onclick = ()=>{
    let v = document.getElementById('tag-input').value
    let ele = document.createElement('label')
    let i = document.createElement('span')
    ele.className = 'tags-obj'
    i.innerText = '#'+v
    let rnd = Math.floor(Math.random()*1000)+'rnd'
    let ic = document.createElement('i')
    ic.className = 'fal fa-minus remove-tag'
    ic.id = rnd
    ic.onclick = (e)=>{
        document.getElementById('tags-entered').removeChild(
            document.getElementById(e.target.id).parentElement)
    }
    tags.push(v)
    ele.append(i,ic)
    document.getElementById('tags-entered').append(ele)
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
    document.cookie = `email=;expires=${d};path=/;`
    document.cookie = `userid=;expires=${d};path=/;`
    document.cookie = `username=;expires=${d};path=/;`
    document.cookie = `password=;expires=${d};path=/;`
    console.log()
    location.replace('http://forum.com:2000/login')
}
document.getElementById('account').onclick = ()=>{
    location.replace('http://forum.com:2000/account')

}
