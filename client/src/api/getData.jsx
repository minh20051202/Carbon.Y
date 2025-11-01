fetch('http://localhost:3000/api/v1/batches/get/?limit=10&page=1')
    .then(response => response.json())
    .then(data => {
      console.log('Fetched batch data:', data);
    })
    .catch(error => {
      console.error('Error fetching batch data:', error);
    });