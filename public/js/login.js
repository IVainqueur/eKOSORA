/* Check if the current url is https */
window.onload = (e)=>{
    console.log("%c LOADED THE PAGE", "color: #48ff48; font-size: 30px")
    document.querySelector('.LoadingOverlay').style.display = "none"
    document.querySelector('style#style2').innerHTML = ""
}

if(!location.href.match(/https/)){
    location.href = "https" + location.href.slice(4)
}


/*

* ================ ACTUAL BEGINNING OF THE CODE ======================

*/


let i = 0
let selectedForm = null

const logOut = ()=>{
    fetch('/logout')
    .catch(e=>{
        // logOut()
        console.log(e)
    })
    .catch(err => {
        alert("Something went wrong. Please try again")
    })
}

logOut()


for(let choice of document.querySelectorAll('.Choice')){
    choice.setAttribute('count', i)
    choice.onclick = ()=>{
        //Making it active
        document.querySelector('.active').classList.remove('active')
        choice.classList.add('active')

        //Changing the form requirements
        document.querySelector('#RequiredBox').textContent = choice.getAttribute('toInquire')
        // selectedForm = parseInt(choice.getAttribute('count'), 10)
        selectedForm = choice.getAttribute('accountType')

    }
    i++
}

document.querySelectorAll('.Choice')[0].click()

let getInBTN = document.querySelector('#GetIn')
let theForm = document.querySelector('form')

theForm.onsubmit = (e)=>{e.preventDefault()}

getInBTN.addEventListener('click', (e)=>{
    console.log(selectedForm)
    let code = document.querySelector('#codeBox')
    let password = document.querySelector('#passwordBox')

    for(let input of [code, password]){
        if(input.value == ''){
            input.parentElement.classList.add('unFilledField')
            input.addEventListener('focus', ()=>{
                input.parentElement.classList.remove('unFilledField')
            }, {once: true})
            return
        }
    }
    let toSend = {
        code: code.value,
        password: password.value,
        accountType: selectedForm
    }
    getInBTN.style.pointerEvents = "none"
    getInBTN.style.filter = "grayscale(0.6)"
    fetch("/getin/login/check", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data => {
        getInBTN.style.pointerEvents = ""
        theForm.setAttribute('error', ``)
        getInBTN.style.filter = ""
        
        if(data.code == "#Success") {
            localStorage.eKOSORA_User = JSON.stringify(data.doc)
            return location.pathname = (document.cookie.match(/redirected=true/))? decodeURIComponent(document.cookie).match(/from=(\/\w+)/)[1] :'/dashboard'
        }else if(data.code == "#NoSuchUser"){
            theForm.setAttribute('error', `There is no ${selectedForm} registered under the entered email`)
            document.body.addEventListener('click', (e)=>{theForm.setAttribute('error', ``)}, {once: true})
            if(selectedForm == 'student') return theForm.setAttribute('error', `There is no ${selectedForm} registered under the entered code`)
            return theForm.classList.add('errorInForm')
        }else if(data.code == "#InvalidPassword"){
            theForm.setAttribute('error', `Incorrect password`)
            document.body.addEventListener('click', (e)=>{theForm.setAttribute('error', ``)}, {once: true})
            return theForm.classList.add('errorInForm')
        }else if(data.code == "#AccountNotSetup"){
            location.href = location.origin + `/parent/signup?_id=${data._id}`
        }else{
            throw new Error("Error")
        }
    })
    .catch(err => {
        alert("Something went wrong. Please try again")
    })

})




