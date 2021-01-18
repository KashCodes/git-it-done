// This Script is solely to help create the functions needed for the 'single-repo.html' page. Pulling the repo's individual issues. //
//-------------------------------------------//

// GLOBAL VARIABLES //
// Variable to append the '#issue-container' <div> element.
var issueContainerEl = document.querySelector("#issues-container");
// Variable to append any pagination limitations to the '#limit-warning' <div> element.
var limitWarningEl = document.querySelector("#limit-warning");
// Variable to append the repo name to the header of the page to the '#repo-name' <span> element.
var repoNameEl = document.querySelector("#repo-name");

//function created to pull the Repo name from the index.html search.
var getRepoName = function () {
  // This variable is designed to extract the 'query parameter' that was created by the pageload from the 'index.html'. It is grabbing the document URL/'.location' and pulling the query parameter/'.search'
  var queryString = document.location.search;
  // This variable will pull the repo name out of the 'queryString'.
  /*  It will do so using the '.split()' method. Splitting the 'queryString' in two. Remember the 'queryString' looks something like '?repo=KashCodes/Code-Quiz'. It is going to just pull the user/repoName by splitting it at the "=". Then the value that it wants to call is the second element/section. Bc JS index starts at 0 we call '[1]'.   */
  var repoName = queryString.split("=")[1];
  // if condition to check if the 'repoName' exists otherwise it will not trigger the remaining conditions.
  if (repoName) {
    // this will append the header <span> to display the repoName.
    repoNameEl.textContent = repoName;
    //this will trigger the 'getRepoIssues' function
    getRepoIssues(repoName);
  }
  // if no 'repoName' exists it will redirect to the 'index.html' page.
  else {
    // rather than use the '.search' we are using '.replace' to redirect the page back to the index page.
    document.location.replace("./index.html");
  }
};

// Function created to pull Repo Issues from GitHub API
var getRepoIssues = function (repo) {
  // format the GitHub API to pull the repo's indiviual issues. This is a different format than the one used in the 'getUserRepos' function on the 'homepage.js' file.
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // Using the Fetch API Method it is running the 'apiUrl' variable.
  /* fetch is running the 'apiUrl' specified above and pulling the information as an object called a 'promise'. A 'promise' pending unti it is fulfilled by a '.then()' When fetching data it needs to pulled twice. Once to grab it and another time to store it. The 'response' is the second 'promise' request which is why there is a second '.then()' function.  */
  fetch(apiUrl).then(function (response) {
    // the if loop is to ensure the request was successful/true/ok. Otherwise it will display an error.
    if (response.ok) {
      /* The response is the second fetch mentioned above. This takes the 'promise' object and runs it through a method called 'json()'. This method formats the response as a JSON. The JSON returns the second pending 'promise' in the JSON format and fulfills it and stores it with the second '.then()' function    */
      response.json().then(function (data) {
        // pass response data to dom function that edits/appends the html with said data.
        displayIssues(data);

        // check if api has paginated (display limit) issues
        /* GitHub documentation states it limits requests at 30. However, it will actually supply a link header with more information if pagination limits exists in our data request.   */
        // if loop that takes 'promises' '.headers' property then uses the '.get()' request to check for the header labeled "Link" in the promise.
        if (response.headers.get("Link")) {
          //triggers 'displayWarning' function that displays a link to the selected repo's GitHub Issues page to see the rest of the issues available outside of the paginated display limit.
          displayWarning(repo);
        }
      });
    }
    // if the request wasn false/unsuccessful it will redirect the page to the index page just like in the 'getRepoName' function.
    else {
      document.location.replace("./index.html");
    }
  });
};

// This function will help take the array of data pulled by 'getRepoIssues' and display them on the 'single-repo.html' file.
var displayIssues = function (issues) {
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

// function created to display link if pagination limitations exist where it will only display a preset limit of data that is determined by the API.
var displayWarning = function (repo) {
  // add text to warning <div> container global variable reference
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  // in the same warning <div> container 'limitWarningEl' create a new variable 'linkEl' and create a new <a> element.
  var linkEl = document.createElement("a");
  //inside the new <a> tag display the following text
  linkEl.textContent = "GitHub.com";
  // make the above text a clickable link by assigning a 'href' attribute. The value/link will be a direct link to the selcted repo's GitHub issues page.
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  // set another 'target' attribute to open it in a new tab w/ "_blank". This happens with any link with 'target="_blank"' then opens in new browser tab.
  linkEl.setAttribute("target", "_blank");

  // append to warning <div> container
  limitWarningEl.appendChild(linkEl);
};

getRepoName();
