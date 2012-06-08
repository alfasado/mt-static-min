TC.Alert=function()
{this.createWindow();this.count=this.prev?this.prev.count:0;}
TC.Alert.width=640;TC.Alert.height=420;TC.Alert.windowName="alert";TC.Alert.instance=null;TC.Alert.alert=TC.alert=function(msg)
{if(!TC.Alert.instance)
TC.Alert.instance=new TC.Alert();if(TC.Alert.instance)
return TC.Alert.instance.alert(msg);return true;}
TC.Alert.prototype.alert=function(msg)
{this.createWindow();if(!this.window)
{confirm("Alert popup window blocked. Using confirm() instead.\n\n"+msg);return true;}
var div=this.window.document.createElement("div");div.style.backgroundColor=(this.count%2)?"#eee":"#fff";div.style.width="auto";div.style.padding="8px";div.innerHTML=msg;this.window.document.body.appendChild(div);this.window.scroll(0,this.window.document.body.scrollHeight);this.count++;return true;}
TC.Alert.prototype.createWindow=function()
{if(this.window&&this.window.document)
return;var x="auto";var y="auto";var attr="resizable=yes, menubar=no, location=no, directories=no, scrollbars=yes, status=no, "+
"width="+TC.Alert.width+", height="+TC.Alert.height+
"screenX="+x+", screenY="+y+", "+
"left="+x+", top="+y+", ";this.window=window.open("",this.windowName,attr);if(!this.window)
return;this.window.document.write("<html><head><title>JavaScript Alerts</title></head><body></body></html>");this.window.title="JavaScript Alerts";this.window.document.body.style.margin="0";this.window.document.body.style.padding="0";this.window.document.body.style.fontFamily="verdana, 'lucida grande', geneva, arial, helvetica, sans-serif";this.window.document.body.style.fontSize="10px";this.prev=this.window.tcai;this.window.tcai=this;if(this.prev)
this.prev.prev=null;}
window.alert=TC.Alert.alert;alert=TC.Alert.alert;