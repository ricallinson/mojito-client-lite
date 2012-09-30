/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

/*
    State is the enemy of the good.
*/

YUI.add("mojito-client-lite", function(Y, NAME) {

    function MojitProxy(config) {
        this.type = config.type;
        this.viewId = config.viewId;
        this.instanceId = config.instanceId;
        this.binder = config.binder;
        this.dispatch = config.dispatch;
    }

    MojitProxy.prototype = {

        invoke: function(action, options, cb) {

            var callback, command;

            options = options || {};

            // If there are no options use it as the callback
            if ('function' === typeof options) {
                callback = options;
                options = {};
            } else {
                callback = cb;
            }

            // If we don't have a callback set an empty one
            if ('function' !== typeof callback) {
                // TODO: this can be a constant function...not created on each
                // invoke call.
                callback = function() {};
            }

            // Make sure we have a "params" key in our "options" object
            options.params = options.params || {};

            // Create the command we will use to call executeAction() with
            command = {
                instance: {
                    type: this.type
                },
                action: action,
                // Explicitly map the params to there keys
                params: {
                    route: options.params.route || {},
                    url: options.params.url || this.getFromUrl(),
                    body: options.params.body || {},
                    file: options.params.file || {}
                }
            };

            this.dispatch(this.viewId, command, callback);
        },

        getViewId: function() {
            return this.viewId;
        },

        destroySelf: function(retainNode) {
            // ...
        },

        destroyChild: function(viewId, retainNode) {
            // ...
        },

        destroyChildren: function(retainNodes) {
            // ...
        },

        /**
         * Gets URL parameters
         * @method getFromUrl
         * @param {String} key The name of the parameter required.
         * @return {String|Object} param value, or all params if no key
         *     specified.
         */
        getFromUrl: function(key) {

            if (!this.query) {
                if (window.location.href.indexOf("?") > 0) {
                    this.query = Y.QueryString.parse(
                        window.location.href.split('?').pop()
                    );
                } else {
                    this.query = {};
                } 
            }

            if (key) {
                return this.query[key];
            }

            return this.query;
        }
    };

    function MojitoClient(config) {

        // Set the clients context
        this.context = config.context;

        // Make the "Resource Store" by wrapping it with the adapter
        this.resourceStore = new Y.mojito.ResourceStore(config);

        // the resource store adapter and the dispatcher must be passed the
        // mojito logger object, because they were created within a Y scope
        // that still has reference to the original Y.log function
        this.resourceStore = Y.mojito.ResourceStoreAdapter.init('client', this.resourceStore, Y);
        this.dispatcher = Y.mojito.Dispatcher.init(this.resourceStore, null, Y);//, YUI._mojito.loader);

        // start up any binders we have in the config
        this.startBinders(config.binders);

        Y.log("Mojito client lite started.");
    }

    MojitoClient.prototype = {

        attachBinders:  function (binderMap, parentId, viewId) {
            console.log("TODO:", binderMap, parentId, viewId);
            this.startBinders(binderMap);
        },

        startBinders: function (binderMap) {

            var self = this;

            if (!binderMap) {
                return;
            }

            Y.Object.each(binderMap, function (binderInfo, viewId) {

                var node = Y.one("#" + viewId),
                    binderName = binderInfo.name;

                if (!node) {
                    Y.log("Element with id [" + viewId + "] was not found for binder [" + binderName + "].", "info");
                    return;
                }

                Y.use(binderName, function () {

                    var binder = Y.mojito.binders[binderName],
                        binderInstance;

                    if (typeof binder === "object") {
                        binderInstance = Object.create(binder);
                    } else if (typeof binder === "function") {
                        binderInstance = new binder();
                    } else {
                        Y.log("The binder module [" + binderName + "] could not be created.", "info");
                        return;
                    }

                    if (!binderInstance) {
                        Y.log("Binder module [" + binderName + "] was not found.", "info");
                        return;
                    }

                    if (typeof binderInstance.initializer === "function") {
                        binderInstance.initializer(new MojitProxy({
                            type: binderInfo.type,
                            viewId: viewId,
                            instanceId: Y.guid(),
                            binder: binderInstance,
                            dispatch: function () {
                                self.dispatchAdapter.apply(self, arguments);
                            }
                        }));
                    }

                    if (typeof binderInstance.bind === "function") {
                        binderInstance.bind(node);
                    }

                    // console.log(binder, viewId);
                });
            });
        },

        dispatchAdapter: function(viewId, command, cb) {

            var self = this;

            this.resourceStore.expandInstance(command.instance, command.context, function(err, instance) {

                if (err) {
                    if (typeof cb === 'function') {
                        cb(new Error(err));
                        return;
                    }
                    throw new Error(err);
                }

                // if there is a controller in the client type details, that
                // means the controller exists here
                var existsOnClient = Boolean(instance['controller-module']);

                if (!existsOnClient) {
                    // change the command.instance to the proxy-mojit
                }

                // Set the context
                command.context = self.context;

                // Sending "this|self" to the "OutputHandler" is not a good idea
                self.dispatcher.dispatch(command, new Y.mojito.OutputHandler(viewId, cb, self));
            });
        }
    };

    Y.namespace('mojito').Client = MojitoClient;

}, "0.0.1", {
	requires: [
        "node",
        "mojito-client-store",
        "mojito-resource-store-adapter",
        "mojito-dispatcher",
        "mojito-output-handler",
        "querystring",
        "io", // Added here to make it appear in "mojito-client-store" (HACK)
        "json" // Added here to make it appear in "mojito-client-store" (HACK)
    ]
});
