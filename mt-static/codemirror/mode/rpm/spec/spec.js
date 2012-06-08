CodeMirror.defineMode("spec",function(config,modeConfig){var arch=/^(i386|i586|i686|x86_64|ppc64|ppc|ia64|s390x|s390|sparc64|sparcv9|sparc|noarch|alphaev6|alpha|hppa|mipsel)/;var preamble=/^(Name|Version|Release|License|Summary|Url|Group|Source|BuildArch|BuildRequires|BuildRoot|AutoReqProv|Provides|Requires(\(\w+\))?|Obsoletes|Conflicts|Recommends|Source\d*|Patch\d*|ExclusiveArch|NoSource|Supplements):/;var section=/^%(debug_package|package|description|prep|build|install|files|clean|changelog|preun|postun|pre|post|triggerin|triggerun|pretrans|posttrans|verifyscript|check|triggerpostun|triggerprein|trigger)/;var control_flow_complex=/^%(ifnarch|ifarch|if)/;var control_flow_simple=/^%(else|endif)/;var operators=/^(\!|\?|\<\=|\<|\>\=|\>|\=\=|\&\&|\|\|)/;return{startState:function(){return{controlFlow:false,macroParameters:false,section:false};},token:function(stream,state){var ch=stream.peek();if(ch=="#"){stream.skipToEnd();return"comment";}
if(stream.sol()){if(stream.match(preamble)){return"preamble";}
if(stream.match(section)){return"section";}}
if(stream.match(/^\$\w+/)){return"def";}
if(stream.match(/^\$\{\w+\}/)){return"def";}
if(stream.match(control_flow_simple)){return"keyword";}
if(stream.match(control_flow_complex)){state.controlFlow=true;return"keyword";}
if(state.controlFlow){if(stream.match(operators)){return"operator";}
if(stream.match(/^(\d+)/)){return"number";}
if(stream.eol()){state.controlFlow=false;}}
if(stream.match(arch)){return"number";}
if(stream.match(/^%[\w]+/)){if(stream.match(/^\(/)){state.macroParameters=true;}
return"macro";}
if(state.macroParameters){if(stream.match(/^\d+/)){return"number";}
if(stream.match(/^\)/)){state.macroParameters=false;return"macro";}}
if(stream.match(/^%\{\??[\w \-]+\}/)){return"macro";}
stream.next();return null;}};});CodeMirror.defineMIME("text/x-rpm-spec","spec");