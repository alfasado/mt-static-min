TC.Preview=function(id,spellCheck)
{this.id=id;this.spellCheck=spellCheck;this.updateLatency=TC.Preview.updateLatency;this.spellCheckLatency=TC.Preview.spellCheckLatency;this.spellCheckURL=TC.Preview.spellCheckURL;this.preHTML=TC.Preview.preHTML;this.postHTML=TC.Preview.postHTML;this.emptyHTML=TC.Preview.emptyHTML;TC.Preview.instances[this.id]=this;this.attachElements();}
TC.Preview.updateLatency=250;TC.Preview.spellCheckLatency=1000;TC.Preview.spellCheckURL="/t/app/weblog/spell";TC.Preview.preHTML="";TC.Preview.postHTML="";TC.Preview.emptyHTML="<span class='dim'>(empty post)</span>";TC.Preview.instances=new Array();TC.Preview.clickWord=function(evt)
{evt=evt||event;var element=evt.target||evt.srcElement;var bits=element.id.split("_");if(!bits||bits.length!=4)
return TC.stopEvent(evt);var id=bits[1];var wordNum=bits[2];var fragmentNum=bits[3];var instance=TC.Preview.instances[id];if(!instance)
return TC.stopEvent(evt);instance.clickWord(evt,wordNum);return TC.stopEvent(evt);}
TC.Preview.prototype.attachElements=function()
{if(!this.attachAttempts)
this.attachAttempts=0;else if(this.attachAttempts>5)
return;this.attachAttempts++;if(!this.textarea)
{this.textarea=document.getElementById(this.id);if(this.textarea)
{TC.allowTabs(this.textarea);TC.attachEvent(this.textarea,"change",this.eventClosure());TC.attachEvent(this.textarea,"keydown",this.eventClosure());TC.attachEvent(this.textarea,"drop",this.eventClosure());TC.attachEvent(this.textarea,"dragdrop",this.eventClosure());TC.attachEvent(this.textarea,"mouseup",this.eventClosure());}}
if(!this.preview)
this.preview=document.getElementById(this.id+"_preview");if(!this.textarea||!this.preview)
window.setTimeout("TC.Preview.instances[ '"+this.id+"' ].attachElements();",1000);if(this.preview)
this.updatePreviewLatent();}
TC.Preview.prototype.eventClosure=function()
{var self=this;return function(evt)
{evt=evt||event;var element=evt.target||evt.srcElement;self.updatePreviewLatent();};}
TC.Preview.prototype.setPreviewHTML=function(html)
{if(this.preview.contentDocument)
{this.preview.contentDocument.body.innerHTML=this.preHTML+html+this.postHTML;this.resizePreviewLatent();this.resizePreview();}
else if(this.preview.contentWindow&&this.preview.contentWindow.document&&this.preview.contentWindow.document.body)
{this.preview.contentWindow.document.body.innerHTML=this.preHTML+html+this.postHTML;this.resizePreviewLatent();this.resizePreview();}
else
this.preview.innerHTML=this.preHTML+html+this.postHTML;}
TC.Preview.prototype.resizePreviewLatent=function()
{window.setTimeout("TC.Preview.instances[ '"+this.id+"' ].resizePreview();",25);}
TC.Preview.prototype.resizePreview=function()
{if(this.preview.contentDocument)
this.preview.style.height=this.preview.contentDocument.body.scrollHeight;else if(this.preview.contentWindow)
this.preview.style.height=this.preview.contentWindow.document.body.scrollHeight;}
TC.Preview.prototype.updatePreviewLatent=function()
{this.cancelUpdatePreview();this.previewTimeout=window.setTimeout("TC.Preview.instances[ '"+this.id+"' ].updatePreview();",this.updateLatency);this.cancelSpellCheck();this.spellCheckTimeout=window.setTimeout("TC.Preview.instances[ '"+this.id+"' ].initSpellCheck();",this.spellCheckLatency);}
TC.Preview.fractureLineRegExp=/(\s+)?(\S+)(\s+)?/g;TC.Preview.prototype.updatePreview=function()
{if(!this.textarea||!this.preview)
return;if(!this.textarea||!this.textarea.value.length)
this.setPreviewHTML(this.emptyHTML);else if(!this.spellCheck||!this.badWordList||!this.badWordList.length)
this.setPreviewHTML(this.textarea.value);else
{this.fractureHTML();this.clickWords=new Array();var html='';for(var i=0;i<this.fractured.length;i++)
{if(this.fractured[i].length==0)
continue;if(this.fractured[i].charAt(0)=='<')
html+=this.fractured[i];else
{var line=this.fractured[i].match(TC.Preview.fractureLineRegExp);if(!line)
{html+=this.fractured[i];continue;}
for(var j=0;j<line.length;j++)
{for(var k=0;k<this.badWordList.length;k++)
{var word=this.words[this.badWordList[k]];if(line[j].match(word.regExp))
{line[j]=line[j].replace(word.regExp,"<span class='wrong' id='word_"+this.id+"_"+this.clickWords.length+"_0"+
"' onClick='return window.parent.TC.Preview.clickWord( event );'>"+RegExp.$1+"</span>");this.clickWords.push(word);}}}
html+=line.join('');}}
this.setPreviewHTML(html);}}
TC.Preview.prototype.cancelUpdatePreview=function()
{if(this.previewTimeout)
window.clearTimeout(this.previewTimeout);}
TC.Preview.prototype.initSpellCheck=function()
{this.cancelSpellCheck();if(!this.spellCheck)
return;if(!this.extractNewWords())
return;var newWords=this.newWordList.join(' ');if(window.XMLHttpRequest)
this.xmlRequest=new XMLHttpRequest();else if(window.ActiveXObject)
this.xmlRequest=new ActiveXObject("Microsoft.XMLHTTP");if(this.xmlRequest)
{var self=this;var processSpellCheck=function(){return self.processSpellCheck();}
this.xmlRequest.onreadystatechange=processSpellCheck;this.xmlRequest.open("POST",this.spellCheckURL,true);this.xmlRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");this.xmlRequest.send("words="+newWords);this.processSpellCheck();}}
TC.Preview.prototype.cancelSpellCheck=function()
{if(this.spellCheckTimeout)
window.clearTimeout(this.spellCheckTimeout);if(this.xmlRequest&&this.xmlRequest.readyState<4)
this.xmlRequest.abort();}
TC.Preview.prototype.processSpellCheck=function()
{if(!this.xmlRequest||this.xmlRequest.readyState<4||!this.xmlRequest.responseXML)
return;var wordNodes=this.xmlRequest.responseXML.getElementsByTagName('word');for(var i=0;i<wordNodes.length;i++)
{var wordValue=wordNodes[i].getAttribute("value");if(!wordValue||!wordValue.length)
continue;if(!this.words[wordValue])
this.words[wordValue]=new TC.Preview.Word(wordValue);var word=this.words[wordValue];if(word.ignored)
continue;word.checked=true;word.good=false;word.clearSuggestions();var sugNodes=wordNodes[i].getElementsByTagName('sug');for(var j=0;j<sugNodes.length;j++)
{var sug=sugNodes[j].getAttribute("value");word.addSuggestion(sug);}};this.makeBadWordList();this.updatePreview();}
TC.Preview.fractureHTMLRegExp=/(\<[^\>]+\>)?([^\<]+)?/g;TC.Preview.prototype.fractureHTML=function()
{this.fractured=new Array();var self=this;var fractureFunc=function(zero,one,two)
{if(one&&one.length)
self.fractured.push(one);if(two&&two.length)
self.fractured.push(two);return'';};var fractureFuncOld=function()
{if(arguments[1])
self.fractured.push(arguments[1]);else if(RegExp.$0&&RegExp.$1)
self.fractured.push(RegExp.$1);if(arguments[2])
self.fractured.push(arguments[2]);else if(RegExp.$0&&RegExp.$2)
self.fractured.push(RegExp.$2);};this.textarea.value.replace(TC.Preview.fractureHTMLRegExp,fractureFunc);var textarea=document.getElementById(this.id+"_text");textarea.value=self.fractured.join("");}
TC.Preview.matchWordsRegExp=/(\S+)/g;TC.Preview.prototype.extractNewWords=function()
{if(!this.words)
this.words=new Array();if(!this.newWordList)
this.newWordList=new Array();this.newWordList.length=0;this.fractureHTML();if(this.fractured.length)
{var i=this.fractured[0].length&&this.fractured[0].charAt(0)=='<'?1:0;for(i;i<this.fractured.length;i+=2)
{var lineWords=this.fractured[i].match(TC.Preview.matchWordsRegExp);if(!lineWords||lineWords.length==0)
continue;for(var j=0;j<lineWords.length;j++)
{var wordValue=lineWords[j].toLowerCase();if(!this.words[wordValue])
this.words[wordValue]=new TC.Preview.Word(wordValue);if(this.words[wordValue].checked||this.words[wordValue].ignored)
continue;this.newWordList.push(wordValue);}}}
return this.newWordList.length;}
TC.Preview.prototype.makeBadWordList=function()
{if(!this.words)
return;this.badWordList=new Array();for(var wordValue in this.words)
{var word=this.words[wordValue];if(word.ignored||word.good)
continue;this.badWordList.push(word.word);}}
TC.Preview.prototype.clickWord=function(evt,wordNum)
{evt=evt||event;var element=evt.target||evt.srcElement;var word=this.clickWords[wordNum];if(!word)
return M;var text=word.word+"\n";for(var sug in word.suggestions)
text+="---> "+sug+"\n";alert(text);}
TC.Preview.Word=function(word)
{this.word=word;this.escaped=escape(word);this.regExp=new RegExp("\\b("+word+")\\b","i");this.good=true;this.ignored=false;this.checked=false;this.count=0;this.suggestions=new Array();}
TC.Preview.Word.prototype.addSuggestion=function(sug)
{if(!sug||sug.length==0||this.suggestions[sug])
return;this.suggestions[sug]=true;}
TC.Preview.Word.prototype.removeSuggestion=function(sug)
{if(!sug||sug.length==0||!this.suggestions[sug])
return;delete this.suggestions[sug];}
TC.Preview.Word.prototype.clearSuggestions=function()
{this.suggestions=new Array();}