console.log("Loaded common.js")
window.onload = (e)=>{
    console.log("%c LOADED THE PAGE", "color: #48ff48; font-size: 30px")
    document.querySelector('.LoadingOverlay').style.display = "none"
    document.querySelector('style#style2').innerHTML = ""
}
const hamburgerMenu = document.querySelector('.HamburgerContainer')
if(hamburgerMenu){
    hamburgerMenu.onclick = ()=>{
        hamburgerMenu.children[0].classList.toggle('clickedMenu')
        document.querySelector('.Menu').classList.toggle('show')
        document.querySelector('.Content').classList.toggle('onlyMain')
        if(document.querySelector('.Content .main')) document.querySelector('.main').classList.toggle('biggerMain')
    }
}
//Setting up the MenuBar info
let userInfo = (localStorage.eKOSORA_User) ? JSON.parse(localStorage.eKOSORA_User) : null
if(userInfo && document.querySelector('.Profile')){

    document.querySelector('.Profile h3').textContent = userInfo.names.split(' ')[1][0].toUpperCase() + userInfo.names.split(' ')[1].slice(1).toLowerCase()

    document.querySelector('.Profile p').textContent = userInfo.accountType 
    document.querySelector('.Profile img').src = userInfo.profileLink


    if(userInfo.title){
        document.querySelector('.Profile p').textContent += ((userInfo.title.match(/admin/)? "(admin)": ""))
        //Adding somethings if the account is admin
        if(userInfo.title.match(/admin/)){
            let div = document.createElement('div')
            div.className = "MenuItem"
            let a = document.createElement('a')
            a.href = "/educator"
            a.textContent = "Educators"
            div.appendChild(a)
            document.querySelector('.Menu').insertBefore(div, document.querySelector('.Menu').lastElementChild.previousElementSibling)
        }
    }


}


if(document.querySelector('#LogOutBTN')){
    document.querySelector('#LogOutBTN').parentElement.addEventListener('click', (e)=>{
        location.pathname = '/login'
    })
}


// document.querySelector('.Middle h1').textContent

for(let menuItem of document.querySelectorAll('.MenuItem')){
    if(menuItem.children[0].textContent == document.querySelector('.Middle h1').textContent) menuItem.classList.add('active')
}

const AlertAlt = (message, sustain, isError)=>{
    let div = document.createElement('div')
    div.className = "AlertDIV"
    div.textContent = message
    if(isError) div.style.backgroundColor = "red"
    if(document.querySelector('.AlertDIV')){
        document.querySelector('.AlertDIV').classList.remove("showAlert")
        document.body.removeChild(document.querySelector('.AlertDIV'))
        
    }
    document.body.appendChild(div)
    setTimeout(()=>{
        div.classList.add("showAlert")
    }, 10)
    setTimeout(()=>{
        if(sustain) return
        div.classList.remove("showAlert")
        setTimeout(()=>{
            if(document.querySelector('.AlertDIV')){
                let alertDIV = document.querySelector('.AlertDIV')
                alertDIV.parentElement.removeChild(alertDIV)
            }
        }, 300)
    }, 3000)
}

if(document.querySelector('.main') && hamburgerMenu){
    window.onresize = ()=>{
        if(window.innerWidth <= 1110){
            console.log("closing or opening")
            hamburgerMenu.children[0].classList.remove('clickedMenu')
            document.querySelector('.Menu').classList.remove('show')
            document.querySelector('.Content').classList.add('onlyMain')
            // hamburgerMenu.click()
        }
    }
    setTimeout(()=>{
        window.dispatchEvent(new Event('resize'))
    }, 300)
    
}


if(location.pathname != "/getin/login") document.cookie = "redirected=false"

function preventClick(){
    for(let element of document.querySelectorAll('*')){
        element.style.pointerEvents = "none"
    }
}

function allowClick(){
    for(let element of document.querySelectorAll('*')){
        element.style.pointerEvents = ""
    }
}



function _pick(needed, theObj){
    let newObj = {}
    Object.keys(theObj).forEach((key, i)=>{
        if(needed.includes(key)){
            newObj[key] = theObj[key]
        }
    })
    return newObj
}

function _remove(needed, theObj){
    let newObj = {}
    Object.keys(theObj).forEach((key, i)=>{
        if(!needed.includes(key)){
            newObj[key] = theObj[key]
        }
    })
    return newObj
}

function arr_remove(needed, theObj){
    let newObj = []
    theObj.forEach((key, i)=>{
        if(!needed.includes(key)){
            newObj.push(key)
        }
    })
    return newObj
}
function getTimePassed (date){
    if(isNaN(date)) date = Date.parse(date)
    let diff = Date.now() - date
    let mseconds = diff % 1000
    let seconds = parseInt(diff/1000) % 60
    let minutes = parseInt(parseInt(diff/1000)/60) % 60
    let hours = parseInt(parseInt(parseInt(diff/1000)/60)/60) % 24
    let days = parseInt(parseInt(parseInt(parseInt(diff/1000)/60)/60)/24)
    return {
        days, hours, minutes, seconds, mseconds
    }
    
}


/* Check if the current url is https */

if(!location.href.match(/https/)){
    // location.href = "https" + location.href.slice(4)
}