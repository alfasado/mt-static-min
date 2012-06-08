Cookie=new Class(Object,{init:function(name,value,domain,path,expires,secure){this.name=name;this.value=value;this.domain=domain;this.path=path;this.expires=expires;this.secure=secure;},fetch:function(){var prefix=escape(this.name)+"=";var cookies=(""+document.cookie).split(/;\s*/);for(var i=0;i<cookies.length;i++){if(cookies[i].indexOf(prefix)==0){this.value=unescape(cookies[i].substring(prefix.length));return this;}}
return undefined;},bake:function(value){if(!exists(this.name))
return undefined;if(exists(value))
this.value=value;else
value=this.value;var name=escape(this.name);value=escape(value);var attributes=(this.domain?"; domain="+escape(this.domain):"")+
(this.path?"; path="+escape(this.path):"")+
(this.expires?"; expires="+this.expires.toGMTString():"")+
(this.secure?"; secure=1":"");var batter=name+"="+value+attributes;document.cookie=batter;return this;},remove:function(){this.expires=new Date(0);this.value="";this.bake();}});override(Cookie,{fetch:function(name){var cookie=new this(name);return cookie.fetch();},bake:function(name,value,domain,path,expires,secure){var cookie=new this(name,value,domain,path,expires,secure);return cookie.bake();},remove:function(name){var cookie=this.fetch(name);if(cookie)
return cookie.remove();}});