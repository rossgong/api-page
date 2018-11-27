var topics = ["chess", "checkers", "monopoly", "ticket to ride", "catan", "go", "uno", "scrabble"]

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

			data.forEach(gif => {
				var imageTile = $("<div>", {
					class: "image-tile",
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
				imageTile.append($("<a>", { class: "gif-dl-btn btn", href: gif.images.original.url.replace(/media[0-9]/i, "i"), target: "_blank" }).text("Source"));
				imageContainer.prepend(imageTile);
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
		var button = $("<button>", { class: "topic-button btn" }).text(topic);

		buttonContainer.append(button);
	});

	$(".topic-button").on("click", function (event) {
		giphy.populateImages($(this).text());
	});
}

$(document).ready(function () {
	populateButtons();

	$("#submit-topic-button").on("click", event => {
		event.preventDefault();

		topics.push($("#topic-form").val());
		$("#topic-form").val("");
		populateButtons();
	});
});
