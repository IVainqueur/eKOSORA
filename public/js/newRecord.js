//Getting the subjects
fetch("/subjects")
.then(res=>res.json())
.then(data => {
    if(data.code == "#Error") return console.log("SOmething went wrong")
    for(let subject of data.doc){
        let option = document.createElement('option')
        option.value = subject.code
        option.textContent = subject.title
        document.querySelector('select#SubjectChoice').appendChild(option)
    }
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})


for(let select of document.querySelectorAll('select')){
    select.addEventListener('change', ()=>{
        document.querySelector('select').firstElementChild.disabled = true
    }, {once: true})
    
}

document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault()
    let toSend = {}
    for(let input of document.querySelectorAll('input, select')){
        let toUse = null
        if(input.tagName == "INPUT"){
            if(input.value == ''){
                input.parentElement.classList.add('unFilledField')
                input.addEventListener('focus', (e)=>{
                    input.parentElement.classList.remove('unFilledField')
                }, {once: true})
                return
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
            if(input.getAttribute('name')== 'class'){
                toUse = {
                    year: Number(input.selectedOptions[0].textContent.slice(5, 6)),
                    class: input.selectedOptions[0].textContent.slice(-1)
                    
                }
            }
        }
        toSend[input.getAttribute('name')] = toUse
    }
    console.log(toSend)

    fetch('/student/addRecord', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data =>{
        console.log(data)
        if(data.code == "#Success") return location.pathname = "/marks"
        alert("Something went wrong. Please check console for more information")
        // console.log(data)
    })
    .catch(err => {
        AlertAlt("Something went wrong. Please try again")
    })
    
})
