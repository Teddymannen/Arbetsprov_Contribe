var apiurl, myresult, apiurl_size, selected_size, searchtext, container;

function image_search() {
	searchtext = document.getElementById("mySearch").value;
	apiurl = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=108ed65e1bb3f978ef07ca07e58754a2&text=" + searchtext + "&per_page=50&format=json&nojsoncallback=1";
	container = document.getElementById("container");
	selected_size = 150; // Initial image size (width).

	container.innerHTML = ""; // clear the container before searching for more images.
	document.getElementById("note2_p").style.visibility = "hidden";
	document.getElementById("note2_p").style.position = "absolute";
	document.getElementById("note_p").style.visibility = "visible";
	document.getElementById("note_p").style.position = "static";


	var request = new XMLHttpRequest();
	request.open("GET", apiurl, true);

	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
	    	// Request successful!
	    	var json = JSON.parse(request.responseText);
	    	json.photos.photo.forEach(function(myresult, i) {
	    		apiurl_size = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=108ed65e1bb3f978ef07ca07e58754a2&photo_id=" + myresult.id + "&format=json&nojsoncallback=1";

	    		var request = new XMLHttpRequest();
				request.open("GET", apiurl_size, true);

				request.onload = function() {
					if (request.status >= 200 && request.status < 400) {
						// Request successful!
				    	var size = JSON.parse(request.responseText);
				    	size.sizes.size.forEach(function(myresult_size, i) {
				    		if (myresult_size.width == selected_size) {
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
				    	// We reached our target server, but it returned an error.
				    	alert("The server has been reached but another problem occured.");
					}
				};
				request.onerror = function() {
					// There was a connection error of some sort.
					alert("Connection problems.");
				};
				request.send();
			});
		} else {
	    	// We reached our target server, but it returned an error.
	    	alert("The server has been reached but another problem occured.");
		}
	};
	request.onerror = function() {
		// There was a connection error of some sort.
		alert("Connection problems.");
	};
	request.send();
}

function image_mark() { // Toggle the classname between 'unmarked' and 'marked'.
	if (this.className === "unmarked") {
		this.className = "marked";
		return false;
	} else {
		this.className = "unmarked";
		return false;
	}
}

function image_filter() { // Filters away all images that hasn't been marked.
	document.getElementById("note_p").style.visibility = "hidden";
	document.getElementById("note_p").style.position = "absolute";
	document.getElementById("note2_p").style.visibility = "visible";
	document.getElementById("note2_p").style.position = "static";

	var unmarked = document.getElementsByClassName("unmarked"); // Removing all non-marked p-elements.
	while (unmarked[0]) {
		unmarked[0].parentNode.removeChild(unmarked[0]);
	}

	var flickr_images = document.getElementsByClassName("flickr_image"); // Changing the size of each image that is selected for the gallery.
	for (var i = 0; i < flickr_images.length; i++) {
		var image_source = flickr_images[i].src;
		var flickr_without_size = image_source.slice(0, -6);
		var flickr_size = image_source.slice(-6, 9999);
		if (flickr_size !== "_s.jpg") {
			flickr_images[i].src = flickr_without_size + "_s.jpg";
		}
	}

	var flickr_gallery = document.getElementsByClassName("marked"); // Changing class name from 'marked' to 'gallery'.
	while (flickr_gallery[0]) {
		flickr_gallery[0].onclick = image_larger;
		flickr_gallery[0].className = "gallery";
	}
}

function image_larger() { // Enlarging the selected image if it's small and minimizing it if it's big.
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