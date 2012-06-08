Dialog={};Dialog.Message=new Class(Modal,{eventClick:function(event){var command=this.getMouseEventCommand(event);if(!command)
return;command=(command=="ok"?true:false);event.stop();this.close(command);},eventKeyPress:function(event){switch(event.keyCode){case 13:var command=this.getMouseEventCommand(event);event.stop();if(command=="cancel")
this.close(false);else
this.close(true);break;case 27:event.stop();this.close(false);}},open:function(){arguments.callee.applySuper(this,arguments);if(typeof this.data=="string")
this.data={message:this.data};var e=DOM.getElement(this.element.id+"-message");if(e)
e.innerHTML=this.data.message;}});Dialog.Simple=new Class(Modal,{inputBlacklist:{image:defined,submit:defined},destroyObject:function(){this.firstInput=null;arguments.callee.applySuper(this,arguments);},eventKeyPress:function(event){switch(event.keyCode){case 13:if(event.target&&event.target.tagName&&event.target.tagName.toLowerCase()=="textarea")
return true;this.data=DOM.getFormData(this.element,this.data);this.close(this.data);return event.stop();case 27:this.close(false);}},eventClick:function(event){var command=this.getMouseEventCommand(event);switch(command){case"cancel":return this.close(false);case"ok":this.data=DOM.getFormData(this.element,this.data);return this.close(this.data);}},getFirstSpecifiedInput:function(element,data,firstInput){if(!element.tagName)
return firstInput;if(exists(element.name)&&!data.hasOwnProperty(element.name))
return firstInput;var tagName=element.tagName.toLowerCase();var type=element.getAttribute("type");type=type?type.toLowerCase():"";switch(tagName){case"input":if(this.inputBlacklist[type]===defined||type=="radio"||type=="checkbox")
return firstInput;case"textarea":case"select":if(!firstInput)
firstInput=element;return firstInput;}
for(var i=0;i<element.childNodes.length;i++){var firstInput=this.getFirstSpecifiedInput(element.childNodes[i],data);if(firstInput)
return firstInput;}},setFirstInput:function(){if(!this.firstInput)
this.firstInput=this.getFirstSpecifiedInput(this.element,this.data,null);},selectFirstInput:function(){if(this.firstInput&&this.firstInput.select)
this.firstInput.select();},focusFirstInput:function(){if(this.firstInput){this.firstInput.focus();if(this.firstInput.focusIn)
this.firstInput.focusIn();}},open:function(data,callback){arguments.callee.applySuper(this,arguments);if(typeof this.data=="string")
this.data={message:this.data};var e=DOM.getElement(this.element.id+"-message");if(e)
e.innerHTML=this.data.message;this.firstInput=null;DOM.setFormData(this.element,this.data);this.setFirstInput();this.focusFirstInput();}});