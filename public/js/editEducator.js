//GET ALL SUBJECTS
fetch("/subjects")
.then(res=>res.json())
.then(data => {
    if(data.code == "#Error") return console.log("SOmething went wrong")
    for(let subject of data.doc){
        // console.log(subject.code)
        let label = document.createElement('label')
        let checkbox = document.createElement('input')
        checkbox.type = "checkbox"
        checkbox.value = subject.code
        label.appendChild(checkbox)
        let choice = document.createElement('option')
        choice.textContent = subject.title
        label.appendChild(choice)
        document.querySelector('.Lessons').appendChild(label)
    }
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})

document.querySelector('#LessonsDropDown img').onclick = (e)=>{
    document.querySelector('.Lessons').classList.toggle('showLessons')
}

//FETCH THE SPECIFIED ID's INFO
fetch(`/educator/getOne?id=${location.search.slice(location.search.indexOf('=')+1)}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#Error") return AlertAlt("Something went wrong. Try refreshing the page.")
    if(data.code == "#NotFound") return AlertAlt("There is no educator under the ID")
    fillInData(data.doc)
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})


function fillInData(data){
    for(let input of document.querySelectorAll('input')){
        if(input.type == 'checkbox') {
            // console.log(data.lessons, input.value)
            if(data.lessons.includes(input.value)) input.checked = true
            continue
        }
        input.value = data[input.getAttribute('name')]
    }
}

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