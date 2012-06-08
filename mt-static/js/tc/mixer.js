TC.Mixer=function(name)
{this.name=name;this.entry=null;this.selected=[];this.history=[];this.maxHistory=0;this.entries={};this.matchedEntries={};this.tagIndexes={};this.tagMatches=[];this.displays=[];this.entryEvents=[];this.onselect=null;var self=this;this.sortEntryClosure=function(a,b){return self.sortEntry(a,b);};}
TC.Mixer.prototype.remix=function()
{if(this.name&&this.entry!=this.entries[this.name])
{this.entry=this.entries[this.name];this.selected[0]=this.entry;var isNew=true;for(var i in this.history)
{if(this.history[i]==this.entry)
{isNew=false;break;}}
if(isNew)
this.history.push(this.entry);if(this.history.length>this.maxHistory)
this.history[0]=this.history.shift();}
else if(!this.name)
{this.entry=null;this.selected[0]=null;}
this.matchedEntries={};for(var i in this.tagMatches)
{var tagMatch=this.tagMatches[i];if(typeof(tagMatch)!='object')
continue;if(tagMatch.match(this.entry))
this.dirtyDisplays(tagMatch.matches);for(var j in tagMatch.entries)
this.matchedEntries[j]=tagMatch.entries[j];}
this.display();}
TC.Mixer.prototype.display=function()
{for(var i in this.displays)
{var display=this.displays[i];if(typeof(display)!='object')
continue;if(display)display.display();}}
TC.Mixer.prototype.selectEntry=function(name)
{this.name=name;this.remix();if(this.onselect){this.onselect(this,name);}}
TC.Mixer.prototype.addEntry=TC.Mixer.prototype.addEntries=function()
{var changed=false;var args=arguments;for(var i=0;i<arguments.length;i++)
{var entry=arguments[i];if(!entry.name||!typeof(entry.name)=="string"||entry.name.length==0)
continue;this.entries[entry.name]=entry;changed=true;}
if(changed)
this.createTagIndexes();}
TC.Mixer.prototype.addEntryEvent=function(name,func)
{this.entryEvents[name]=func;}
TC.Mixer.prototype.sortEntry=function(a,b)
{if(a.sort<b.sort)
return-1;else if(a.sort>b.sort)
return 1;else
return 0;}
TC.Mixer.prototype.createTagIndexes=function()
{for(var tag in this.tagIndexes)
this.tagIndexes[tag].length=0;for(var i in this.entries)
{var entry=this.entries[i];if(!entry)
continue;for(var j in entry.tags)
{var tag=entry.tags[j];if(!this.tagIndexes[tag])
this.tagIndexes[tag]=[];this.tagIndexes[tag].push(entry);}}
for(var tag in this.tagIndexes)
{var tagIndex=this.tagIndexes[tag];var sorted=tagIndex.sort(this.sortEntryClosure);for(var i in sorted)
tagIndex[i]=sorted[i];}}
TC.Mixer.prototype.getTagIndex=function(tag)
{if(!this.tagIndexes[tag])
this.tagIndexes[tag]=[];return this.tagIndexes[tag];}
TC.Mixer.prototype.addTagMatch=function(regExp,inclusive,randomize)
{var tagMatch;var rs=regExp?regExp.source:null;for(var i in this.tagMatches)
{tagMatch=this.tagMatches[i];if(tagMatch.inclusive!=inclusive||tagMatch.randomize!=randomize||(!tagMatch.regExp&&regExp)||(tagMatch.regExp&&!regExp)||tagMatch.regExp.source!=rs)
continue;return tagMatch;}
tagMatch=new TC.Mixer.TagMatch(this,regExp,inclusive,randomize);this.tagMatches.push(tagMatch);return tagMatch;}
TC.Mixer.prototype.addInclusiveTagMatch=function(regExp)
{return this.addTagMatch(regExp,true,false);}
TC.Mixer.prototype.addRandomTagMatch=function(regExp)
{return this.addTagMatch(regExp,false,true);}
TC.Mixer.prototype.dirtyDisplays=function(source)
{for(var i in this.displays)
{var display=this.displays[i];if(typeof(display)!='object')
continue;if(!source||display.source==source)
display.dirty=true;}}
TC.Mixer.prototype.addDisplay=function(id,entryList,start,count,imageProperty)
{var display=new TC.Mixer.Display(this,id,entryList,start,count,imageProperty);this.displays.push(display);return display;}
TC.Mixer.prototype.addClonedDisplay=function(id,display)
{if(!display)
return null;display=display.clone();this.displays.push(display);return display;}
TC.Mixer.prototype.addInitialDisplay=function(id)
{return this.addDisplay(id,this.history,0,1,"imageSmall");}
TC.Mixer.prototype.addSelectedDisplay=function(id)
{return this.addDisplay(id,this.selected,0,1,"imageBig");}
TC.Mixer.prototype.addBigSelectedDisplay=function(id)
{return this.addDisplay(id,this.selected,0,1,"imageSmall");}
TC.Mixer.prototype.addHistoryDisplay=function(id,count)
{if(count>this.maxHistory)
this.maxHistory=count;return this.addDisplay(id,this.history,-1,count*-1,"imageSmall");}
TC.Mixer.prototype.addTagIndexDisplay=function(id,count,tag)
{var tagIndex=this.getTagIndex(tag);return this.addDisplay(id,tagIndex,0,count,"imageSmall");}
TC.Mixer.prototype.addTagMatchDisplay=function(id,count,regExp)
{var tagMatch=this.addInclusiveTagMatch(regExp);return this.addDisplay(id,tagMatch.matches,0,count,"imageSmall");}
TC.Mixer.prototype.addRandomTagMatchDisplay=function(id,count,regExp)
{var tagMatch=this.addRandomTagMatch(regExp);return this.addDisplay(id,tagMatch.matches,0,count,"imageSmall");}