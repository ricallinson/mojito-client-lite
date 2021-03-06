/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add("example-ctrl", function (Y, NAME) {

    Y.namespace("mojito.controllers")[NAME] = {

        index: function (ac) {
            ac.assets.addBlob("<title>Addons Rule</title>", "top");
            ac.html.done({msg: "Hello world"});
        },

        destroy: function (ac) {
            ac.assets.addBlob("<title>Destroy Stuff</title>", "top");
            ac.html.done({msg: "Destroy world"});
        }
    };

}, "0.1.0", {
    requires: [
        "mojito",
        "mojito-assets-addon",
        "yahoo-mojito-addon-html"
    ]
});
