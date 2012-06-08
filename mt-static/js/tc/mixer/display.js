TC.Mixer.Display=function(mixer,elementOrId,source,start,count,imageProperty)
{this.mixer=mixer;this.id=elementOrId;this.source=source;this.start=start;this.count=count;this.imageProperty=imageProperty;this.simple=false;this.pager=true;this.events=true;this.entryElements=[];this.dirty=true;this.displayed=false;var self=this;this.entryClickClosure=function(evt){return self.entryClick(evt,this.getAttribute("entryName"));};this.prevClickClosure=function(evt){return self.prevClick(evt);};this.nextClickClosure=function(evt){return self.nextClick(evt);};}
TC.Mixer.Display.prototype.entryClassName="tc-mixer-entry";TC.Mixer.Display.prototype.selectedClassName="tc-mixer-selected";TC.Mixer.Display.prototype.selectedEntryClassName="tc-mixer-entry tc-mixer-selected";TC.Mixer.Display.prototype.disabledClassName="tc-mixer-disabled";TC.Mixer.Display.prototype.propsClassName="tc-mixer-props";TC.Mixer.Display.prototype.entryProperties={"title":"Title:","description":"Description:","author":"Author:","tags":"Tags:","url":"URL:"};TC.Mixer.Display.prototype.clone=function()
{var clone=new TC.Mixer.Display;for(var i in this)
clone[i]=this[i];return clone;}
TC.Mixer.Display.prototype.display=function()
{if(!this.init())
return;if(this.source.length==0)
{this.clear();return;}
if(TC.getStyle(this.displayElement,"display")=="none"||TC.getStyle(this.displayElement,"visibility")=="hidden")
{this.displayed=false;return;}
this.displayed=true;var start=this.start+(this.page*this.count);if(start<0)
start+=this.source.length;if(start<0||start>=this.source.length)
return;var end=start+this.count;if(end<0)
end=-1;else if(end>=this.source.length)
end=this.source.length;var delta=this.count<0?-1:1;var changed=false;var entryElements=[];for(var i=start;i!=end;i+=delta)
{var entry=this.source[i];if(!entry)
{changed=true;continue;}
var element=this.entryElements[entryElements.length];var name=element?element.getAttribute("entryName"):null;if(entry.name!=name)
{element=this.makeEntryElement(entry);changed=true;}
element.className=(entry==this.mixer.entry)?this.selectedEntryClassName:this.entryClassName;entryElements.push(element);}
if(!changed)
return;this.entryElements=entryElements;this.clear();for(var i in entryElements)
{var element=entryElements[i];if(typeof(element)!='object')
continue;this.displayElement.appendChild(element);if(this.events)
{element.onclick=this.entryClickClosure;for(var j in this.mixer.entryEvents)
element["on"+j]=this.mixer.entryEvents[j];}}
this.displayOther();}
TC.Mixer.Display.prototype.displayOther=function()
{if(this.pageCount==1||this.page==0)
TC.addClassName(this.prevElement,this.disabledClassName);else
TC.removeClassName(this.prevElement,this.disabledClassName);if(this.pageCount==1||this.page==(this.pageCount-1))
TC.addClassName(this.nextElement,this.disabledClassName);else
TC.removeClassName(this.nextElement,this.disabledClassName);}
TC.Mixer.Display.prototype.makeEntryElement=function(entry)
{if(!entry)
return null;var element=this.simple?this.simpleElement:this.element;if(element)
{var clone=element.cloneNode(true);if(clone)
return clone;else
return element;}
element=this.document.createElement("div");element.setAttribute("entryName",entry.name);element.title=entry.title||entry.name;element.className=this.entryClassName;var span=this.document.createElement("span");span.className="hidden";span.innerHTML=entry.url;element.appendChild(span);var img=this.document.createElement("img");img.src=entry[this.imageProperty];img.alt=entry.title||entry.name;element.appendChild(img);if(!this.simple)
{var props=this.document.createElement("div");props.className=this.propsClassName;element.appendChild(props);for(var ep in this.entryProperties)
{var epLabel=trans(this.entryProperties[ep]);var epValue=entry[ep]||" ";if(epValue.join)
epValue=epValue.join(", ");if(typeof(epValue)!="string")
continue;var prop=this.document.createElement("div");prop.className=ep;props.appendChild(prop);var label=this.document.createElement("span");label.className="label";label.appendChild(this.document.createTextNode(epLabel));prop.appendChild(label);var content=this.document.createElement("span");content.className="content";if(epLabel=="URL:"){var link=this.document.createElement("a");link.href=epValue;link.appendChild(this.document.createTextNode("CSS File"));content.appendChild(link);}else{content.appendChild(this.document.createTextNode(epValue));}
prop.appendChild(content);}}
if(this.simple)
entry.simpleElement=element;else
entry.element=element;return element;}
TC.Mixer.Display.prototype.clear=function()
{if(!this.document)
return;var elements=this.displayElement.childNodes;var entryElements=[];for(var i=0;i<elements.length;i++)
{if(TC.hasClassName(elements[i],this.entryClassName))
entryElements.push(elements[i]);}
for(var i in entryElements)
{try
{this.displayElement.removeChild(entryElements[i]);}
catch(e){};}}
TC.Mixer.Display.prototype.init=function()
{if(!this.document)
{this.displayElement=TC.elementOrId(this.id);if(this.displayElement)
this.id=this.displayElement.id;if(!this.displayElement)
return false;this.document=this.displayElement.ownerDocument;if(!this.document)
this.document=document;this.prevElement=this.document.getElementById(this.id+"-prev");TC.attachEvent(this.prevElement,"click",this.prevClickClosure);this.nextElement=this.document.getElementById(this.id+"-next");TC.attachEvent(this.nextElement,"click",this.nextClickClosure);this.clear();}
if(!this.dirty)
return true;this.initPages();this.dirty=false;return true;}
TC.Mixer.Display.prototype.initPages=function()
{this.absCount=Math.abs(this.count);this.pageCount=Math.ceil(this.source.length/this.absCount);this.page=0;if(!this.pager)
return;if(this.source.length<=this.count||this.count==1)
return;var delta=this.count<0?-1:1;for(var i=0;i<this.source.length;i++)
{var n=this.start+(i*delta);while(n<0)
n+=this.source.length;while(n>=this.source.length)
n-=this.source.length;var entry=this.source[n];if(entry==this.mixer.entry)
{this.page=Math.floor(i/this.absCount);break;}}}
TC.Mixer.Display.prototype.setPage=function(page)
{if(page<0)
page=0;else if(page>=this.pageCount)
page=this.pageCount-1;this.page=page;}
TC.Mixer.Display.prototype.prevPage=function()
{return this.setPage(this.page-1);}
TC.Mixer.Display.prototype.nextPage=function()
{return this.setPage(this.page+1);}
TC.Mixer.Display.prototype.entryClick=function(evt,name)
{evt=evt||event;if(name)
this.mixer.selectEntry(name);}
TC.Mixer.Display.prototype.prevClick=function(evt)
{this.prevPage();this.display();}
TC.Mixer.Display.prototype.nextClick=function(evt)
{this.nextPage();this.display();}