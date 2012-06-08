TC.WordSelect=function(element)
{var self=this;this.mouseDownClosure=function(evt){return self.mouseDown(evt);};this.mouseUpClosure=function(evt){return self.mouseUp(evt);};this.clickClosure=function(evt){return self.click(evt);};this.doubleClickClosure=function(evt){return self.doubleClick(evt);};this.selectStartClosure=function(evt){return self.selectStart(evt);};this.selectionChangeClosure=function(evt){return self.selectionChange(evt);};this.init(element);}
TC.WordSelect.prototype.downTime=0;TC.WordSelect.prototype.upTime=0;TC.WordSelect.prototype.clickInterval=10000;TC.WordSelect.prototype.doubleClickInterval=333;TC.WordSelect.prototype.doubleClicked=false;TC.WordSelect.prototype.init=function(element)
{element=TC.elementOrId(element);if(!element)
return;this.element=element;var self=this;TC.attachEvent(element,"mousedown",this.mouseDownClosure);TC.attachEvent(element,"mouseup",this.mouseUpClosure);TC.attachEvent(element,"click",this.clickClosure);TC.attachEvent(element,"dblclick",this.doubleClickClosure);TC.attachEvent(element,"selectstart",this.selectStartClosure);TC.attachEvent(element,"selectionchange",this.selectionChangeClosure);}
TC.WordSelect.prototype.mouseDown=function(evt)
{this.doubleClicked=false;var date=new Date();var time=date.getTime();if(this.upTime>this.downTime)
{this.clickInterval=time-this.downTime;this.clickInterval=(time-this.upTime)*2;if(this.clickInterval<=this.doubleClickInterval)
{this.doubleClicked=true;if(!TC.defined(this.element.onselectionchange))
return this.selectionChange(evt);}}
this.downTime=time;}
TC.WordSelect.prototype.mouseUp=function(evt)
{var date=new Date();this.upTime=date.getTime();var selection=TC.getSelection(this.element);var range=TC.createRange(selection,this.element);if(!range)
return;if(range.startContainer&&range.collapsed)
{var node=range.endContainer;while(node)
{if(node.nodeType==1&&node.tagName.toLowerCase()=="a")
{this.expelCursor(selection,range,node);break;}
node=node.parentNode;}}}
TC.WordSelect.prototype.click=function(evt)
{evt=evt||event;var element=evt.target||evt.srcElement;}
TC.WordSelect.prototype.doubleClick=function(evt)
{if(this.doubleClicked||this.clickInterval>this.doubleClickInterval)
{this.doubleClickInterval=this.clickInterval;this.selectWord();}
this.doubleClicked=false;TC.stopEvent(evt);return false;}
TC.WordSelect.prototype.selectStart=TC.WordSelect.prototype.mouseDown;TC.WordSelect.prototype.selectionChange=function(evt)
{if(this.doubleClicked)
{this.doubleClicked=false;return this.selectWord(evt);}}
TC.WordSelect.prototype.expelCursor=function(selection,range,node)
{var parentNode=node.parentNode;var end=range.endContainer;if(!end)
return;if(range.startOffset==0)
{var t=(node.previousSibling&&node.previousSibling.nodeType==3)?node.previousSibling:node.ownerDocument.createTextNode("");parentNode.insertBefore(t,node);selection.collapse(t,(t.data?t.data.length:0));}
else if(range.endOffset>=(end.data?end.data.length:end.childNodes.length))
{var t=(node.nextSibling&&node.nextSibling.nodeType==3)?node.nextSibling:node.ownerDocument.createTextNode("");parentNode.insertBefore(t,node.nextSibling);selection.collapse(t,0);}}
TC.WordSelect.prototype.fixSelection=function()
{var selection=TC.getSelection(this.element);var range=TC.createRange(selection,this.element);if(!range)
return;if(range.startContainer)
{if(range.collapsed)
return;var node=range.endContainer;if(node.nodeType==1&&range.endOffset>0)
node=node.childNodes[range.endOffset-1];else if(node.nodeType==3&&range.endOffset==0)
node=node.previousSibling;else
node=node.lastChild;if(node&&node.nodeType==1&&node.tagName.toLowerCase()=="br")
range.setEndBefore(node);}}
TC.WordSelect.prototype.selectWord=function(evt)
{var selection=TC.getSelection(this.element);var range=TC.createRange(selection,this.element);if(!range)
return;if(range.startContainer)
{if(!range.collapsed||range.startContainer.nodeType!=3)
return;var startNode=range.startContainer;var startOffset=0;var text=startNode.data.substr(0,range.startOffset)+"T";while(startOffset<=0)
{startOffset=text.search(/\S+$/);if(startOffset<=0)
{var node=TC.getPreviousTextNode(startNode,true);if(node)
{startNode=node;startOffset=0;text=node.data+"T";}
else
{startOffset=0;break;}}}
var endNode=range.endContainer;var endOffset=0;text=endNode.data.substr(range.endOffset,endNode.data.length);while(endOffset<=0)
{endOffset=text.search(/\s/);if(endOffset==0)
break;else if(endOffset<0)
{var node=TC.getNextTextNode(endNode,true);if(node)
{endNode=node;endOffset=0;text=node.data;}
else
{endOffset=endNode.data.length;break;}}}
if(endNode==range.endContainer)
endOffset+=range.endOffset;if(endOffset>endNode.data.length)
endOffset=endNode.data.length;try
{selection.collapse(startNode,startOffset);selection.extend(endNode,endOffset);}
catch(e){}}
else if(TC.defined(range.text))
{range.expand("word");if(range.text.length==0)
range.moveEnd("character",1000000);var start=range.text.search(/\S/);if(start<0)
start=0;range.moveStart("character",start);var end=range.text.search(/\s/);if(end<0)
end=range.text.length;if(end==0)
end=1;range.collapse(true);range.moveEnd("character",end);range.select();}
if(evt)
{TC.stopEvent(evt);return false;}}
TC.WordSelect.prototype.bubbleBreaks=function(element)
{if(!element)
element=this.element;if(!element.hasChildNodes)
return;var node=element.firstChild;while(node)
{this.bubbleBreaks(node);node=node.nextSibling;}
var parent=element.parentNode;if(!parent||!TC.isInlineNode(element))
return;node=element.lastChild;while(node&&node.nodeType==1&&node.tagName.toLowerCase()=="br")
{element.removeChild(node);parent.insertBefore(node,element.nextSibling);node=element.lastChild;}}