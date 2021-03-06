Dialog={};Dialog.Simple=new Class(Object,{init:function(name){this.name=name;this.callback=null;this.element=TC.elementOrId(name+"-dialog");},close:function(data){if(this.callback)this.callback(data);},open:function(data,callback){if(callback)this.callback=callback;this.render();},render:Function.stub});Dialog.MultiPanel=new Class(Dialog.Simple,{init:function(name){Dialog.MultiPanel.superClass.init.apply(this,arguments);this.panels=[];this.currentPanel=0;},setPanels:function(panels){this.panels=[];for(var i=0;i<panels.length;i++){var panel;if(typeof panels[i]=='object'){panel=panels[i];}else{panel=new ListingPanel(panels[i]);}
panel.parent=this;this.panels[this.panels.length]=panel;}
this.currentPanel=0;this.panels[0].show();},nextPanel:function(){if(this.currentPanel+1>=this.panels.length)
return;var old_panel=this.panels[this.currentPanel];var new_panel=this.panels[this.currentPanel+1];new_panel.show();old_panel.hide();this.currentPanel++;},previousPanel:function(){if(this.currentPanel-1<0)
return;var old_panel=this.panels[this.currentPanel];var new_panel=this.panels[this.currentPanel-1];new_panel.show();old_panel.hide();this.currentPanel--;},selectPanel:function(index){index=1*index;if(index<0||this.panels.length<=index)
return;if(index==this.currentPanel)
return;var old_panel=this.panels[this.currentPanel];var new_panel=this.panels[index];new_panel.show();old_panel.hide();this.currentPanel=index;}});SelectionList=new Class(Object,{init:function(el){this.container=el;this.itemHash={};this.itemList=[];this.onChange=null;this.render();},toggle:function(name,data){if(name in this.itemHash)
this.remove(name,data);else
this.add(name,data);},add:function(name,data){if(!(name in this.itemHash)){var display=name;var row=TC.elementOrId(name);if(!data||(data&&!data.label)){if(!data)data={};if(row){var label=row.getElementsByTagName("label")[0];if(label)
data.label=label.innerHTML;}
if(!data.label)data.label=name;}
this.itemHash[name]=data;this.itemList[this.itemList.length]=name;this.changed(true,name,this.itemHash[name]);this.render();}},remove:function(name){if(name in this.itemHash){var pos;for(pos=0;pos<this.itemList.length;pos++){if(this.itemList[pos]==name){this.itemList.splice(pos,1);this.changed(false,name,this.itemHash[name]);delete this.itemHash[name];this.render();return;}}}},changed:function(selected,name,data){if(this.onChange)this.onChange(this,selected,name,data);},render:function(){if(!this.container)return;this.container.innerHTML='';var doc=TC.getOwnerDocument(this.container);var self=this;var makeclosure=function(x){return function(){self.remove(x)}};for(var i=0;i<this.itemList.length;i++){var p=this.itemList[i];var d=this.itemHash[p];var l=d.label;l.replace(/\s/g,'&nbsp;');var link=doc.createElement("span");link.setAttribute("id","selected-"+p);link.setAttribute("class","sticky-label selected-item");link.onclick=makeclosure(p);link.innerHTML=l+"&nbsp;<span class='remove clickable'>x</span>";this.container.appendChild(link);this.container.appendChild(doc.createTextNode(' '));}
if(this.itemList.length==0)
this.container.innerHTML=trans('(None)');},items:function(){var items=[];for(var i=0;i<this.itemList.length;i++)
items[i]=this.itemList[i];return items;}});Panel=new Class(Object,{init:function(name){this.parent=null;this.name=name;this.element=TC.elementOrId(name+"-panel");},show:function(){TC.removeClassName(this.element,"hidden");},hide:function(){TC.addClassName(this.element,"hidden");}});ListingPanel=new Class(Panel,{listChanged:function(ts,row,checked){if(this.selectionList){if(checked)
this.selectionList.add(row.id);else
this.selectionList.remove(row.id);}else{var count=ts.selected().length;if(this.nextButton){if(count==0)
TC.addClassName(this.nextButton,"disabled");else
TC.removeClassName(this.nextButton,"disabled");this.nextButton.disabled=count==0;}
if(this.closeButton){if(count==0)
TC.addClassName(this.closeButton,"disabled");else
TC.removeClassName(this.closeButton,"disabled");this.closeButton.disabled=count==0;}}},init:function(name,searchtype){ListingPanel.superClass.init.apply(this,arguments);var self=this;this.listData=TC.getElementsByTagAndClassName("div","list-data",this.element)[0];this.datasource=new Datasource(this.listData,name,searchtype);this.pager=new Pager(TC.getElementsByTagAndClassName("div","pagination",this.element)[0]);this.datasource.setPager(this.pager);this.datasource.onUpdate=function(ds){if(self.selectionList)
self.tableSelect.selectThese(self.selectionList.items());};var search=TC.getElementsByTagAndClassName("input","search-input",this.element);if(search&&search.length){this.searchField=search[0];this.searchField.form.onsubmit=function(){self.datasource.search(self.searchField.value);if(self.searchReset)
TC.removeClassName(self.searchReset,"hidden");return false;};}
var search_reset=TC.getElementsByClassName("search-reset",this.element);if(search_reset&&search_reset.length){this.searchReset=search_reset[0];this.searchReset.onclick=function(){self.datasource.navigate(0);self.searchField.value="";TC.addClassName(self.searchReset,"hidden");return false;};}
var next=TC.getElementsByTagAndClassName("button","next",this.element);if(next&&next.length){this.nextButton=next[0];this.nextButton.onclick=function(){self.parent.nextPanel();};}
var previous=TC.getElementsByTagAndClassName("button","previous",this.element);if(previous&&previous.length){this.previousButton=previous[0];this.previousButton.onclick=function(){self.parent.previousPanel();};}
var cancel=TC.getElementsByTagAndClassName("button","cancel",this.element);if(cancel&&cancel.length){this.cancelButton=cancel[0];this.cancelButton.onclick=function(){self.parent.close(false);};}
var close=TC.getElementsByTagAndClassName("button","close",this.element);if(close&&close.length){this.closeButton=close[0];this.closeButton.onclick=function(){self.parent.close(true);};}
var selector=TC.getElementsByTagAndClassName("div","selector",this.element);if(selector&&selector.length){this.tableSelect=new TC.TableSelect(selector[0]);this.tableSelect.rowSelect=true;this.tableSelect.onChange=function(ts,row,checked){self.listChanged(ts,row,checked);};}
var items=TC.getElementsByClassName("items",this.element);if(items&&items.length){this.selectionList=new SelectionList(items[0]);this.selectionList.onChange=function(sl,selected,name,data){var row=TC.elementOrId(name);if(row){self.tableSelect.selectRow(row,selected);self.tableSelect.selectAll();}
var items=sl.items();if(self.nextButton){if(items.length==0)
TC.addClassName(self.nextButton,"disabled");else
TC.removeClassName(self.nextButton,"disabled");self.nextButton.disabled=items.length==0;}
if(self.closeButton){if(items.length==0)
TC.addClassName(self.closeButton,"disabled");else
TC.removeClassName(self.closeButton,"disabled");self.closeButton.disabled=items.length==0;}};}}});