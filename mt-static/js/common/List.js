List=new Class(Component,{disableUnSelect:false,viewMode:"tile",enableMagnifier:false,magnifierElement:null,magnifyDelay:100,singleSelect:false,updateCache:false,cacheObject:null,perPage:30,noClickSelection:false,hoverDelay:100,checkboxSelection:false,selectLimit:0,activatable:true,flyoutClasses:["flyout-left","flyout-right","flyout-top","flyout-bottom"],initObject:function(element,templateName){arguments.callee.applySuper(this,arguments);this.content=DOM.getElement(element+"-content");if(!this.content)
this.content=this.element;if(!templateName)
throw"List now takes an element, and a template as arguments";this.templateName=templateName;this.selected=[];this.focused=false;this.itempos={};this.items=[];this.unselectable={};this.lastselected=null;this.hoverElement=null;this.hoveredElement=null;this.hoverTimer=null;this.cacheObject=null;this.currentPage=1;},destroyObject:function(){this.selected.length=0;this.selected=null;this.items.length=0;this.items=null;this.unselectable=null;this.content=null;this.hoverElement=null;this.hoveredElement=null;this.magnifierElement=null;this.magnifierElementContent=null;this.cacheObject=null;arguments.callee.applySuper(this,arguments);},initEventListeners:function(){arguments.callee.applySuper(this,arguments);this.addEventListener(this.element,"DOMMouseScroll","eventDOMMouseScroll");DOM.addEventListener(this.element,"selectstart",Event.stop);},clearHover:function(){if(this.hoverElement)
DOM.removeClassName(this.hoverElement,"list-item-hover");this.hoverElement=null;if(this.hoverTimer)
this.hoverTimer.destroy();this.hoverTimer=null;},clearHovered:function(){if(this.hoveredElement)
DOM.removeClassName(this.hoveredElement,"list-item-hover");},deactivate:function(){arguments.callee.applySuper(this,arguments);this.clearHover();},setOption:function(opt,value){switch(opt){case"magnifierElement":if(!value)
break;this.magnifierElement=$(value);if(!this.magnifierElement)
break;this.magnifierElementContent=$(value+'-content');if(!this.magnifierElementContent)
this.magnifierElementContent=this.magnifierElement;if(!this.magnifierElement.mouseOverSet){var el=this.magnifierElement;DOM.addEventListener(this.magnifierElementContent,"mouseover",function(){DOM.addClassName(el,"hidden");});this.magnifierElement.mouseOverSet=true;}
break;case"enableMagnifier":if(!value)
DOM.addClassName(this.magnifierElement,"hidden");this[opt]=value;break;case"viewMode":DOM.removeClassName(this.element,/^mode-.*/);DOM.addClassName(this.element,"mode-"+value);this[opt]=value;break;case"singleselect":opt="singleSelect";default:this[opt]=value;}},setModel:function(model){if(this.model)
this.model.removeObserver(this);this.model=model;this.model.addObserver(this);this.retrieveItems();},getSelectedLength:function(){return this.selected.length;},getSelectedIDs:function(){return this.selected;},getFirstSelected:function(){return this.selected.length?this.selected[0]:null;},getSelectedItems:function(){var selected=[];for(var i=0;i<this.selected.length;i++)
selected.push(this.items[this.itempos[this.selected[i]]]);return selected;},getFirstItem:function(){return this.items.length?this.items[0]:null;},getItem:function(id){if(!defined(this.itempos[id]))
return null;else
return this.items[this.itempos[id]];},getItems:function(){return this.items;},getItemIds:function(){var ids=[];for(var i=0;i<this.items.length;i++)
ids.push(this.items[i].itemId);return ids;},replaceItems:function(items){var current=this.selected;this.resetView();for(var i=0;i<items.length;i++)
this.addItem(items[i],(current.indexOf(items[i].id)!=-1)?true:false);this.broadcastToObservers("listItemsUpdated",this,false,items);},updateItems:function(items,classes){for(var i=0;i<items.length;i++){var id=items[i].id;var pos=this.itempos[id];var zebra=(pos%2)?"even":"odd";if(!defined(pos))
continue;var selected=(this.selected.indexOf(id)!=-1)?true:false;var div=document.createElement("div");div.className=defined(classes)?classes:"list-item "+zebra;div.innerHTML=Template.process(this.templateName,{div:div,item:items[i],is:{selected:selected},list:this,index:pos});div.itemId=items[i].id;if(selected){DOM.addClassName(div,"selected");if(this.checkboxSelection)
this.toggleCheckbox(div,true);}
this.content.replaceChild(div,this.items[pos]);this.items[pos]=div;if(this.updateCache&&this.cacheObject)
this.cacheObject.setItem(items[i].id,items[i]);}
if(this.items.length)
this.setListEmpty(false);this.broadcastToObservers("listItemsUpdated",this,true,items);},addItem:function(item,selected,classes){this.setListEmpty(false);var pos=this.items.length;var zebra=(pos%2)?"even":"odd";var div=document.createElement("div");div.className=defined(classes)?classes:"list-item "+zebra;div.innerHTML=Template.process(this.templateName,{div:div,item:item,is:{selected:selected},list:this,index:pos});div.itemId=item.id;if(defined(item.type))
div.type=item.type;if(defined(item.unselectable)&&item.unselectable)
this.unselectable[item.id]=true;this.content.appendChild(div);this.items.push(div);this.itempos[item.id]=pos;if(this.updateCache&&this.cacheObject)
this.cacheObject.setItem(item.id,item);if(selected){DOM.addClassName(div,"selected");if(this.checkboxSelection)
this.toggleCheckbox(div,true);this.selected.add(item.id);}},removeItem:function(itemid){if(!defined(this.itempos[itemid]))
return;log("remove item "+itemid);this.removeItems([itemid]);},removeItems:function(items){var itemids=[];for(var i=0;i<items.length;i++){var idx=this.itempos[items[i]];if(!defined(idx))
continue;if(this.items[idx].itemId!=items[i])
continue;this.content.removeChild(this.items[idx]);if(this.lastselected==items[i])
this.lastselected=null;var len=this.items.length;for(var j=idx+1;j<len;j++)
this.itempos[this.items[j].itemId]=(j-1);this.selected.remove(items[i]);delete this.itempos[items[i]];this.items.splice(idx,1);if(this.items.length==0)
this.setListEmpty(true);itemids.push(items[i]);if(this.updateCache&&this.cacheObject)
this.cacheObject.deleteItem(items[i]);}
if(itemids.length)
this.broadcastToObservers("listItemsRemoved",this,itemids);},reset:function(){this.resetView();DOM.addClassName(this.element,"list-empty");},resetView:function(){this.selected=[];this.itempos={};var len=this.items.length;for(var i=0;i<len;i++)
this.content.removeChild(this.items[i]);this.items=[];this.lastselected=null;this.unselectable={};},setSelection:function(ids,nobcast){var startlen=this.selected.length;var idx;var selected=[];var e;for(var i=0;i<ids.length;i++){this.selected.add(ids[i]);idx=this.itempos[ids[i]];if(defined(idx)){e=this.items[idx];selected.push(e.itemId);DOM.addClassName(e,"selected");if(this.checkboxSelection)
this.toggleCheckbox(e,true);}}
if(nobcast)
return;if(startlen<this.selected.length&&selected.length)
this.broadcastToObservers("listItemsSelected",this,selected);},unsetSelection:function(ids){var startlen=this.selected.length;var selected=[];var idx;var e;for(var i=0;i<ids.length;i++){this.selected.remove(ids[i]);idx=this.itempos[ids[i]];if(!defined(idx))
continue;e=this.items[idx];selected.push(e.itemId);DOM.removeClassName(e,"selected");if(this.checkboxSelection)
this.toggleCheckbox(e,false);}
if(startlen>this.selected.length&&selected.length)
this.broadcastToObservers("listItemsUnSelected",this,selected);},resetSelection:function(){if(this.selected.length==0)
return;var selected=[];var idx;var e;for(var i=0;i<this.selected.length;i++){idx=this.itempos[this.selected[i]];if(!defined(idx))
continue;e=this.items[idx];selected.push(this.selected[i]);DOM.removeClassName(e,"selected");if(this.checkboxSelection)
this.toggleCheckbox(e,false);}
this.selected=[];if(selected.length)
this.broadcastToObservers("listItemsUnSelected",this,selected);},getListElementFromTarget:function(target){return DOM.getFirstAncestorByClassName(target,"list-item",true);},getItemIdFromTarget:function(target){var item=this.getListElementFromTarget(target);if(item)
return item.itemId;else
return undefined;},eventDOMMouseScroll:function(event){var delta=0;if(event.wheelDelta){delta=(event.wheelDelta*-0.5);}else if(event.detail){delta=(event.detail*10);}
var scrollt=this.content.scrollTop;this.content.scrollTop+=delta;if(scrollt!=this.content.scrollTop){this.reflow();event.stop();}},eventMouseDown:function(event){arguments.callee.applySuper(this,arguments);var ancestor=this.getListElementFromTarget(event.target);if(ancestor)
return;},eventDoubleClick:function(event){var ancestor=this.getListElementFromTarget(event.target);if(!ancestor)
return;if(this.selected.length)
this.broadcastToObservers("listItemsDoubleClicked",this,this.selected);},eventMouseOver:function(event){var element=this.getListElementFromTarget(event.target);if(element!==this.hoverElement){this.hoverElement=element;if(this.hoverTimer)
this.hoverTimer.destroy();this.hoverTimer=new Timer(this.getIndirectMethod("timedMouseover"),this.hoverDelay,1);if(!this.enableMagnifier||!element)
return;}
if(!this.enableMagnifier)
return;if(this.magnifierAttribute){var target=DOM.getMouseEventAttribute(event,this.magnifierAttribute);if(!target)
return;}
if(!this.cacheObject&&window.app&&app.assetCache)
this.cacheObject=app.assetCache;if(this.magnifyItemId&&this.magnifyItemId==element.itemId)
return;this.magnifyItemId=element.itemId;var item=this.cacheObject.getItem(this.magnifyItemId);if(!item)
return;this.magnifierElementContent.innerHTML=Template.process(this.magnifierTemplate,{item:item,list:this});if(this.magnifyTimer)
this.magnifyTimer.destroy();this.magnifyTimer=new Timer(this.getIndirectMethod("showMagnifier"),this.magnifyDelay,1);var cli=DOM.getClientDimensions();this.clientHX=cli.x/2;this.clientHY=cli.y/2;this.positionMagnifier(event);},showMagnifier:function(){if(!defined(this.magnifyItemId))
return;DOM.removeClassName(this.magnifierElement,"hidden");},eventMouseMove:function(event){if(!this.enableMagnifier||!defined(this.magnifyItemId)||!this.getListElementFromTarget(event.target))
return;this.positionMagnifier(event);},positionMagnifier:function(event){var m=DOM.getAbsoluteCursorPosition(event);var classX=(m.x>this.clientHX)?0:1;var classY=(m.y>this.clientHY)?2:3;if(classX!=this.magClassX||classY!=this.magClassY){for(var i=0;i<this.flyoutClasses.length;i++){if(i==classX||i==classY)
continue;DOM.removeClassName(this.magnifierElement,this.flyoutClasses[i]);}
DOM.addClassName(this.magnifierElement,this.flyoutClasses[classX]);DOM.addClassName(this.magnifierElement,this.flyoutClasses[classY]);this.magClassX=classX;this.magClassY=classY;}
m.x+=10;m.y+=15;DOM.setLeft(this.magnifierElement,m.x);DOM.setTop(this.magnifierElement,m.y);},eventMouseOut:function(event){var element;if(this.magnifierAttribute){var target=DOM.getMouseEventAttribute(event,this.magnifierAttribute);if(!target)
return;}else{element=this.getListElementFromTarget(event.relatedTarget);if(event.relatedTarget&&!element)
this.clearHover();}
if(this.enableMagnifier&&!element){if(this.magnifyTimer)
this.magnifyTimer.destroy();DOM.addClassName(this.magnifierElement,"hidden");this.magnifyItemId=undefined;event.stop();}},eventClick:function(event){if(this.noClickSelection)
return;var command=this.getMouseEventCommand(event);if(command)
return;var ancestor=this.getListElementFromTarget(event.target);if(!ancestor){if(event.ctrlKey||event.metaKey||event.shiftKey)
return;if(!this.disableUnSelect)
this.resetSelection();return;}
var itemId=ancestor.itemId;if(!this.singleSelect&&event.shiftKey){var sel=[];var start=this.itempos[this.lastselected]||0
var end=this.itempos[itemId];if(start>end){var tmp=end;end=start;start=tmp;}
for(var i=start;i<=end;i++){if(this.selectLimit&&(this.selected.length+sel.length)>=this.selectLimit){this.unsetSelection([this.items[i].itemId]);continue;}
if(this.selected.indexOf(this.items[i].itemId)==-1&&!this.unselectable[this.items[i].itemId])
sel.push(this.items[i].itemId);}
this.setSelection(sel);return;}else if(!this.singleSelect&&(event.ctrlKey||event.metaKey)){if(this.selected.indexOf(itemId)!=-1&&!this.unselectable[itemId]){this.lastselected=itemId;this.unsetSelection([itemId]);return;}}else{if(this.selected.length==1&&this.selected[0]==itemId){this.lastselected=itemId;if(this.toggleSelect)
this.unsetSelection([itemId]);return;}else{if(!this.toggleSelect&&!this.disableUnSelect)
this.resetSelection();}}
if(defined(this.unselectable[itemId]))
return;this.lastselected=itemId;if(this.toggleSelect){if(this.selected.indexOf(itemId)!=-1){log("unselecting "+itemId);this.unsetSelection([itemId]);return;}}
if(this.selectLimit&&this.selected.length>=this.selectLimit)
return this.unsetSelection([itemId]);log("selecting "+itemId);this.setSelection([itemId]);},timedMouseover:function(timer){if(this.hoveredElement)
this.clearHovered();if(this.hoverElement){DOM.addClassName(this.hoverElement,"list-item-hover");this.hoveredElement=this.hoverElement;}},listModelItems:function(modelobj,items,update,total,offset,count){this.length=total;this.broadcastToObservers("listTotal",this,total,this.currentPage,this.perPage,items.length);if(update){this.updateItems(items);return;}
DOM.removeClassName(this.element,"list-loading");if(modelobj.filteredEmpty)
this.setListEmpty(true,true);else if(modelobj.empty)
this.setListEmpty(true);else if(items.length)
this.setListEmpty(false);else if(!items.length)
this.setListEmpty(true);else
this.setListEmpty(false);this.replaceItems(items);},setListEmpty:function(empty,filtered){if(empty){if(filtered)
DOM.addClassName(this.element,"list-empty-filtered");else
DOM.removeClassName(this.element,"list-empty-filtered");DOM.addClassName(this.element,"list-no-results");}else{DOM.removeClassName(this.element,"list-no-results");DOM.removeClassName(this.element,"list-empty-filtered");}
DOM.removeClassName(this.element,"list-empty");this.broadcastToObservers("listEmpty",this,empty,filtered);},retrieveItems:function(){this.model.getItems(((this.currentPage-1)*this.perPage),this.perPage);},setPerPage:function(perPage){this.perPage=perPage;},setCurrentPage:function(currentPage){this.currentPage=currentPage;},listModelChanged:function(modelobj){this.retrieveItems();},pagerPageChange:function(pagerobj,page){this.setCurrentPage(page);this.retrieveItems();},componentActivated:function(comp){if(!this.enableMagnifier)
return;DOM.addClassName(this.magnifierElement,"hidden");},componentDeactivated:function(comp){if(!this.enableMagnifier)
return;DOM.addClassName(this.magnifierElement,"hidden");},toggleCheckbox:function(e,value){var es=e.getElementsByTagName("input");if(!es)
return;var type;for(var i=0;i<es.length;i++){type=es[i].getAttribute("type");type=type?type.toLowerCase():"";if(type=="checkbox"||type=="radio")
es[i].checked=value;}}});ListModel=new Class(Observable,{init:function(){arguments.callee.applySuper(this,arguments);if(arguments[0]instanceof Array)
this.source=arguments[0];app.c.addObserver(this);},getItems:function(start,end,callback){if(!start)
start=0;if(!end||end>this.source.length)
end=this.source.length;this.broadcastToObservers("listModelItems",this,this.source.slice(start,end));},assetsDeleted:function(cobj,ids){this.broadcastToObservers("listModelChanged",this);},assetsUpdated:function(cobj,ids){this.broadcastToObservers("listModelChanged",this);}});