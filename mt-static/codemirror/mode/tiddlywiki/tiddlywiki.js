CodeMirror.defineMode("tiddlywiki",function(config,parserConfig){var indentUnit=config.indentUnit;var textwords=function(){function kw(type){return{type:type,style:"text"};}
return{};}();var keywords=function(){function kw(type){return{type:type,style:"macro"};}
return{"allTags":kw('allTags'),"closeAll":kw('closeAll'),"list":kw('list'),"newJournal":kw('newJournal'),"newTiddler":kw('newTiddler'),"permaview":kw('permaview'),"saveChanges":kw('saveChanges'),"search":kw('search'),"slider":kw('slider'),"tabs":kw('tabs'),"tag":kw('tag'),"tagging":kw('tagging'),"tags":kw('tags'),"tiddler":kw('tiddler'),"timeline":kw('timeline'),"today":kw('today'),"version":kw('version'),"option":kw('option'),"with":kw('with'),"filter":kw('filter')};}();var isSpaceName=/[\w_\-]/i,reHR=/^\-\-\-\-+$/,reWikiCommentStart=/^\/\*\*\*$/,reWikiCommentStop=/^\*\*\*\/$/,reBlockQuote=/^<<<$/,reJsCodeStart=/^\/\/\{\{\{$/,reJsCodeStop=/^\/\/\}\}\}$/,reXmlCodeStart=/^<!--\{\{\{-->$/,reXmlCodeStop=/^<!--\}\}\}-->$/,reCodeBlockStart=/^\{\{\{$/,reCodeBlockStop=/^\}\}\}$/,reCodeStart=/\{\{\{/,reUntilCodeStop=/.*?\}\}\}/;function chain(stream,state,f){state.tokenize=f;return f(stream,state);}
function nextUntilUnescaped(stream,end){var escaped=false,next;while((next=stream.next())!=null){if(next==end&&!escaped)return false;escaped=!escaped&&next=="\\";}
return escaped;}
var type,content;function ret(tp,style,cont){type=tp;content=cont;return style;}
function jsTokenBase(stream,state){var sol=stream.sol(),ch,tch;state.block=false;ch=stream.peek();if(sol&&/[<\/\*{}\-]/.test(ch)){if(stream.match(reCodeBlockStart)){state.block=true;return chain(stream,state,twTokenCode);}
if(stream.match(reBlockQuote)){return ret('quote','quote');}
if(stream.match(reWikiCommentStart)||stream.match(reWikiCommentStop)){return ret('code','code');}
if(stream.match(reJsCodeStart)||stream.match(reJsCodeStop)||stream.match(reXmlCodeStart)||stream.match(reXmlCodeStop)){return ret('code','code');}
if(stream.match(reHR)){return ret('hr','hr');}}
var ch=stream.next();if(sol&&/[\/\*!#;:>|]/.test(ch)){if(ch=="!"){stream.skipToEnd();return ret("header","header");}
if(ch=="*"){stream.eatWhile('*');return ret("list","list");}
if(ch=="#"){stream.eatWhile('#');return ret("list","list");}
if(ch==";"){stream.eatWhile(';');return ret("list","list");}
if(ch==":"){stream.eatWhile(':');return ret("list","list");}
if(ch==">"){stream.eatWhile(">");return ret("quote","quote");}
if(ch=='|'){return ret('table','table');}}
if(ch=='{'&&stream.match(/\{\{/)){return chain(stream,state,twTokenCode);}
if(/[hf]/i.test(ch)){if(/[ti]/i.test(stream.peek())&&stream.match(/\b(ttps?|tp|ile):\/\/[\-A-Z0-9+&@#\/%?=~_|$!:,.;]*[A-Z0-9+&@#\/%=~_|$]/i)){return ret("link-external","link-external");}}
if(ch=='"'){return ret('string','string');}
if(/[\[\]]/.test(ch)){if(stream.peek()==ch){stream.next();return ret('brace','brace');}}
if(ch=="@"){stream.eatWhile(isSpaceName);return ret("link-external","link-external");}
if(/\d/.test(ch)){stream.eatWhile(/\d/);return ret("number","number");}
if(ch=="/"){if(stream.eat("%")){return chain(stream,state,twTokenComment);}
else if(stream.eat("/")){return chain(stream,state,twTokenEm);}}
if(ch=="_"){if(stream.eat("_")){return chain(stream,state,twTokenUnderline);}}
if(ch=="-"){if(stream.eat("-")){return chain(stream,state,twTokenStrike);}}
if(ch=="'"){if(stream.eat("'")){return chain(stream,state,twTokenStrong);}}
if(ch=="<"){if(stream.eat("<")){return chain(stream,state,twTokenMacro);}}
else{return ret(ch);}
stream.eatWhile(/[\w\$_]/);var word=stream.current(),known=textwords.propertyIsEnumerable(word)&&textwords[word];return known?ret(known.type,known.style,word):ret("text",null,word);}
function twTokenString(quote){return function(stream,state){if(!nextUntilUnescaped(stream,quote))state.tokenize=jsTokenBase;return ret("string","string");};}
function twTokenComment(stream,state){var maybeEnd=false,ch;while(ch=stream.next()){if(ch=="/"&&maybeEnd){state.tokenize=jsTokenBase;break;}
maybeEnd=(ch=="%");}
return ret("comment","comment");}
function twTokenStrong(stream,state){var maybeEnd=false,ch;while(ch=stream.next()){if(ch=="'"&&maybeEnd){state.tokenize=jsTokenBase;break;}
maybeEnd=(ch=="'");}
return ret("text","strong");}
function twTokenCode(stream,state){var ch,sb=state.block;if(sb&&stream.current()){return ret("code","code");}
if(!sb&&stream.match(reUntilCodeStop)){state.tokenize=jsTokenBase;return ret("code","code-inline");}
if(sb&&stream.sol()&&stream.match(reCodeBlockStop)){state.tokenize=jsTokenBase;return ret("code","code");}
ch=stream.next();return(sb)?ret("code","code"):ret("code","code-inline");}
function twTokenEm(stream,state){var maybeEnd=false,ch;while(ch=stream.next()){if(ch=="/"&&maybeEnd){state.tokenize=jsTokenBase;break;}
maybeEnd=(ch=="/");}
return ret("text","em");}
function twTokenUnderline(stream,state){var maybeEnd=false,ch;while(ch=stream.next()){if(ch=="_"&&maybeEnd){state.tokenize=jsTokenBase;break;}
maybeEnd=(ch=="_");}
return ret("text","underlined");}
function twTokenStrike(stream,state){var maybeEnd=false,ch,nr;while(ch=stream.next()){if(ch=="-"&&maybeEnd){state.tokenize=jsTokenBase;break;}
maybeEnd=(ch=="-");}
return ret("text","line-through");}
function twTokenMacro(stream,state){var ch,tmp,word,known;if(stream.current()=='<<'){return ret('brace','macro');}
ch=stream.next();if(!ch){state.tokenize=jsTokenBase;return ret(ch);}
if(ch==">"){if(stream.peek()=='>'){stream.next();state.tokenize=jsTokenBase;return ret("brace","macro");}}
stream.eatWhile(/[\w\$_]/);word=stream.current();known=keywords.propertyIsEnumerable(word)&&keywords[word];if(known){return ret(known.type,known.style,word);}
else{return ret("macro",null,word);}}
return{startState:function(basecolumn){return{tokenize:jsTokenBase,indented:0,level:0};},token:function(stream,state){if(stream.eatSpace())return null;var style=state.tokenize(stream,state);return style;},electricChars:""};});CodeMirror.defineMIME("text/x-tiddlywiki","tiddlywiki");