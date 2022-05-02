const makeCards = (toUse)=>{
    
    // console.log(toUse)
    let Cards = document.createElement('div')
    Cards.className = "Cards"
    for(let card of toUse){
        let div = document.createElement('div')
        let title = document.createElement('h1')
        let mark = document.createElement('h1')
        let date = document.createElement('p')
        let after = document.createElement('div')

        for(let letter of card.subject.split('')){
            after.innerHTML += `<span>${letter}</span>`
        }
        
        after.className = "after"
        div.className = "Card"
        mark.className = "Mark"
        date.className = "Date"

        title.textContent = card.recordName
        mark.textContent = `${card.mark}/${card.max}`
        date.textContent = new Date(card.date).toString().slice(0, 15)

        div.appendChild(title)
        div.appendChild(mark)
        div.appendChild(date)
        div.appendChild(after)

        Cards.appendChild(div)

        
    }
    document.querySelector('.main').appendChild(Cards)
    AlertAlt("Loaded!")
}

let query = (userInfo.accountType == 'student') ? userInfo._id : ((userInfo.children) ? userInfo.children.map(x => x._id).join(',') : '')
AlertAlt("Loading...", sustain=true)
fetch(`/student/getMarks?ids=${query}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#NoSuchID"){
        document.write("Something is wrong with your account authentication. <a href='/login'>Click Here</a> to log in again")
        return
    }
    if(data.code == "#Error") {
        console.log(data.message)
        return AlertAlt("Something went wrong. Please try again...")
    }
    console.log(data.doc)
    for(let student of data.doc){
        let h1 = document.createElement('h1')
        h1.textContent = student.names + "'s marks"
        document.querySelector('.main').appendChild(h1)
        makeCards(student.records)
    }
    
})
.catch(err => {
    console.log(err)
    AlertAlt("Something went wrong. Please try again", true, true)
})

