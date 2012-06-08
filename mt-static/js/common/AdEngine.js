AdEngine={init:function(){var es=document.getElementsByTagName("script");for(var i=0;i<es.length;i++){var ar=es[i].getAttribute("defersrc");if(!ar)
continue;var cl=es[i].cloneNode(true);if(!cl)
continue;cl.setAttribute("src",ar);cl.removeAttribute("defersrc");try{es[i].parentNode.replaceChild(cl,es[i]);}catch(e){}}},insertAdResponse:function(params){var e=document.getElementById(params.id);if(!e)
return;if(params.html){var e2=document.createElement("div");e2.innerHTML=params.html;e.innerHTML="";e.appendChild(e2);}
if(params.js)
return eval("("+params.js+")");},insertAdsMulti:function(params){var i=0;for(i=0;i<params.length;i++){AdEngine.insertAdResponse(params[i]);}}};