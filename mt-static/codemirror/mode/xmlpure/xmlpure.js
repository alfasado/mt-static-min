CodeMirror.defineMode("xmlpure",function(config,parserConfig){var STYLE_ERROR="error";var STYLE_INSTRUCTION="comment";var STYLE_COMMENT="comment";var STYLE_ELEMENT_NAME="tag";var STYLE_ATTRIBUTE="attribute";var STYLE_WORD="string";var STYLE_TEXT="atom";var STYLE_ENTITIES="string";var TAG_INSTRUCTION="!instruction";var TAG_CDATA="!cdata";var TAG_COMMENT="!comment";var TAG_TEXT="!text";var doNotIndent={"!cdata":true,"!comment":true,"!text":true,"!instruction":true};var indentUnit=config.indentUnit;function chain(stream,state,parser){state.tokenize=parser;return parser(stream,state);}
function inBlock(style,terminator,nextTokenize){return function(stream,state){while(!stream.eol()){if(stream.match(terminator)){popContext(state);state.tokenize=nextTokenize;break;}
stream.next();}
return style;};}
function pushContext(state,tagName){var noIndent=doNotIndent.hasOwnProperty(tagName)||(state.context&&state.context.doIndent);var newContext={tagName:tagName,prev:state.context,indent:state.context?state.context.indent+indentUnit:0,lineNumber:state.lineNumber,indented:state.indented,noIndent:noIndent};state.context=newContext;}
function popContext(state){if(state.context){var oldContext=state.context;state.context=oldContext.prev;return oldContext;}
return null;}
function isTokenSeparated(stream){return stream.sol()||stream.string.charAt(stream.start-1)==" "||stream.string.charAt(stream.start-1)=="\t";}
function parseDocument(stream,state){if(stream.eat("<")){if(stream.eat("?")){pushContext(state,TAG_INSTRUCTION);state.tokenize=parseProcessingInstructionStartTag;return STYLE_INSTRUCTION;}else if(stream.match("!--")){pushContext(state,TAG_COMMENT);return chain(stream,state,inBlock(STYLE_COMMENT,"-->",parseDocument));}else if(stream.eatSpace()||stream.eol()){stream.skipToEnd();return STYLE_ERROR;}else{state.tokenize=parseElementTagName;return STYLE_ELEMENT_NAME;}}
stream.skipToEnd();return STYLE_ERROR;}
function parseElementTagName(stream,state){var startPos=stream.pos;if(stream.match(/^[a-zA-Z_:][-a-zA-Z0-9_:.]*/)){var tagName=stream.string.substring(startPos,stream.pos);pushContext(state,tagName);state.tokenize=parseElement;return STYLE_ELEMENT_NAME;}else if(stream.match(/^\/[a-zA-Z_:][-a-zA-Z0-9_:.]*( )*>/)){var endTagName=stream.string.substring(startPos+1,stream.pos-1).trim();var oldContext=popContext(state);state.tokenize=state.context==null?parseDocument:parseElementBlock;if(oldContext==null||endTagName!=oldContext.tagName){return STYLE_ERROR;}
return STYLE_ELEMENT_NAME;}else{state.tokenize=state.context==null?parseDocument:parseElementBlock;stream.eatWhile(/[^>]/);stream.eat(">");return STYLE_ERROR;}
stream.skipToEnd();return null;}
function parseElement(stream,state){if(stream.match(/^\/>/)){popContext(state);state.tokenize=state.context==null?parseDocument:parseElementBlock;return STYLE_ELEMENT_NAME;}else if(stream.eat(/^>/)){state.tokenize=parseElementBlock;return STYLE_ELEMENT_NAME;}else if(isTokenSeparated(stream)&&stream.match(/^[a-zA-Z_:][-a-zA-Z0-9_:.]*( )*=/)){state.tokenize=parseAttribute;return STYLE_ATTRIBUTE;}
state.tokenize=state.context==null?parseDocument:parseDocument;stream.eatWhile(/[^>]/);stream.eat(">");return STYLE_ERROR;}
function parseAttribute(stream,state){var quote=stream.next();if(quote!="\""&&quote!="'"){stream.skipToEnd();state.tokenize=parseElement;return STYLE_ERROR;}
state.tokParams.quote=quote;state.tokenize=parseAttributeValue;return STYLE_WORD;}
function parseAttributeValue(stream,state){var ch="";while(!stream.eol()){ch=stream.next();if(ch==state.tokParams.quote){state.tokenize=parseElement;return STYLE_WORD;}else if(ch=="<"){stream.skipToEnd()
state.tokenize=parseElement;return STYLE_ERROR;}else if(ch=="&"){ch=stream.next();if(ch==';'){stream.skipToEnd()
state.tokenize=parseElement;return STYLE_ERROR;}
while(!stream.eol()&&ch!=";"){if(ch=="<"){stream.skipToEnd()
state.tokenize=parseElement;return STYLE_ERROR;}
ch=stream.next();}
if(stream.eol()&&ch!=";"){stream.skipToEnd();state.tokenize=parseElement;return STYLE_ERROR;}}}
return STYLE_WORD;}
function parseElementBlock(stream,state){if(stream.eat("<")){if(stream.match("?")){pushContext(state,TAG_INSTRUCTION);state.tokenize=parseProcessingInstructionStartTag;return STYLE_INSTRUCTION;}else if(stream.match("!--")){pushContext(state,TAG_COMMENT);return chain(stream,state,inBlock(STYLE_COMMENT,"-->",state.context==null?parseDocument:parseElementBlock));}else if(stream.match("![CDATA[")){pushContext(state,TAG_CDATA);return chain(stream,state,inBlock(STYLE_TEXT,"]]>",state.context==null?parseDocument:parseElementBlock));}else if(stream.eatSpace()||stream.eol()){stream.skipToEnd();return STYLE_ERROR;}else{state.tokenize=parseElementTagName;return STYLE_ELEMENT_NAME;}}else if(stream.eat("&")){stream.eatWhile(/[^;]/);stream.eat(";");return STYLE_ENTITIES;}else{pushContext(state,TAG_TEXT);state.tokenize=parseText;return null;}
state.tokenize=state.context==null?parseDocument:parseElementBlock;stream.skipToEnd();return null;}
function parseText(stream,state){stream.eatWhile(/[^<]/);if(!stream.eol()){popContext(state);state.tokenize=parseElementBlock;}
return STYLE_TEXT;}
function parseProcessingInstructionStartTag(stream,state){if(stream.match("xml",true,true)){if(state.lineNumber>1||stream.pos>5){state.tokenize=parseDocument;stream.skipToEnd();return STYLE_ERROR;}else{state.tokenize=parseDeclarationVersion;return STYLE_INSTRUCTION;}}
if(isTokenSeparated(stream)||stream.match("?>")){state.tokenize=parseDocument;stream.skipToEnd();return STYLE_ERROR;}
state.tokenize=parseProcessingInstructionBody;return STYLE_INSTRUCTION;}
function parseProcessingInstructionBody(stream,state){stream.eatWhile(/[^?]/);if(stream.eat("?")){if(stream.eat(">")){popContext(state);state.tokenize=state.context==null?parseDocument:parseElementBlock;}}
return STYLE_INSTRUCTION;}
function parseDeclarationVersion(stream,state){state.tokenize=parseDeclarationEncoding;if(isTokenSeparated(stream)&&stream.match(/^version( )*=( )*"([a-zA-Z0-9_.:]|\-)+"/)){return STYLE_INSTRUCTION;}
stream.skipToEnd();return STYLE_ERROR;}
function parseDeclarationEncoding(stream,state){state.tokenize=parseDeclarationStandalone;if(isTokenSeparated(stream)&&stream.match(/^encoding( )*=( )*"[A-Za-z]([A-Za-z0-9._]|\-)*"/)){return STYLE_INSTRUCTION;}
return null;}
function parseDeclarationStandalone(stream,state){state.tokenize=parseDeclarationEndTag;if(isTokenSeparated(stream)&&stream.match(/^standalone( )*=( )*"(yes|no)"/)){return STYLE_INSTRUCTION;}
return null;}
function parseDeclarationEndTag(stream,state){state.tokenize=parseDocument;if(stream.match("?>")&&stream.eol()){popContext(state);return STYLE_INSTRUCTION;}
stream.skipToEnd();return STYLE_ERROR;}
return{electricChars:"/[",startState:function(){return{tokenize:parseDocument,tokParams:{},lineNumber:0,lineError:false,context:null,indented:0};},token:function(stream,state){if(stream.sol()){state.lineNumber++;state.lineError=false;state.indented=stream.indentation();}
if(stream.eatSpace())return null;var style=state.tokenize(stream,state);state.lineError=(state.lineError||style=="error");return style;},blankLine:function(state){state.lineNumber++;state.lineError=false;},indent:function(state,textAfter){if(state.context){if(state.context.noIndent==true){return;}
if(textAfter.match(/^<\/.*/)){return state.context.indent;}
if(textAfter.match(/^<!\[CDATA\[/)){return 0;}
return state.context.indent+indentUnit;}
return 0;},compareStates:function(a,b){if(a.indented!=b.indented)return false;for(var ca=a.context,cb=b.context;;ca=ca.prev,cb=cb.prev){if(!ca||!cb)return ca==cb;if(ca.tagName!=cb.tagName)return false;}}};});CodeMirror.defineMIME("application/xml","purexml");CodeMirror.defineMIME("text/xml","purexml");