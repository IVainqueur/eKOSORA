fetch(`/getInfo/${JSON.parse(localStorage.eKOSORA_User)._id}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#Error"){
        return AlertAlt("Something went wrong. Please try again", sustain=true)
    }
    if(data.code == "#NoSuchID"){
        document.write("Something is wrong with your account authentication. <a href='/login'>Click Here</a> to log in again")
        return
    }
    if(data.code == "#Success"){
        // document.querySelector('input[type=password]').value = data.password
        fillInData(data.doc)
    }
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
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
            setTimeout(()=>{location.reload()}, 200)
        }
    })
    .catch(err => {
        AlertAlt("Something went wrong. Please try again")
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
    for(let input of document.querySelectorAll('.Settings input[readonly]')){
        // console.log("Did this")
        if(input.parentElement.getAttribute('noteditable') == 'true') continue
        if(input.value == 'unknown') input.value = ''
        input.readOnly = false
        // input.style.border = "1px solid #b7b7b7"
        // input.style.backgroundColor = "#b7b7b7"
        input.classList.add("editableOption")
    }
}


editBTN.addEventListener('click', clickedEdit, {once: true})

document.querySelector('.ProfileImage').addEventListener('click', (e)=>{
    let fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.accept = ".png, .jpeg, .jpg, .gif, .ico"
    fileInput.onchange = async (e2)=>{
        let reader = new FileReader()
        let failed = false
        reader.onload = async function(event) {
            if(event.total > 100000){
                console.log("Inside the load function")
                failed = true
                return alert("The file must be under 50Kb in size")
            } 
            let img = document.querySelector('.ProfileImage img')
            img.src = event.target.result
            let data = new FormData()
            // data.append('fromReader', event.target.result)
            AlertAlt('Updating profile...', true)
            data.append('file', fileInput.files[0])
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
                    AlertAlt('Updated profile successfully')
                }
            })
            .catch(err => {
                AlertAlt("Something went wrong. Please try again")
            })
            
        }
        let readFile = await reader.readAsDataURL(e2.target.files[0])
        // if(failed) return
        // console.log("reached here")
        // return
        
        // console.log(e2.target.files[0])
    }

    fileInput.click()

})

const observer = new ResizeObserver((entries)=>{
    let mainDIV = entries[0]
    if(mainDIV.contentRect.width < 690){
        mainDIV.target.classList.add('smallSettings')
    }else{
        mainDIV.target.classList.remove('smallSettings')
    }
})

observer.observe(document.querySelector('.Settings'))


///! GET EXTRA SETTINGS
AlertAlt("Loading...", true)
fetch('/settings/otherSettings')
.then(res => res.json())
.then(data => {
    console.log(data)
    AlertAlt("Updated")
    if(data.code == "#Error"){
        AlertAlt("Could not load other settings. Try refreshing the page!")
    }
    if(data.code == "#Success"){
        if(data.doc.length == 0) return
        for(let setting of data.doc){
            console.log(setting.value.value['number'])
            let div = document.createElement('div')
            let h1 = document.createElement('h1')
            
            h1.textContent = setting.key
            h1.style.textTransform = "capitalize"
            
            div.className = "OtherSetting"

            div.appendChild(h1)

            for(let valueKey of Object.keys(setting.value.value)){
                let field = document.createElement('div')
                field.className = "Field"
                let h3 = document.createElement('h3')
                h3.textContent = valueKey + ":"
                h3.style.textTransform = "capitalize"
                let input = document.createElement('input')
                input.type = setting.value.value[valueKey].type
                input.className = "span"
                input.readOnly = true

                if(setting.value.value[valueKey].type == 'Date'){
                    input.valueAsNumber = Date.parse(new Date(setting.value.value[valueKey].data))
                }else{
                    input.value = setting.value.value[valueKey].data
                }


                field.appendChild(h3)
                field.appendChild(input)
                div.appendChild(field)
            }


            //* THE EDIT BUTTON FOR EACH SETTING
            let settingEditBTN = document.createElement('div')
            settingEditBTN.innerHTML = `<img src="../img/edit.svg" alt="EDIT BUTTON">`
            settingEditBTN.className = "settingEditBTN"

            settingEditBTN.addEventListener('click', (e)=>{
                for(let child of settingEditBTN.parentElement.children){
                    if((child.tagName == "DIV") && (Array.from(child.classList).includes("Field"))){
                        for(let subchild of child.children){
                            if(subchild.tagName == "INPUT"){
                                subchild.readOnly = false
                                subchild.classList.add('editableOption')
                            }
                        }
                    }
                }
                settingEditBTN.style.transform = "rotate(360deg)"
                setTimeout(()=>{
                    document.querySelector('.settingEditBTN img').src = "../img/save.svg"
                }, 250)
            }, {once: true})

            div.appendChild(settingEditBTN)


            document.querySelector('.main').appendChild(div)

        }
    }

})
.catch(err => {
    console.log(err)
    AlertAlt("Something went wrong. Please try again")
})


