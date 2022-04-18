const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Y1A', 'Y1B', 'Y2A', 'Y2B', 'Y3A', 'Y3B'],
        datasets: [{
            label: 'Discipline average/ 100%',
            data: [10, 92, 73, 75, 52, 93],
            backgroundColor: [
                "#3F7CAC"
            ],
            borderColor: [
                "#3F7CAC"
            ],
            borderWidth: 2,
            borderRadius: 3
        }, 
        {
            label: 'Pop Quiz average/ 100%',
            data: [75, 52, 93, 10, 92, 73],
            backgroundColor: [
                'rgba(0,0,0,1)'
            ],
            borderColor: [
                'rgba(0,0,0,0.6)'
            ],
            borderWidth: 2,
            borderRadius: 3
        }]
    },
    options: {
    }
});


//Preparing data for the statistics feature
console.log(userInfo.lessons)
fetch('/student/getSummary', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        lessons: (userInfo.lessons) ? userInfo.lessons : []
    })
})
.then(res => res.json())
.then(data => {
    if(data.code == "#Error") throw new Error(data.message)

    for(let subject of userInfo.lessons){
        for(let year of Object.keys(data.doc)){
            let students = data.doc[year]
            let classes = Object.keys(students)

            //Check if that subject has more than one record 
            //{
            let subjectRecordCount = 0
            let recordNames = []
            for(let classLetter of classes){
                for(let record of students[classLetter][0].records){
                    if(record.subject == subject) {
                        subjectRecordCount++
                        if(!recordNames.map(x=>x._id).includes(record._id)) recordNames.push({name: record.recordName, _id: record._id, sum: {}, max: record.max})
                    }
                }
            }
            
            if(subjectRecordCount < 2) continue
            // console.log("The subject %s has more than 2 records", subject)
            
            // console.log("These are the record Names \n",recordNames)

            //TODO: PREPARING THE DATA NEEDED FOR A CHART
            let worstClass = {
                className: "",
                mark: null
            }
            let bestClass = {
                className: "",
                mark: null
            }
            let byClass = {}

            for(let record of recordNames){
                for(let classLetter of classes){
                    for(let student of students[classLetter]){
                        let _rec = student.records.find((rec, index)=>{
                            if(rec._id == record._id) return true
                        })

                        if(!record.sum[student.class.class]) {
                            record.sum[student.class.class] = 0
                            byClass[student.class.class] = 0
                        }

                        record.sum[student.class.class] += ((!_rec) ? 0 : _rec.mark)

                    }
                    
                    record.sum[classLetter] = (record.sum[classLetter]/students[classLetter].length)/(record.max*0.01)
                    byClass[classLetter] += record.sum[classLetter]


                }
            }
            worstClass.mark = Object.values(byClass)[0]
            worstClass.className = `Year ${year} ${Object.keys(byClass)[0]}`
            bestClass.mark = Object.values(byClass)[0]
            bestClass.className = `Year ${year} ${Object.keys(byClass)[0]}`

            for(let classLetter of Object.keys(byClass)){
                if(byClass[classLetter] > bestClass.mark){
                    bestClass.mark = byClass[classLetter]
                    bestClass.className = `Year ${year} ${classLetter}`
                }
                if(byClass[classLetter] < worstClass.mark){
                    worstClass.mark = byClass[classLetter]
                    worstClass.className = `Year ${year} ${classLetter}`
                    console.log(worstClass.className)
                }
            }

            let labels = classes.map(x => `Y${year}${x}`)
            let datasets = recordNames.map(x => {
                return {
                    label: x.name, 
                    data: Object.values(x.sum),
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.9)',
                        'rgba(54, 162, 235, 0.9)',
                        'rgba(255, 206, 86, 0.9)',
                        'rgba(75, 192, 192, 0.9)',
                        'rgba(153, 102, 255, 0.9)',
                        'rgba(255, 159, 64, 0.9)',
                        "#3F7CAC"
                    ],
                    borderRadius: 3
                }
            })

            
            let options = {
                scales: {
                    y: {
                        min: 0,
                        max: 100,
                    }
                }
            }

            let dataForChart = {
                type: 'bar',
                data: {
                    labels,
                    datasets
                },
                options
            }

            //Checking for the worst class and best class

            
            let Statistic = document.createElement('div')
            Statistic.className = "Statistic"
            let canvas = document.createElement('canvas')
            canvas.style.width = "100%"
            canvas.style.maxWidth = "50%"
            canvas.style.maxHeight = "400px"

            let Summary = document.createElement('div')
            Summary.setAttribute("for", subject)
            Summary.className = "Summary"
            console.log(bestClass, worstClass)
            Summary.innerHTML = `
                <h1>Summary</h1>
                <div class="Best">
                    <h3>Best Class</h3>
                    <div class="infoPiece">
                        <span>Class:</span>
                        <span>${bestClass.className}</span>
                    </div>
                    <div class="infoPiece">
                        <span>Marks:</span>
                        <span>${Math.round(bestClass.mark*10)/10}%</span>
                    </div>
                </div>
                <div class="Worst">
                    <h3>Worst Class</h3>
                    <div class="infoPiece">
                        <span>Class:</span>
                        <span>${worstClass.className}</span>
                    </div>
                    <div class="infoPiece">
                        <span>Marks:</span>
                        <span>${Math.round(worstClass.mark*10)/10}%</span>
                    </div>
                </div>
            `

            new Chart(canvas, dataForChart, options)

            Statistic.appendChild(canvas)
            Statistic.appendChild(Summary)
            document.querySelector('.Statistics').appendChild(Statistic)

        }
    }
})
.catch(e=>{
    console.log(e)
})