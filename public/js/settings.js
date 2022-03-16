if(JSON.parse(localStorage.eKOSORA_User).profileLink){
    document.querySelector('.ProfileImage img').src = JSON.parse(localStorage.eKOSORA_User).profileLink
}

const editBTN = document.querySelector('#EditBTN')
const clickedSaveEdit = (e)=>{
    console.log("Clicked Save Edit")
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