/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add("server-ctrl", function (Y, NAME) {

    Y.namespace("mojito.controllers")[NAME] = {

        index: function (ac) {
        	ac.assets.addBlob("<title>Server Stuff</title>", "top");
            ac.html.done({msg: "Server world"});
        },

        remote: function (ac) {
            ac.done("<p>String from server.</p>");
        }
    };

}, "0.1.0", {
    requires: [
        "mojito",
        "mojito-assets-addon",
        "yahoo-mojito-addon-html"
    ]
});
