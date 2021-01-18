// This Script is solely to help create the functions needed for the 'single-repo.html' page. Pulling the repo's individual issues. //
//-------------------------------------------// 

// GLOBAL VARIABLES // 
// Variable to append the '#issue-container' <div>
var issueContainerEl = document.querySelector("#issues-container");

// Function created to pull Repo Issues from GitHub API
var getRepoIssues = function(repo) {
  // format the GitHub API to pull the repo's indiviual issues. This is a different format than the one used in the 'getUserRepos' function on the 'homepage.js' file. 
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // Using the Fetch API Method it is running the 'apiUrl' variable.
            /* fetch is running the 'apiUrl' specified above and pulling the information as an object called a 'promise'. A 'promise' pending unti it is fulfilled by a '.then()' When fetching data it needs to pulled twice. Once to grab it and another time to store it. The 'response' is the second 'promise' request which is why there is a second '.then()' function.  */
  fetch(apiUrl).then(function(response) {
    // the if loop is to ensure the request was successful/true/ok. Otherwise it will display an error. 
    if (response.ok) {
            /* The response is the second fetch mentioned above. This takes the 'promise' object and runs it through a method called 'json()'. This method formats the response as a JSON. The JSON returns the second pending 'promise' in the JSON format and fulfills it and stores it with the second '.then()' function    */
      response.json().then(function(data) {
        // pass response data to dom function that edits/appends the html with said data.
        displayIssues(data);
      });
    }
    // if the request wasn't ok/true/successful it will display this error msg. 
    else {
      alert("There was a problem with your request!");
    }
  });
};

// This function will help take the array of data pulled by 'getRepoIssues' and display them on the 'single-repo.html' file.
var displayIssues = function(issues) {
  //this if loop will check if there are 0 issues and if so display that accordingly. Then it will stop/'return' the function. 
  if (issues.length === 0) {
    // this global variables '.textContent' ill display the following content.
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }
  // for loop that looks over the repo pulled for issues. It does it for the '.length'/count of the issues each repo has. 
  for (var i = 0; i < issues.length; i++) {
    // create a link element to take users to the issue displayed on github through a different tab in the browser when clicked. 
    // creating the variable 'issueEl' that creates an <a> tag/element each time it is ran. 
    var issueEl = document.createElement("a");
    //the 'issueEl' <a> element is then assigned the following '.classList' attribute to style the <a> element. 
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    // 'issueEl' is now setting an additional attribute for a 'href'. This 'href' will be created for each issue '[i]' that has been looped over. The value of this 'href' is the '.html_url'.
    issueEl.setAttribute("href", issues[i].html_url);
    // 'issueEl' will have another attribute created for 'target' and the value will be '_blank'. When 'target="_blank"' is used in the same 'href' link it opens the link in a new browser tab instead of replacing the current page. 
    issueEl.setAttribute("target", "_blank");

    // Variable that creates <span> tag to hold issue title
    var titleEl = document.createElement("span");
    // 'titleEl' <span> is now assigned some '.textContent' inside. The content is ever looped '[i]' 'issues' '.title' property.
    titleEl.textContent = issues[i].title;

    // append each 'titleEl' to each 'issueEl' <a> container
    issueEl.appendChild(titleEl);

    // Variable that creates a type <span> element. They will be defined as either 'pull requests' or 'issue'
    var typeEl = document.createElement("span");

    // if loop to check if issue is an actual issue or a pull request
    // for every looped '[i]' issue that is a '.pull_request'
    if (issues[i].pull_request) {
      // the 'typeEl' '.textContent' will display "(Pull request)"
      typeEl.textContent = "(Pull request)";
    } else {
      // if it isn't a '.pull_request' the 'typeEl' '.textContent' will display "(Issue)"
      typeEl.textContent = "(Issue)";
    }

    // append 'titleEl' <span> to the 'issueEl' <a> container
    issueEl.appendChild(typeEl);

    // this appendChild will go into effect for every issue found in the following for loop to the empty <div> in the HTML
    issueContainerEl.appendChild(issueEl);
  }

  

};





getRepoIssues("facebook/react");