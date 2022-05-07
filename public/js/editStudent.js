//FETCH THE SPECIFIED ID's INFO
AlertAlt("Loading data...", sustain=true)
fetch(`/student/getOne?id=${location.search.slice(location.search.indexOf('=')+1)}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#Error") return AlertAlt("Something went wrong. Try refreshing the page.")
    if(data.code == "#NotFound") return AlertAlt("There is no student under the ID")
    fillInData(data.doc)
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})


function fillInData(data){
    for(let input of document.querySelectorAll('input')){
        if(input.getAttribute("name") == "class"){
            input.value = `${data['class'].year} ${data["class"].class} `
            continue
        }
        if(input.getAttribute("name") == "parentEmails") {
            fillInParents(input, data["parentEmails"])
        }
        input.value = data[input.getAttribute('name')]
    }
    AlertAlt("Loaded!!")
}

function fillInParents(input, parentEmails){
    for(let child of input.parentElement.children){
        if(child.className === 'parentEmail') input.parentElement.removeChild(child)
    }
    console.log(parentEmails)
    for(let parentEmail of parentEmails){
        let div = document.createElement('div')
        div.className = "parentEmail"
        div.textContent = parentEmail
        input.parentElement.insertBefore(div, input)
    }
    input.value = ""
    input.style.height = "0"
    input.style.padding = "0"
}

document.querySelector('.addParent').addEventListener('click', (e)=>{
    e.preventDefault()
    const handler = (e)=>{
        if(e.key == "Enter"){
            e.preventDefault()
            document.querySelector('input[name=parentEmails]').removeEventListener('click', handler)
        }
    }
    document.querySelector('input[name=parentEmails]').addEventListener('keyup', handler, {once: true})
})

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let toSend = {lessons: []}
    for(let input of document.querySelectorAll('input, select')){
        let toUse = null
        if(input.tagName == "INPUT"){
            if(input.value == ''){
                //To check whether the unFilled field is among the required ones
                if(["names", "email", "tel"].includes(input.getAttribute('name'))) {
                    input.parentElement.classList.add('unFilledField')
                    input.addEventListener('focus', (e)=>{
                        input.parentElement.classList.remove('unFilledField')
                    }, {once: true})
                    return
                }
                
            }else if(input.type == 'checkbox'){
                // console.log(input)
                if(input.checked) toSend.lessons.push(input.value)
                continue
            }
            toUse = input.value
        }else{
            if(input.selectedOptions[0].value == ''){
                input.parentElement.classList.add('unSelectedField')
                input.addEventListener('focus', (e)=>{
                    input.parentElement.classList.remove('unSelectedField')
                }, {once: true})
                return
            }
            toUse = input.selectedOptions[0].value
            
        }
        toSend[input.getAttribute('name')] = toUse
    }

    // console.log(checkedBoxes)
    // toSend.lessons = checkedBoxes
    // toSend._id = location.search.slice(location.search.indexOf('=')+1)
    //  console.log(toSend)
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: toSend
        })
    })
    .then(res => {
       res.json()
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        AlertAlt("Something went wrong. Please try again")
    })
})