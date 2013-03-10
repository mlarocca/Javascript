# JavaScript libs 

A collection of various JavaScript utilities and patterns

## JavaScript Object Oriented Extension
An extension lib to JavaScript core that allows effective encapsulation to cohexist with inheritance.

See more here: 

http://mlarocca.github.com/Javascript-OOE
https://github.com/mlarocca/Javascript-OOE

## Utilities (utils.js)

**Required by HTML 5 Storage and Asynchronous Image Loader**

Various utilities functions added to Arrays and Objects prototypes, plus a Utils object added to global namespace which provides a few more useful functions.

## HTML 5 Storage

A wrapper for the HTML 5 local storage functionalities; it exposes an interface to friendly handle session and persistent storage, handle browser compatibility and quota errors
The operations exposed are:

* Store a value v in the field f on localStorage:
	```bash
	StorageWrapper.store(f, v);
	```
* Store a value v in the field f on sessionStorage:
	```bash
	StorageWrapper.store(f, v, true);
	```	
* Delete field f from localStorage:
	```bash
	StorageWrapper.store(f);
	```
	
	Or simply:
	```bash
	StorageWrapper.remove(f);
	```			
* Delete field f from sessionStorage:
	```bash
	StorageWrapper.store(f, undefined, true);
	```	
	
	Or simply:
	```bash
	StorageWrapper.remove(f, true);
	```	
* Delete field f from localStorage:

	```bash
	StorageWrapper.store(f);
	```
* Load the value stored for a field:

	```bash
	StorageWrapper.load(f);
	```	
	
	Note:
	- If local storage isn't supported, or no such key has been stored return null;
	- If both sessionStore and localStore contains a value associated with key,
			the session version has precedence. 	
				
	
An example of a wrapper object handling the insertion and persistence of an IPv4 address is implemented;
The IPStorageHandler object's interface exposes the following methods (see code for details):

* **enterIP(sessionOnly)**    

	Asks to insert a valid IP through promptFunction (by default, the js prompt function)
	The IP gets validated: IPv4 formatting only admitted, and for each of the four part
	of the address it will be checked if they are in the valid range.
	Return true iff the operation was complited and is saved on localStorage (or sessionStorage)
	If sessionOnly is passed and it's "truthy", saves the data on sessionStorage instead that on localStorage.
								
* **enterSessionIP()**
      
	shortcut for enterIP(true)
				
* **getIP(enterOnMiss)**

	Returns the value saved for the IP address field:
		- If there is a field saved both on sessionStorage and localStorage, the sessionStorage one has
		higher priority;
		- If no value at all is saved for the field, not even in localStorage, automatically calls enterIP(), unless enterOnMiss
		is an expression that evaluates to false;
		- In both cases, returns the value finally stored on HTML 5 local storage, if any, or null otherwise (returning null 
		is preferred to throwing an exception here, and checking is deferred to the caller)

* **removeIP()** 

	Deletes the value for the IP field saved in localStorage (NOT the one in sessionStorage - WARNING the value in sessionStorage
		will be erased anyway when the current page is closed);

* **removeSessionIP()** 

	Deletes the value for the IP field saved in sessionStorage (NOT the one in localStorage - WARNING the value in localStorage 
		will be kept even when the current page will be closed, and shared with other pages open on the same browser)

IPStorageWrapper is a singleton object; upon creation, the functions that handle value prompting and user feedback (by default here prompt and alert) can be customized.

## Asynchronous Image Loader

An asynch loader for images, with a loading queue to limit the number of simultaneous request;
The factory method 
```bash
asynchImageLoaderFactory(maxQueueSize, defaultDelay, onErrorFunction);
```	
returns a new Loader object, so that upon need you might decide to have more than one separate queue on your page, f.i. one queue for every website you are loading images from.
The size of the queue, a delay between each loading request and a function to handle errors on loading can be passed to the factory method.

The loading function
```bash
loadImage(destination_jquery_div, img_url, width, height)
```
takes as arguments a jquery wrapper for a div, the url of the image to load, and optional width and height parameters.

	
## Data Structures
* **Queues**
* **Priority Queues**
* **Graphs**
	Operation on graphs:
	1. Depth-First Search
	2. Breadth-First Search
	3. Dijkstra algorithm (single source shortest path)
	4. Prim algorithm (minimum spanning tree)
    
    
## Words in-document highlighting

Highlights arbitrary terms assigning up to 2 custom classes to it.
It is possible to use regular expressions as pattern and to choose to highlight only whole words matching it.
The _highlightClassName_ parameter can be used to easily remove all the highlighting in a DOM elements with one single call,
while the specificClassName parameter allow for highlighting each pattern with a different css style (but it is optional).
For each highlighted piece of text, a span is created in the original HTML document and (up to) 2 classes 
( _highlightClassName_ and _specificClassName_)are assigned to this new tag.

Based on <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html> by Johann Burkard