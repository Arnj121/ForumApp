var userdetails = {'name':0,'email':0,'userid':0}
var tags=[]
var settingWindow=0
var filters={'date':0,'asnwer':0}
var sort = 'sort-latest'
init()
getMyquestions()
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
    document.getElementById('questions').style.backgroundColor='#ECEFF1'
    document.getElementById('questions').style.color='#212121'
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
function displayQuestions(quest) {
    for(let i=0;i<quest.length;i++){
        createQuestionObj(quest[i])
    }
}

function createQuestionObj(obj){
    let main = document.createElement('div')
    main.className = 'asked-questions-obj'

    let title= document.createElement('label')
    title.className ='q-title';
    title.innerText = obj['title']
    title.onclick = ()=>{
        location.replace(`http://forum.com:2000/questions/${obj['_id']}`)
    }

    let body = document.createElement('p')
    body.className = 'q-body';
    body.innerText = obj['body']

    let votemain = document.createElement('div')
    votemain.className = 'votemain'
    let upvotes = document.createElement('label')
    upvotes.className = 'votes'
    let upicon = document.createElement('i')
    let un = document.createElement('label')
    upicon.className = 'fal fa-caret-up vote'
    un.innerText = obj['upvotes']
    upvotes.append(upicon,un)

    let downvotes = document.createElement('label')
    downvotes.className = 'votes'
    let downic = document.createElement('i')
    let dn =document.createElement('label')
    downic.className = 'fal fa-caret-down vote'
    dn.innerText = obj['downvotes']
    downvotes.append(downic,dn)

    let answers = document.createElement('label')
    answers.innerText = obj['answer']+' answer'
    answers.style.color = '#898988'
    answers.style.margin = 'auto 10px'

    let date = document.createElement('label')
    let dateicon = document.createElement('i')
    dateicon.className = 'fal fa-clock'
    date.className = 'date'
    dateicon.style.marginRight ='5px'
    let d = obj['time'].substring(0,10)
    date.innerHTML = dateicon.outerHTML+d.substring(8,)+'-'+d.substring(5,7)+'-'+d.substring(0,4)

    votemain.append(upvotes,downvotes,answers,date)

    main.append(title,body,votemain)
    document.getElementById('asked-questions').append(main)

}
function displayNoquestions() {
    let ele = document.createElement('label')
    ele.style.margin = '10px auto'
    ele.innerText = 'No Questions'
    ele.id = 'noquest'
    document.getElementById('asked-questions').appendChild(ele)
}

function getMyquestions(){
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4){
            let res = JSON.parse(xhr.response)
            console.log(res)
            if(res['status']==1)
                displayQuestions(res['response'])
            else{
                displayNoquestions()
            }
        }
    }
    xhr.open('GET',`http://localhost:2000/getmyquestions?userid=${userdetails['userid']}`)
    xhr.send()
}
document.getElementById('search-input').oninput = (e)=>{
    let s = e.target.value
    if(s.length>=3) {
        let xhr = new XMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                let res = JSON.parse(xhr.response)
                if (res['status'] == 1)
                    displaySearchResults(res['response'])
                else
                    clearSearchResults()
            }
        }
        xhr.open('GET', `http://localhost:2000/search?s=${s}&target=myquest&userid=${userdetails['userid']}`)
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
