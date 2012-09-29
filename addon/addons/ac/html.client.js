/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add("yahoo-mojito-addon-html", function (Y, NAME) {

    function Addon(command, adapter, ac) {
        this.ac = ac;
    }

    Addon.prototype = {

        namespace: "html",

        done: function (data, meta) {
            this.ac.done(data, meta);
        }
    };

    Y.namespace("mojito.addons.ac").html = Addon;

}, "0.1.0", {
    requires: [
        "mojito"
    ]
});
