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
        composer.textContent = announcement.composer

        div.appendChild(title)
        div.appendChild(content)
        div.appendChild(composer)
        document.querySelector('.Announcements').appendChild(div)
    }
})