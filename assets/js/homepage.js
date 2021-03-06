// GLOBAL VARIABLES //
// Variables to store and reference the search form submissions.
/*  The variables reference the 'id' values from the <input> feilds in the form. w/ these variables all entries will be captured for future reference */
// references the form
var userFormEl = document.querySelector("#user-form");
// references the input/values from the form
var nameInputEl = document.querySelector("#username");

//variables to append info to HTML
// Variable to display all the results pulled from the search in an empty <div> in the HTML
var repoContainerEl = document.querySelector("#repos-container");
// Variable to write the search term used we pulled from the search to an empty <span> element in the HTML
var repoSearchTerm = document.querySelector("#repo-search-term");

//Variable to listen for the language button clicks
var languageButtonsEl = document.querySelector("#language-buttons");

// function created to we're grabbing a GitHub username. It will execute the event upon form submission by the global event listener.
var formSubmitHandler = function (event) {
  // This stops the browser from performing the default action the event wants to do.
  /* In this case it prevents the browser from sending the forms input data to a URL. We will handle what happens witht he form input data ourselves in Javascript. */
  event.preventDefault();
  // get value from input element
  /* This creates a local variable 'username' that = the global variable 'nameInputEl', then uses the '.value' property to return the value from the 'nameInputEl' form submission. The form submission returns as a string where we use the '.trim' method to remove whitespace from both sides of it.   */
  var username = nameInputEl.value.trim();

  // if loop ensures the 'nameInputEl' isn't blank. If it is an alert will display instructing the user to enter a GitHub username.
  /* This argument takes the 'username' and passes it through it's own argument 'getUserRepos' to ensure the value isn't blank.  */
  if (username) {
    // clear old content
    getUserRepos(username);
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }
};

// Variable to handle language button clicks
var buttonClickHandler = function (event) {
  //Variable that grabs the event listener for button clicks, and uses '.getAttribute' to pull the attribute for the specific button that was clicked.
  var language = event.target.getAttribute("data-language");

  // if loop reacts if a 'language' was found.
  if (language) {
    //calls the 'getFeaturesRepos' function for the language defined.
    getFeaturedRepos(language);

    // clears old content that might still be in the search repo feild.
    repoContainerEl.textContent = "";
  }
};

// function to fetch user repos from the GitHub API using Fetch API 'promises'.
var getUserRepos = function (user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url using Fetch API
  /* 'fetch' is an HTTP request from the app specified as 'apiUrl' above, and the response comes from the requested server (GitHub's API). The 'fetch' returns an 'object' called a 'promise', this is pending until it is fulfilled with a 'then()'. This 'promise' is called twice in this function and has a '.then' for each call to the 'promise'. The first is used to pull the data and the second stores it. */
  fetch(apiUrl)
    .then(function (response) {
      // an if loop is created to ensure we have an error message displayed if the username that was searched doesn't exist.
      if (response.ok) {
        // If the 'response' pulls a valid result/username aka 'ok'/true it runs the following.
        /* The promise is returned in the 'response'. This 'response' logic has a method called 'json()'. The method formats the response as JSON. ***In situations where a resource may return non-JSON data, they would use a different method such as 'text()'.***    */
        /* The 'json()' method returns another 'promise', hence the extra 'then()' method, whose callback function captures the actual data. This JSON data is then sent to the function 'displayRepos()'. This will send the repo data that was fetched and the username submitted. (data, user) */
        response.json().then(function (data) {
          displayRepos(data, user);
        });

        // if the 'response' is an invalid/false username the following alert/error message will display.
      } else {
        /* 'alert' window will show "Error: " and status of the response   */
        alert("Error: " + response.statusText);
      }
    })

    // '.catch()' is Fetch API's way of handling network errors. If the '.then()' method fails or rejects the fetched 'promise', this will run and display the following alert message.
    .catch(function (error) {
      // Notice this `.catch()` getting chained onto the end of the `.then()` method
      alert("Unable to connect to GitHub");
    });
};

