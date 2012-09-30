/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add("mojito-client-invoke-ctrl", function (Y, NAME) {

    Y.namespace("mojito.controllers")[NAME] = {

        execute: function (ac) {
        	var command = ac.params.body();
        	console.log(JSON.stringify(command, null, 4));
        	ac.done({data: "<p>mojito-client-invoke-ctrl from server</p>", meta: {}}, "json");
        }
    };

}, "0.1.0", {
    requires: [
        "mojito",
        "mojito-params-addon"
    ]
});
