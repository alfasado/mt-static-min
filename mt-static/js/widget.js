function edit_different_widgetmanager(blog_id){var current=getByID('current-widgetmanager').value;window.location='?__mode=manage&blog_id='+blog_id+'&widgetmanager='+current;}
function selectAllOptions(obj){if(!hasOptions(obj)){return;}
for(var i=0;i<obj.options.length;i++){obj.options[i].selected=true;}}
function hasOptions(obj){if(obj!=null&&obj.options!=null){return true;}
return false;}
function swapOptions(obj,i,j){var o=obj.options;var i_selected=o[i].selected;var j_selected=o[j].selected;var temp=new Option(o[i].text,o[i].value,o[i].defaultSelected,o[i].selected);var temp2=new Option(o[j].text,o[j].value,o[j].defaultSelected,o[j].selected);o[i]=temp2;o[j]=temp;o[i].selected=j_selected;o[j].selected=i_selected;}
function moveOptionUp(obj){if(!hasOptions(obj)){return;}
var i;for(i=0;i<obj.options.length;i++){if(obj.options[i].selected){if(i!=0&&!obj.options[i-1].selected){swapOptions(obj,i,i-1);obj.options[i-1].selected=true;}}}}
function moveOptionDown(obj){if(!hasOptions(obj)){return;}
var i;for(i=obj.options.length-1;i>=0;i--){if(obj.options[i].selected){if(i!=(obj.options.length-1)&&!obj.options[i+1].selected){swapOptions(obj,i,i+1);obj.options[i+1].selected=true;}}}}<!--Original:Phil Webb(phil@philwebb.com)--><!--Web Site:http:<!--This script and many more are available free online at--><!--The JavaScript Source!!http:function move(fbox,tbox){var arrFbox=new Array();var arrTbox=new Array();var arrLookup=new Array();var i;for(i=0;i<tbox.options.length;i++){arrLookup[tbox.options[i].text]=tbox.options[i].value;arrTbox[i]=tbox.options[i].text;}
var fLength=0;var tLength=arrTbox.length;for(i=0;i<fbox.options.length;i++){arrLookup[fbox.options[i].text]=fbox.options[i].value;if(fbox.options[i].selected&&fbox.options[i].value!=""){arrTbox[tLength]=fbox.options[i].text;tLength++;}else{arrFbox[fLength]=fbox.options[i].text;fLength++;}}
arrFbox.sort();fbox.length=0;tbox.length=0;var c;for(c=0;c<arrFbox.length;c++){var no=new Option();no.value=arrLookup[arrFbox[c]];no.text=arrFbox[c];fbox[c]=no;}
for(c=0;c<arrTbox.length;c++){var no=new Option();no.value=arrLookup[arrTbox[c]];no.text=arrTbox[c];tbox[c]=no;}}
function move_item(val,fbox,tbox){var arrFbox=new Array();var arrTbox=new Array();var arrLookup=new Array();var i;for(i=0;i<tbox.options.length;i++){arrLookup[tbox.options[i].text]=tbox.options[i].value;arrTbox[i]=tbox.options[i].text;}
var fLength=0;var tLength=arrTbox.length;for(i=0;i<fbox.options.length;i++){arrLookup[fbox.options[i].text]=fbox.options[i].value;if(fbox.options[i].value==val){arrTbox[tLength]=fbox.options[i].text;tLength++;}else{arrFbox[fLength]=fbox.options[i].text;fLength++;}}
arrFbox.sort();arrTbox.sort();fbox.length=0;tbox.length=0;var c;for(c=0;c<arrFbox.length;c++){var no=new Option();no.value=arrLookup[arrFbox[c]];no.text=arrFbox[c];fbox[c]=no;}
for(c=0;c<arrTbox.length;c++){var no=new Option();no.value=arrLookup[arrTbox[c]];no.text=arrTbox[c];tbox[c]=no;}}