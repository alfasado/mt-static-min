Template=new Class(Object,{beginToken:"[#",endToken:"#]",init:function(source){if(source)
this.compile(source);},compile:function(source){var statements=["context.open();","with( context.vars ) { "];var start=0,end=-this.endToken.length;while(start<source.length){end+=this.endToken.length;start=source.indexOf(this.beginToken,end);if(start<0)
start=source.length;if(start>end)
statements.push("context.write( ",'"'+source.substring(end,start).escapeJS()+'"'," );");start+=this.beginToken.length;if(start>=source.length)
break;end=source.indexOf(this.endToken,start);if(end<0)
throw"Template parsing error: Unable to find matching end token ("+this.endToken+").";var length=(end-start);if(length<=0)
continue;else if(length>=4&&source.charAt(start)=="-"&&source.charAt(start+1)=="-"&&source.charAt(end-1)=="-"&&source.charAt(end-2)=="-")
continue;else if(source.charAt(start)=="=")
statements.push("context.write( ",source.substring(start+1,end)," );");else if(source.charAt(start)=="*"){var cmd=source.substring(start+1,end).match(/^\s*(\w+)/);if(cmd){cmd=cmd[1];switch(cmd){case"return":statements.push("return context.close();");}}
}else if(source.charAt(start)=="|"){start+=1;var afterfilters=source.substring(start,end).search(/\s/);var filters=[];var params=[];if(afterfilters>0){filters=source.substring(start,start+afterfilters).replace(/(\w+)(\(([^\)]+)\))?/g,"$1|$3").split("|");afterfilters+=1;}else{filters=["h",""];}
var cmds=[];var params=[];for(var j=0;j<filters.length;j++){if(j%2)
params.push(filters[j]);else
cmds.push(filters[j]);}
filters=cmds.reverse();var numfilters=filters.length;filters.push(source.substring(start+afterfilters,end));for(var i=0;i<numfilters;i++){filters[i]=" context.f."+filters[i]+"( ";filters.push(", context");if(params[i]!="")
filters.push(", ["+params[i]+"]");filters.push(" )");}
filters=filters.join("");statements.push("context.write( "+filters+" );");}
else
statements.push(source.substring(start,end));}
statements.push("} return context.close();");this.process=new Function("context",statements.join("\n"));},process:function(context){return"";},exec:function(context){log("Template::exec() method has been deprecated. Please use process() instead or "+
"the new static Template.process( name[, vars[, templates]] ) method.");return this.process(context);}});extend(Template,{templates:{},process:function(name,vars,templates){var context=new Template.Context(vars,templates);return context.include(name);}});Template.Context=new Class(Object,{init:function(vars,templates){this.vars=vars||{};this.templates=templates||Template.templates;this.stack=[];this.out=[];this.f=Template.Filter;},include:function(name){if(!this.templates.hasOwnProperty(name)){log.error("Template name "+name+" does not exist!");return;}
if(typeof this.templates[name]=="string")
this.templates[name]=new Template(this.templates[name]);try{return this.templates[name].process(this);}catch(e){var error="Error while processing template:"+name+" - "+e.message;log.error(error);throw error;}},write:function(){this.out.push.apply(this.out,arguments);},writeln:function(){this.write.apply(this,arguments);this.write("\n");},clear:function(){this.out.length=0;},exit:function(){return this.getOutput();},getOutput:function(){return this.out.join("");},open:function(){this.stack.push(this.out);this.out=[];},close:function(){var result=this.getOutput();this.out=this.stack.pop()||[];return result;}});Template.Filter={i:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return string.interpolate(context.vars);},h:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.encodeHTML():"".encodeHTML(string);},H:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.decodeHTML():"".encodeHTML(string);},U:function(string,context){return decodeURI(string);},u:function(string,context){return encodeURI(string).replace(/\//g,"%2F");},lc:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.toLowerCase():"".toLowerCase(string);},uc:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.toUpperCase():"".toUpperCase(string);},substr:function(string,context,params){if(!params)
throw"Template Filter Error: substr() requires at least one parameter";if(params[0]<0)
params[0]=string.length+params[0];return String.substr.apply(string,params);},ws:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.replace(/^\s+/g,"").replace(/\s+$/g,""):string;},trim:function(string,context,params){if(!params)
throw"Template Filter Error: trim() requires at least one parameter";if((typeof string!="string")&&string&&string.toString)
string=string.toString();if((typeof string=="string")&&string.length>params[0]){string=string.substr(0,params[0]);var newstr=string.replace(/\w+$/,"");return((newstr=="")?string:newstr)+"\u2026";}else
return string;},date:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();var date=Date.fromISOString(string);return(date)?date.toISODateString():"";},localeDate:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();var date=Date.fromISOString(string);return(date)?date.toLocaleString():"";},rt:function(string,context){if((typeof string!="string")&&string&&string.toString)
string=string.toString();return(typeof string=="string")?string.replace(/<\/?[^>]+>/gi,""):string;},rp:function(string,params){if((typeof string!="string")&&string&&string.toString)
string=string.toString();if((typeof string=="string")&&params.length==2){return string.replace(params[0],params[1]);}else
return string;}};