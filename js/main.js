/***************
 AJAX REQUESTS
 ***************/

var userQuery;
var searchURL;
var extractsURL;
var newJSON = [];

//When input is submited
$('.search').submit(function (e) {
  e.preventDefault();

  //get value from input
  userQuery = $('form input[type="text"]').val();

  //put that value in the url
  searchURL = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=&list=search&srsearch=' + userQuery;

  //remove child nodes of articles
  $('.articles').empty();

  var searchRequest = $.ajax({
    url: searchURL,
    method: 'GET',
    dataType: 'jsonp'
  }).done(getSearch);
});

function getSearch(data) {

  extractsURL = searchURL += '&prop=extracts&exsentences=2&exlimit=max&exintro=1&explaintext=1&titles=';

  //for each result in the searchRequest
  for (var i = 0; i < data.query.search.length; i++) {
    //get title and attach it to the extractsURL
    var newTitle = data.query.search[i].title;
    extractsURL += newTitle + '%7C';
  }

  var extractsRequest = $.ajax({
    url: extractsURL,
    method: 'GET',
    dataType: 'jsonp'
  }).done(getExtracts);
}

function getExtracts(data) {
  //start with empty array
  newJSON = [];

  //for each article
  for (var articles in data.query.pages) {
    //get values
    var title = data.query.pages[articles].title;
    var extract = data.query.pages[articles].extract;
    var articleID = data.query.pages[articles].pageid;

    //put values in object
    var article = {
      "title": title,
      "extract": extract,
      "id": articleID
    };

    //push object to the newJSON array
    newJSON.push(article);
  };
  //remove last item
  newJSON.pop();
  putArticles();
}


/***************
 APPEND DATA
 ***************/
function putArticles() {
  var articles = $('.articles');
  for (var i = 0; i < newJSON.length; i++) {
    var html = '<div class="article group">';
    html += '<h1><a target="_blank" href="https://en.wikipedia.org/?curid=' + newJSON[i].id + '">';
    html += newJSON[i].title + '</a></h1>';
    html += '<p>' + newJSON[i].extract + '</p></div>';
    articles.append(html);
  }
}
