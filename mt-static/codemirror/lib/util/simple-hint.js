(function(){CodeMirror.simpleHint=function(editor,getHints){if(editor.somethingSelected())return;var result=getHints(editor);if(!result||!result.list.length)return;var completions=result.list;function insert(str){editor.replaceRange(str,result.from,result.to);}
if(completions.length==1){insert(completions[0]);return true;}
var complete=document.createElement("div");complete.className="CodeMirror-completions";var sel=complete.appendChild(document.createElement("select"));if(!window.opera)sel.multiple=true;for(var i=0;i<completions.length;++i){var opt=sel.appendChild(document.createElement("option"));opt.appendChild(document.createTextNode(completions[i]));}
sel.firstChild.selected=true;sel.size=Math.min(10,completions.length);var pos=editor.cursorCoords();complete.style.left=pos.x+"px";complete.style.top=pos.yBot+"px";document.body.appendChild(complete);if(completions.length<=10)
complete.style.width=(sel.clientWidth-1)+"px";var done=false;function close(){if(done)return;done=true;complete.parentNode.removeChild(complete);}
function pick(){insert(completions[sel.selectedIndex]);close();setTimeout(function(){editor.focus();},50);}
CodeMirror.connect(sel,"blur",close);CodeMirror.connect(sel,"keydown",function(event){var code=event.keyCode;if(code==13){CodeMirror.e_stop(event);pick();}
else if(code==27){CodeMirror.e_stop(event);close();editor.focus();}
else if(code!=38&&code!=40){close();editor.focus();setTimeout(function(){CodeMirror.simpleHint(editor,getHints);},50);}});CodeMirror.connect(sel,"dblclick",pick);sel.focus();if(window.opera)setTimeout(function(){if(!done)sel.focus();},100);return true;};})();