Timer=new Class(Object,{init:function(callback,delay,count){this.callback=callback;this.delay=max(delay,1);this.nextDelay=this.delay;this.startTime=0;this.count=count;this.execCount=0;this.state="new";this.timeout=null;this.id=Unique.id();this.start();},destroy:function(){this.stop();this.callback=null;},exec:function(){this.execCount++;this.callback(this);if(this.count&&this.execCount>=this.count){return this.destroy();}
if(this.state=="started")
this.run();},run:function(){this.state="started";this.timeout=window.setTimeout(this.exec.bind(this),this.nextDelay);this.nextDelay=this.delay;var date=new Date();this.startTime=date.UTC;},start:function(){switch(this.state){case"new":case"paused":case"stopped":this.run();break;}},stop:function(){this.state="stopped";try{window.clearTimeout(this.timeout);}catch(e){}
this.timeout=null;},pause:function(){if(this.state!="started")
return;this.stop();this.state="paused";var date=new Date();this.nextDelay=max(this.delay-(date.UTC-this.startTime),1);},reset:function(delay){if(this.state!="started")
return;if(defined(delay))
this.delay=this.nextDelay=max(delay,1);try{window.clearTimeout(this.timeout);}catch(e){}
this.timeout=window.setTimeout(this.exec.bind(this),this.nextDelay);}});