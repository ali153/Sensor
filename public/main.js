const form = document.getElementById('vote-form');

// Form Submit Event

form.addEventListener('submit', e => {

    let data = { ID: "dev1", temp: 80 };

    fetch('http://192.168.2.9:3000/poll', {
      method: 'post',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
      e.preventDefault();
  
});

fetch('http://192.168.2.9:3000/poll')
  .then(res => res.json())
  .then(data => {
    const votes = data.votes;

    // Refresh the Total Votes every 2 seconds
    setInterval(() => {
      fetch('http://192.168.2.9:3000/poll')
        .then(res => res.json())
        .catch(err => console.log(err));
    }, 2000);




    let dataPoints=[];
    for (i = 0; i < 10; i++) { 
      dataPoints[i]={label: i , y : votes[9-i].temp};
  }

 
    const chartContainer = document.querySelector('#chartContainer');

    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        data: [
          {
            type: 'line',
            dataPoints: dataPoints
          }
        ]
      });
      chart.render();

      // Enable pusher logging - don't include this in production
      Pusher.logToConsole = true;

      var pusher = new Pusher('9ce246bee0bf8c403b62', {
        cluster: 'eu',
        encrypted: true
      });

      var channel = pusher.subscribe('ID-poll');
      channel.bind('ID-vote', function(data) {
        console.log(data);

        for(i = 1;i<10;i++){
          dataPoints[i-1]={label: i , y : dataPoints[i].y};
        }
        dataPoints[9]={label:0 , y : data.temp};
        //console.log(dataPoints);
        chart.render();
      });
    }
  });
