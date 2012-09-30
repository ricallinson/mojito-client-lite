/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

/**
 * @module ActionContextAddon
 */
YUI.add("mojito-deploylite-addon", function (Y, NAME) {

    function Addon(command, adapter, ac) {
        this.ac = ac;
    }

    Addon.prototype = {

        namespace: "deploylite",

        /**
         * Declaration of store requirement.
         * @method setStore
         * @private
         * @param {ResourceStore} rs The resource store instance.
         */
        setStore: function (rs) {
            this.rs = rs;
            if (rs) {
                Y.log("Initialized and activated with Resource Store", "info", NAME);
            }
        },

        /**
         * Builds up the browser Mojito runtime.
         * @method constructMojitoClientRuntime
         * @param {AssetHandler} assetHandler asset handler used to add scripts
         *     to the DOM under construction.
         * @param {object} binderMap information about the binders that will be
         *     deployed to the client.
         */
        addAssets: function (assets, binderMap) {

            var store = this.rs,
                viewId,
                pageConfig = {binders: {}},
                pageConfigStr,
                context,
                clientLiteAdded,
                appConfigClient,
                yuiConfig,
                yuiConfigStr;

            context = Y.mojito.util.copy(this.ac.context);
            context.runtime = "client";

            /*
                Get the app.json config for the client
            */
            appConfigClient = store.getAppConfig(context);

            /*
                Setup YUI Config
            */
            yuiConfig = {};
            yuiConfig.lang = context.lang;

            // Remove the dependencyCalculations option as we will let YUI work naturally
            delete yuiConfig.dependencyCalculations;

            // If we have a "base" for YUI use it
            if (appConfigClient.yui.base) {
                yuiConfig.base = appConfigClient.yui.base;
                yuiConfig.combine = false;
            }

            // If we know where yui "Loader" is tell YUI
            if (appConfigClient.yui.loader) {
                yuiConfig.loaderPath = appConfigClient.yui.loader;
            }

            if (appConfigClient.yui.url) {
                assets.addJs(appConfigClient.yui.url, "top");
            } else {
                assets.addJs("http://yui.yahooapis.com/" + YUI.version + "/build/yui/yui.js", "top");
            }

            // Add required config data
            pageConfig.context = context;
            pageConfig.appConfig = {};

            // Y.Object.each(binderMap, function (binder, viewId) {
            //     binder = binderMap[viewId];
            //     Y.Object.each(binder.needs, function (url) {
            //         assets.addJs(url, "bottom");
            //     });
            //     pageConfig.binders[viewId] = binder.name;
            // });

            // add binders' dependencies
            Y.Object.each(binderMap, function (binder, viewId) {
                binder = binderMap[viewId];
                // Add "mojito-client-lite", a lite version of "mojito-client"
                if (!clientLiteAdded) {
                    assets.addJs(binder.needs["mojito-client-lite"], "bottom");
                    assets.addJs(binder.needs["mojito-dispatcher"], "bottom");
                    assets.addJs(binder.needs["mojito-client-store"], "bottom");
                    assets.addJs(binder.needs["mojito-resource-store-adapter"], "bottom");
                    assets.addJs(binder.needs["mojito-output-handler"], "bottom");
                    assets.addJs(binder.needs["mojito-perf"], "bottom");
                    assets.addJs(binder.needs["mojito-util"], "bottom");
                    assets.addJs(binder.needs["mojito-controller-context"], "bottom"); // will be removed in 0.5
                    // assets.addJs(binder.needs["mojito-action-context"], "bottom"); // will be added in 0.5
                    clientLiteAdded = true;
                }

                assets.addJs(binder.needs[binder.name], "bottom");
                pageConfig.binders[viewId] = {
                    type: binder.type,
                    name: binder.name
                };
            });

            // Unicode escape the various strings in the config data to help
            // fight against possible script injection attacks.
            yuiConfigStr = Y.JSON.stringify(Y.mojito.util.cleanse(yuiConfig));
            pageConfigStr = Y.JSON.stringify(Y.mojito.util.cleanse(pageConfig));

            assets.addBlob("<script type=\"text/javascript\">" +
                "YUI.applyConfig(" + yuiConfigStr + ");\n" +
                "YUI().use(\"mojito-client-lite\", function(Y) {" +
                "new Y.mojito.Client(" +
                pageConfigStr + ");" +
                "});" +
                "</script>", "bottom");

            // console.log(JSON.stringify(yuiConfig, null, 4));
            // console.log(JSON.stringify(pageConfig, null, 4));
        }
    };

    Y.namespace("mojito.addons.ac").deploylite = Addon;

}, "0.1.0", {
    requires: [
        "mojito"
    ]
});
