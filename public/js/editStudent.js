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

function fillInParent(input, parentEmail){
    let div = document.createElement('div')
    div.className = "parentEmail"
    div.textContent = parentEmail
    input.parentElement.insertBefore(div, input)
    input.value = ""
    input.style.height = "0"
    input.style.padding = "0"
}

document.querySelector('.addParent').addEventListener('click', (e)=>{
    e.preventDefault()
    console.log("Called the addParent listener")
    let inputBox = document.querySelector('input[name=parentEmails]')
    if(document.querySelector('.addParent').hasAttribute('adding')){
        document.querySelector('.addParent').removeAttribute('adding')
        fillInParent(inputBox, inputBox.value)
        return
    }
    document.querySelector('.addParent').setAttribute('adding', '')
    
    inputBox.value = ""
    inputBox.style.height = ""
    inputBox.style.padding = ""
    
})

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let toSend = {parentEmails: []}
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
    /* 


    * Here the script checks if the class entered is valid
    * Ideally there should be a model upon which to check it because different schools have different class-naming schemes
    * But for now we'll just use the most popular scheme in Rwanda
    * which is [Year Number] [Class Letter]
    


    */
    toSend.class = toSend.class.split(' ').join('')
    if(toSend.class.length > 2) return AlertAlt("[Error] Invalid class. 1A is an example of a valid class name", sustain=false, isError=true)

    if(!toSend.class.match(/[0-9][A-Z]/)) return AlertAlt("[Error] Invalid class. 1A is an example of a valid class name", sustain=false, isError=true)
    toSend.class = {
        year: Number(toSend.class[0]),
        class: toSend.class[1]
    }
    /* 
    * Adding the parent emails to the request body
    */

    toSend.parentEmails = []

    for(let parentEmail of document.querySelectorAll('.parentEmail')){
        toSend.parentEmails.push(parentEmail.textContent)
    }

    // return console.log(toSend)

    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.code != "#Success") throw new Error((data.message) ? data.message : '#UnknownError')
        location.pathname = "/student"
    })
    .catch(err => {
        console.log(err)
        AlertAlt(`Something went wrong. Please try again. [Error]: ${err.message}`)
    })
})