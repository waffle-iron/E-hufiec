/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["jquery.sap.global"],function($){"use strict";function n(s,S){S=S||" ";return s.replace(/[\-_]/g," ").trim().replace(/(?!\s)\W/g,"").replace(/\s+/g,S);}var d={normalization:{titleCase:function(S){d._testNormalizationInput(S,"titleCase");return n(S).replace(/\w*/g,function(s){return s.charAt(0).toUpperCase()+s.substr(1).toLowerCase();});},pascalCase:function(s){d._testNormalizationInput(s,"pascalCase");return d.normalization.titleCase(s).split(/\s/).join("");},camelCase:function(S){d._testNormalizationInput(S,"camelCase");return d.normalization.pascalCase(S).replace(/^(\w)/,function(s){return s.toLowerCase();});},hyphenated:function(s){d._testNormalizationInput(s,"hyphenated");return n(s,"-").toLowerCase();},none:function(s){d._testNormalizationInput(s,"none");return s;}},toTable:function(D,N){this._testArrayInput(D,"toTable");var f=this._getNormalizationFunction(N,"toTable");var k=D[0].map(f);return D.slice(1).map(function(r){var g={};for(var i=0;i<k.length;++i){g[k[i]]=r[i];}return g;});},toObject:function(D,N){this._testArrayInput(D,"toObject");N=this._getNormalizationFunction(N,"toObject");var r={};for(var i=0;i<D.length;++i){var R=D[i];var k=R[0];var v=R.slice(1);if(v.length===1){v=v[0];}else{v=this.toObject([v],N);}if(r[k]){$.extend(r[k],v);}else{r[k]=v;}}return this._normalizeKeys(r,N);},_normalizeKeys:function(o,N){for(var p in o){if(o.hasOwnProperty(p)){var s=N.call(this.normalization,p);if(!o.hasOwnProperty(s)){o[s]=o[p];delete o[p];}}}return o;},_getNormalizationFunction:function(f,F){var e="dataTableUtils."+F+": parameter 'vNorm' must be either a Function or a String with the value 'titleCase', 'pascalCase', 'camelCase', 'hyphenated' or 'none'";switch($.type(f)){case"string":var N=this.normalization[f];if(N===undefined){throw new Error(e);}return N;case"function":return f;case"undefined":case"null":return this.normalization.none;default:throw new Error(e);}},_testNormalizationInput:function(s,N){if($.type(s)!=="string"){throw new Error("dataTableUtils.normalization."+N+": parameter 'sString' must be a valid string");}},_testArrayInput:function(A,f){var e="dataTableUtils."+f+": parameter 'aData' must be an Array of Array of Strings";if($.type(A)!=="array"){throw new Error(e);}if(!A.every(function(a){return($.type(a)==="array")&&(a.every(function(s){return($.type(s)==="string");}));})){throw new Error(e);}}};return d;},true);