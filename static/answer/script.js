var userdetails = {'name':0,'email':0,'userid':0}
var tags=[]
var settingWindow=0
var filters={'date':0,'asnwer':0}
var sort = 'sort-latest'
init()
getanswered()
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
    document.getElementById(sort).style.backgroundColor = '#ECEFF1'
    document.getElementById(sort).style.color = '#FF6E40'
    document.getElementById('answered').style.backgroundColor='#ECEFF1'
    document.getElementById('answered').style.color='#212121'
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
function displaySearchResults2(result){
    clearSearchResults()
    for(let i=0;i<result.length;i++) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                let result = JSON.parse(xhr.response).response
                console.log(result)
                let ele = document.createElement('label')
                ele.className = 'search-results-obj'
                ele.innerHTML = "<span style='color: #252524'>Found in </span>"+result['title']
                ele.id = result['_id']
                ele.onclick = (e) => {
                    location.replace(`http://forum.com:2000/questions/${e.target.id}`)
                }
                document.getElementById('search-results').append(ele)
                document.getElementById('search-input').style.borderRadius = '5px 5px 0 0'
                document.getElementById('search-results').style.display = 'flex'
            }
        }
        xhr.open('GET', `http://localhost:2000/idToQuest?postid=${result[i].postid}`)
        xhr.send()
    }

}
function createanswered(obj) {
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            let res = JSON.parse(xhr.response)['response']
            let title = res['title']
            let main = document.createElement('div')
            main.className = 'q-ans-window-obj'

            let question = document.createElement('label')
            question.innerText = title
            question.className = 'question'
            question.id = res['_id']
            question.onclick = (e)=>{
                location.replace(`http://forum.com:2000/questions/${e.target.id}`)
            }
            let answer = document.createElement('label')
            answer.innerText = obj['answer']
            answer.className='answer'
            let date = document.createElement('label')
            let d= obj['time']
            date.innerText = 'answered '+d.substring(8,10)+'-'+d.substring(5,7)+'-'+d.substring(0,4)
            date.className = 'date'
            let votes = document.createElement('div')
            votes.style.margin = '10px 0 0 10px'

            votes.style.display ='flex'
            votes.style.flexDirection = 'row'
            let upv = document.createElement('label')
            let ui = document.createElement('i')
            ui.className = 'fal fa-caret-up'
            ui.style.margin = 'auto 5px'
            upv.innerHTML = ui.outerHTML+obj['upvotes']
            upv.className = 'vote'
            let dov = document.createElement('label')
            let di = document.createElement('i')
            di.className = 'fal fa-caret-down'
            di.style.margin = 'auto 5px'
            dov.innerHTML = di.outerHTML+obj['downvotes']
            dov.className = 'vote'
            votes.append(upv,dov)

            main.append(question, answer,date,votes)
            document.getElementById('q-ans-window').append(main)

        }
    }
    xhr.open('GET',`http://localhost:2000/idToQuest?postid=${obj['postid']}`)
    xhr.send()
    }

function displayanswered(response) {
    for(let i=0;i<response.length;i++){
        createanswered(response[i])
    }
}
function displaynoanswer() {
    let ele = "<div style='margin: 10px auto'>" +
        "   <label style='width: 100%'><i class='fas fa-meh fa-2x' style='margin-right: 10px'></i>Nothing to see here</label>"
    document.getElementById('q-ans-window').innerHTML = ele
}

function getanswered(){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if (xhr.readyState==4) {
            let response = JSON.parse(xhr.response)
            if(response.status ==1)
                displayanswered(response['response'])
            else
                displaynoanswer()
        }
    }
    xhr.open('GET',`http://localhost:2000/getanswered?userid=${userdetails['userid']}`)
    xhr.send()
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
                else if(res.status == 2){
                    displaySearchResults2(res.response)
                }
                else
                    clearSearchResults()
            }
        }
        xhr.open('GET', `http://localhost:2000/search?s=${s}&target=answer&userid=${userdetails['userid']}`)
        xhr.send()
    }
    else{
        clearSearchResults()
    }
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
document.getElementById('date-filter').onclick = ()=>{
    if(filters['date']==1){
        filters['date']=0
        document.getElementById('date-filter').style.color = 'black'
        document.getElementById('date-filter').style.backgroundColor = 'white'
        document.getElementById('d1').style.display = 'none'
        document.getElementById('d2').style.display = 'none'
    }
    else {
        filters['date'] = 1
        document.getElementById('date-filter').style.color = '#FF6E40'
        document.getElementById('date-filter').style.backgroundColor = '#ECEFF1'
        document.getElementById('d1').style.display = 'inline'
        document.getElementById('d2').style.display = 'inline'

    }
}
document.getElementById('answer-filter').onclick =()=>{
    if(filters['answer']==1){
        filters['answer']=0
        document.getElementById('answer-filter').style.color = 'black'
        document.getElementById('answer-filter').style.backgroundColor = 'white'

    }
    else {
        filters['answer'] = 1
        document.getElementById('answer-filter').style.color = '#FF6E40'
        document.getElementById('answer-filter').style.backgroundColor = '#ECEFF1'
    }
}

document.getElementById('sort-oldest').onclick = ()=>{
    document.getElementById(sort).style.backgroundColor = 'white'
    document.getElementById(sort).style.color = 'black'
    sort = 'sort-oldest'
    document.getElementById(sort).style.backgroundColor = '#ECEFF1'
    document.getElementById(sort).style.color = '#FF6E40'
}
document.getElementById('sort-latest').onclick = ()=>{
    document.getElementById(sort).style.backgroundColor = 'white'
    document.getElementById(sort).style.color = 'black'
    sort = 'sort-latest'
    document.getElementById(sort).style.backgroundColor = '#ECEFF1'
    document.getElementById(sort).style.color = '#FF6E40'
}
document.getElementById('sort-downvote').onclick = ()=>{
    document.getElementById(sort).style.backgroundColor = 'white'
    document.getElementById(sort).style.color = 'black'
    sort = 'sort-downvote'
    document.getElementById(sort).style.backgroundColor = '#ECEFF1'
    document.getElementById(sort).style.color = '#FF6E40'
}
document.getElementById('sort-upvote').onclick = ()=>{
    document.getElementById(sort).style.backgroundColor = 'white'
    document.getElementById(sort).style.color = 'black'
    sort = 'sort-upvote'
    document.getElementById(sort).style.backgroundColor = '#ECEFF1'
    document.getElementById(sort).style.color = '#FF6E40'
}

