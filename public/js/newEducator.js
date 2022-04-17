//Getting the subjects
fetch("/subjects")
.then(res=>res.json())
.then(data => {
    if(data.code == "#Error") return console.log("Something went wrong")
    for(let subject of data.doc){
        console.log(subject)
        let label = document.createElement('label')
        let checkbox = document.createElement('input')
        checkbox.type = "checkbox"
        label.appendChild(checkbox)
        let choice = document.createElement('option')
        checkbox.value = subject.code
        choice.textContent = subject.title
        label.appendChild(choice)
        document.querySelector('.Lessons').appendChild(label)
    }
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})

for(let select of document.querySelectorAll('select')){
    select.addEventListener('change', (e)=>{
        select.firstElementChild.disabled = true
    })
}

document.querySelector('#LessonsDropDown img').onclick = (e)=>{
    document.querySelector('.Lessons').classList.toggle('showLessons')
}

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let toSend = {lessons: []}
    // let checkedBoxes = []
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
    console.log(toSend)
    fetch('', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
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