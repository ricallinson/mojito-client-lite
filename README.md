# yahoo_mojito_addon_html

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