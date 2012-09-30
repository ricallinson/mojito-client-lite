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
        // ...
    }

    function MojitoClient(config) {

        // start up any binders we have in the config
        this.startBinders(config.binders);

        Y.log("Mojito client lite started.");
    }

    MojitoClient.prototype = {

        startBinders: function (binderMap) {

            if (!binderMap) {
                return;
            }

            Y.Object.each(binderMap, function (binderName, viewId) {

                var node = Y.one("#" + viewId);

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
                        binderInstance.initializer({});
                    }

                    if (typeof binderInstance.bind === "function") {
                        binderInstance.bind(node);
                    }

                    // console.log(binder, viewId);
                });

                    
            });
        }
    };

    Y.namespace('mojito').Client = MojitoClient;

}, "0.0.1", {
	requires: [
        "node"
    ]
});
