if(location.search.match(/_id/)){
    if(location.search.slice(5).length == 24){
        AlertAlt("Loading...", true)
        fetch(`/parent/getParentInfo${location.search}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.code == "#Error") throw new Error(JSON.stringify(data.message))
            if(data.code == "#NoSuchID") return AlertAlt("Check if this is the correct url you were given through your email...")
            AlertAlt("Done")

            for(let key of Object.keys(data.doc)){
                if(key == "password") continue
                if(key == "children"){
                    let ul = document.createElement('ul')
                    for(let child of data.doc["children"]){
                        let li = document.createElement('li')
                        li.textContent = child.names
                        ul.appendChild(li)
                    }
                    document.querySelector('.Children').appendChild(ul)
                }else{
                    if(!document.querySelector(`input[name=${key}]`)) continue
                    document.querySelector(`input[name=${key}]`).value = data.doc[key]
                }
            }

        })
        .catch(err =>{
            console.log(err)
            AlertAlt("Something went wrong. Please try again...", sustain=false, isError=true)
        })
    }else{
        AlertAlt("Check if this is the correct url you were given through your email...")
    }

    document.querySelector('form').onsubmit = (e)=>{
        e.preventDefault()
        if(document.querySelector('.AlertDIV')) document.querySelector('.AlertDIV').classList.remove("showAlert")
        let toSend = {}
        for(let input of document.querySelectorAll('form input:not(input[name=password], input[name=c-password])')){
            if(input.value == "") return AlertAlt(`Please fill the ${input.name} field`, sustain=true, isError=true)
            toSend[input.getAttribute("name")] = input.value

        }

        let password = document.querySelector('form input[name=password]').value
        let cpassword = document.querySelector('form input[name=c-password]').value

        if((password == "") || (cpassword == ""))return AlertAlt("Please fill the password fields", sustain=true, isError=true)

        if(password != cpassword) return AlertAlt("The password and confirm password do not match", sustain=true, isError=true)

        toSend.password = password

        fetch("", {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(toSend)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if(data.code == "#Error") throw new Error(JSON.stringify(data.message))
            if(data.code == "#NoSuchID") return AlertAlt("Check if this is the correct url you were given through your email...", sustain=false, isError=true)
            AlertAlt("Success")
            location.pathname = "/login"
        })
        .catch(err =>{
            console.log(err)
            AlertAlt("Something went wrong. Please try again...", sustain=false, isError=true)
        })
    }
    
}