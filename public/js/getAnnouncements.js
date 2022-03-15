fetch('/announcement/view')
.then(res => res.json())
.then(data =>{
    console.log(data)
    if(data.doc.length == 0){
        document.querySelector('.Announcements').innerHTML = "<p>No announcements to show</p>"
        return
    }
    for(let announcement of data.doc){
        let div = document.createElement('div')
        let title = document.createElement('h3')
        let content = document.createElement('p')
        let composer = document.createElement('span')
        content.textContent = announcement.content
        title.textContent = announcement.title
        let writer = announcement.writtenBy.split(' ').slice(0, -1).map(x => x.slice(0,1)+'.').join(' ') + ` ${announcement.writtenBy.split(' ')[announcement.writtenBy.split(' ').length -1]}`
        composer.innerHTML = `Posted by <strong style="color: rgba(0,0,0,0.6);">${writer}</strong> on <strong style="color: rgba(0,0,0,0.6);">${new Date(announcement.date).toString().slice(0, 15)}</strong>`

        if(Math.abs(new Date(announcement.date) - new Date()) >= 8640000 ) {
            div.setAttribute('badge', "New")
        }else{
            console.log(new Date(announcement.date) - new Date())
            let days = Math.abs(new Date(announcement.date) - new Date())/(1000*60*60*24)
            div.setAttribute('badge', `${Math.floor(days)} days ago`)
        }
        div.classList.add('NewAnnouncement')

        div.appendChild(title)
        div.appendChild(content)
        div.appendChild(composer)
        document.querySelector('.Announcements').appendChild(div)
    }
})