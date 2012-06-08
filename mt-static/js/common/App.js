ModalMask=new Class(Component,{eventMouseDown:function(event){window.app.dismissTransients();}});App=new Class(Component,Component.Delegator,{NAMESPACE:"core",initObject:function(){arguments.callee.callSuper(this,document.documentElement);this.window=window;this.document=document;this.displayState={};this.dialogs={};this.flyouts={};this.modalStack=[];this.activeComponent=null;this.monitorTimer=new Timer(this.getIndirectMethod("monitor"),100);},destroyObject:function(){this.modalStack=null;this.dialogs=null;this.flyouts=null;this.displayState=null;this.activeComponent=null;this.document=null;this.window=null;arguments.callee.applySuper(this,arguments);},initEventListeners:function(){arguments.callee.applySuper(this,arguments);this.addEventListener(window,"resize","eventResize");this.addEventListener(window,"unload","eventUnload");},eventClick:function(event){var command=this.getMouseEventCommand(event);switch(command){case"goToLocation":event.stop();this.gotoLocation(event.commandElement.getAttribute("href"));break;}},eventResize:function(event){return this.reflow(event);},eventUnload:function(event){this.destroy();},initComponents:function(){arguments.callee.applySuper(this,arguments);if(DOM.getElement("modal-mask"))
this.modalMask=this.addComponent(new ModalMask("modal-mask"));},monitor:function(timer){this.monitorDisplayState();this.monitorLocation();},monitorDisplayState:function(){var changed=0;var style=DOM.getComputedStyle(this.element);changed+=this.displayChanged(style,"fontSize");if(changed)
this.reflow();},displayChanged:function(object,property){try{if(this.displayState[property]!=object[property]){this.displayState[property]=object[property];return 1;}}catch(e){}
return 0;},getActiveComponent:function(){return this.activeComponent;},setActiveComponent:function(component){var modal=this.modalStack[this.modalStack.length-1];var ancestors=DOM.getAncestors(component.element,true);if(modal&&ancestors.indexOf(modal.element)>0&&modal.active)
return false;if(this.activeComponent&&this.activeComponent!==component)
this.activeComponent.deactivate();this.activeComponent=component;return true;},addModal:function(modal){this.modalStack.add(modal);this.modalMask.show();modal.show();this.stackModals();},removeModal:function(modal){modal.active=false;modal.hide();this.modalStack.remove(modal);this.stackModals();},STACK_RADIX:1000,stackModals:function(){for(var i=this.modalStack.length;i>0;i--)
DOM.setZIndex(this.modalStack[i-1].element,i*this.STACK_RADIX);DOM.setZIndex(this.modalMask.element,this.modalStack.length*this.STACK_RADIX-10);if(this.modalStack.length){this.modalMask.show();this.modalStack[this.modalStack.length-1].activate();}else
this.modalMask.hide();},dismissTransients:function(){for(var i=this.modalStack.length-1;i>=0;i--)
if(this.modalStack[i].transitory)
this.modalStack[i].close();},dismissAll:function(){while(this.modalStack.length)
this.removeModal(this.modalStack[0]);},gotoLocation:function(locationBase,locationArg){var location=(""+this.window.location);var parts=location.split("#");if(locationBase){parts[0]=locationBase;this.monitorTimer.stop();}
if(locationArg)
parts[1]=encodeURI(this.encodeLocation(locationArg));else
parts.length=1;location=parts.join("#");if(this.location==location)
return;this.location=location;if(!locationBase&&defined(this.window.clipboardData)){var iframe=this.document.getElementById("__location");iframe.contentWindow.document.open("text/html");iframe.contentWindow.document.write("<script type='text/javascript'>"+
"if( window.parent && window.parent.app )"+
"window.parent.app.replaceLocation( '"+this.location+"' );"+
"</script>"+
"<body style='background: rgb("+
Math.floor(Math.random()*256)+","+
Math.floor(Math.random()*256)+","+
Math.floor(Math.random()*256)+")'>"+
this.location+"</body>");}
else{this.window.location=this.location;if((""+this.window.location)!=this.location)
this.monitorTimer.stop();}
this.parseLocation();if(!locationBase){this.exec();this.broadcastToObservers("exec");}},replaceLocation:function(location){this.window.location.replace(location);if(this.location==location)
return;this.location=location;this.parseLocation();this.exec();this.broadcastToObservers("exec");},monitorLocation:function(){var location=(""+window.location);if(this.location==location)
return;this.location=location;this.parseLocation();this.exec();this.broadcastToObservers("exec");},parseLocation:function(){if(!defined(this.locationArg))
this.locationArg=null;try{var parts=this.location.split("#");var arg=decodeURI(parts[1]||"");this.locationArg=this.decodeLocation(arg);}catch(e){}
return this.locationArg;},encodeLocation:function(obj){var loc=[];for(key in obj)
if(obj.hasOwnProperty(key)&&typeof obj[key]!="function")
loc.push(key+":"+((obj[key]instanceof Array)?obj[key].join(","):obj[key]));return loc.join("/");},decodeLocation:function(arg){var obj={};var vals=arg.split("/");var kv;for(var i=0;i<vals.length;i++){if(!defined(vals[i]))
continue;kv=vals[i].split(":");if(kv&&kv.length>1)
obj[kv[0]]=kv[1];else
obj[vals[i]]=true;}
return obj;},exec:function(){}});App.bootstrap=function(){window.app=App.initSingleton();};App.bootstrapInline=function(defer){DOM.addEventListener(window,"load",this.bootstrap);this.deferBootstrap=defer;this.bootstrapApp();};App.bootstrapIframe=function(){this.deferBootstrap=false;this.bootstrapApp();};App.bootstrapCheck=function(){var e=DOM.getElement("bootstrapper");if(!e)
return log.warn('bootstrap checking...');if(this.bootstrapTimer)
this.bootstrapTimer.stop();this.bootstrapTimer=null;this.bootstrap();}
App.bootstrapApp=function(){if(this.deferBootstrap)
return;this.bootstrapTimer=new Timer(this.bootstrapCheck.bind(this),20);};if(defined(window.clipboardData)){try{document.execCommand("BackgroundImageCache",false,true);}catch(e){};var blankURI=window.__blankURI__||"about:blank";document.write("<iframe id='__location' src='"+blankURI+"' width='0' height='0' frameborder='0'"+
"style='visibility:hidden;position:absolute;left:0;top:0;'></iframe>");}