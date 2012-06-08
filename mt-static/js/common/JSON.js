extend(Object,{toJSON:function(o){if(!defined(o)||o==null)
return"null";if(typeof o.toJSON=="function"&&o.toJSON!==arguments.callee)
return o.toJSON();var out=["{"];for(var p in o){if(o.hasOwnProperty&&!o.hasOwnProperty(p))
continue;if(o[p]===undefined)
continue;if(out.length>1)
out.push(",");out.push(Object.toJSON(p),":",Object.toJSON(o[p]));}
out.push("}");return out.join("");},fromJSON:function(s){try{return eval("("+s.replace(/=/g,"\\u003D").replace(/\(/g,"\\u0028")+")");}catch(e){}
return undefined;}});Array.prototype.toJSON=function(){var out=["["];for(var i=0;i<this.length;i++){if(out.length>1)
out.push(",");out.push(Object.toJSON(this[i]));}
out.push("]");return out.join("");}
Boolean.prototype.toJSON=function(){return this.toString();}
Number.prototype.toJSON=function(){return isFinite(this)?this.toString():"0";}
Date.prototype.toJSON=function(){return this.toUTCISOString?this.toUTCISOString().toJSON():this.toString().toJSON();}
String.prototype.toJSON=function(){return'"'+this.escapeJS()+'"';}
RegExp.prototype.toJSON=function(){return this.toString().toJSON();}
Function.prototype.toJSON=function(){return this.toString().toJSON();}