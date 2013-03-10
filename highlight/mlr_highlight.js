/**
  * @author Marcello La Rocca marcellolarocca@gmail.com
  * Highlights arbitrary terms assigning up to 2 custom classes to it.
  * It is possible to use regular expressions as pattern and to choose to highlight only whole words matching it.
  * The highlightClassName parameter can be used to easily remove all the highlighting in a DOM elements with one single call,
  * while the specificClassName parameter allow for highlighting each pattern with a different css style (but it is optional).
  * For each highlighted piece of text, a span is created in the original HTML document and (up to) 2 classes 
  * (highlightClassName and specificClassName)are assigned to this new tag.
  * 
  * @param {String} pattern              The string [regular expression] to highlight.
  * @param {Boolean} wholeWordOnly       True iff only whole words matching pattern should be highlighted.
  * @param {String} highlightClassName   Name of the general class assigned to highlighted words: can be used for
  *                                      styling the highlighted text or just as a mean to remove highlighting 
  *                                      altogether with a single call.
  * @param {String} [specificClassName]  Name of the specific class that must be used to style the matching text.
  *
  * Based on 
  * <http://johannburkard.de/blog/programming/javascript/highlight-javascript-text-higlighting-jquery-plugin.html>
  * by Johann Burkard
  *
  */
jQuery.fn.highlight = function(pattern, wholeWordOnly, highlightClassName, specificClassName) {
    "use strict";

    var upperCasePattern = pattern.toUpperCase();
    var regex = wholeWordOnly ? new RegExp("(^" + pattern + "[\\W]+)|([\\W]+" + pattern + "[\\W]+)|([\\W]+" + pattern + "$)|(^"+ pattern + "$)", "gi") 
                              : new RegExp(pattern, "gi");
    
    function innerHighlight(node) {
        var nodesToSkip = 0;
        var pos;
        
        if (node.nodeType === Node.TEXT_NODE) {
            if (regex.test(node.data)) {
                
                //If the reg exp matches the content of the node, we need to find the index of pattern inside it
                pos = node.data.toUpperCase().indexOf(upperCasePattern);
                
                var spannode = document.createElement('span');
                spannode.className = highlightClassName + (specificClassName ? " " + specificClassName : "");
                var middlebit = node.splitText(pos);
                var endbit = middlebit.splitText(pattern.length);
                var middleclone = middlebit.cloneNode(true);
                spannode.appendChild(middleclone);
                middlebit.parentNode.replaceChild(spannode, middlebit);
                nodesToSkip = 1;
            }
        }
        else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            for (var i = 0; i < node.childNodes.length; ++i) {
                i += innerHighlight(node.childNodes[i]);
            }
        }
        return nodesToSkip;
    }
    
    return this.length && pattern && pattern.length ?   this.each(function() {
                                                            innerHighlight(this);
                                                        })
                                                    : this;
};

jQuery.fn.removeHighlight = function(highlightClassName) {
    "use strict";

    return this.find("span." + highlightClassName).each(function() {
                                                            //this.parentNode.firstChild.nodeName;
                                                            
                                                            this.parentNode.replaceChild(this.firstChild, this);
                                                            try{
                                                                this.parentNode.normalize();
                                                            }catch(e){
                                                                //Nothing to do
                                                            }
                                                            
                                                        }).end();
};


jQuery.fn.getText = function() {
    "use strict";
    
    function innerGetText(node) {
        var texts = [];
        
        if (node.nodeType === Node.TEXT_NODE) {
                //If the reg exp matches the content of the node, we need to find the index of pattern inside it
                texts.push(node.data);
        }
        else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes && !/(script|style)/i.test(node.tagName)) {
            
            for (var i = 0; i < node.childNodes.length; ++i) {
                texts.push(innerGetText(node.childNodes[i]));
            }
        }
        return texts.join(" ");
    }
    
    if (this.length > 0) {
        var results = [];
        var res;
        this.each(function() {
            results.push(innerGetText(this));
        });
        return results.join(" ");
    } else {
        return innerGetText(this);
    }
}; 