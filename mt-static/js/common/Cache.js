Cache=new Class(Object,{maxLength:100,hits:0,misses:0,init:function(maxLength){if(maxLength>0)
this.maxLength=maxLength;this.flush();},flush:function(){this.length=0;this.LRU=0;this.MRU=0;this.IDX={};this.KEY=[];this.VALUE=[];this.PREV=[];this.NEXT=[];this.DELETE=[];},getItemsOrdered:function(offset,count){offset=offset||0;count=count||this.length;var keys=[];var values=[];var idx=this.MRU;var c=0;for(var i=0;i<this.length;i++){if(i<offset){idx=this.NEXT[idx];continue;}
keys.push(this.KEY[idx]);values.push(this.VALUE[idx]);c++;if(c>=count)
break;idx=this.NEXT[idx];}
return[keys,values];},getItems_:function(){return[this.KEY,this.VALUE];},deleteItem:function(key){if(!this.IDX.hasOwnProperty(key))
return undefined;var value=this.VALUE[this.IDX[key]];this.deleteNode(key);return value;},setItem:function(key,value){if(!defined(key)||!defined(value))
return undefined;var idx;if(this.IDX.hasOwnProperty(key))
idx=this.deleteNode(key);else if(this.length>=this.maxLength&&defined(this.KEY[this.LRU]))
idx=this.deleteNode(this.KEY[this.LRU]);else if(this.KEY.length&&this.KEY[this.LRU]==undefined)
idx=this.LRU;this.insertNode(key,value,idx);return value;},getItem:function(key){var idx=this.IDX[key];if(!this.IDX.hasOwnProperty(key)||idx<0||idx>=this.length||!defined(this.VALUE[idx])){this.misses++;return undefined;}
this.hits++;this.setMRU(idx);return this.VALUE[idx];},getItems:function(ids){var items=[];for(var i=0;i<ids.length;i++){var item=this.getItem(ids[i]);if(item)
items.push(item);}
return items;},touchItem:function(key){var idx=this.IDX[key];if(!this.IDX.hasOwnProperty(key)||idx<0||idx>=this.length||!defined(this.VALUE[idx]))
return undefined;this.setMRU(idx);},setMRU:function(idx){var prevnode=this.PREV[idx];var nextnode=this.NEXT[idx];if(prevnode==-1){if(this.MRU!=idx)
log.error("LRUCache::setMRU idx:"+idx+" has an inconsistent PREV key (PREV:-1 but MRU != idx)");return;}
this.connectNodes(prevnode,nextnode);this.PREV[this.MRU]=idx;this.NEXT[idx]=this.MRU;this.PREV[idx]=-1;this.MRU=idx;},setLRU:function(idx){var nextnode=this.NEXT[idx];var prevnode=this.PREV[idx];if(nextnode==-1){if(this.LRU!=idx)
log.error("LRUCache::setLRU  idx:"+idx+" has an inconsistent NEXT key (NEXT:-1 but LRU != idx)");return;}
this.connectNodes(prevnode,nextnode);this.NEXT[this.LRU]=idx;this.PREV[idx]=this.LRU;this.NEXT[idx]=-1;this.LRU=idx;},connectNodes:function(prevnode,nextnode){if(prevnode==-1)
this.MRU=nextnode;else
this.NEXT[prevnode]=nextnode;if(nextnode==-1)
this.LRU=prevnode;else
this.PREV[nextnode]=prevnode;},deleteNode:function(key){var idx=this.IDX[key];this.setLRU(idx);delete this.IDX[key];this.KEY[idx]=undefined;this.VALUE[idx]=undefined;return idx;},insertNode:function(key,value,idx){if(!defined(idx))
idx=this.length++;this.setMRU(idx);this.VALUE[idx]=value;this.KEY[idx]=key;this.IDX[key]=idx;return idx;},visualize:function(){var c=this.LRU;log.warn("LRUCache::visualize MRU: "+c);for(var i=0;i<this.length;i++){log.warn("LRUCache::visualize [ "+this.KEY[c]+" ] "+c+
((this.LRU==c)?" - LRU":"")+((this.MRU==c)?" - MRU":""));c=this.PREV[c];}}});