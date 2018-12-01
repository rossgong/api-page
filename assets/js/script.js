var topics = ["Godspeed You! Black Emperor", "Chistina Vantzou", "Youth Code", "ops", "Museum Mouth", "Denzel Curry", "Frigs", "Moaning", "HIDE", "Angel Olsen", "Bobby Shmurda"];

var omdb = {
	baseURL: "https://www.omdbapi.com/",
	query: "?y=&plot=short&t=",
	//TODO: change this key to a personal key
	apiKey: "trilogy",


	populateImages: function (topic) {

		var imageContainer = $("#image-container");
		$.ajax({
			url: this.constructURL(topic),
			method: "GET"
		}).then(function (response) {
			var movieTile = $("<div>", {
				class: "movie-tile tile",
			});

			console.log(response);

			if (response.Response == "True") {

				var poster = $("<h2>").text("No Poster Available");

				if (response.Poster !== "N/A") {
					poster = $("<img>", { src: response.Poster, class: "poster-img" });
				}

				movieTile.append(poster);
				movieTile.append($("<h1>").text(response.Title));


				movieTile.append($("<p>").text(response.Plot));
				movieTile.append($("<a>", { href: ("https://www.imdb.com/title/" + response.imdbID), target: "_blank" }).text("More Details"))
			} else {
				movieTile.append($("<h2>").html(topic + "<br>movie not found"));
			}

			var footer = $("<div>", { class: "tile-footer movie-footer" });
			var footerImg = $("<img>", { class: "footer-img", src: (omdb.baseURL + "favicon.ico") })
			footer.append($("<a>", { href: omdb.baseURL, class: "footer-link", target: "_blank" }).text("OMDB").prepend(footerImg));

			movieTile.append(footer);

			imageContainer.prepend(movieTile);
		});


	},

	constructURL: function (topic) {
		return this.baseURL + this.query + topic + "&apiKey=" + this.apiKey;
	},
}

var bands = {
	baseURL: "https://rest.bandsintown.com/",
	query: "artists/",
	//TODO: change this key to a personal key
	apiKey: "codingbootcamp",

	populateImages: function (topic) {
		var imageContainer = $("#image-container");
		$.ajax({
			url: this.constructURL(topic),
			method: "GET"
		}).then(function (response) {
			console.log(response);

			var bandTile = $("<div>", {
				class: "band-tile tile"
			});

			if (response === "") {
				bandTile.append($("<h2>").html(topic + "<br>is probably not a band"));
			} else {
				bandTile.append($("<img>", { src: response.image_url, class: "band-img" }));
				bandTile.append($("<h1>").text(response.name));
			}

			bandTile.append($("<p>").text("They have " + response.upcoming_event_count + " events coming up!"));
			bandTile.append($("<a>", { href: response.url, target: "_blank" }).text("Link"));

			var footer = $("<div>", { class: "tile-footer bands-footer" });
			var footerImg = $("<img>", { class: "footer-img", src: ("https://bandsintown.com/favicon.ico") })
			footer.append($("<a>", { href: "https://bandsintown.com", class: "footer-link", target: "_blank" }).text("Bands in Town").prepend(footerImg));

			bandTile.append(footer);

			imageContainer.prepend(bandTile);
		});
	},

	constructURL: function (topic) {
		return this.baseURL + this.query + topic + "?app_id=" + this.apiKey;
	},
}

