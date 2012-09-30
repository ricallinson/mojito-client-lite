# Mojit to use in place of HTMLFrameMojit

__IN DEVELOPMENT__: This is a __bundle__ of __mojits__ for the [Yahoo! Mojito](https://github.com/yahoo/mojito/) framework. It provides a smaller client side footprint and integration with [Y.View](http://yuilibrary.com/yui/docs/view/).

## Developer Example App

To run the example;

	git clone git@github.com:ricallinson/mojito-client-lite.git
	cd ./mojito-client-lite/app
	npm i mojito -g
	npm link ../mojit
	mojito start

Open [http://localhost:8666/@example/index](http://localhost:8666/@example/index) in a browser.

## Code Preview

The example below is all you need to deploy the client runtime. No application.json or complicated specs.

	YUI.add("example-ctrl", function (Y, NAME) {
	    Y.namespace("mojito.controllers")[NAME] = {
	        index: function (ac) {
	            ac.html.done("Hello world.");
	        }
	    };
	}, "0.1.0", {
	    requires: [
	        "mojito",
	        "yahoo-mojito-addon-html"
	    ]
	});