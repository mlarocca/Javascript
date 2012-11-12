//require jQuery

var Utils = (function(){
	"use strict"

	//Add a init method to Object
	if (!Object.hasOwnProperty("init")) {
		Object.init = function (o, properties){
			if (arguments.length != 2){
				throw new Error('Object.init implementation only accepts 2 parameters.');
			}
			var key, new_obj = Object.create(o);
			
			if (properties){
				for (key in properties){
					Object.defineProperty(new_obj, key, {
							value: properties[key],
							writable: true,
							enumerable: true,
							configurable: false
						}
					);	
				}
			}
			return new_obj;
		};
	}
	
	var utils = {
		isArray: function(obj) {
			return obj && (obj.constructor === Array);
		},
		isFunction: function(arg) {
			return typeof arg === 'function';
		},
		get_server_IP_address: function(){
			try{
				return $(location).attr('host');
			}catch(e){
				return document.location.host;
			}
		}			
	};
	Object.freeze(utils);
	return utils;
})();

var sharedImgLoaderPrototype = {
	
	/**
		@param destination_jquery_div: The jquery object is required, NOT the DOM one
		
		WARNING: as a side effect, all children of the passed node will be removed!!!
	*/
	loadImage: function (destination_jquery_div, img_url, width, height){
		"use strict"
		
		var loader = this;
		var timerID;	//== undefined
		
		try{
			
			if (width !== undefined){
				 destination_jquery_div.css('width', width);
			}
			if (height !== undefined){
				destination_jquery_div && destination_jquery_div.css('height', height);
			}
		}catch(e){
			//Not a jquery DOM wrapper: should it re-throw an exception?
			return ;
		}
	
		function addToQueue(){
			"use strict"
			
			if (loader.queue.length < loader.MAX_QUEUE_SIZE){
				if (timerID !== undefined){
					clearInterval(timerID);
					timerID = undefined;
				
					new_img.attr('src', img_url).load(function(){
						if (!this.complete || typeof this.naturalWidth == "undefined" || this.naturalWidth == 0){
							//Image couldn't be load
							loader.onError();
						} 
						
						loader.queue.splice( $.inArray(new_img, loader.queue), 1 );
					});
				}
			}
		}
		
		destination_jquery_div.empty();
		var new_img = $('<img alt="Loading..."/>');
		destination_jquery_div.append(new_img);
		
		
		timerID = setInterval( addToQueue, loader.DEFAULT_DELAY );
	}
}
Object.freeze(sharedImgLoaderPrototype);

/**
  * @param onErrorFunction: optional parameter: function to be called in case an error happens
  */
var asynchImageLoaderFactory = function(maxQueueSize, defaultDelay, onErrorFunction){
	"use strict"
	if (!Utils.isFunction(onErrorFunction)){
		onErrorFunction = function(){};	//PlaceHolder function;
	}
	
	defaultDelay = defaultDelay || 100;
	maxQueueSize = maxQueueSize || 4;
	
	var new_obj = Object.create(sharedImgLoaderPrototype);
	Object.defineProperty(new_obj, 'queue', {
		value: [],
		writable: false,
		enumerable: true,
		configurable: false
	});
	Object.defineProperty(new_obj, 'MAX_QUEUE_SIZE', {
		value: maxQueueSize,
		writable: false,
		enumerable: false,
		configurable: false
	});	
	Object.defineProperty(new_obj, 'DEFAULT_DELAY', {
		value: defaultDelay,	//0.1 seconds between each loading
		writable: false,
		enumerable: false,
		configurable: false
	});		
	Object.defineProperty(new_obj, 'onError', {
		value: onErrorFunction,
		writable: false,
		enumerable: false,
		configurable: false
	});
	
	return new_obj;
};