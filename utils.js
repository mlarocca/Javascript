
if (!window.Utils){
	/**
		module Utils       
	*/
	var Utils = (function(){
		"use strict";

		//Add a init method to Object
		if (!Object.hasOwnProperty("init")) {
			Object.init = function (o, properties){
				if (arguments.length !== 2){
					throw new Error('Object.init implementation only accepts 2 parameters.');
				}
				var key, new_obj = Object.create(o);
				
				if (properties){
					for (key in properties){
						if (properties.hasHownProperty(key)){
							Object.defineProperty(new_obj, key, {
									value: properties[key],
									writable: true,
									enumerable: true,
									configurable: false
								}
							);
						}
					}
				}
				return new_obj;
			};
		}
		
		if (Object.prototype.clear){
			Object.prototype.clear = 	function(){
											for (var prop in this){
												if (this.hasOwnProperty(prop)){
													delete this[prop]; 
												}
											}
											return this;
										};
		
		}
		
		if (Array.prototype.clear){
			Array.prototype.clear = function(){
										this.length = 0;
										return this;
									};	
		}	
		
		if (!Array.prototype.map){
			Array.prototype.map = function(extract_element_val /*,A*/){
				if (!Utils.isFunction(extract_element_val)){
					throw new TypeError();
				}else{
					var len = this.length;
					var res = new Array(len);
					var A = arguments[1];
					for (var i = 0; i < len; i++)
					{
						if (i in this){
							res[i] = extract_element_val.call(A, this[i], i, this);
						}
					}

					return res;
				}
			};	
		}	
		
		if (!Array.prototype.max){
			Array.prototype.max = function(extract_element_val){
										if (Utils.isFunction(extract_element_val)){
											return Math.max.apply(Math, this.map(extract_element_val));
										}else{
											return Math.max.apply(Math, this);
										}
									};	
		}	
		
		if (!Array.prototype.min){
			Array.prototype.min = function(extract_element_val){
										if (Utils.isFunction(extract_element_val)){
											return Math.min.apply(Math, this.map(extract_element_val));
										}else{
											return Math.min.apply(Math, this);
										}
									};	
		}		
			
		var utils = {
			isArray: function(obj) {
				return obj && (obj.constructor === Array);
			},
			isFunction: function(arg) {
				return typeof arg === 'function';
			}		
		};
		Object.freeze(utils);
		return utils;
	})();
}