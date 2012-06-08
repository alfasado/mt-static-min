TC.Mixer.TagMatch=function(mixer,regExp,inclusive,randomize)
{this.mixer=mixer;this.regExp=regExp;this.greedy=this.regExp?this.regExp.global:true;this.inclusive=inclusive;this.randomize=randomize;this.matches=[];this.entries={};}
TC.Mixer.TagMatch.prototype.match=function(entry)
{var matches=new Array();var entries=new Array();if(entry)
{for(var i in entry.tags)
{var tag=entry.tags[i];if(this.regExp)
{var m=tag.match(this.regExp);if(!m||m.length==0)
continue;}
var tagIndex=this.mixer.tagIndexes[tag];if(!tagIndex)
continue;for(var j in tagIndex)
{var tagEntry=tagIndex[j];if(entries[tagEntry.name])
continue;if(!this.inclusive&&(tagEntry==entry||this.mixer.matchedEntries[tagEntry.name]))
continue;entries[tagEntry.name]=tagEntry;matches.push(tagEntry);}
if(!this.greedy)
break;}}
if(matches.length==this.matches.length)
{var same=true;for(var i in entries)
{if(entries[i]!=this.entries[i])
{same=false;break;}}
if(same)
{return false;}}
if(this.randomize)
TC.scramble(matches);else
matches=matches.sort(this.mixer.sortEntryClosure);this.entries=entries;this.matches.length=matches.length;for(var i in matches)
this.matches[i]=matches[i];return true;}