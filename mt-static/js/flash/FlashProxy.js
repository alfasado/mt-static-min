function FlashProxy(uid,proxySwfName)
{this.uid=uid;this.proxySwfName=proxySwfName;this.flashSerializer=new FlashSerializer(false);}
FlashProxy.prototype.call=function()
{if(arguments.length==0)
{throw new Exception("Flash Proxy Exception","The first argument should be the function name followed by any number of additional arguments.");}
var qs='lcId='+escape(this.uid)+'&functionName='+escape(arguments[0]);if(arguments.length>1)
{var justArgs=new Array();for(var i=1;i<arguments.length;++i)
{justArgs.push(arguments[i]);}
qs+=('&'+this.flashSerializer.serialize(justArgs));}
var divName='_flash_proxy_'+this.uid;if(!document.getElementById(divName))
{var newTarget=document.createElement("div");newTarget.id=divName;document.body.appendChild(newTarget);}
var target=document.getElementById(divName);var ft=new FlashTag(this.proxySwfName,1,1);ft.setVersion('6,0,65,0');ft.setFlashvars(qs);target.innerHTML=ft.toString();}
FlashProxy.callJS=function()
{var functionToCall=eval(arguments[0]);var argArray=new Array();for(var i=1;i<arguments.length;++i)
{argArray.push(arguments[i]);}
functionToCall.apply(functionToCall,argArray);}