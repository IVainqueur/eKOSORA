if(location.pathname == "/announcement") AlertAlt("Loading...", sustain=true)

fetch('/announcement/view')
.then(res => res.json())
.then(data =>{
    console.log(data)
    if(data.doc.length == 0){
        document.querySelector('.Announcements').innerHTML += "<p>No announcements to show</p>"
        return
    }
    document.querySelector('.Announcements .loadingAnnouncements').innerHTML = ""
    document.querySelector('.Announcements h1 span').innerHTML = data.doc.length
    const isAtDashboard = location.pathname.match(/dashboard/)
    let announcements = data.doc.reverse().slice(0, isAtDashboard ? 2 : undefined)
    for(let announcement of announcements){
        let div = document.createElement('div')
        let title = document.createElement('h3')
        let content = document.createElement('p')
        let composer = document.createElement('span')
        content.textContent = announcement.content
        title.textContent = announcement.title
        let writer = announcement.writtenBy.split(' ').slice(0, -1).map(x => x.slice(0,1)+'.').join(' ') + ` ${announcement.writtenBy.split(' ')[announcement.writtenBy.split(' ').length -1]}`
        composer.innerHTML = `Posted by <strong style="color: rgba(0,0,0,0.6);">${writer}</strong> on <strong style="color: rgba(0,0,0,0.6);">${new Date(announcement.date).toString().slice(0, 15)}</strong>`

        let _tp = Date.now() - Date.parse(new Date(announcement.date))
        let _tl = Date.parse(new Date(announcement.expiry)) - Date.now()
        let _timePassed = calculateTime(_tp)
        let _timeLeft = calculateTime(_tl)
        
        div.setAttribute('badge', (_timePassed.days < 3) ? "New" : `${_timePassed.days} days ago`)
        div.classList.add('NewAnnouncement')

        if(_timeLeft.days > 0){
            div.appendChild(title)
            div.appendChild(content)
            div.appendChild(composer)
            document.querySelector('.Announcements').appendChild(div)
        }else{
            // Flag expired announcement
            console.log(_timeLeft, _timePassed)
        }

        if(location.pathname == "/announcement") AlertAlt("Loaded all announcements")
    }
})
.catch(err => {
    console.log(err)
    AlertAlt("Something went wrong. Please try again")
})