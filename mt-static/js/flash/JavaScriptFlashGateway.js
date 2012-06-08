function Exception(name,message)
{if(name)
this.name=name;if(message)
this.message=message;}
Exception.prototype.setName=function(name)
{this.name=name;}
Exception.prototype.getName=function()
{return this.name;}
Exception.prototype.setMessage=function(msg)
{this.message=msg;}
Exception.prototype.getMessage=function()
{return this.message;}
function FlashTag(src,width,height)
{this.src=src;this.width=width;this.height=height;this.version='7,0,14,0';this.id=null;this.wmode='opaque';this.bgcolor='ffffff';this.flashVars=null;}
FlashTag.prototype.setVersion=function(v)
{this.version=v;}
FlashTag.prototype.setId=function(id)
{this.id=id;}
FlashTag.prototype.setBgcolor=function(bgc)
{this.bgcolor=bgc;}
FlashTag.prototype.setFlashvars=function(fv)
{this.flashVars=fv;}
FlashTag.prototype.toString=function()
{var ie=(navigator.appName.indexOf("Microsoft")!=-1)?1:0;var flashTag=new String();if(ie)
{flashTag+='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" ';if(this.id!=null)
{flashTag+='id="'+this.id+'" ';}
flashTag+='codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.version+'" ';flashTag+='width="'+this.width+'" ';flashTag+='height="'+this.height+'">';flashTag+='<param name="movie" value="'+this.src+'"/>';flashTag+='<param name="quality" value="high"/>';flashTag+='<param name="bgcolor" value="#'+this.bgcolor+'"/>';flashTag+='<param name="wmode" value="'+this.wmode+'"/>';if(this.flashVars!=null)
{flashTag+='<param name="flashvars" value="'+this.flashVars+'"/>';}
flashTag+='</object>';}
else
{flashTag+='<embed src="'+this.src+'" ';flashTag+='quality="high" ';flashTag+='bgcolor="#'+this.bgcolor+'" ';flashTag+='width="'+this.width+'" ';flashTag+='height="'+this.height+'" ';flashTag+='wmode="'+this.wmode+'" ';flashTag+='type="application/x-shockwave-flash" ';if(this.flashVars!=null)
{flashTag+='flashvars="'+this.flashVars+'" ';}
if(this.id!=null)
{flashTag+='name="'+this.id+'" ';}
flashTag+='pluginspage="http://www.macromedia.com/go/getflashplayer">';flashTag+='</embed>';}
return flashTag;}
FlashTag.prototype.write=function(doc)
{doc.write(this.toString());}
function FlashSerializer(useCdata)
{this.useCdata=useCdata;}
FlashSerializer.prototype.serialize=function(args)
{var qs=new String();for(var i=0;i<args.length;++i)
{switch(typeof(args[i]))
{case'undefined':qs+='t'+(i)+'=undf';break;case'string':qs+='t'+(i)+'=str&d'+(i)+'='+escape(args[i]);break;case'number':qs+='t'+(i)+'=num&d'+(i)+'='+escape(args[i]);break;case'boolean':qs+='t'+(i)+'=bool&d'+(i)+'='+escape(args[i]);break;case'object':if(args[i]==null)
{qs+='t'+(i)+'=null';}
else if(args[i]instanceof Date)
{qs+='t'+(i)+'=date&d'+(i)+'='+escape(args[i].getTime());}
else
{try
{qs+='t'+(i)+'=xser&d'+(i)+'='+escape(this._serializeXML(args[i]));}
catch(exception)
{throw new Exception("FlashSerializationException","The following error occurred during complex object serialization: "+exception.getMessage());}}
break;default:throw new Exception("FlashSerializationException","You can only serialize strings, numbers, booleans, dates, objects, arrays, nulls, and undefined.");}
if(i!=(args.length-1))
{qs+='&';}}
return qs;}
FlashSerializer.prototype._serializeXML=function(obj)
{var doc=new Object();doc.xml='<fp>';this._serializeNode(obj,doc,null);doc.xml+='</fp>';return doc.xml;}
FlashSerializer.prototype._serializeNode=function(obj,doc,name)
{switch(typeof(obj))
{case'undefined':doc.xml+='<undf'+this._addName(name)+'/>';break;case'string':doc.xml+='<str'+this._addName(name)+'>'+this._escapeXml(obj)+'</str>';break;case'number':doc.xml+='<num'+this._addName(name)+'>'+obj+'</num>';break;case'boolean':doc.xml+='<bool'+this._addName(name)+' val="'+obj+'"/>';break;case'object':if(obj==null)
{doc.xml+='<null'+this._addName(name)+'/>';}
else if(obj instanceof Date)
{doc.xml+='<date'+this._addName(name)+'>'+obj.getTime()+'</date>';}
else if(obj instanceof Array)
{doc.xml+='<array'+this._addName(name)+'>';for(var i=0;i<obj.length;++i)
{this._serializeNode(obj[i],doc,null);}
doc.xml+='</array>';}
else
{doc.xml+='<obj'+this._addName(name)+'>';for(var n in obj)
{if(typeof(obj[n])=='function')
continue;this._serializeNode(obj[n],doc,n);}
doc.xml+='</obj>';}
break;default:throw new Exception("FlashSerializationException","You can only serialize strings, numbers, booleans, objects, dates, arrays, nulls and undefined");break;}}
FlashSerializer.prototype._addName=function(name)
{if(name!=null)
{return' name="'+name+'"';}
return'';}
FlashSerializer.prototype._escapeXml=function(str)
{if(this.useCdata)
return'<![CDATA['+str+']]>';else
return str.replace(/&/g,'&amp;').replace(/</g,'&lt;');}
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