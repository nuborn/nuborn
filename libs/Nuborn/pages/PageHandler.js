define( "nu.pages.PageHandler", function ( require, exports, module ) {

    'use strict';

    var $ = jQuery;
    var pageEventsManager = require( "nu.pages.PageEventsManager" ).instance;
    var Utils = require( "nu.Utils" );
    var Log = require( "nu.debug.Log" );

    /**
     * @class nu.pages.PageHandler
     *
     * Handle lifecycle of jQuery Mobile pages.
     * Defaults PageHandler instances are prototype which means every time you navigate away
     * to another page, it is removed from the DOM.
     * As page parameters are set on "pageinit" event, singleton controllers received them
     * once only.
     */
    var PageHandler = Object.subClass( {

        /**
         * Initialize a fresh new Page Handler.
         * @param {Object} settings    The settings of the page handler (ID, URL, ...).
         */
        init: function ( settings ) {
            // Declaring class members
            // Settings : object containing ID and URL or a jQuery Mobile page
            this.settings = $.extend( true, {
                singleton: false
            }, settings );

            // Html : Object containing jQuery Object referencing to HTML elements of the page
            this.html = {};

            // Data : data of the page
            this.data = {
                visible: false
            };

            // Regitsering
            // pageEventsManager.registerPageHandler( this );
        },

        /**
         * Called for the pagebeforecreate event. <br/>
         * Also register page into HTML elements.
         * @param  {Object} event
         */
        pageBeforeCreate: function ( event ) {
            // Registering the page into HTML elements
            var page = event.currentTarget;
            this.html.page = $( page );

            // TODO inserting wordings on current page
            // $.it.wordings.update(page);

            // TODO using right image resolution depending on device
            // $.it.rimages.update(page);
        },


        /**
         * Called for the pageinit event. <br/>
         * Populate page parameters by reading url hash part in PageHandler#data#pageParams.
         * Also create PageHandler#html and PageHandler#data properties.
         * @param  {Object} event
         */
        pageInit: function ( event ) {
            DEBUG && Log.i( "page init of " + event.currentTarget.id );

            // page parameters are passed in on "pageinit" event
            // so controller in singleton mode will keep their page parameters
            // forever
            if ( this.settings.singleton )
                this.data.pageParams = Utils.deserializeHash().params;

            // Calling #createHtmlElements
            this.createHtmlElements();

            // Calling #createDataElements if exists
            this.createDataElements();

        },

        /**
         * Called for the pagecreate event.
         * @param  {Object} event
         */
        pageCreate: function ( event ) {
            DEBUG && Log.i( "page create of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called       for the pagebeforehide event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageBeforeHide: function ( event, data ) {
            DEBUG && Log.i( "page before hide of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pagehide event.
         * Also clean references to HTML elements & Data Objects in prototype mode,
         * i.e. when page is removed each time we go away.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageHide: function ( event, data ) {
            DEBUG && Log.i( "page hide of '" + event.currentTarget.id + "'" );
            this.data.visible = false;
            if ( !this.settings.singleton ) {
                // Cleaning references to HTML elements & data objects
                // as they will be recreated every time we go back to the page
                this.html.page.remove();
                this.deleteHtmlElements();
                this.deleteDataElements();
            }
        },

        /**
         * Called for the pagebeforeshow event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageBeforeShow: function ( event, data ) {
            // controller in prototype mode can receive parameters each time
            // the page is rendered
            if ( !this.settings.singleton )
                this.data.pageParams = Utils.deserializeHash().params;

            DEBUG && Log.i( "page before show of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pageshow event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageShow: function ( event, data ) {
            DEBUG && Log.i( "page show of '" + event.currentTarget.id + "'" );
            this.data.visible = true;
            if ( this.data.isFirst ) {
                Utils.hideSplashScreen();
                delete this.data.isFirst;
            }
        },

        /**
         * Called for the pagebeforechange event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageBeforeChange: function ( event, data ) {
            DEBUG && Log.i( "page before change of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pagechange event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageChange: function ( event, data ) {
            DEBUG && Log.i( "page change of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pagebeforeload event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageBeforeLoad: function ( event, data ) {
            DEBUG && Log.i( "page before load of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pageLoad event.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageLoad: function ( event, data ) {
            DEBUG && Log.i( "page load of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the pageremove event. <br/>
         * Also clean references to HTML elements & Data Objects in prototype mode,
         * i.e. when page is removed each time we go away.
         * @param  {Object} event
         * @param  {Object} data
         */
        pageRemove: function ( event, data ) {
            DEBUG && Log.i( "page remove of '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the swipeleft event. <br/>
         * @param  {Object} event
         * @param  {Object} data
         */
        swipeLeft: function ( event ) {
            DEBUG && Log.i( "swipe left on '" + event.currentTarget.id + "'" );
        },

        /**
         * Called for the swiperight event. <br/>
         * @param  {Object} event
         * @param  {Object} data
         */
        swipeRight: function ( event ) {
            DEBUG && Log.i( "swipe right on '" + event.currentTarget.id + "'" );
        },

        /**
         * Create all references to HTML elements.
         */
        createHtmlElements: function () {
            Log.w( "This method should be overriden" );
        },

        /**
         * Create all references to data objects.
         */
        createDataElements: function () {
            Log.w( "This method should be overriden" );
        },

        /**
         * Delete all references to HTML elements.
         */
        deleteHtmlElements: function () {
            if ( this.html ) {
                for ( var key in this.html ) {
                    delete this.html[ key ];
                }
            }
        },

        /**
         * Delete all references to data objects.
         */
        deleteDataElements: function () {
            if ( this.data ) {
                for ( var key in this.data ) {
                    delete this.data[ key ];
                }
            }
        },

        /**
         * Utility method to load a page
         * If the page handler has an id and we found a javascript template for it, we use it.
         * Else error.
         *
         * @param {Object} pageParams Page parameters. Will be merged with this controller settings as placeholder values.
         *
         * @throws {String} This page handler has no valid page
         */
        load: function ( pageParams ) {

            if ( !this.settings ) throw "invalid page handler";

            var pageId = this.settings.id;
            var templateId = this.settings.templateId || pageId;

            // creating a new object which contains static page settings plus dynamic page parameters
            // this object will be used by the template engine to fill placeholders
            var templateData = Utils.clone( this.settings );
            templateData = $.extend( true, templateData, pageParams );

            if ( templateId && templates[ templateId ] ) {
                if ( !document.getElementById( pageId ) ) {
                    DEBUG && Log.i( "loading #" + pageId );
                    DEBUG && Log.i( "templateData: " + Utils.toJSON( templateData ) );
                    $( templates[ templateId ].render( templateData ) ).appendTo( "body" );
                }
            }
            else {
                throw "This page handler has no valid page";
            }
        },

        backButton: function ( event ) {
            DEBUG && Log.i( "back button" );
        },

        menuButton: function ( event ) {
            DEBUG && Log.i( "menu button" );
        },

        /**
         * Utility method to navigate from one page to another
         * If the page handler has an id and we found a javascript template for it, we use it.
         * Else, if the page handler has a url, we use that instead.
         * Else error.
         *
         * @param {Object} options
         * @param options.jqmOptions [jQuery Mobile #changePage options][1]
         * [1]: http://api.jquerymobile.com/jQuery.mobile.changePage/
         * @param options.pageParams Key/value pairs to be passed to destination page
         * @param options.delay Delay before navigating. Default 0 = no delay.
         * @param options.callback Callback called after navigating.
         *
         * @throws {String} This page handler has no valid page
         */
        navigate: function ( options ) {

            if ( !this.settings ) throw "invalid page handler";

            var pageId = this.settings.id;
            var templateId = this.settings.templateId || pageId;

            // settings defaults
            options = $.extend( true, {
                jqmOptions: {},
                pageParams: undefined,
                delay: 0,
                callback: undefined
            }, options );

            // the JQM tricky way to pass parameters between pages is to use the dataUrl option
            // must contain the hash name without "#" followed by query params
            options.jqmOptions.dataUrl = pageId;
            if ( options.pageParams ) {
                var serializedParams = Utils.serializeHashParameters( options.pageParams );
                if ( serializedParams && serializedParams.length )
                    options.jqmOptions.dataUrl += "?" + serializedParams;
            }

            DEBUG && Log.i( "options: " + Utils.toJSON( options ) );

            if ( templateId && templates[ templateId ] ) {

                // loading template in DOM
                this.load( options.pageParams );

                // changing page with a delay if any
                window.setTimeout( function () {
                    DEBUG && Log.i( "navigating to #" + pageId );
                    $.mobile.changePage( "#" + pageId, options.jqmOptions );
                    // calling callback after page change if any
                    if ( options.callback ) {
                        options.callback();
                    }
                }, options.delay );
            }
            else {
                throw "This page handler has no valid page";
            }
        },

        isVisible: function () {
            return this.data.visible;
        }

    } );

    module.exports = PageHandler;

} );