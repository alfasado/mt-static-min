Calendar=new Class(Transient,{msInDay:(1000*60*60*24),initObject:function(element,templateName){arguments.callee.applySuper(this,arguments);this.templateName=templateName;this.contentElement=DOM.getElement(this.element.id+'-content');if(!this.contentElement)
this.contentElement=this.element;this.timeElement=DOM.getElement(this.element.id+'-time-input');if(!this.timeElement)
throw"Cannot find time element:"+this.element.id+"-time-input";this.dateObject=new Date();},destroyObject:function(){this.element=null;this.contentElement=null;this.timeElement=null;this.dateObject=null;this.currentDateObject=null;arguments.callee.applySuper(this,arguments);},open:function(){arguments.callee.applySuper(this,arguments);this.dateObject=(!this.data.date)?(new Date()):Date.fromISOString(this.data.date);this.currentDateObject=(!this.data.currentDate)?(new Date()):Date.fromISOString(this.data.currentDate);this.disallowFuture=this.data.disallowFuture;this.timeElement.value=this.getISOTimeShortString();this.render();this.reflow();},close:function(ok){var r=!ok?ok:this.dateObject;arguments.callee.callSuper(this,r);},render:function(){this.contentElement.innerHTML=Template.process(this.templateName,{cal:this});},eventClick:function(event){if(!this.isOpen)
return;var command=this.getMouseEventCommand(event);if(!command)
return;event.stop();var m;var day;if(m=command.match(/setDay-(\d+)/)){day=m[1];command='setDay';}
switch(command){case"nextMonth":this.nextMonth();this.render();break;case"prevMonth":this.prevMonth();this.render();break;case"cancel":this.close();break;case"save":this.checkTimeInput();this.close(true);break;case"setDay":var resetTime=false;if(this.disallowFuture){var dt=this.dateObject.clone();dt.setDate(day);if(dt>this.currentDateObject){dt.setSeconds(1);dt.setHours(0);dt.setMinutes(0);if(dt>this.currentDateObject)
break;else
resetTime=true;}}
var d=this.date();if(d==day)
break;this.date(day);var es=DOM.getElementsByClassName(this.contentElement,"day-"+d);if(es&&es[0])
DOM.removeClassName(es[0],"selected");es=DOM.getElementsByClassName(this.contentElement,"day-"+day);if(es&&es[0])
DOM.addClassName(es[0],"selected");if(resetTime){var d=new Date();var hours=d.getHours().toString().pad(2,"0");var minutes=d.getMinutes().toString().pad(2,"0");var seconds=d.getSeconds().toString().pad(2,"0");this.timeElement.value=hours+":"+minutes+":"+seconds;this.time(this.timeElement.value);}
break;}},eventBlur:function(event){if(event.target!==this.timeElement)
return;this.checkTimeInput();try{this.render();}catch(e){};},checkTimeInput:function(){var time=this.timeElement.value;var m=time.match(/^\d{2}:\d{2}:\d{2}/);if(!m){this.timeElement.value=this.time();return;}
if(this.disallowFuture){var dt=this.dateObject.clone();this.time(time,dt);if(dt>this.currentDateObject){this.timeElement.value=this.time();return;}}
this.timeElement.value=this.time(time);},eventMouseOver:function(event){DOM.addClassName(this.element,"hover-over");},eventMouseOut:function(event){DOM.removeClassName(this.element,"hover-over");},nextMonthAllowed:function(){if(this.disallowFuture){var dt=this.dateObject.clone();var month=this.month();var year=this.year();if(month==11){month=1;year++;}else
month++;dt.setMonth(month);dt.setYear(year);dt.setDate(1);if(dt>this.currentDateObject)
return false;}
return true;},nextMonth:function(){var m=this.month();var y=this.year();if(m==11){m=0;y++;}else
m++;if(this.disallowFuture){var dt=this.dateObject.clone();dt.setMonth(m);dt.setYear(y);if(dt>this.currentDateObject){dt.setDate(1);if(dt>this.currentDateObject){return false;}else{this.date(1);}}}
this.year(y);if(this.month(m)!=m){this.date(this.getDaysInMonth(m));this.month(m);}
return true;},prevMonth:function(){var m=this.month();var y=this.year();if(m==0){m=11;y--;}else
m--;this.year(y);if(this.month(m)!=m){this.date(this.getDaysInMonth(m));this.month(m);}
return true;},isToday:function(day){var dt=this.dateObject.clone();dt.setDate(day);return(this.getCurrentISODate()==dt.toISODateString());},isFuture:function(day){var dt=this.dateObject.clone();dt.setDate(day);dt.setSeconds(1);dt.setHours(0);dt.setMinutes(0);return(dt>this.currentDateObject);},getCurrentISODate:function(){return this.currentDateObject.toISODateString();},getISODate:function(){return this.dateObject.toISODateString();},getISOTime:function(){return this.dateObject.toISOTimeString();},getISOTimeShortString:function(){var hours=this.dateObject.getHours().toString().pad(2,"0");var minutes=this.dateObject.getMinutes().toString().pad(2,"0");var seconds=this.dateObject.getSeconds().toString().pad(2,"0");return hours+":"+minutes+":"+seconds;},getISOString:function(){return this.dateObject.toISOString();},month:function(m){if(defined(m))
this.dateObject.setMonth(m);return this.dateObject.getMonth();},year:function(year){if(year)
this.dateObject.setFullYear(year);return this.dateObject.getFullYear();},date:function(day){if(day)
this.dateObject.setDate(day);return this.dateObject.getDate();},time:function(time,dateobj){if(!dateobj)
dateobj=this.dateObject;if(time){var m=time.match(/^(\d{2}):(\d{2}):(\d{2})/);if(!m&&m.length>2)
return dateobj.toISOTimeString();dateobj.setHours(finiteInt(m[1],10));dateobj.setMinutes(finiteInt(m[2],10));dateobj.setSeconds(finiteInt(m[3],10));}
return dateobj.toISOTimeString();},weekStart:function(){return Date.strings.localeWeekStart;},dow:function(opt){if(opt)
log.error('Calendar.dow() is only a getter');return this.dateObject.getDay();},getDOWFromDay:function(day){var dt=this.dateObject.clone();dt.setDate(day);return dt.getDay();},getDaysInMonth:function(month,year){if(!month)
month=this.month();if(!year)
year=this.year();return 32-(new Date(year,month,32)).getDate();},getLocaleDayString:function(dow){return this.dateObject.getLocaleDayString(dow);},getLocaleDayShortString:function(dow){return this.dateObject.getLocaleDayShortString(dow);},getLocaleMonthString:function(month){return this.dateObject.getLocaleMonthString(month);},getLocaleMonthShortString:function(month){return this.dateObject.getLocaleMonthShortString(month);}});