var giphy = {
	baseURL: "https://api.giphy.com/v1/",
	query: "gifs/search",
	//TODO: change this key to a personal key
	apiKey: "dc6zaTOxFJmzC",

	populateImages: function (topic) {
		var imageContainer = $("#image-container");
		$.ajax({
			url: this.constructURL(topic),
			method: "GET"
		}).then(function (response) {
			var data = response.data;
			console.log(data);

			if (data.length === 0) {
				console.log("here");
				var imageTile = $("<div>", {
					class: "image-tile tile",
					"data-still": "",
					"data-animated": "",
					"data-state": "still"
				});
				imageTile.append($("<h2>").html(topic + "<br>gifs not found"));
				imageContainer.prepend(imageTile);
			} else {
				//Use this array so I can prepend the tiles in reverse order that they come in to ensure most relevant images are first
				var tiles = [];

				data.forEach(gif => {
					var imageTile = $("<div>", {
						class: "image-tile tile",
						"data-still": gif.images.fixed_height_still.url,
						"data-animated": gif.images.fixed_height.url,
						"data-state": "still"
					});

					//gifContainer contins the gif and any overlays
					var gifContainer = $("<div>", { class: "gif-container" });
					gifContainer.append($("<img>", { src: gif.images.fixed_height_still.url }));
					gifContainer.append($("<div>", { class: "gif-overlay gif-rating-div" }).text(gif.rating.toUpperCase()));

					//I have to dynamically set the width with the CSS to amke it display properly. I like this solution more than the table solution
					//and it is more resiliant than the <figure> solution also used it to provide an ability to show/hide title on hover.

					gifContainer.append($("<div>", { class: "gif-title-div gif-overlay" }).text(gif.title)
						.css({ width: gif.images.fixed_height_still.width, opacity: 0 }));

					imageTile.append(gifContainer);

					if (gif.source_tld === "") {
						gif.source_tld = "Not Available";
					}

					imageTile.append($("<div>", { class: "gif-src-div" }).text("Source: " + gif.source_tld));
					imageTile.append($("<a>", { class: "gif-dl-btn", href: gif.images.original.url.replace(/media[0-9]/i, "i"), target: "_blank" }).text("Link"));
					imageTile.append($("<br>"));

					var footer = $("<div>", { class: "tile-footer gif-footer" });
					var footerImg = $("<img>", { class: "footer-img", src: ("https://giphy.com/favicon.ico") });
					footer.append($("<a>", { href: "https://giphy.com", class: "footer-link", target: "_blank" }).text("Giphy").prepend(footerImg));

					imageTile.append(footer);

					tiles.unshift(imageTile);
				});

				tiles.forEach(tile => {
					imageContainer.prepend(tile);
				});

				//Hover function shows title on mouseenter and rehides on mouseleave
				$(".image-tile").on({
					click: function (event) {
						giphy.toggleAnimation($(this));
					},

					mouseenter: function (event) {
						$(this).children().children(".gif-title-div").css({ opacity: .75 });
					},

					mouseleave: function (event) {
						$(this).children().children(".gif-title-div").css({ opacity: 0 });
					}
				});
			}
		});
	},

	constructURL: function (topic) {
		return this.baseURL + this.query + "?limit=10&q=" + topic + "&apiKey=" + this.apiKey;
	},

	toggleAnimation: function (div) {
		if (div.attr("data-state") === "still") {
			div.attr("data-state", "animated");

			div.children().children("img").attr("src", div.attr("data-animated"));
		} else if (div.attr("data-state") === "animated") {
			div.attr("data-state", "still");

			div.children().children("img").attr("src", div.attr("data-still"));
		}
	}
}

function populateButtons() {
	var buttonContainer = $("#button-container").html("");
	topics.forEach(topic => {
		var topicDiv = $("<div>", { class: "topic-tile tile" }).text(topic);
		var buttonDiv = $("<div>", { class: "button-div" }).appendTo(topicDiv);



		buttonDiv.append($("<button>", { class: "giphy-button btn", "data-topic": topic }).text("giphy"));
		buttonDiv.append($("<button>", { class: "ombd-button btn", "data-topic": topic }).text("OMBD"));
		buttonDiv.append($("<button>", { class: "bands-button btn", "data-topic": topic }).text("Bands"));

		buttonContainer.append(topicDiv);
	});

	$(".giphy-button").on("click", function (event) {
		giphy.populateImages($(this).attr("data-topic"));
	});

	$(".ombd-button").on("click", function (event) {
		omdb.populateImages($(this).attr("data-topic"));
	});

	$(".bands-button").on("click", function (event) {
		bands.populateImages($(this).attr("data-topic"));
	});
}

$(document).ready(function () {
	populateButtons();

	$("#submit-topic-button").on("click", event => {

		var topic = $("#topic-form").val();


		if (topic !== "") {
			topics.push(topic);
			$("#topic-form").val("");
			populateButtons();
		}

		return false;
	});
});
