// Configuration of jQuery Mobile before it loads
$(document).on("mobileinit", function ()
{
	// do not auto initialize page because of splashscreen
	$.mobile.autoInitializePage = false;

	// Deprecated since 1.1
	// $.mobile.touchOverflowEnabled = true;

	// phonegap friendly ?
	if (window.cordova)
		$.mobile.phonegapNavigationEnabled = true;

	// TODO je serais partant pour désactiver les transitions dès qu'on a un peu scrollé
	// la valeur par défaut me semble bien trop importante (3 fois la taille du viewport)
	// malheureusement, j'ai peur que cela soit harcodé contrairement à ce qui est dit dans la doc
	// $.mobile.getMaxScrollForTransition = function ()
	// {
	// 	return $.mobile.getScreenHeight();
	// };

	// Don't use fancy transitions on poor capable devices
	if ($.mobile.gradeA())
		$.mobile.defaultPageTransition = "slide";
	else
		$.mobile.defaultPageTransition = "none";
});