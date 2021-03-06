define "manager.NewsManager", ( require, exports, module ) ->

    'use strict'

    $ = jQuery
    log = require "#log"
    Manager = require "manager.Manager"
    Utils = require "utils.Utils"
    ajax = require "ajax#ajax"
    context = require "#context"
    Constants = require "common.Constants"

    ###
    @class manager.NewsManager
    @extends common.Base
    Implements boot algorithm.
    ###
    class NewsManager extends Manager

        ###
        @constructor
        ###
        constructor: ->

        ###
        Return the current news. News may be read from the cache.
        ###
        news: (skipCache = false) ->

            dfd = $.Deferred()

            # Force refresh if data has more than 12 hours
            if @lastNewsTimestamp
                elapsedTime = new Date().getTime() - @lastNewsTimestamp
                if elapsedTime > 1000*60*60*12
                    log.d "Forcing news refresh as the elapsed time is #{elapsedTime/1000/60/60} hours" if DEBUG
                    skipCache = true

            newsInCache = context.get "news"
            # If loading news for the first time or seeking fresh data
            if not newsInCache or skipCache

                log.d "Loading fresh news" if DEBUG

                ajax.get("get-news")

                    # Ajax success
                    .done (data) ->
                        # Saving last successful load date
                        @lastNewsTimestamp = new Date().getTime()

                        log.d "Donwloaded fresh news: #{Utils.toJSON data}" if DEBUG

                        # Simulating network latency
                        setTimeout ->
                            # Saving in context and local storage
                            context.set "news", data, true
                            dfd.resolveWith this, [data]
                        , 5000

                    # Ajax failure
                    .fail (error) ->
                        log.e "Can't load news: ", error if ERROR
                        dfd.rejectWith this, [error]

            # If using the cache
            else
                log.d "Loading news from the cache" if DEBUG
                dfd.resolveWith this, [newsInCache]

            return dfd.promise()

        ###
        Find a news by id.
        ###
        newsById: (id) ->
            dfd = $.Deferred()
            news = context.get "news"

            find = ->
                result = null
                # Not using Array#filter because you can't break the loop
                for newsItem in news.list
                    if newsItem.id is id
                        result = newsItem
                        break;

                if not result
                    log.e "News with id '#{id}' not found" if ERROR
                    dfd.rejectWith this, [Constants.Ajax.RESOURCE_NOT_FOUND]
                else
                    log.d "Found news: #{Utils.toJSON result[0]}" if DEBUG
                    dfd.resolveWith this, [result]

            if not id
                dfd.reject()
            else if not news?.list?.length
                @news()
                .done ->
                    find()
                .fail (error) ->
                    dfd.rejectWith this, [error]
            else
                find()

            return dfd.promise()


    module.exports = NewsManager


###
Shared instance
###
define "manager#news", ( require, exports, module ) ->

    'use strict'

    NewsManager = require "manager.NewsManager"
    module.exports = new NewsManager()
