/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./library','sap/ui/core/Control','sap/ui/core/Popup','./MessageToast','./MessageList'],function(q,l,C,P,M,a){"use strict";var b=C.extend("sap.ui.commons.MessageBar",{metadata:{deprecated:true,library:"sap.ui.commons",properties:{anchorID:{type:"string",group:"Appearance",defaultValue:''},visible:{type:"boolean",group:"Behavior",defaultValue:true},maxToasted:{type:"int",group:"Misc",defaultValue:3},maxListed:{type:"int",group:"Misc",defaultValue:7},anchorSnapPoint:{type:"string",group:"Misc",defaultValue:"begin top"}}}});b.prototype.init=function(){this.aErrors=[];this.aWarnings=[];this.aSuccesses=[];this.aToasts=[];this.maxToastsReached=false;this.oPopup=new P(this,false,true,false);this.oList=null;var i=this.getId();this.oToast=new M(i+"__Toast",{anchorId:i+"__sums"});var t=this;this.oToast.attachNext(function(){t.checkForToast();});this.snapPoint=null;this.oHomePosition=null;this.oDropPosition=null;this.bToggleListBackAfterDrag=null;};b.prototype.exit=function(){this.onmouseup();this.close();this.oPopup.destroy();this.oPopup=null;this.oToast.destroy();this.oToast=null;if(this.oList){this.oList.destroy();this.oList=null;}};b.prototype.ondragstart=function(e){e.preventDefault();e.stopPropagation();};b.prototype.onmousedown=function(e){var s=e.target;var S=q(s);if(S.css('cursor')!="move"){return;}this.sDragMode="move";this.oMsgBarDragStartPosition=this.$().rect();this.oMsgBarDragStartPosition.right=Number(this.$().css('right').replace("px",""));if(!this.oHomePosition){this.oHomePosition=this.oMsgBarDragStartPosition;}this.mouseDragStartPositionX=e.screenX;this.mouseDragStartPositionY=e.screenY;var d=q(window.document);d.bind("mousemove",q.proxy(this.handleMove,this));if(window.parent){q(window.parent.document).bind("mousemove",q.proxy(this.handleMove,this),true);}d.bind("selectstart",q.proxy(this.ondragstart,this),true);};b.prototype.handleMove=function(e){if(!this.sDragMode){return;}if(this.bToggleListBackAfterDrag==null&&this.oList){this.bToggleListBackAfterDrag=this.oList.getVisible();if(this.bToggleListBackAfterDrag){this.toggleList();}}e=e||window.event;var t=this.oMsgBarDragStartPosition.top+e.screenY-this.mouseDragStartPositionY;var L=this.oMsgBarDragStartPosition.left+e.screenX-this.mouseDragStartPositionX;var r=this.oMsgBarDragStartPosition.right-e.screenX+this.mouseDragStartPositionX;this.oPopup._$().css('top',t);if(this.snapPoint.indexOf("right")!=-1){this.oPopup._$().css('right',r);}else{this.oPopup._$().css('left',L);}this.oDropPosition={top:t,left:L,right:r};e.cancelBubble=true;return false;};b.prototype.onmouseup=function(e){if(!this.sDragMode){return;}if(this.oDropPosition){this.addStyleClass("sapUiMsgBarMoved");}if(this.bToggleListBackAfterDrag){this.toggleList();}this.bToggleListBackAfterDrag=null;var d=q(window.document);d.unbind("mousemove",q.proxy(this.handleMove,this));if(window.parent){q(window.parent.document).unbind("mousemove",q.proxy(this.handleMove,this));}d.unbind("selectstart",q.proxy(this.ondragstart,this));this.sDragMode=null;this.checkForToast();};b.prototype.onclick=function(e){var s=e.target;var S=q(s);if(S.css('cursor')!="pointer"){return;}if(S.hasClass("sapUiMsgBarToggle")){this.toggleList();}else if(S.hasClass("sapUiMsgBarHome")){this.backHome();}else{q.sap.log.debug("Warning: MessageBar unsupported click on "+S.attr('className'));}};b.prototype.checkForToast=function(){if(this.maxToastsReached){return;}if(this.aToasts==null||this.aToasts.length==0){return;}var m=this.getMaxToasted();if(m==0){return;}if(this.sDragMode){return;}var n=null;var c="";if(this.aToasts.length>this.getMaxToasted()){this.aToasts=[];this.maxToastsReached=true;c=this.getId()+"__arrowImg";}else{if(!this.oToast.isIdle()){return;}n=this.aToasts.splice(0,1)[0];c=this.getId()+"__"+n.getType()+"Img";}this.oToast.toast(n,c);};b.prototype.addToasts=function(m){for(var i=0,c=m.length;i<c;i++){var n=m[i];var d=false;for(var j=this.aToasts.length;j>=0;j--){if(n==this.aToasts[j]){d=true;break;}}if(!d){this.aToasts.push(n);}}};b.prototype.deleteToast=function(i){if(!this.aToasts){return;}for(var j=0,c=this.aToasts.length;j<c;j++){if(this.aToasts[j].getId()==i){this.aToasts.splice(j,1);return;}}};b.prototype.deleteOneMessage=function(i){if(!i){return;}for(var j=0,c=this.aErrors.length;j<c;j++){if(this.aErrors[j].getId()==i){this.aErrors[j].closeDetails();this.aErrors.splice(j,1);return;}}for(var j=0,c=this.aWarnings.length;j<c;j++){if(this.aWarnings[j].getId()==i){this.aWarnings[j].closeDetails();this.aWarnings.splice(j,1);return;}}for(var j=0,c=this.aSuccesses.length;j<c;j++){if(this.aSuccesses[j].getId()==i){this.aSuccesses[j].closeDetails();this.aSuccesses.splice(j,1);return;}}};b.prototype.getSnapPoint=function(){if(!this.snapPoint){this.snapPoint=this.getAnchorSnapPoint();if(sap.ui.getCore().getConfiguration().getRTL()){this.snapPoint=this.snapPoint.replace("begin","right").replace("end","left");}else{this.snapPoint=this.snapPoint.replace("begin","left").replace("end","right");}}return this.snapPoint;};b.prototype.open=function(){var c=0;var s=this.getSnapPoint();var d=null;var e=this.getAnchorID();if(e){d=q.sap.domById(e);}if(!d){d=document.body;}this.oPopup.open(c,s,s,d,"0 0");if(this.oDropPosition){this.oPopup._$().css('top',this.oDropPosition.top);if(s.indexOf("right")!=-1){this.oPopup._$().css('right',this.oDropPosition.right);}else{this.oPopup._$().css('left',this.oDropPosition.left);}}if(this.hasStyleClass("sapUiMsgBarOpen")){this.oList.setVisible(true);}};b.prototype.close=function(){if(this.oList&&this.oList.getVisible()){this.oList.setVisible(false);}var c=0;this.oPopup.close(c);this.maxToastsReached=false;};b.prototype.updateCountersAndVisibility=function(){if(!this.getProperty("visible")){return;}var i=this.getId();var c=q.sap.domById(i+"__ErrorCount");if(!c){this.open();c=q.sap.domById(i+"__ErrorCount");}var d=this.aErrors.length;var o=c.innerHTML;var n="("+d+")";var I=null;var j=null;if(n!=o){c.innerHTML=n;if(n=="(0)"){I=q.sap.byId(i+"__ErrorImg");j=q.sap.byId(i+"__ErrorCount");I.addClass("sapUiMsgBarZeroCount");j.addClass("sapUiMsgBarZeroCount");}else if(o=="(0)"){I=q.sap.byId(i+"__ErrorImg");j=q.sap.byId(i+"__ErrorCount");I.removeClass("sapUiMsgBarZeroCount");j.removeClass("sapUiMsgBarZeroCount");}}c=q.sap.domById(i+"__WarningCount");d=this.aWarnings.length;o=c.innerHTML;n="("+d+")";I=null;j=null;if(n!=o){c.innerHTML=n;if(n=="(0)"){I=q.sap.byId(i+"__WarningImg");j=q.sap.byId(i+"__WarningCount");I.addClass("sapUiMsgBarZeroCount");j.addClass("sapUiMsgBarZeroCount");}else if(o=="(0)"){I=q.sap.byId(i+"__WarningImg");j=q.sap.byId(i+"__WarningCount");I.removeClass("sapUiMsgBarZeroCount");j.removeClass("sapUiMsgBarZeroCount");}}c=q.sap.domById(i+"__SuccessCount");d=this.aSuccesses.length;o=c.innerHTML;n="("+d+")";I=null;j=null;if(n!=o){c.innerHTML=n;if(n=="(0)"){I=q.sap.byId(i+"__SuccessImg");j=q.sap.byId(i+"__SuccessCount");I.addClass("sapUiMsgBarZeroCount");j.addClass("sapUiMsgBarZeroCount");}else if(o=="(0)"){I=q.sap.byId(i+"__SuccessImg");j=q.sap.byId(i+"__SuccessCount");I.removeClass("sapUiMsgBarZeroCount");j.removeClass("sapUiMsgBarZeroCount");}}if(this.aErrors.length==0&&this.aWarnings.length==0&&this.aSuccesses.length==0){this.close();return;}else{this.open();}if(this.oList&&this.oList.getVisible()){this.oList.setMessages(this.aSuccesses.concat(this.aWarnings).concat(this.aErrors));}this.checkForToast();};b.prototype.toggleList=function(){if(!this.oList){var c=this.getId()+"__List";this.oList=new a(c,{anchorId:this.getId(),maxListed:this.getMaxListed()});}var v=this.oList.getVisible();if(!v){this.oList.setMessages(this.aSuccesses.concat(this.aWarnings).concat(this.aErrors));this.addStyleClass("sapUiMsgBarOpen");}else{this.removeStyleClass("sapUiMsgBarOpen");}this.oList.setVisible(!v);};b.prototype.backHome=function(){var p=this.oPopup._$();if(this.oList&&this.oList.getVisible()){this.toggleList();var t=this;if(this.snapPoint.indexOf("right")!=-1){p.animate({right:this.oHomePosition.right+"px",top:this.oHomePosition.top+"px"},200,function(){t.toggleList();});}else{p.animate({left:this.oHomePosition.left+"px",top:this.oHomePosition.top+"px"},200,function(){t.toggleList();});}}else{if(this.snapPoint.indexOf("right")!=-1){p.animate({right:this.oHomePosition.right+"px",top:this.oHomePosition.top+"px"},200);}else{p.animate({left:this.oHomePosition.left+"px",top:this.oHomePosition.top+"px"},200);}}this.oDropPosition=null;this.removeStyleClass("sapUiMsgBarMoved");};b.prototype.addMessages=function(m){if(!m){return;}for(var i=0,c=m.length;i<c;i++){this.deleteOneMessage(m[i].getId());switch(m[i].getType()){case sap.ui.commons.MessageType.Error:this.aErrors.push(m[i]);break;case sap.ui.commons.MessageType.Warning:this.aWarnings.push(m[i]);break;case sap.ui.commons.MessageType.Success:this.aSuccesses.push(m[i]);break;default:q.sap.log.debug("ERROR: MessageBar supplied messageType="+m[i].getType());}}this.addToasts(m);this.updateCountersAndVisibility();return this;};b.prototype.deleteMessages=function(I){if(!I){return;}for(var i=0,c=I.length;i<c;i++){this.deleteOneMessage(I[i]);this.deleteToast(I[i]);}this.updateCountersAndVisibility();return this;};b.prototype.deleteAllMessages=function(){for(var j=this.aErrors.length-1;j>=0;j--){this.aErrors[j].closeDetails();}for(var j=this.aWarnings.length-1;j>=0;j--){this.aWarnings[j].closeDetails();}for(var j=this.aSuccesses.length-1;j>=0;j--){this.aSuccesses[j].closeDetails();}this.aErrors=[];this.aWarnings=[];this.aSuccesses=[];this.aToasts=[];this.updateCountersAndVisibility();return this;};b.prototype.setVisible=function(v){this.setProperty("visible",v);if(v){this.updateCountersAndVisibility();}else{this.close();}return this;};return b;},true);