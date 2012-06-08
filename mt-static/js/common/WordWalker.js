WordWalker=new Class(Object,{WORD_START:/[a-zA-Z0-9\u00C0-\u00FF\u0101-\u017F]/,WORD_END:/\.(?=[^a-zA-Z\u00C0-\u00FF\u0101-\u017F0-9'\u2018,][^a-z\u00DF-\u00FF]|[\s]*$)|['"\u2018\u2019\u201c\u201d](?=\s|\)|\]|,)|[^a-zA-Z0-9\u00C0-\u00FF\u0101-\u017F\u2018\-\.'](?!\.\d)|s(?=\))/,init:function(rootNode,nodeFilter){this.rootNode=rootNode;this.nodeFilter=nodeFilter;this.reset();},reset:function(){this.range=undefined;this.word=undefined;this.length=0;return undefined;},getNextWord:function(){if(defined(this.range)){this.range.setStart(this.range.endContainer,this.range.endOffset);this.range.collapse(true);}else{this.reset();var node=DOM.Proxy.getNextTextNode(this.rootNode);if(!node)
return undefined;this.range=new SelectionRange(node,0);this.range.collapse(true);}
this.word=undefined;var proxy=new DOM.Proxy(this.range.startContainer);while(defined(proxy.node)&&!defined(this.word)){if(proxy.node.nodeType==Node.TEXT_NODE){if(proxy.node!=this.range.startContainer)
this.range.setStart(proxy.node,0);var value=proxy.node.nodeValue;var sub=value.substring(this.range.startOffset,value.length);var offset=sub.search(this.WORD_START);if(offset>=0)
this.word="";else
offset=sub.length;this.range.startOffset+=offset;this.range.collapse(true);}
if(!defined(this.word))
proxy.getNextNode();if(proxy.node===this.rootNode)
break;}
if(!defined(this.word))
return this.reset();var done=false;while(!done&&defined(proxy.node)){if(proxy.node.nodeType==Node.TEXT_NODE){if(proxy.node!=this.range.startContainer)
this.range.setEnd(proxy.node,0);var value=proxy.node.nodeValue;var sub=value.substring(this.range.endOffset,value.length);var offset=sub.search(this.WORD_END);if(offset>=0)
done=true;else
offset=sub.length;this.range.endOffset+=offset;this.word+=sub.substr(0,offset);}
proxy.getNextNode();if(!defined(proxy.node)||proxy.node===this.rootNode||!DOM.isInlineNode(proxy.node))
break;}
if(this.word.length==0)
return this.reset();this.length++;return this.word;}});