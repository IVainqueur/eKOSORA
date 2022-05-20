//Shit that is only specific for the student's settings page
let addParentBTN = document.createElement('button')
addParentBTN.textContent = "+"
addParentBTN.style = `width: fit-content;
    padding: 10px 20px;
    border-radius: 20px;
    text-align: center;
    margin-top: 10px;
    font-weight: bold;`

document.querySelector('div[title=parentEmails]').appendChild(addParentBTN)
document.querySelector('div[title=parentEmails] input').type = "email"


addParentBTN.addEventListener('click',
(e)=>{
    document.querySelector('div[title=parentEmails] input').classList.add("editableOption")
    document.querySelector('div[title=parentEmails] input').readOnly = false
    

    document.querySelector('div[title=parentEmails] input').style.height = ""
    document.querySelector('div[title=parentEmails] input').style.padding = ""

    e.target.textContent = "SAVE"

    e.target.onclick = async (e) =>{
        if(!document.querySelector('div[title=parentEmails] input').checkValidity()){
            return AlertAlt("Email required")
        }
        if(confirm(`Are you sure you want to add "${document.querySelector('div[title=parentEmails] input').value}" as your parent?`)){
            try{
                let res = await fetch("/student/addParent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        studentName: userInfo.names,
                        studentId: userInfo._id,
                        email: document.querySelector('div[title=parentEmails] input').value
                    })
                })
                let data = await res.json()
                if(data.code == "#Error") throw new Error(JSON.stringify(data.message))
                AlertAlt("Successfully added new parent")
                location.reload()
                console.log(data)
                // setTimeout(()=>{location.reload()}, 1000)
            }catch(e){
                console.log(e)
                AlertAlt("Something went wrong. Please try again", sustain=true)
            }
        }else{
            location.reload()
        }
    }
},
 {once: true})