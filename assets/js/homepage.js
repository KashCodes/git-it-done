// GLOBAL VARIABLES //
// Variables to store and reference the form submissions.
        /*  The variables reference the 'id' values from the <input> feilds in the form. w/ these variables all entries will be captured for future reference */
// references the form
var userFormEl = document.querySelector("#user-form");
// references the input/values from the form
var nameInputEl = document.querySelector("#username");

// Variable to display all the results pulled from the search in an empty <div> in the HTML
var repoContainerEl = document.querySelector("#repos-container");
// Variable to write the search term used we pulled from the search to an empty <span> element in the HTML
var repoSearchTerm = document.querySelector("#repo-search-term");


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


// This function will accept the array of the repository data and the term we searched for as parameters and display it in the HTML with proper titles.
var displayRepos = function(repos, searchTerm) {
  // clear old content before running new search.
  repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos using for loop as many times as the repos length is. Length is the number of repo's being pulled total. 
  for (var i = 0; i < repos.length; i++) {
  // format repo name
        /* for each loop in the repo it will display the owner/login name split with a "/" then the repos name. This will now be referred to as the 'repoName'. */
  var repoName = repos[i].owner.login + "/" + repos[i].name;

        /* The next few variables will be created for each 'repoName' created. i.e. Every repo assigned to the username.  */
  // create a container for each repo in a <div> name this variable 'repoEl'
  var repoEl = document.createElement("div");
  // assign this new <div> element the following classes using '.classList' attribute.
  repoEl.classList = "list-item flex-row justify-space-between align-center";

  // create a <span> element to hold repository name in a variable called 'titleEl' inside each of the 'repoEl' <div> element.
  var titleEl = document.createElement("span");
  // each 'repoEl' <div> container will display the 'repoName' variable created above in the initial for loop using the '.textContent' property to set the Repo name as a title. 
  titleEl.textContent = repoName;

  // create a status element to show how many issues each repo has in GitHub
  // creates new variable 'statusEl' that creates a <span> element.
  var statusEl = document.createElement("span");
  // assigns this new <span> element with the following classes using the '.classList' attribute.
  statusEl.classList = "flex-row align-center";

  // if loop to check if current repo has issues or not
       /* for each repo the first if loop pulls 'repos[i]', it will check and see if the '.open_issues_count' property is greater than 0.   */
  if (repos[i].open_issues_count > 0) {
        /* if the repo has open issues it will edit the '.innerHTML' of the 'statusEl' <span> with the following icon class settings. It will also display the total count of the open " issue(s)"   */
    statusEl.innerHTML =
      "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
  } else {
        /* If there are 0 open issues it will instead show the following class icon's.   */
    statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
  }

  // append to container - Puts the <span> title inside each <div> container created.
  repoEl.appendChild(titleEl);

  // appends the status count and/or icon <span> to the 'repoEl' <div> container.
  repoEl.appendChild(statusEl);

  // appends the full <div> container to the dom
  repoContainerEl.appendChild(repoEl);
}

  console.log(repos);
  console.log(searchTerm);
};








// Event listener for 'userFormEl' variable when the form is submit it will execute the 'formSubmitHandler' function.
userFormEl.addEventListener("submit", formSubmitHandler);        