// Configuration of jQuery Mobile before it loads
$(document).on("mobileinit", function () {
	// do not auto initialize page because of splashscreen
	$.mobile.autoInitializePage = false;
	// $.mobile.touchOverflowEnabled = true; // Deprecated since 1.1
	$.mobile.phonegapNavigationEnabled = true;
	// $.mobile.maxScrollForTransition = 1;
});