(function($, nu, undefined) {

	/**
	 * Utility methods for buttons.
	 *
	 * @provide nu.widgets.button.utils
	 * @require nu.widgets.button
	 */
	nu.widgets.button.utils = {

		onvmousedown: function() {
			var button = $(this)
			// making the back button active
			button.addClass("pressed")
			// when touch end, go to normal state
			button.one("vmouseup vmousemove", function() {
				// making the back button normal
				button.removeClass("pressed")
			})
		},

		enableUniversalPressMode: function(button) {
			if (!button) return;
			if (!button.context) button = $(button)

			button.on("vmousedown", this.onvmousedown)
		},

		disableUniversalPressMode: function(button) {
			if (!button) return;
			if (!button.context) button = $(button)

			button.off("vmousedown", this.onvmousedown)
		}

	}

})(jQuery, nu)