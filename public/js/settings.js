fetch(`/getInfo/${JSON.parse(localStorage.eKOSORA_User)._id}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#Error"){
        return AlertAlt("Something went wrong. Please try again", sustain=true)
    }
    if(data.code == "#NoSuchId"){
        document.write("Something is wrong with your account authentication. <a href='/login'>Click Here</a> to log in again")
        return
    }
    if(data.code == "#Success"){
        // document.querySelector('input[type=password]').value = data.password
        fillInData(data.doc)
    }
})


if(JSON.parse(localStorage.eKOSORA_User).profileLink){
    document.querySelector('.ProfileImage img').src = JSON.parse(localStorage.eKOSORA_User).profileLink
}

const fillInData = (toUse)=>{
    for(let input of document.querySelectorAll('.Field input')){
        let value = toUse[input.parentElement.getAttribute('title')]
        input.value = (value) ? value : 'unknown'
        if(typeof(value) == 'object'){
            if(value.length == 0){
                input.value = 'unknown'
            }else{
                if(input.parentElement.getAttribute('title') == "class"){
                    input.value = `Year ${toUse[input.parentElement.getAttribute('title')]['year']} ${toUse[input.parentElement.getAttribute('title')]['class']}`
                }
            }
    }
    }
}

fillInData(JSON.parse(localStorage.eKOSORA_User))

const editBTN = document.querySelector('#EditBTN')
const viewHideBTN = document.querySelector('#ViewHidePassword')

viewHideBTN.onclick = (e)=>{
    viewHideBTN.src = (viewHideBTN.src.match("../img/visibility_off.svg"))? "../img/visibility.svg" : "../img/visibility_off.svg"
    viewHideBTN.previousElementSibling.type = (viewHideBTN.previousElementSibling.type == "text")?"password": "text"
}

const clickedSaveEdit = (e)=>{
    // console.log("Clicked Save Edit")
    let toSend = {}
    let readyToGo = true
    for(let input of document.querySelectorAll('.Field input')){
        if((input.value == '') && (input.parentElement.getAttribute('notneeded')!="true")){
            input.style.borderRadius = "3px"
            input.addEventListener('focus', (e)=>{e.target.style.outline = "none"}, {once: true})
            input.style.outline = "2px solid red"
            readyToGo = false
        }
        if(input.parentElement.getAttribute('noteditable') == "true") continue
        toSend[input.parentElement.getAttribute('title')] = (input.value != 'unknown') ? input.value : ''
        
    }
    if(!readyToGo) return
    // return console.log(toSend)
    AlertAlt("Updating...")
    fetch(`/settings/updateSettings/${JSON.parse(localStorage.eKOSORA_User)._id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data => {
        if(data.code == "#Error"){
            console.log(data.message)
            
            return AlertAlt("Something went wrong. Please try again...", sustain=true)
        }
        if(data.code == "#Success"){
            AlertAlt("User info updated successfully.")
            console.log(data)
            localStorage.eKOSORA_User = JSON.stringify(data.doc)
            setTimeout(()=>{location.reload()}, 2000)
        }
    })

    // fetch()
}

const clickedCancelBTN = (e)=>{
    location.reload()

}

const clickedEdit = (e)=>{
    console.log('Clicked the edit btn')
    let cancelBTN = document.createElement('button')
    cancelBTN.textContent = "CANCEL"
    cancelBTN.style.backgroundColor = "#ac3f3f"
    e.target.textContent = "SAVE"

    e.target.parentElement.insertBefore(cancelBTN, e.target)
    e.target.addEventListener('click', clickedSaveEdit)
    cancelBTN.addEventListener('click', clickedCancelBTN)
    // Array.from(document.querySelectorAll('input[readonly]')).map(x => x.readOnly = false)
    for(let input of document.querySelectorAll('input[readonly]')){
        // console.log("Did this")
        if(input.parentElement.getAttribute('noteditable') == 'true') continue
        if(input.value == 'unknown') input.value = ''
        input.readOnly = false
        input.style.border = "1px solid #b7b7b7"
        input.style.backgroundColor = "#b7b7b7"
    }
}


editBTN.addEventListener('click', clickedEdit, {once: true})

document.querySelector('#ProfileChangeBTN').addEventListener('click', (e)=>{
    let fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = ".png, .jpeg, .jpg, .gif, .ico"
    fileInput.onchange = async (e2)=>{
        let reader = new FileReader()
        let failed = false
        reader.onload = async function(event) {
            if(event.total > 100000){
                failed = true
                return alert("The file must be under 50Kb in size")
            } 
            let img = document.querySelector('.ProfileImage img')
            img.src = event.target.result
            
            
        }
        await reader.readAsDataURL(e2.target.files[0])
        // return
        if(failed) return
        let data = new FormData()
        // data.append('fromReader', event.target.result)
        data.append('file', e2.target.files[0])
        data.append("_id", JSON.parse(localStorage.eKOSORA_User)._id)
        // console.log(event.total)
        fetch('/settings/newProfile', {
            method: 'POST',
            headers: {},
            body: data
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.code == "#Success"){
                let userInfo = JSON.parse(localStorage.eKOSORA_User)
                userInfo.profileLink = data.url
                localStorage.eKOSORA_User = JSON.stringify(userInfo)
            }
        })
        // console.log(e2.target.files[0])
    }

    fileInput.click()

})