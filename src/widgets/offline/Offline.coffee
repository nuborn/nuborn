define "widgets.Offline", ( require, exports, module ) ->

    'use strict'

    $ = jQuery
    log = require "#log"
    message = require "#message"
    NetworkUtils = require "utils.NetworkUtils"


    ###
    @class widgets.Offline
    A fullscreen widget which add an overlay above the current page with a network issue message.
    ###
    class Offline

        ###
        Watching some events for connectivy checks.
        ###
        watch: () ->
            $( document ).on "online offline", checkConnectivity

        unwatch: () ->
            $( document ).off "online offline", checkConnectivity



    checkConnectivity = ( event ) ->

        isNetworkAvailable = NetworkUtils.isNetworkAvailable()

        log.i "Network Available : #{isNetworkAvailable}" if DEBUG
        log.i "Event: #{event.type}" if TRACE

        if isNetworkAvailable then message.hide() else message.offline()


    module.exports = Offline

###
Shared instance.
###
define "#offlineWidget", ( require, exports, module ) ->

    'use strict'

    Offline = require "widgets.Offline"
    module.exports = new Offline