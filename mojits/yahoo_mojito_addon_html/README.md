# HTML Generator Addon

This is an __addon__ for the [Yahoo! Mojito](https://github.com/yahoo/mojito/) framework.

## ac.html

Used in place of the standard HTMLFrameMojit. Generates a __html__ wrapper when run in the server context.

### ac.html.done

    YUI.add("example-ctrl", function(Y, NAME) {
        Y.namespace("mojito.controllers")[NAME] = {
            index: function(ac) {
                ac.html.done({msg: "Hello world"});
            }
        };
    }, "0.1.0", {requires: ["mojito", "yahoo-mojito-addon-html"]});