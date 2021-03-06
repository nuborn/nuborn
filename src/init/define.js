/**
 * Copied from cordova project.
 */
( function ( window, undefined ) {

    if ( window.define && window.require ) return;

    var modules = {},
        // Stack of moduleIds currently being built.
        requireStack = [],
        // Map of module ID -> index into requireStack of modules currently being built.
        inProgressModules = {},
        SEPERATOR = ".";

    function build( module ) {
        var factory = module.factory,
            localRequire = function ( id ) {
                var resultantId = id;
                //Its a relative path, so lop off the last portion and add the id (minus "./")
                if ( id.charAt( 0 ) === "." ) {
                    resultantId = module.id.slice( 0, module.id.lastIndexOf( SEPERATOR ) ) + SEPERATOR + id.slice( 2 );
                }
                return require( resultantId );
            };
        module.exports = {};
        delete module.factory;
        factory( localRequire, module.exports, module );
        return module.exports;
    }

    require = function ( id ) {
        if ( !modules[ id ] ) {
            // throw "module " + id + " not found";
            console.log( "module " + id + " not found" );
            return;
        }
        else if ( id in inProgressModules ) {
            var cycle = requireStack.slice( inProgressModules[ id ] ).join( '->' ) + '->' + id;
            throw "Cycle in require graph: " + cycle;
        }
        if ( modules[ id ].factory ) {
            try {
                inProgressModules[ id ] = requireStack.length;
                requireStack.push( id );
                return build( modules[ id ] );
            }
            finally {
                delete inProgressModules[ id ];
                requireStack.pop();
            }
        }
        return modules[ id ].exports;
    };

    requireWithPattern = function ( pattern ) {
        var results = {};
        for ( var id in modules )
            if ( pattern.test( id ) )
                results[ id ] = require( id );
        return results;
    };

    define = function ( id, factory ) {
        if ( modules[ id ] ) {
            throw "module " + id + " already defined";
        }

        modules[ id ] = {
            id: id,
            factory: factory
        };
    };

    define.remove = function ( id ) {
        delete modules[ id ];
    };

    define.moduleMap = modules;
} )( window );