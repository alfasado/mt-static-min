benchmark=function(callback,iterations){var start=new Date();for(var i=0;i<iterations;i++)
callback();var end=new Date();return(end.getSeconds()-start.getSeconds())+
(end.getMilliseconds()-start.getMilliseconds())/1000;}
inspect=function(object,allProperties,noBreaks){var out="";for(var property in object){try{if(!allProperties&&!object.hasOwnProperty(property))
continue;out+=property+": "+object[property]+
(noBreaks?"\n":"<br />");}catch(e){}}
return out;}
Logger=new Class(Object,{width:320,height:240,windowName:"log",colors:{INFO:"#000",ERROR:"#f00",DEBUG:"#005f16",WARN:"#2634cf"},log:function(){this.logMessages("INFO",arguments);},logError:function(){this.logMessages("ERROR",arguments);},logWarn:function(){this.logMessages("WARN",arguments);},logDebug:function(){this.logMessages("DEBUG",arguments);},logMessages:function(type,messages){try{var message="";for(var i=0;i<messages.length;i++)
message+=messages[i];if(window.console&&window.console.log){if(window.console[type.toLowerCase()])
window.console[type.toLowerCase()](message);else
window.console.log(message);return;}
this.createWindow();if(!this.window){confirm("Logger popup window blocked. Using confirm() instead.\n\n"+msg);return true;}
var div=this.window.document.createElement("div");div.style.color=this.colors[type]||"#000";div.style.backgroundColor=(this.count%2)?"#eee":"#fff";div.style.width="auto";div.style.padding="3px";div.innerHTML=message;this.window.document.body.appendChild(div);this.window.scroll(0,this.window.document.body.scrollHeight);this.count++;return true;}catch(e){}},createWindow:function(){if(this.window&&this.window.document)
return;var x="auto";var y="auto";var attr="resizable=yes, menubar=no, location=no, directories=no, scrollbars=yes, status=no, "+
"width="+this.width+", height="+this.height+
"screenX="+x+", screenY="+y+", "+
"left="+x+", top="+y+", ";this.window=window.open("",this.windowName,attr);if(!this.window)
return;window.top.focus();var instance;try{instance=this.window.__Logger;}catch(e){this.window.location.replace("about:blank");}
if(instance){var div=this.window.document.createElement("div");div.style.backgroundColor="#f00";div.style.width="auto";div.style.height="2px";div.style.fontSize="0.1px";div.style.lineHeight="0.1px";this.window.document.body.appendChild(div);}else{this.window.document.open("text/html","replace");this.window.document.write("<html><head><title>JavaScript Log</title></head><body ondblclick=\"document.body.innerHTML='';\"></body></html>");this.window.document.close();this.window.title="JavaScript Loggers";this.window.document.body.style.margin="0";this.window.document.body.style.padding="0";this.window.document.body.style.fontFamily="verdana, 'lucida grande', geneva, arial, helvetica, sans-serif";this.window.document.body.style.fontSize="10px";}
this.prev=instance;this.window.__Logger=this;if(this.prev)
this.prev.prev=null;this.count=this.prev?this.prev.count:0;}});override(Logger,{log:function(){var a=Logger.logMessages("INFO",arguments);return a;},logError:function(){return Logger.logMessages("ERROR",arguments);},logWarn:function(){return Logger.logMessages("WARN",arguments);},logDebug:function(){return Logger.logMessages("DEBUG",arguments);},logMessages:function(type,messages){Logger.initSingleton();return Logger.singleton.logMessages(type,messages);}});log=Logger.log;log.error=Logger.logError;log.warn=Logger.logWarn;log.debug=Logger.logDebug;