// function that accepts a language parameter, creates an API endpoint, and makes an HTTP request to that endpoind using 'fetch()'
/* in the 'apiUrl' variable below it uses different types of 'query parameters'. This is first done with a GitHub documentation specific one, '?q='. The q is referencing a string of qualifiers when it comes to GitHub API. Then we add the search 'keyword' which is '+ langauge'. This will eventually be filled in by a button click. We then add the '+is:featured" which is the qualifier that tells the API we only want repo's that feature the next type of search parameter. We seprate the search query parameters by using '&' symbol between each parameter in the URL. The final parameter is using the 'sort=' paramter which GitHub documentation gives us several options to choose from, but we will be using the 'sort=help-wanted-issues' parameter.   */
/*  To summerize, there are 3 query parameters in effect here. The first '?q=' that says go through all the string of qualifiers and search for the keyword 'languages'. Then we add a second qualifier using the '+isfeatured' parameter. Seperate this parameter and the keyword value for it with '&'. Finally, the keyword value is going to be a third specified parameter, narrowing it down even more by using a GitHub specific parameter called 'sort='. Then out of our GitHub options available for this 'sort' we chose 'sort=help-wanted-issues'  */
var getFeaturedRepos = function (language) {
  var apiUrl =
    "https://api.github.com/search/repositories?q=" +
    language +
    "+is:featured&sort=help-wanted-issues";

  // Fetch is grabbing the 'apiUrl' pending object promise and fulfilling it with a '.then()' function. This intial call is the entire HTTP response and not the JSON.
  fetch(apiUrl).then(function (response) {
    // If the response is 'ok'/true it runs the next line.
    if (response.ok) {
      // We have to call the promise a 2nd time to store it using 'response'. This time we convert it using '.json()' method. This extracts the JSON from the response. Every promise is pending until we use the '.then()' function to fulfill it. Finally, this new JSON is stored as a callback function called 'data'.
      response.json().then(function (data) {
        // we call the 'displayRepos' function to display the 'data' property '.items'. The value we want to pull from the '.items' property is called 'language'.
        displayRepos(data.items, language);
      });
    }
    // if there is an issue with response being false then it will display the "Error: " with the status of the false response.
    else {
      alert("Error: " + response.statusText);
    }
  });
};

// This function will accept the array of the repository data and the term we searched for as parameters and display it in the HTML with proper titles.
var displayRepos = function (repos, searchTerm) {
  // if loop to check if api returned any repos. If no repo's are found it will state that.
  /* If the repo length/count IS equal to 0, then the following '.textContent' property will display "no repositories found."   */
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    // return runs/calls this if loop and stops it from repeating/looping itself.
    return;
  }

  // // clear old content before running new search.
  // repoContainerEl.textContent = "";
  repoSearchTerm.textContent = searchTerm;

  // loop over repos using for loop as many times as the repos length is. Length is the number of repo's being pulled total.
  for (var i = 0; i < repos.length; i++) {
    // format repo name
    /* for each loop in the repo it will display the owner/login name split with a "/" then the repos name. This will now be referred to as the 'repoName'. */
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    /* The next few variables will be created for each 'repoName' created. i.e. Every repo assigned to the username.  */
    // create a container for each repo in a <a> name this variable 'repoEl'
    var repoEl = document.createElement("a");
    // assign this new <a> element the following classes using '.classList' attribute.
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    // assign an 'href' attribute to link each 'repoEl' name. Link it to the 'sing-repo.html' that shows all the issues assigned to said 'repoName'. We connect this using the '?repo=' + 'repoName' called a 'query parameter' through this URL/href.
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);

    // create a <span> element to hold repository name in a variable called 'titleEl' inside each of the 'repoEl' <div> element.
    var titleEl = document.createElement("span");
    // each 'repoEl' <div> container will display the 'repoName' variable created above in the initial for loop using the '.textContent' property to set the Repo name as a title.
    titleEl.textContent = repoName;

    // append to container - Puts the <span> title inside each <div> container created.
    repoEl.appendChild(titleEl);

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
        "<i class='fas fa-times status-icon icon-danger'></i>" +
        repos[i].open_issues_count +
        " issue(s)";
    } else {
      /* If there are 0 open issues it will instead show the following class icon's.   */
      statusEl.innerHTML =
        "<i class='fas fa-check-square status-icon icon-success'></i>";
    }

    // appends the status count and/or icon <span> to the 'repoEl' <div> container.
    repoEl.appendChild(statusEl);

    // appends the full <div> container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

//Event listener for the language button clicks
languageButtonsEl.addEventListener("click", buttonClickHandler);

// Event listener for 'userFormEl' variable when the form is submit it will execute the 'formSubmitHandler' function.
userFormEl.addEventListener("submit", formSubmitHandler);
