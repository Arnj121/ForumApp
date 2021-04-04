
document.getElementById('eye').onclick = ()=>{
    let e = document.getElementById('eye')
    if(e.classList.contains('fa-eye-slash')){
        e.classList.remove('fa-eye-slash')
        e.classList.add('fa-eye')
        document.getElementById('password').type = 'text'
    }
    else{
        e.classList.remove('fa-eye')
        e.classList.add('fa-eye-slash')
        document.getElementById('password').type = 'password'
    }
}
document.getElementById('eye2').onclick = ()=>{
    let e = document.getElementById('eye2')
    if(e.classList.contains('fa-eye-slash')){
        e.classList.remove('fa-eye-slash')
        e.classList.add('fa-eye')
        document.getElementById('password2').type = 'text'
    }
    else{
        e.classList.remove('fa-eye')
        e.classList.add('fa-eye-slash')
        document.getElementById('password2').type = 'password'
    }
}
document.getElementById('login-link').onclick = ()=>{
    document.getElementById('mainframe').style.display = 'none'
    document.getElementById('mainframe2').style.display = 'flex'
}
document.getElementById('signup-link').onclick = ()=>{
    document.getElementById('mainframe2').style.display = 'none'
    document.getElementById('mainframe').style.display = 'flex'
}
document.getElementById('signin').onclick = ()=>{
    let email = document.getElementById('emailid').value
    let password = document.getElementById('password').value
    let username = document.getElementById('username').value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4) {
            let res = JSON.parse(xhr.response)
            if (res['status'] == 1) {
                let userid = res['userid']
                let d = new Date()
                d.setMonth(d.getMonth()+1)
                document.cookie = `email=${email};expires=${d};path=/home;`
                document.cookie = `password=${password};expires=${d};path=/home;`
                document.cookie = `userid=${userid};expires=${d};path=/home;`
                document.cookie = `username=${username};expires=${d};path=/home;`
                location.replace('http://forum.com:2000/home')
            } else {
                document.getElementById('error').innerText = 'Email Id already taken'
            }
        }
    }
    xhr.open('POST','http://localhost:2000/signup')
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify({'email':email,'password':password,'username':username}))
}
document.getElementById('signin2').onclick = ()=>{
    let email = document.getElementById('emailid2').value
    let password = document.getElementById('password2').value
    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
        if(xhr.readyState==4) {
            let res = JSON.parse(xhr.response)
            if (res['status'] == 1) {
                let userid = res['userid']
                console.log(userid)
                let d = new Date()
                d.setMonth(d.getMonth()+1)
                document.cookie = `email=${email};expires=${d};path=/;`
                document.cookie = `password=${password};expires=${d};path=/;`
                document.cookie = `userid=${userid};expires=${d};path=/;`
                document.cookie = `username=${res['username']};expires=${d};path=/;`
                location.replace('http://forum.com:2000/home')
            } else {
                document.getElementById('error2').innerText = 'Enter the correct email and password!'
            }
        }
    }
    xhr.open('POST','http://localhost:2000/login')
    xhr.setRequestHeader('Content-Type','application/json;charset=UTF-8')
    xhr.send(JSON.stringify({'email':email,'password':password}))
}
