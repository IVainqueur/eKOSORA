// let userInfo = JSON.parse(localStorage.eKOSORA_User)

//GET INFO ABOUT ALL THE REGISTERED EDUCATORS
fetch('/student/view')
.then(res => res.json())
.then(data => {
    // console.dir(`Year ${data.doc[0].class.year} ${data.doc[0].class.class}`)
    buildTable(data.doc, '.Table')
})
.catch(err => {
    console.log(err)
    AlertAlt("Something went wrong. Please try again")
})

function buildTable(data, selector){
    // console.log(heads, "\n", data)
    let heads = []
    document.querySelector('.notifier').textContent = ''

    if(document.querySelector(`${selector} table`)) document.querySelector(`${selector}`).removeChild(document.querySelector(`${selector} table`))


    let table = document.createElement('table')
    let thead = document.createElement('thead')
    let tbody = document.createElement('tbody')

    for(let key of arr_remove(["records"], Object.keys(data[0]))){
        if(['profileLink', '_id'].includes(key)) continue
        heads.push(key)
        let th = document.createElement('th')
        th.textContent = key
        thead.appendChild(th)
    }




    let actionTH = document.createElement('th')
    actionTH.textContent = 'Action'
    thead.appendChild(actionTH)


    for(let student of data){
        let tr = document.createElement('tr')

        //First column we need profileLink, _id, and name
        let col1 = document.createElement('td')
        col1.innerHTML = `<img src="${student.profileLink}" alt="profile" /> <span class="name">${student.names}</span>`
        tr.appendChild(col1)

        for(let studentData of arr_remove(["names"], heads)){
            let td = document.createElement('td')
            
            if(studentData == 'class') {
                student[studentData] = `Year ${student.class.year} ${student.class.class}`
            }
            if(typeof(student[studentData]) == 'object') student[studentData] = student[studentData].toString()
            td.textContent = (["", Array(0)].includes(student[studentData])) ? "~~" : student[studentData]
            tr.appendChild(td)
        }

        let actionTD = document.createElement('td')
        actionTD.className = "ActionTD"
        actionTD.innerHTML = `
                <a href="/student/edit?id=${student._id}"><img src="../img/edit.svg"></a>
                <img src="../img/delete.svg" onclick="deleteEducator(this)">
            `
        tr.appendChild(actionTD)
        tbody.appendChild(tr)
    }
    
    table.appendChild(thead)
    table.appendChild(tbody)
    document.querySelector(selector).appendChild(table)
}


function deleteStudent(e){
    if(confirm("Are you sure you want to delete student "+ e.parentElement.parentElement.firstElementChild.childNodes[1].textContent+ "?")){
        if(userInfo._id == e.parentElement.parentElement.title){
            return AlertAlt("You can not delete your own account!")
        }
        fetch(`/student/delete?id=${e.parentElement.parentElement.title}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.code == "#Error") return AlertAlt('Something went wrong. Please try again')
            AlertAlt("Deleted 1 educator successfully.")
            setTimeout(()=>{location.reload()}, 400)
        })
        .catch(err => {
            AlertAlt("Something went wrong. Please try again")
        })
    }
}