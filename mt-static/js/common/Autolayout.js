Autolayout={matchAutolayout:/(?:^|\s)autolayout-(\S+)(?:\s|$)/,matchSingleAutolayout:/^autolayout-(\S+)$/,applyAutolayouts:function(e){var cs=DOM.getClassNames(e);for(var i=0;i<cs.length;i++){var r=this.matchSingleAutolayout.exec(cs[i]);if(!r||!r[1])
continue;var l=r[1].cssToJS();if(!this.layouts.hasOwnProperty(l))
continue;this.layouts[l].apply(this,arguments);}}}
Autolayout.layouts={center:function(e){DOM.setLeft(e,finiteInt(e.parentNode.clientWidth/2)-finiteInt(e.offsetWidth/2));DOM.setTop(e,finiteInt(e.parentNode.clientHeight/2)-finiteInt(e.offsetHeight/2));},heightParent:function(e){DOM.setHeight(e,finiteInt(e.parentNode.clientHeight));},heightNext:function(e){var ne=DOM.getNextElement(e);if(!ne)
return;DOM.setHeight(e,finiteInt(ne.offsetTop)-finiteInt(e.offsetTop));},flyout:function(e){var d=DOM.getIframeAbsoluteDimensions(this.targetElement);if(!d)
return;DOM.setLeft(e,d.absoluteLeft);DOM.setTop(e,d.absoluteBottom);},FLYOUT_SMART_EPSILON_Y:200,flyoutSmart:function(e){var td=DOM.getIframeAbsoluteDimensions(this.targetElement);if(!td)
return;var dd=DOM.getDocumentDimensions(DOM.getOwnerDocument(e));if(td.absoluteLeft>(dd.width/2)){e.style.left="auto";DOM.setRight(e,(dd.width-td.absoluteRight));}else{e.style.right="auto";DOM.setLeft(e,td.absoluteLeft);}
if(td.absoluteTop>(dd.height-300)){e.style.top="auto";DOM.setBottom(e,(dd.height-td.absoluteBottom));}else{e.style.bottom="auto";DOM.setTop(e,td.absoluteTop);}},flyoutUp:function(e){var d=DOM.getIframeAbsoluteDimensions(this.targetElement);if(!d)
return;var a=DOM.getDimensions(e);DOM.setLeft(e,d.absoluteLeft);DOM.setTop(e,d.absoluteBottom-a.offsetHeight);},flyoutLeft:function(e){var d=DOM.getIframeAbsoluteDimensions(this.targetElement);if(!d)
return;var a=DOM.getDimensions(e);DOM.setLeft(e,d.absoluteLeft-a.offsetWidth);DOM.setTop(e,d.absoluteTop);},flyoutLeftFromRight:function(e){var d=DOM.getIframeAbsoluteDimensions(this.targetElement);if(!d)
return;var a=DOM.getDimensions(e);DOM.setLeft(e,d.absoluteRight-a.offsetWidth);DOM.setTop(e,d.absoluteTop);},targetWidth:function(e){if(!this.targetElement)
return;DOM.setWidth(e,this.targetElement.offsetWidth);}}