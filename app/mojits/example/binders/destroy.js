/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add('example_binder_destroy', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = Y.Base.create(NAME, Y.View, [], {

        events: {
            div: {
                click: "logit"
            }
        },

        initializer: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {
            this.set("container", node);
        },

        logit: function (e) {
            e.currentTarget.remove();
        }
    });

}, '0.0.1', {
	requires: [
		"mojito-client-lite",
        "view"
	]
});
