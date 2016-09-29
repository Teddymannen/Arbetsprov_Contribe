var apiurl, myresult, apiurl_size, selected_size, searchtext, container;

function image_search() {
	searchtext = document.getElementById("mySearch").value;
	apiurl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=108ed65e1bb3f978ef07ca07e58754a2&text=" + searchtext + "&per_page=10&format=json&nojsoncallback=1";
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
								p.className = "unmarked";
								p.onclick = image_mark;
								var a = document.createElement("A");
								a.href = "#";
								var img = document.createElement("IMG");
								img.src = myresult_size.source;
								img.className = "flickr_image";
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

function image_mark() {
	if (this.className === "unmarked") {
		this.className = "marked";
		return false;
	} else {
		this.className = "unmarked";
		return false;
	}
}

function image_filter() {
	var unmarked = document.getElementsByClassName("unmarked");
	while (unmarked[0]) {
		unmarked[0].parentNode.removeChild(unmarked[0]);
	}

	var flickr_images = document.getElementsByClassName("flickr_image");
	for (var i = 0; i < flickr_images.length; i++) {
		var image_source = flickr_images[i].src;
		var flickr_without_size = image_source.slice(0, -6);
		var flickr_size = image_source.slice(-6, 9999);
		if (flickr_size !== "_s.jpg") {
			flickr_images[i].src = flickr_without_size + "_s.jpg";
		}
	}

	var flickr_gallery = document.getElementsByClassName("marked");
	while (flickr_gallery[0]) {
		// flickr_gallery[0].setAttribute("onclick", "image_larger()");
		flickr_gallery[0].onclick = image_larger;
		flickr_gallery[0].className = "gallery";
	}
}
function image_larger() {
	if (this.className === "gallery") {
		var gallery_image = this.getElementsByClassName("flickr_image");
		var image_source = gallery_image[0].src;
		var flickr_without_size = image_source.slice(0, -6);
		var flickr_size = image_source.slice(-6, 9999);
		if (flickr_size !== "_z.jpg") {
			gallery_image[0].src = flickr_without_size + "_z.jpg";
			return false;
		}
		else {
			gallery_image[0].src = flickr_without_size + "_s.jpg";
			return false;
		}
	}
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