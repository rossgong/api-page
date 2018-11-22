var topics = ["chess", "checkers", "monopoly", "ticket to ride", "catan", "go", "uno", "scrabble"]

var giphy = {
	baseURL: "https://api.giphy.com/v1/",
	query: "gifs/search",
	//TODO: change this key to a personal key
	apiKey: "dc6zaTOxFJmzC",

	populateImages: function (topic) {
		var imageContainer = $("#image-container").html("");
		$.ajax({
			url: this.constructURL(topic),
			method: "GET"
		}).then(function (response) {
			var data = response.data;

			data.forEach(gif => {
				var gifDiv = $("<div>", {
					class: "image-tile",
					"data-still": gif.images.fixed_height_still.url,
					"data-animated": gif.images.fixed_height.url,
					"data-state": "still"
				});
				gifDiv.append($("<img>", { src: gif.images.fixed_height_still.url }));
				gifDiv.append($("<div>", { class: "gif-rating-div" }).text(gif.rating.toUpperCase()))

				imageContainer.append(gifDiv);
			});

			$(".image-tile").on("click", function (event) {
				giphy.toggleAnimation($(this));
			});
		});
	},

	constructURL: function (topic) {
		return this.baseURL + this.query + "?limit=10&q=" + topic + "&apiKey=" + this.apiKey;
	},

	toggleAnimation: function (div) {
		if (div.attr("data-state") === "still") {
			div.attr("data-state", "animated");

			div.children("img").attr("src", div.attr("data-animated"));
		} else if (div.attr("data-state") === "animated") {
			div.attr("data-state", "still");

			div.children("img").attr("src", div.attr("data-still"));
		}
	}


}

function populateButtons() {
	var buttonContainer = $("#button-container").html("");
	topics.forEach(topic => {
		var button = $("<button>", { class: "topic-button btn" }).text(topic);

		console.log(topic);

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
