TC.Focus=function(rootElement,className,tagNames)
{this.rootElement=TC.elementOrId(rootElement);if(className)
this.className=className;if(tagNames)
this.tagNames=tagNames;this.elements=[];var self=this;this.focusClosure=function(evt)
{return self.focus(evt);};TC.attachDocumentEvent(window,"focus",this.focusClosure,true);TC.attachDocumentEvent(window,"focusin",this.focusClosure,true);TC.attachDocumentEvent(window,"mousedown",this.focusClosure,true);}
TC.Focus.prototype.className="focus";TC.Focus.prototype.tagNames=[];TC.Focus.prototype.focus=function(evt)
{evt=evt||event;var element=evt.target||evt.srcElement;if(!element)return;if(element.nodeType==9)
return;if(element.nodeType==3)
element=element.parentNode;var unfocus=false;if(this.tagNames.length)
{unfocus=true;var tagName=element.tagName.toLowerCase();for(var i=0;i<this.tagNames.length;i++)
{if(tagName==this.tagNames[i])
{unfocus=false;break;}}}
var elements=[];while(element)
{elements[elements.length]=element;if(element==this.rootElement)
break;element=element.parentNode;}
if(this.rootElement&&element!=this.rootElement)
return;var length=elements.length>this.elements.length?elements.length:this.elements.length;for(var i=1;i<=length;i++)
{var newElement=unfocus?null:elements[elements.length-i];var oldElement=this.elements[this.elements.length-i];if(oldElement&&oldElement!=newElement)
TC.removeClassName(oldElement,this.className);if(newElement)
TC.addClassName(newElement,this.className);}
this.elements=elements;return true;}