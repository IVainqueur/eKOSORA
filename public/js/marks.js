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
    window.dispatchEvent(new Event('hashchange'))

})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})

let students = null

//RESIZE OBSERVER
const observer = new ResizeObserver((entries)=>{
    let main = entries[0]
    console.log(main.contentRect.height, main.contentRect.width)
    if(main.contentRect.width <= 970){
        main.target.classList.add('smallMain')
    }else{
        main.target.classList.remove('smallMain')
    }
})

observer.observe(document.querySelector('.main'))
//SOME GLOBAL VARIABLES
const selected = {
    class: {
        year: null,
        class: null
    },
    subject: null
}
const classChoice = document.querySelector('#ClassChoice')
const subjectChoice = document.querySelector('#SubjectChoice')


window.onhashchange = async (e)=>{
    console.log("The hash changed")
    let modified = location.hash.split('-')
    try{
        if(!document.querySelector(`option[value=${modified[0].slice(1)}]`)) return console.log("No such class")
        if(!document.querySelector(`option[value=${modified[1]}]`)) return console.log("No such course", modified)
    }catch(e){
        return console.log(e)
    }
    
    document.querySelector(`option[value=${modified[0].slice(1)}]`).selected = true
    document.querySelector(`option[value=${modified[1]}]`).selected = true
    document.querySelector(`option[value=${modified[0].slice(1)}]`).parentElement.dispatchEvent(new Event('change'))
    document.querySelector(`option[value=${modified[1].slice(0)}]`).parentElement.dispatchEvent(new Event('change'))

    try{
        let result = await fetch(`/student/getRecords/?year=${selected.class.year}&class=${selected.class.class}&subject=${selected.subject}`)
        result = await result.json()
        students = result.records
        parseFetchData(result)
    }catch(e){
        AlertAlt("Something went wrong. Please try again")
    }
}


document.addEventListener('click', (e)=>{
    if((!e.path.includes(document.querySelector('.EditChoice'))) && (!e.path.includes(document.querySelector('#EditBTN')))){
        document.querySelector('.EditChoice').style.display = "none"
    }
    
})


for(let select of document.querySelectorAll('select')){
    select.addEventListener('change', (e)=>{
        select.firstElementChild.disabled = true
    })
}


classChoice.addEventListener('change', async (e)=>{
    console.log('%cClass changed', "color: orange;")
    try{
        selected.class.year = Number(classChoice.selectedOptions[0].textContent.slice(5, 7))
        selected.class.class = (classChoice.selectedOptions[0].textContent.slice(-1))
        if(subjectChoice.selectedIndex == 0) return
        location.hash = `${classChoice.selectedOptions[0].value}-${subjectChoice.selectedOptions[0].value}`
        
    }
    catch(e){
        console.log(e)
    }
})


subjectChoice.addEventListener('change', async (e)=>{
    console.log('%cCourse changed', "color: orange;")

    try{
        selected.subject = (subjectChoice.selectedOptions[0].value)
        if(classChoice.selectedIndex == 0) return
        location.hash = `${classChoice.selectedOptions[0].value}-${subjectChoice.selectedOptions[0].value}`
        
    }
    catch(e){
        console.log(e)
    }
    // console.log(result)
})

let theData = null

function parseFetchData(data){
    // console.log(data.records)
    theData = data.records

    document.querySelector('.Right h1 span').textContent = selected.subject + " marks"

    if(document.querySelector(`.Right table`)) document.querySelector(`.Right`).removeChild(document.querySelector(`.Right table`))

    if(data[Object.keys(data)[1]].length == 0) return document.querySelector('.notifier').textContent = "No records to show"

    if(data[Object.keys(data)[1]][0].records.length == 0) return document.querySelector('.notifier').textContent = "No records to show"

    let heads = ["names"]
    heads = heads.concat(data.records[0].records.map(x => `/${x.max}`))
    // console.log()
    let forTable = []
    forTable = forTable.concat(data.records.map(x => [x.studentName]))

    theData = data.records
    data = data.records.map(x => x.records)

    for(let i = 0; i < data.length; i++){
        let unoData = data[i]
        forTable[i] = forTable[i].concat(unoData.map(x => x.mark))
        forTable[i].push(theData[i].studentId)
    }

    buildTable(heads, forTable, '.Right')

}

let className = document.createTextNode('')
document.querySelector('.Right h1').insertBefore(className, document.querySelector('.Right h1').firstElementChild)

//building the table
const buildTable = (heads, data, selector)=>{
    // console.log(data)
    document.querySelector('.notifier').textContent = ''

    className.textContent = classChoice.selectedOptions[0].textContent

    document.querySelector(selector).firstElementChild.firstElementChild.textContent = `${subjectChoice.selectedOptions[0].value} marks`

    if(document.querySelector(`${selector} table`)) document.querySelector(`${selector}`).removeChild(document.querySelector(`${selector} table`))


    let table = document.createElement('table')
    let thead = document.createElement('thead')
    let tbody = document.createElement('tbody')

    //Building the head
    let checkHead = document.createElement('th') //For the checkbox column
    checkHead.innerHTML = '<input type="checkbox">'
    thead.appendChild(checkHead)
    for(let head of heads){
        let th = document.createElement('th')
        th.textContent = head
        thead.appendChild(th)
    }
    for(let i=0; i < data.length; i++){
        let tr = document.createElement('tr')
        for(let j = 0; j <= (data[i]).length -1; j++){
            let td = document.createElement('td')
            td.textContent = (j == 0) ? '': (data[i])[j-1]
            td.innerHTML = (j == 0) ? `<input type="checkbox">` : td.innerHTML
            tr.appendChild(td)
        }
        tr.title = data[i][data[i].length-1]
        tbody.appendChild(tr)
    }
    
    table.appendChild(thead)
    table.appendChild(tbody)
    document.querySelector(selector).appendChild(table)
    setListeners()
}

