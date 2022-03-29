const hamburgerMenu = document.querySelector('.HamburgerContainer')
hamburgerMenu.onclick = ()=>{
    hamburgerMenu.children[0].classList.toggle('clickedMenu')
    document.querySelector('.Menu').classList.toggle('show')
    document.querySelector('.Content').classList.toggle('onlyMain')
    if(document.querySelector('.Content .main')) document.querySelector('.main').classList.toggle('biggerMain')
}

let userName = JSON.parse(localStorage.eKOSORA_User).names.split(' ').slice(0, -1).map(x => x.slice(0,1)+'.').join(' ') + ` ${JSON.parse(localStorage.eKOSORA_User).names.split(' ')[JSON.parse(localStorage.eKOSORA_User).names.split(' ').length -1]}`
// console.log(userName)
document.querySelector('.Profile h3').textContent = JSON.parse(localStorage.eKOSORA_User).names.split(' ')[1][0].toUpperCase() + JSON.parse(localStorage.eKOSORA_User).names.split(' ')[1].slice(1).toLowerCase()
// document.querySelector('.Profile h3').textContent = userName
document.querySelector('.Profile p').textContent = JSON.parse(localStorage.eKOSORA_User).accountType

if(document.querySelector('#LogOutBTN')){
    document.querySelector('#LogOutBTN').parentElement.addEventListener('click', (e)=>{
        location.pathname = '/login'
    })
}


// document.querySelector('.Middle h1').textContent

for(let menuItem of document.querySelectorAll('.MenuItem')){
    if(menuItem.children[0].textContent == document.querySelector('.Middle h1').textContent) menuItem.classList.add('active')
}

const AlertAlt = (message, sustain)=>{
    let div = document.createElement('div')
    div.className = "AlertDIV"
    div.textContent = message
    if(document.querySelector('.AlertDIV')){
        document.querySelector('.AlertDIV').classList.remove("showAlert")
        document.body.removeChild(document.querySelector('.AlertDIV'))
        // setTimeout(()=>{}, 300)
    }
    document.body.appendChild(div)
    setTimeout(()=>{
        div.classList.add("showAlert")
    }, 10)
    setTimeout(()=>{
        if(sustain) return
        div.classList.remove("showAlert")
        setTimeout(()=>{document.body.removeChild(div)}, 300)
    }, 3000)
}

if(document.querySelector('.main')){
    window.onresize = ()=>{
        if(window.innerWidth <= 1110){
            console.log("closing or opening")
            hamburgerMenu.children[0].classList.remove('clickedMenu')
            document.querySelector('.Menu').classList.remove('show')
            document.querySelector('.Content').classList.add('onlyMain')
        }
    }
    setTimeout(()=>{
        window.dispatchEvent(new Event('resize'))
    }, 1000)
    
}


if(location.pathname != "/getin/login") document.cookie = "redirected=false"