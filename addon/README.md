# HTML Generator Addon

This is an __addon__ for the [Yahoo! Mojito](https://github.com/yahoo/mojito/) framework.

## ac.html

Used in place of the HTMLFrameMojit. Generates a __html__ wrapper when run in the server context.

### ac.html.done

    YUI.add("example-ctrl", function(Y, NAME) {
        Y.namespace("mojito.controllers")[NAME] = {
            index: function(ac) {
                ac.html.done({msg: "Hello world"});
            }
        };
    }, "0.1.0", {requires: ["mojito", "yahoo-mojito-addon-html"]});

## mojitoClientLite

Used in place of the default Mojito Client Runtime. To activate it add __mojitoClientLite: true__ to __application.json__.

    [
        {
            "settings": ["master"],
            "mojitoClientLite": true
        }
    ]

When __mojitoClientLite: true__ is set the API of a __binder__ changes to support the use of [Y.View](http://yuilibrary.com/yui/docs/view/). This takes the form of using the method __initializer__ in place of __init__. The value returned by the binder module can be either an __object__ or a __function__. If the value is a function the __new__ operator will be called on it. The __binder__ now comes with the _Mojit Proxy_ attached to the attribute __mp__ by default.

    YUI.add('example_binder_index', function (Y, NAME) {
        Y.namespace('mojito.binders')[NAME] = {
            initializer: function () {
                // ...
            },
            bind: function (node) {
                Y.log("Yo, the binder is working!");
            }
        };
    }, '0.0.1', {requires: ["mojito-client-lite"]});

or; 

    YUI.add('example_binder_index', function (Y, NAME) {
        Y.namespace('mojito.binders')[NAME] = Y.Base.create(NAME, Y.View, [], {
            events: {
                div: {
                    click: "logit"
                }
            },
            initializer: function () {
                // ...
            },
            logit: function () {
                this.mp.invoke("index", function (err, data) {
                    Y.log("A click happened");
                });
            }
        });
    }, '0.0.1', {requires: ["mojito-client-lite", "view"]});
