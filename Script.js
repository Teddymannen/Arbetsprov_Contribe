var apiurl, myresult, apiurl_size, selected_size, searchtext, container;

function flickr_ing() {
	searchtext = document.getElementById("mySearch").value;
	apiurl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=108ed65e1bb3f978ef07ca07e58754a2&text=" + searchtext + "&url_q&per_page=10&format=json&nojsoncallback=1";
	container = document.getElementById("container");
	selected_size = 150;

	container.innerHTML = ""; // clear the container before searching for more images.

	var request = new XMLHttpRequest();
	request.open("GET", apiurl, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
	    	// Success!
	    	var json = JSON.parse(request.responseText);
	    	json.photos.photo.forEach(function(myresult, i) {
	    		apiurl_size = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=108ed65e1bb3f978ef07ca07e58754a2&photo_id=" + myresult.id + "&format=json&nojsoncallback=1";

	    		var request = new XMLHttpRequest();
				request.open('GET', apiurl_size, true);

				request.onload = function() {
					if (request.status >= 200 && request.status < 400) {
				    	// Success!
				    	var size = JSON.parse(request.responseText);
				    	size.sizes.size.forEach(function(myresult_size, i) {
				    		if (myresult_size.width == selected_size) {
								// container.appendChild('<p><a href="' + myresult.url + '" target="_blank"><img src="' + myresult.source + '"/></a></p>');
								var p = document.createElement("P");
								var a = document.createElement("A");
								a.href = myresult_size.url;
								a.target = "_blank";
								var img = document.createElement("IMG");
								img.src = myresult_size.source;
								a.appendChild(img);
								p.appendChild(a);
								container.appendChild(p);
							}
						});
					} else {
				    // We reached our target server, but it returned an error
					}
				};
				request.onerror = function() {
					// There was a connection error of some sort
				};
				request.send();
			});
		} else {
	    	// We reached our target server, but it returned an error
		}
	};
	request.onerror = function() {
		// There was a connection error of some sort
	};
	request.send();
}

// $(document).ready(function(){
// 	$('#button').click(function(){
// 		$.getJSON(apiurl,function(json){
// 			$.each(json.photos.photo,function(i,myresult){
// 				apiurl_size = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=ca370d51a054836007519a00ff4ce59e&photo_id="+myresult.id+"&format=json&nojsoncallback=1";
// 				$.getJSON(apiurl_size,function(size){
// 					$.each(size.sizes.size,function(i,myresult_size){
// 						if(myresult_size.width==selected_size){
// 							$("#results").append('<p><a href="'+myresult_size.url+'" target="_blank"><img src="'+myresult_size.source+'"/></a></p>');
// 						}
// 					})
// 				})
// 			});
// 		});
// 	});
// });

/* 
Reference?

var request = require("superagent");

/**
  * @constructor
  * /

module.exports = Client;

function Client(api_key) {
	this.params = {};
	this.params.api_key = "108ed65e1bb3f978ef07ca07e58754a2";
	this.params.format = "json";
	this.params.nojsoncallback = 1;
}

Client.prototype = Object.create(null);

Client.prototype.search = function (text, done) {
	request("GET", "https://api.flickr.com/services/rest")
	.query("method=flickr.photos.search")
	.query("text=" + text)
	.query(this.params)
	.end(done);
};
*/