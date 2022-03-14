const hamburgerMenu = document.querySelector('.HamburgerContainer')
hamburgerMenu.onclick = ()=>{
    hamburgerMenu.children[0].classList.toggle('clickedMenu')
    document.querySelector('.Menu').classList.toggle('show')
}

document.querySelector('.Profile h3').textContent = JSON.parse(localStorage.eKOSORA_User).names.split(' ')[1][0].toUpperCase() + JSON.parse(localStorage.eKOSORA_User).names.split(' ')[1].slice(1).toLowerCase()
document.querySelector('.Profile p').textContent = JSON.parse(localStorage.eKOSORA_User).title

if(document.querySelector('#LogOutBTN')){
    document.querySelector('#LogOutBTN').addEventListener('click', (e)=>{
        location.pathname = '/login'
    })
}
