/*
 * Copyright (c) 2011-2012, Yahoo! Inc.  All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */

/*jslint nomen: true*/

/*global YUI*/

"use strict";

YUI.add("yahoo-mojito-addon-html", function (Y, NAME) {

    var renderListAsHtmlAssets;

    function AdapterBuffer(callback) {
        this.callback = callback;
        this.data = "";
        this.meta = {};
    }

    AdapterBuffer.prototype = {

        done: function (data, meta) {
            this.flush(data, meta);
            this.callback(this.data, this.meta);
        },

        flush: function (data, meta) {
            this.meta = meta;
            this.data += data;
        },

        error: function (err) {
            Y.log("Error executing child mojit at '" + this.id + "':", 'error', NAME);
            if (err.message) {
                Y.log(err.message, 'error', NAME);
            } else {
                Y.log(err, 'error', NAME);
            }
            if (err.stack) {
                Y.log(err.stack, 'error', NAME);
            }
            // Pass back some empty data so we don't fail the composite
            this.done('');
        }
    };

    renderListAsHtmlAssets = function (list, type) {
        var i,
            data = '',
            url;

        if ('js' === type) {
            for (i = 0; i < list.length; i += 1) {
                // TODO: Fuly escape any HTML chars in the URL to avoid trivial
                // attribute injection attacks. See owasp-esapi reference impl.
                url = encodeURI(list[i]);
                data += '<script type="text/javascript" src="' +
                    url + '"></script>\n';
            }
        } else if ('css' === type) {
            for (i = 0; i < list.length; i += 1) {
                // TODO: Escape any HTML chars in the URL to avoid trivial
                // attribute injection attacks. See owasp-esapi reference impl.
                url = encodeURI(list[i]);
                data += '<link rel="stylesheet" type="text/css" href="' +
                    url + '"/>\n';
            }
        } else if ('blob' === type) {
            for (i = 0; i < list.length; i += 1) {
                // NOTE: Giant security hole...but used by everyone who uses
                // Mojito so there's not much we can do except tell authors of
                // Mojito applications to _never_ use user input to generate
                // blob content or populate config data. Whatever goes in here
                // can't be easily encoded without the likelihood of corruption.
                data += list[i] + '\n';
            }
        } else {
            Y.log('Unknown asset type "' + type + '". Skipped.', 'warn', NAME);
        }

        return data;
    };

    function Addon(command, adapter, ac) {
        this.ac = ac;
    }

    Addon.prototype = {

        namespace: "html",

        done: function (data, meta) {

            var html,
                assets = {},
                ac = this.ac,
                tmp;

            // If we don't have any meta make it an object
            meta = meta || {};

            tmp = this.ac._adapter;

            ac._adapter = new AdapterBuffer(function (data, meta) {

                // Put the real adapter back
                ac._adapter = tmp;

                // Add all the assets we have been given to our local store
                ac.assets.addAssets(meta.assets);

                // Get all the deploy assets
                ac.deploy.constructMojitoClientRuntime(ac.assets, meta.binders);

                // Set the HTTP header
                ac.http.setHeader("content-type", "text/html");

                // Attach assets found in the "meta" to the page
                Y.Object.each(ac.assets.getAssets(), function (types, location) {
                    if (!assets[location]) {
                        assets[location] = '';
                    }
                    Y.Object.each(types, function (assetsOfType, type) {
                        assets[location] += renderListAsHtmlAssets(assetsOfType, type);
                    });
                });

                html = "<html><head>" + assets.top + "</head><body>\n" + data + "\n" + assets.bottom + "</body>";

                // console.log(JSON.stringify(assets, null, 4));

                ac.done(html, meta);
            });

            // Mess with your head
            ac.done(data, meta);
        }
    };

    Y.namespace("mojito.addons.ac").html = Addon;

}, "0.1.0", {
    requires: [
        "mojito",
        "mojito-deploy-addon",
        "mojito-assets-addon",
        "mojito-http-addon"
    ]
});
