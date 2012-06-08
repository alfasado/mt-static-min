function FlashTag(src,width,height)
{this.src=src;this.width=width;this.height=height;this.version='8,0,0,0';this.id=null;this.bgcolor='ffffff';this.flashVars=null;this.wmode='opaque';}
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
flashTag+='codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version='+this.version+'" ';flashTag+='width="'+this.width+'" ';flashTag+='height="'+this.height+'">';flashTag+='<param name="movie" value="'+this.src+'"/>';flashTag+='<param name="quality" value="high"/>';flashTag+='<param name="wmode" value="'+this.wmode+'"/>';flashTag+='<param name="bgcolor" value="#'+this.bgcolor+'"/>';if(this.flashVars!=null)
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