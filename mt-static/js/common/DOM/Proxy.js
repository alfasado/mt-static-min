DOM.Proxy=new Class(Object,{LEADING:-1,INITIAL:0,TRAILING:1,init:function(startNode){this.startNode=startNode;this.update(startNode);},update:function(node,edge){if(!node)
return;this.node=node||this.node;this.edge=edge||this.INITIAL;this.nodeType=this.node.nodeType||0;this.nodeName=this.node.nodeName||"";this.nodeValue=this.node.nodeValue||"";this.tagName=this.node.tagName||"";this.attributes=this.node.attributes||[];this.parentNode=this.node.parentNode;this.previousSibling=this.node.previousSibling;this.nextSibling=this.node.nextSibling;this.firstChild=this.node.firstChild;this.lastChild=this.node.lastChild;this.childNodes=this.node.childNodes||[];this.empty=false;return node;},getPreviousNode:function(){if(!this.node)
return undefined;if(this.lastChild&&this.edge!=this.LEADING&&!this.empty)
return this.update(this.lastChild,this.TRAILING);if(this.previousSibling)
return this.update(this.previousSibling,this.TRAILING);if(this.parentNode)
return this.update(this.parentNode,this.LEADING);return undefined;},getNextNode:function(){if(!this.node)
return undefined;if(this.firstChild&&this.edge!=this.TRAILING&&!this.empty)
return this.update(this.firstChild,this.LEADING);if(this.nextSibling)
return this.update(this.nextSibling,this.LEADING);if(this.parentNode)
return this.update(this.parentNode,this.TRAILING);return undefined;},toSource:function(){return this.serialize.apply(this,arguments);},serialize:function(){switch(this.nodeType){case Node.TEXT_NODE:return this.serializeTextNode();case Node.COMMENT_NODE:return this.serializeComment();case Node.ELEMENT_NODE:return this.serializeElement();default:log("Unknown nodeType: "+this.nodeType);}
return"";},serializeChildNodes:function(){var source="";for(var i=0;i<this.childNodes.length;i++){var proxy=new this.constructor(this.childNodes[i]);source+=proxy.serialize();}
return source;},serializeTextNode:function(){return this.nodeValue.encodeHTML();},serializeComment:function(){return"<!-- "+this.nodeValue.encodeHTML()+" -->";},serializeElement:function(){if(!this.tagName)
return"";var source="<"+this.tagName;source+=this.serializeAttributes();if(this.empty)
source+=" />";else{source+=">";source+=this.serializeChildNodes();source+="</"+this.tagName+">";}
return source;},serializeAttributes:function(){var source="",value;for(var i=0;i<this.attributes.length;i++){var name=this.attributes[i].nodeName;value=this.attributes[i].nodeValue;if(exists(value)&&typeof value!="boolean")
value=value.toString().encodeHTML();else
value="";source+=" "+name+"=\""+value+"\"";}
return source;}});extend(DOM.Proxy,{forPrevious:function(node,callback){var proxy=new this(node);while(node=proxy.getPreviousNode()){var out=callback(node,proxy.startNode);if(defined(out))
return out;}
return undefined;},forNext:function(node,callback){var proxy=new this(node);while(node=proxy.getNextNode()){var out=callback(node,proxy.startNode);if(defined(out))
return out;}
return undefined;},getPreviousTextNode:function(node){return this.forPrevious(node,DOM.isTextNode);},getPreviousInlineTextNode:function(node){return this.forPrevious(node,DOM.isInlineTextNode);},getNextTextNode:function(node){return this.forNext(node,DOM.isTextNode);},getNextInlineTextNode:function(node){return this.forNext(node,DOM.isInlineTextNode);},findText:function(node,text){if(node.nodeType==Node.TEXT_NODE){var offset=node.nodeValue.indexOf(text);if(offset>=0)
return{node:node,offset:offset};}else if(node.nodeType==ELEMENT_NODE&&node.childNodes){for(var i=0;i<node.childNodes.length;i++){var found=this.findText(node.childNodes[i],text);if(found.node)
return found;}}
return{node:undefined,offset:0};},findTextPosition:function(node,offset){var position={node:undefined,offset:0};while(node){if(node.nodeType==Node.TEXT_NODE){position.offset+=node.length;var delta=position.offset-offset;if(delta>=0){position.node=node;position.offset=node.length-delta;break;}}
node=this.getNextTextNode(node);}
return position;},serialize:function(node){var proxy=new this(node);return proxy.serialize();},serializeChildNodes:function(node){var proxy=new this(node);return proxy.serializeChildNodes();}});