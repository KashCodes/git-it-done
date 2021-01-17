var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
         /* 'fetch' is an HTTP request from the app, and response came from the requested server (GitHub's API). The 'fetch' returns an 'object' called a 'promise'. A 'promise' has a 'then()' function when it is fulfilled. */
  fetch(apiUrl).then(function(response) {
        /* The promise is returned in the 'response'. This 'response' logic has a method called 'json()'. The method formats the response as JSON. ***In situations where a resource may return non-JSON data, they would use a different method such as 'text()'.*** */
        /* The 'json()' method returns another 'promise', hence the extra 'then()' method, whose callback function captures the actual data. */
    response.json().then(function(data) {
      console.log(data);
    });
  });
};