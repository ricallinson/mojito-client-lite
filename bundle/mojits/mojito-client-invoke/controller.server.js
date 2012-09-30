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

            // console.log(JSON.stringify(command, null, 4));

            ac._dispatch(command, {

                bdata: "",
                bmeta: {},

                done: function (data, meta) {
                    this.flush(data, meta);
                    ac.done({data: this.bdata, meta: this.bmeta}, "json");
                },

                flush: function (data, meta) {
                    this.bdata += data;
                    this.bmeta = Y.mojito.util.mergeRecursive(this.bmeta, meta);
                }
            });
        }
    };

}, "0.1.0", {
    requires: [
        "mojito",
        "mojito-util",
        "mojito-params-addon"
    ]
});
