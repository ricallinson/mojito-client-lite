/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add('example_binder_index', function (Y, NAME) {

    Y.namespace('mojito.binders')[NAME] = {

        init: function (mp) {
            this.mp = mp;
        },

        bind: function (node) {
            Y.log("Yo, the binder is working!");
        }
    };

}, '0.0.1', {
	requires: ['mojito-client']
});
