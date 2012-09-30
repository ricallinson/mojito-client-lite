/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*global YUI*/

"use strict";

YUI.add("mojito-client-invoke-ctrl", function (Y, NAME) {

    Y.namespace("mojito.controllers")[NAME] = {

    	/*
    		Call the controller on the server
    	*/

        execute: function (ac) {
        	var command = ac.params.body(),
        		cfg,
        		uri = "/@mojito-client-invoke/execute";
        	// console.log(JSON.stringify(command, null, 4));

        	cfg = {
			    method: 'POST',
			    data: JSON.stringify(ac.params.body()),
			    headers: {
			        'Content-Type': 'application/json',
			    },
			    on: {
			    	complete: function (id, e) {

			    		console.log(JSON.stringify([id, e], null, 4));

			    		// Get the data and meta from the responseText
			    		var payload = Y.JSON.parse(e.responseText);
			    		// Send it back to the requester
			    		ac.done(payload.data, payload.meta);
			    	}
			    }
			};

			Y.io(uri, cfg);
        }
    };

}, "0.1.0", {
    requires: [
    	"json",
        "mojito",
        "io-base",
        "mojito-params-addon"
    ]
});
