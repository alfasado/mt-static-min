CodeMirror.defineMode("properties",function(){return{token:function(stream,state){var sol=stream.sol();var eol=stream.eol();if(sol){if(state.nextMultiline){state.inMultiline=true;state.nextMultiline=false;}else{state.position="key";}}
if(eol&&!state.nextMultiline){state.inMultiline=false;state.position="key";}
if(sol){while(stream.eatSpace());}
var ch=stream.next();if(sol&&(ch==="#"||ch==="!")){state.position="comment";stream.skipToEnd();return"comment";}else if(ch==="="||ch===":"){state.position="value";return"equals";}else if(ch==="\\"&&state.position==="value"){if(stream.next()!=="u"){state.nextMultiline=true;}}
return state.position;},startState:function(){return{position:"key",nextMultiline:false,inMultiline:false};}};});CodeMirror.defineMIME("text/x-properties","properties");