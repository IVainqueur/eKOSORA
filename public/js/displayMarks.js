const makeCards = (toUse)=>{
    // console.log(toUse)
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

        document.querySelector('.main').appendChild(div)

        
    }
}
fetch(`/student/getMarks/${JSON.parse(localStorage.eKOSORA_User)._id}`)
.then(res => res.json())
.then(data => {
    if(data.code == "#NoSuchID"){
        document.write("Something is wrong with your account authentication. <a href='/login'>Click Here</a> to log in again")
        return
    }
    if(data.code == "#Error") return AlertAlt("Something went wrong. Please try again...")
    // console.log(data)
    makeCards(data.marks)
})
.catch(err => {
    AlertAlt("Something went wrong. Please try again")
})