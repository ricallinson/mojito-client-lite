# Mojito Client Lite

This is a __mojit__ for the [Yahoo! Mojito](https://github.com/yahoo/mojito/) framework.

    npm link <this-dir>

## ac.html

An __addon__ to use in place of the HTMLFrameMojit. Generates a __html__ wrapper when run in the server context.

### ac.html.done

    YUI.add("example-ctrl", function(Y, NAME) {
        Y.namespace("mojito.controllers")[NAME] = {
            index: function(ac) {
                ac.html.done({msg: "Hello world"});
            }
        };
    }, "0.1.0", {requires: ["mojito", "yahoo-mojito-addon-html"]});

## mojitoClientLite

Used in place of the default Mojito Client Runtime. To activate it add __mojitoClientLite: true__ to __application.json__ when you are using __ac.html__ for generating your HTML.

    [
        {
            "settings": ["master"],
            "mojitoClientLite": true
        }
    ]

## binder

When using __mojitoClientLite: true__ it is important to note that the __binder__ api has changed to support the [Y.View](http://yuilibrary.com/yui/docs/view/) method of working with the DOM. They are;

* Replacing the __init__ method with an __initializer__ method.
* The value returned by the YUI Module can be either an __object__ or a __function__.
    * If the value is a function the __new__ operator will be called on it.
    * If the value is an object it will be passed to the __Object.create__ function.
* The __binder__ now comes with the _Mojit Proxy_ attached to the attribute __mp__ by default.
* If the binder is a [Y.View](http://yuilibrary.com/yui/docs/view/) instance the DOM node is automatically set.

Object based binder;

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

Y.View based binder; 

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

### initializer

Optional: This function is called after the creation of the binder but before [bind](#bind).

### bind

Optional: This function is called after [initializer](#initializer). It is passed a single argument which is a YUI Node object containing the Mojits DOM element that __id="{{mojit_view_id}}"__ was added to.

### mp.invoke

### mp.getViewId

### mp.destroySelf

### mp.destroyChild

### mp.destroyChildren

### mp.getFromUrl
