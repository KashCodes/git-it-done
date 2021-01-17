// This Script is solely to help create the functions needed for the 'single-repo.html' page. Pulling the repo's individual issues. //
//-------------------------------------------// 


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
        console.log(data);
      });
    }
    // if the request wasn't ok/true/successful it will display this error msg. 
    else {
      alert("There was a problem with your request!");
    }
  });
};

getRepoIssues("facebook/react");