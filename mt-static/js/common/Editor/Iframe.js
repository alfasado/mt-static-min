Editor.Iframe=new Class(Component,{FORMAT_BLOCK_TAG:"div",initObject:function(element,editor){arguments.callee.applySuper(this,arguments);this.editor=editor;this.window=this.element.contentWindow;this.document=this.element.contentDocument||this.element.contentWindow.document;if(defined(this.document.body.contentEditable)&&navigator.userAgent.indexOf("Gecko/")==-1)
this.document.body.contentEditable=true;else
this.document.designMode="on";try{this.document.execCommand("useCSS",false,true);this.document.execCommand("styleWithCSS",false,false);}catch(e){}
this.document.body.innerHTML=" ";},destroyObject:function(){this.savedSelection=null;this.document=null;this.window=null;this.editor=null;arguments.callee.applySuper(this,arguments);},initEventListeners:function(){this.addEventListener(this.document,"mousedown","eventMouseDown",true);this.addEventListener(this.document,"mouseup","eventMouseUp",true);this.addEventListener(this.document,"mouseover","eventMouseOver",false);this.addEventListener(this.document,"mouseout","eventMouseOut",false);this.addEventListener(this.document,"click","eventClick",true);this.addEventListener(this.document,"dblclick","eventDoubleClick",true);this.addEventListener(this.document,"contextmenu","eventContextMenu");this.addEventListener(this.document,"keydown","eventKeyDown",true);this.addEventListener(this.document,"keypress","eventKeyPress",true);this.addEventListener(this.document,"keyup","eventKeyUp",true);this.addEventListener(this.document,"focus","eventFocus");this.addEventListener(this.document,"focusin","eventFocusIn");this.addEventListener(this.window,"blur","eventBlur");this.addEventListener(this.element,"beforedeactivate","eventBeforeDeactivate");},eventBlur:function(event){this.saveSelection();},eventBeforeDeactivate:function(event){if(event.target!==this.element)
return;this.saveSelection();},eventKeyDown:function(event){if(event.ctrlKey||event.metaKey){var appBinding=app.eventKeyDown?app.eventKeyDown(event):void 0;if(defined(appBinding))
return appBinding;}
this.monitorSelection();this.editor.setChanged();switch(event.keyCode){case 8:case 46:return this.captureDelete(event);}},eventKeyPress:function(event){var command=this.editor.getKeyEventCommand(event);if(command){this.execCommand(command,false,null);return event.stop();}},eventKeyUp:function(event){this.saveSelection();this.monitorSelection(event);},eventMouseDown:function(event){this.monitorSelection(event);return true;},eventMouseUp:function(event){this.saveSelection();this.eventClick(event);},eventClick:function(event){this.monitorSelection(event);},focus:function(event){if(this.element.focus){try{this.element.focus();}catch(e){};}
if(this.window.focus){try{this.window.focus();}catch(e){};}
this.monitorSelection(event);},getSelection:function(){return DOM.getSelection(this.window,this.document);},saveSelection:function(){var selection=this.getSelection();if(selection.createRange){var range=selection.createRange();if(range.parentElement){var element=range.parentElement();if(element&&element.ownerDocument===this.document)
this.savedSelection=range.getBookmark();}}else if(selection.getRangeAt)
this.savedSelection=selection.getRangeAt(0).cloneRange();},restoreSelection:function(){this.focus();if(!this.savedSelection)
return;var selection=this.getSelection();if(selection.createRange){var range=this.document.body.createTextRange();range.moveToBookmark(this.savedSelection);range.select();}else if(selection.getRangeAt){selection.removeAllRanges();selection.addRange(this.savedSelection);}
this.savedSelection=null;},deleteSelection:function(){var selection=this.getSelection();if(selection.createRange){var range=selection.createRange();range.execCommand("delete",false,null);}
else{this.document.execCommand("delete",false,null);}},monitorSelection:function(event){var selection=this.getSelection();if(selection.rangeCount){this.editor.updateToolbar(selection);var range=selection.getRangeAt(0).cloneRange();var collapsed=range.collapsed;if(event&&event.type=="mousedown"&&event.button!=2){selection.collapse(selection.anchorNode,selection.anchorOffset);collapsed=true;}
var immutable=DOM.getImmutable(range.startContainer);if(immutable){range.setStartBefore(immutable);if(collapsed)
range.collapse(true);else
range.setEndAfter(immutable);}
else if(collapsed&&event&&event.type&&event.type.match(/keyup|mouseup/)){var arrowKey="";if(event.keyCode==37)
arrowKey="left";else if(event.keyCode==39)
arrowKey="right";this.setCaretOutsideElement(selection,range,arrowKey,event.type.match(/mouseup/));}
else
return;selection.removeAllRanges();selection.addRange(range);}
else{if(event&&event.type.match(/keyup|mouseup/)){if(event.keyCode&&(new RegExp("\\w| ").test(String.fromCharCode(event.keyCode))))
return;var updateToolbar=this.editor.getIndirectMethod("updateToolbar");var callUpdate=function(){updateToolbar(selection);};new Timer(callUpdate,400,1);}}},isContentOrImmutable:function(node){if(node.nodeType==Node.TEXT_NODE&&node.nodeValue.match(/\S/))
return null;if(DOM.isImmutable(node))
return node;},getPreviousImmutable:function(node){return DOM.Proxy.forPrevious(node,this.isContentOrImmutable);},getNextImmutable:function(node){return DOM.Proxy.forNext(node,this.isContentOrImmutable);},captureDelete:function(event){var selection=this.getSelection();if(event.ctrlKey)
return;if(selection.type=="Control")
this.deleteSelection();else if(selection.createRange&&selection.type=="None"){var range=selection.createRange();var bookmark=range.getBookmark();if(event.keyCode==8||event.keyCode==46){var vector=event.keyCode==8?-1:1;var originalText=range.text;range.moveStart("character",vector);if(vector==-1&&!range.text.length){range.moveStart("character",vector);if(range.text.length)
range.moveStart("character",(-1)*vector);var nonCharDelete=true;}}
range.select();selection=this.getSelection();if(selection.type=="Control"||nonCharDelete){this.deleteSelection();range.select();}else{if(vector==1){range.moveToBookmark(bookmark);range.select();}else if(range.text==originalText){range.collapse(true);return false;}
this.document.execCommand("delete",false,null);}}
else if(selection.getRangeAt){if(!selection.isCollapsed)
return;var range=selection.getRangeAt(0);var node=range.startContainer;var offset=range.startOffset;var immutable;if(event.keyCode==8&&(node.nodeType!=Node.TEXT_NODE||offset==0)){immutable=this.getPreviousImmutable(node);try{if(immutable)
range.setStartBefore(immutable);}catch(e){}}
else if(event.keyCode==46&&(node.nodeType!=Node.TEXT_NODE||offset==node.nodeValue.length)){immutable=this.getNextImmutable(node);try{if(immutable)
range.setEndAfter(immutable);}catch(e){}}
if(immutable){selection.removeAllRanges();selection.addRange(range);this.deleteSelection();}
return;}
else
this.document.execCommand("delete",false,null);return event.stop();},getHTML:function(){var html=this.document.body.innerHTML;return html;},saveFragmentLink:function(html){this.dummyPage='ztqhsdg';while(html.indexOf(this.dummyPage)!=-1){this.dummyPage+='_ztqhsdg';}
return html.replace(/("|')#/,'$1'+this.dummyPage+'#');},restoreFragmentLink:function(html){return html.replace(this.dummyPage+'#','#');},setHTML:function(html){this.formatBlock();var needToSaveFragmentLink=false;if(navigator.appVersion.indexOf('MSIE 8.0')||navigator.appVersion.indexOf('MSIE 7.0')){needToSaveFragmentLink=true;}
if(needToSaveFragmentLink){html=this.saveFragmentLink(html);}
this.document.body.innerHTML=html;if(needToSaveFragmentLink){this.document.body.innerHTML=this.restoreFragmentLink(this.document.body.innerHTML);}},insertHTML:function(html,select,id,isTempId){this.beginCommand();this.restoreSelection();var selection=this.getSelection();var inserted=null;if(selection.createRange){var range=selection.createRange();if(range.parentElement().document!==this.document){this.document.body.innerHTML=html+this.document.body.innerHTML;}
else if(selection.type=="None"||selection.type=="Text"){html=this.saveFragmentLink(html);try{range.pasteHTML(html);}catch(err){log("Error pasting html on selection of type 'Text' or 'None': "+err);}
if(defined(id)){inserted=this.document.getElementById(id);if(select)
range.moveToElementText(inserted);}else{if(range.moveStart){range.moveStart("character",((html.length)*(-1)));inserted=range.parentElement();}}
if(inserted){var props=['innerHTML','href','src'];for(var i=0;i<props.length;i++){if(inserted[props[i]]){try{inserted[props[i]]=this.restoreFragmentLink(inserted[props[i]]);}
catch(e){}}}}
if(select)
range.select();}else{range.item(0).outerHTML=html;inserted=range.item(0);}}
else if(selection.getRangeAt){var range;if(selection.rangeCount)
range=selection.getRangeAt(0);else{range=this.document.createRange();range.setStart(this.document.body,0);range.setEnd(this.document.body,0);selection.addRange(range);}
var anchor=range.startContainer;if(selection&&range&&this.isCaretAtEnd(selection,range)){var paragraph=this.document.createElement(this.FORMAT_BLOCK_TAG);paragraph.insertBefore(this.document.createElement("br"),null);this.document.getElementsByTagName("body")[0].insertBefore(paragraph,null);}
if(select&&anchor.nodeType==Node.TEXT_NODE&&!html.match(/<[a-z][a-z]*\s/i)){range.setStart(anchor,selection.anchorOffset);var insertNode=this.document.createTextNode(html);range.insertNode(insertNode);var inserted=insertNode;}else{var pS=anchor.previousSibling;var nS=anchor.nextSibling;var m=html.match(/^(<.*(?:src|href)=")(.[^"]*)(".*>)$/)||null;if(m)html=m[1]+'####'+m[3];this.document.execCommand("insertHTML",false,html);if(m){var html=this.document.body.innerHTML;html=html.replace(/####/,m[2]);this.document.body.innerHTML=html;}
if(pS!==anchor.previousSibling)
inserted=anchor.previousSibling;else if(nS!==anchor.nextSibling)
inserted=anchor.nextSibling;else
inserted=anchor.firstChild;}
if(defined(id))
inserted=this.document.getElementById(id);if(inserted&&inserted.tagName&&inserted.tagName.toLowerCase()=="a")
this.tagJustInserted=true;if(select){range.selectNode(inserted);this.monitorSelection();}
selection.addRange(range);}
if(isTempId&&inserted){inserted.id=undefined;inserted.removeAttribute("id");}
this.endCommand();return inserted;},setCaretOutsideElement:function(selection,range,arrowKey,mouseUp){if(selection.rangeCount){if(!range)
range=selection.getRangeAt(0).cloneRange();var node=range.startContainer;var nodeLength=node.data?node.data.length:node.childNodes.length;var element=this.getFirstAncestorElementByDisplayType(node,true,true);if(element&&DOM.isInlineNode(element)){if(!arrowKey&&!mouseUp)
return;if(((arrowKey=="left"&&this.tagJustInserted)||range.startOffset==0)&&!node.previousSibling){var t=(element.previousSibling&&element.previousSibling.nodeType==Node.TEXT_NODE)?element.previousSibling:element.ownerDocument.createTextNode("");element.parentNode.insertBefore(t,element);range.setStart(t,t.data.length);range.collapse(true);}else if(((arrowKey=="right"&&this.tagJustInserted)||range.endOffset>=nodeLength)&&!node.nextSibling){var t=(element.nextSibling&&element.nextSibling.nodeType==Node.TEXT_NODE)?element.nextSibling:element.ownerDocument.createTextNode("");element.parentNode.insertBefore(t,element.nextSibling);range.setEnd(t,0);range.collapse(false);}}}},isCaretAtEnd:function(selection,range){var focusNode=range.endContainer;if(focusNode.nextSibling)
return false;var node=focusNode;while(node&&node.parentNode&&(!node.parentNode.tagName||node.parentNode.tagName.toLowerCase()!="body")){node=node.parentNode;if(node.nextSibling)
return false;}
if(focusNode.nodeType==Node.TEXT_NODE){if(range.endOffset<focusNode.nodeValue.length)
return false;}
return true;},getFirstAncestorElementByDisplayType:function(element,inline,includeSelf){var ancestors=DOM.getAncestors(element,includeSelf);for(var i=0;i<ancestors.length;i++){if(ancestors[i].nodeType==Node.TEXT_NODE)
continue;if(inline&&DOM.isInlineNode(ancestors[i])||!inline&&!DOM.isInlineNode(ancestors[i]))
return ancestors[i];}},isTextSelected:function(){var selection=this.getSelection();if(!selection)
return;if(navigator.userAgent.indexOf('MSIE')!=-1){return selection.type=='Text';}
else{if((selection+'').length>0){return true;}
var asTextElement={"img":1};for(var i=0;i<selection.rangeCount;i++){var range=selection.getRangeAt(0);var j,j_limit;if(range.startContainer!=range.endContainer){j_limit=range.startContainer.childNodes.length;}
else{j_limit=range.endOffset+1;}
for(j=range.startOffset;j<j_limit;j++){if(asTextElement[range.startContainer.childNodes[j].nodeName.toLowerCase()]){return true;}}
if(range.startContainer!=range.endContainer){for(j=range.endOffset;j>=0;j--){if(asTextElement[range.endContainer.childNodes[j].nodeName.toLowerCase()]){return true;}}}}
return false;}},getSelectedLink:function(){var selection=this.getSelection();var selectionRange=new SelectionRange(selection);var link=DOM.getFirstAncestorByTagName(selectionRange.getCommonAncestorContainer(),"a")||DOM.filterElementsByTagName(selectionRange.getNodes(),"a")[0];if(link&&link.href){var bases=[this.window.location.href,this.window.location.href.replace(/\/[^\/]*$/,'/'),this.window.location.href.replace(/.*\//,''),this.window.location.href.replace(/.*\/\/[^\/]+/,'')]
for(var i=0;i<bases.length;i++){var base=bases[i];if((link.href.indexOf(base)!=-1)&&(this.getHTML().indexOf(link.href)==-1)){link.setAttribute('href',link.href.substring(base.length));break;}}}
return link;},beginCommand:function(){DOM.addClassName(this.document.body,"editor-transient");},endCommand:function(){DOM.removeClassName(this.document.body,"editor-transient");},execCommand:function(command,userInterface,argument){this.beginCommand();this.restoreSelection();log(command);switch(command){case"unlink":this.commandUnlink(argument);break;case"createLink":if(command=="createLink"){var selection=this.getSelection();this.tagJustInserted=true;}
default:this.extendedExecCommand(command,userInterface,argument);}
this.monitorSelection();this.endCommand();this.editor.setChanged();},extendedExecCommand:function(command,userInterface,argument){this.document.execCommand(command,userInterface,argument);},commandUnlink:function(argument){var element=this.getSelectedLink();if(!element)
return false;var selection=this.getSelection();if(selection.getRangeAt){var range=selection.getRangeAt(0);range.selectNode(element);}else if(element.select)
element.select();this.document.execCommand("unlink",false,null);},formatBlock:function(){this.document.execCommand("formatBlock",false,this.FORMAT_BLOCK_TAG);}});