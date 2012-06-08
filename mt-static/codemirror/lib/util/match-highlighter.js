(function(){var DEFAULT_MIN_CHARS=2;function MatchHighlightState(){this.marked=[];}
function getMatchHighlightState(cm){return cm._matchHighlightState||(cm._matchHighlightState=new MatchHighlightState());}
function clearMarks(cm){var state=getMatchHighlightState(cm);for(var i=0;i<state.marked.length;++i)
state.marked[i].clear();state.marked=[];}
function markDocument(cm,className,minChars){clearMarks(cm);minChars=(typeof minChars!=='undefined'?minChars:DEFAULT_MIN_CHARS);if(cm.somethingSelected()&&cm.getSelection().length>=minChars){var state=getMatchHighlightState(cm);var query=cm.getSelection();cm.operation(function(){if(cm.lineCount()<2000){for(var cursor=cm.getSearchCursor(query);cursor.findNext();){if(!(cursor.from().line===cm.getCursor(true).line&&cursor.from().ch===cm.getCursor(true).ch))
state.marked.push(cm.markText(cursor.from(),cursor.to(),className));}}});}}
CodeMirror.defineExtension("matchHighlight",function(className,minChars){markDocument(this,className,minChars);});})();