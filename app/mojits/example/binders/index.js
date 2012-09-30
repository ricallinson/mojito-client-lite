/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add('example_binder_index', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = Y.Base.create(NAME, Y.View, [], {

        events: {
            div: {
                click: "logit"
            }
        },

        logit: function (e) {
            this.mp.invoke("index", function (err, data) {
                e.currentTarget.append(data);
            });
        }
    });

}, '0.0.1', {
    requires: [
        "mojito-client-lite",
        "view"
    ]
});