let selectedCount = document.querySelector('#SelectedCount')

function setListeners(){
    for(let checkbox of document.querySelectorAll('input[type=checkbox]')){
        checkbox.onchange= (e)=>{
            
            if(e.target.parentElement.tagName == 'TH' ){
                selectedCount.textContent = 0
                for(let oneCheckBox of document.querySelectorAll('input[type=checkbox]')){
                    if(oneCheckBox.parentElement.tagName == 'TH') continue
                    oneCheckBox.checked = e.target.checked
                    oneCheckBox.dispatchEvent(new Event('change'))
                }
            }else{
                if(!e.target.checked) {
                    document.querySelector('input[type=checkbox]').checked = false
                }
                selectedCount.textContent = parseInt(selectedCount.textContent) + ((e.target.checked) ? (1) : (-1))
                if(parseInt(selectedCount.textContent) < 0) selectedCount.textContent = 0
            }
    
            // if(selectedCount.textContent != 0){
    
            // }
        }
    }
}

let editBTN = document.querySelector('#EditBTN')
let individualEdit = document.querySelector('#IndEdit')
let groupEdit = document.querySelector('#GroupEdit')

editBTN.addEventListener('click', ()=>{
    if(selectedCount.textContent != 0){
        document.querySelector('.Selected .EditChoice').style.display = "flex"
        setTimeout(()=>{
            document.querySelector('.Selected .EditChoice').style.bottom = "-60px"
        }, 10)

    }else{
        alert("Select at least 1 student")
    }
})

individualEdit.addEventListener('click', ()=>{
    // console.log("Clicked the individual edit btn")
    for(let selectedCheck of document.querySelectorAll('input[type=checkbox]:checked')){
        if(selectedCheck.parentElement.tagName == "TH") continue
        let selectedRow = selectedCheck.parentElement.parentElement
        // console.log(selectedRow.children.length)
        document.querySelector('.Warning').textContent = "! Currently in Editing mode"
        for(let i=2; i < selectedRow.children.length; i++){
            selectedRow.children[i].contentEditable = "true"
            
        }
    }
    for(let editable of document.querySelectorAll('td[contenteditable=true]')){
        // console.log(editable)
        editable.onkeydown = (e)=>{
            let prev = editable.textContent
            if(e.key.length == 1){
                if(e.key.match(/[^0-9^.]/) ) return e.preventDefault()
                if(Number(editable.textContent + e.key) > Number(document.querySelectorAll('th')[editable.cellIndex].textContent.slice(1))) return e.preventDefault()
            }
            setTimeout(()=>{
                if(Number(editable.textContent) > Number(document.querySelectorAll('th')[editable.cellIndex].textContent.slice(1))){
                    editable.textContent = prev
                }
                
                editable.className = "updating"
                fetch('/student/updateMark', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        recordId: theData[editable.parentElement.rowIndex].records[editable.cellIndex-2]._id,
                        studentId: theData[editable.parentElement.rowIndex].studentId,
                        mark: Number(editable.textContent)
                    })
                })
                .then(res =>res.json())
                .then(data => {
                    console.log(data)
                    if(data.code == "#Success") return editable.className="updated"
                    editable.className="failedUpdating"

                })
                .catch(err => {
                    AlertAlt("Something went wrong. Please try again")
                })
            }, 10)
        }
    }
})

groupEdit.addEventListener('click', ()=>{
    document.querySelector('.GroupEditPopUp').style.display = "grid"

    for(let record of students[0].records){
        let option = document.createElement('option')
        option.textContent = ` on ${record.recordName} ${new Date(record.date).toString().slice(0, 15)}`
        option.value = record._id
        document.querySelector('.GroupEditPopUp select').appendChild(option)
    }
    
})

document.querySelector('.PopUpCancel').addEventListener('click', (e)=>{
    e.target.parentElement.style.display = "none"
    document.querySelector('#AddOrRemoveCount').textContent = 0
})

document.querySelector('#RemoveBTN').addEventListener('click', (e)=>{
    let count = document.querySelector('#AddOrRemoveCount')
    count.textContent = Number(count.textContent) - 1
})
document.querySelector('#AddBTN').addEventListener('click', (e)=>{
    let count = document.querySelector('#AddOrRemoveCount')
    count.textContent = Number(count.textContent) + 1
})

document.querySelector('#GroupAdjBTN').addEventListener('click', (e)=>{
    if(document.querySelector('.GroupEditPopUp select').selectedOptions[0].value == "") return alert("Please select a record")
    let toSend = {
        mark: Number(document.querySelector('#AddOrRemoveCount').textContent),
        recordId: document.querySelector('.GroupEditPopUp select').selectedOptions[0].value,
        students: []
    }
    for(let selectedStudent of document.querySelectorAll('input[type=checkbox]:checked')){
        if(selectedStudent.parentElement.tagName == "TH") continue
        toSend.students.push(selectedStudent.parentElement.parentElement.title)
    }
    AlertAlt("Updating...", sustain=true)
    fetch('/student/updateForMany', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(toSend)
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        if(data.code == "#Error") throw new Error(data.message)
        setTimeout(()=>{
            location.reload()
        }, 1000)
    })
    .catch(err => {
        console.log(err)
        AlertAlt("Something went wrong. Please try again.")
    })
    console.log(toSend)
})