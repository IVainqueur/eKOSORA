const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Y1A', 'Y1B', 'Y2A', 'Y2B', 'Y3A', 'Y3B'],
        datasets: [{
            label: 'Discipline average/ 100%',
            data: [10, 92, 73, 75, 52, 93],
            backgroundColor: [
                // 'rgba(255, 99, 132, 0.9)',
                // 'rgba(54, 162, 235, 0.9)',
                // 'rgba(255, 206, 86, 0.9)',
                // 'rgba(75, 192, 192, 0.9)',
                // 'rgba(153, 102, 255, 0.9)',
                // 'rgba(255, 159, 64, 0.9)'
                "#3F7CAC"
            ],
            borderColor: [
                // 'rgba(255, 99, 132, 1)',
                // 'rgba(54, 162, 235, 1)',
                // 'rgba(255, 206, 86, 1)',
                // 'rgba(75, 192, 192, 1)',
                // 'rgba(153, 102, 255, 1)',
                // 'rgba(255, 159, 64, 1)'
                "#3F7CAC"
            ],
            borderWidth: 2
        }]
    },
    options: {
        // scales: {
        //     y: {
        //         beginAtZero: true
        //     }
        // }
    }
});