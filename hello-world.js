const axios = require('axios');

// See the axios GitHub here: https://github.com/axios/axios

// Make a request for a user with a given ID
axios.get('https://cat-fact.herokuapp.com/facts/')
  .then(function (response) {
    // handle success
    console.log(response);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .finally(function () {
    // always executed
  });


  // POST Request example
 /*
  axios.post('https://some.api.somewhere', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  }); 
  */