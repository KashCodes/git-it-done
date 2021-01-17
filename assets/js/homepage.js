var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
         /* 'fetch' is an HTTP request from the app, and response came from the requested server (GitHub's API). The 'fetch' returns an 'object' called a 'promise'. A 'promise' has a 'then()' function when it is fulfilled. */
  fetch(apiUrl).then(function(response) {
        /* The promise is returned in the 'response'. This 'response' logic has a method called 'json()'. The method formats the response as JSON. ***In situations where a resource may return non-JSON data, they would use a different method such as 'text()'.***    */
        /* The 'json()' method returns another 'promise', hence the extra 'then()' method, whose callback function captures the actual data. This JSON data is then sent to the function 'displayRepos()'. This will send the repo data that was fetched and the username submitted. (data, user) */
    response.json().then(function(data) {
      displayRepos(data, user);
    });
  });
};

// Variables to store and reference the form submissions.
        /*  The variables reference the 'id' values from the <input> feilds in the form. w/ these variables all entries will be captured for future reference */
var userFormEl = document.querySelector("#user-form");
var nameInputEl = document.querySelector("#username");

// function created to we're grabbing a GitHub username. It will execute the event upon form submission by the global event listener.
var formSubmitHandler = function(event) {
  // This stops the browser from performing the default action the event wants to do. 
        /* In this case it prevents the browser from sending the forms input data to a URL. We will handle what happens witht he form input data ourselves in Javascript. */
  event.preventDefault();
  // get value from input element
        /* This creates a local variable 'username' that = the global variable 'nameInputEl', then uses the '.value' property to return the value from the 'nameInputEl' form submission. The form submission returns as a string where we use the '.trim' method to remove whitespace from both sides of it.   */
  var username = nameInputEl.value.trim();

  // if loop ensures the 'nameInputEl' isn't blank. If it is an alert will display instructing the user to enter a GitHub username.
        /* This argument takes the 'username' and passes it through it's own argument 'getUserRepos' to ensure the value isn't blank.  */
  if (username) {
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
  console.log(event);
};


// This function will accept the array of the repository data and the term we searched for as parameters.
var displayRepos = function(repos, searchTerm) {
  console.log(repos);
  console.log(searchTerm);
};








// Event listener for 'userFormEl' variable when the form is submit it will execute the 'formSubmitHandler' function.
userFormEl.addEventListener("submit", formSubmitHandler);        