// let userInfo = JSON.parse(localStorage.eKOSORA_User)

//GET INFO ABOUT ALL THE REGISTERED EDUCATORS
fetch('/educator/view')
.then(res => res.json())
.then(data => {
    console.log(data)
    buildTable(Object.keys(data.doc[0]), data.doc, '.Table')
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})

function buildTable(heads, data, selector){
    document.querySelector('.notifier').textContent = ''

    if(document.querySelector(`${selector} table`)) document.querySelector(`${selector}`).removeChild(document.querySelector(`${selector} table`))


    let table = document.createElement('table')
    let thead = document.createElement('thead')
    let tbody = document.createElement('tbody')
    //Building the head
    for(let head of heads){
        if(['profileLink', '_id'].includes(head)) continue
        let th = document.createElement('th')
        th.textContent = head
        thead.appendChild(th)
    }
    let actionTH = document.createElement('th')
    actionTH.textContent = 'Action'
    thead.appendChild(actionTH)
    //adding the data
    for(let i=0; i < data.length; i++){
        let tr = document.createElement('tr')
        console.log(data[i])
        for(let j = 0; j < heads.length-1; j++){
            if(j == 0){
                tr.title = data[i][heads[j]]
                continue
            }
            let td = document.createElement('td')
            let textContent = (['', Array(0)].includes(data[i][heads[j]])) ? '~~' : data[i][heads[j]]
            td.innerHTML = ((j == 1) ? `<img src="${data[i]['profileLink']}">` : '') + textContent
            tr.appendChild(td)
        }
        let actionTD = document.createElement('td')
        actionTD.className = "ActionTD"
        actionTD.innerHTML = `
                <a href="/educator/edit?id=${data[i]._id}"><img src="../img/edit.svg"></a>
                <img src="../img/delete.svg" onclick="deleteEducator(this)">
            `
        tr.appendChild(actionTD)
        tbody.appendChild(tr)
    }
    
    table.appendChild(thead)
    table.appendChild(tbody)
    document.querySelector(selector).appendChild(table)
    // setListeners()
}


function deleteEducator(e){
    // console.log(e.parentElement.parentElement)
    if(confirm("Are you sure you want to delete educator "+ e.parentElement.parentElement.firstElementChild.childNodes[1].textContent+ "?")){
        if(userInfo._id == e.parentElement.parentElement.title){
            return AlertAlt("You can not delete your own account!")
        }
        fetch(`/educator/delete?id=${e.parentElement.parentElement.title}`)
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