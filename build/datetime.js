var DateTime=function(){function e(e){return e.month>0&&e.month<=12}function n(e){return e.day>0&&e.day<=s(e)}function t(e){return e.hours>=0&&e.hours<24}function r(e){return e.minutes>=0&&e.minutes<60}function i(e){return e.seconds>=0&&e.seconds<60}function a(e,n,t){var r=O(t),i=r.match(S),a="",o=[];return a=r.replace(/\(y{2,4}\)/,"(\\d{2,4})").replace(/\(M{3,4}\)|\(d{3,4}\)/g,"(\\w{3,})").replace(/\(m{1,2}\)|\(d{1,2}\)|\(h{1,2}\)|\(s{1,2}\)/gi,"(\\d{1,2})").replace(/\(t{2}\)/gi,"(\\w{2})"),o=n.match(a),e.year=d(o,i),e.month=f(o,i),e.day=h(o,i),e.hours=l(o,i),e.minutes=c(o,i),e.seconds=m(o,i),p(e),e}function o(e,n){if(0==n.length)throw M("#initFromArray",n);for(var t=["year","month","day","hours","minutes","seconds"],r=0;r<n.length;r++)e[t[r]]=parseInt(n[r]);for(var r=1;3>r;r++)e[t[r]]||(e[t[r]]=1);for(var r=3;r<t.length;r++)e[t[r]]||(e[t[r]]=0);return e}function s(e){var n=e.month-1,t=I[n];return 1==n&&(e.year%1e3==0||e.year%4==0&&e.year%100!=0)&&(t+=1),t}function u(e){for(var n=0;n<H.length;n++)if(e.slice(0,3).toUpperCase()==H[n].slice(0,3).toUpperCase())return n+1;return-1}function d(e,n){var t=-1,r=!1;n.indexOf("(yyyy)")>=0?t=n.indexOf("(yyyy)")+1:n.indexOf("(yy)")>=0&&(t=n.indexOf("(yy)")+1,r=!0);var i=t>0?parseInt(e[t]):2013;return r&&2==i.toString().length&&(i+=30>i?2e3:1900),i}function f(e,n){var t=-1,r=!0;return n.indexOf("(MMMM)")>=0?(t=n.indexOf("(MMMM)")+1,r=!1):n.indexOf("(MMM)")>=0?(t=n.indexOf("(MMM)")+1,r=!1):n.indexOf("(MM)")>=0?t=n.indexOf("(MM)")+1:n.indexOf("(M)")>=0&&(t=n.indexOf("(M)")+1),r?parseInt(e[t]):u(e[t])}function h(e,n){var t=-1,r=!1;n.indexOf("(dd)")>=0?(t=n.indexOf("(dd)")+1,r=!0):n.indexOf("(d)")>=0&&(t=n.indexOf("(d)")+1);var i=t>0?e[t]:1;return parseInt(r?N(i):i)}function l(e,n){var t=0,r=-1,i=!1,a=!0;if(n.indexOf("(HH)")>=0)r=n.indexOf("(HH)")+1;else if(n.indexOf("(hh)")>=0)r=n.indexOf("(hh)")+1,i=!0;else if(n.indexOf("(H)")>=0)r=n.indexOf("(H)")+1,a=!1;else{if(!(n.indexOf("(h)")>=0))return 0;r=n.indexOf("(h)")+1,a=!1,i=!0}if(t=parseInt(e[r]),i){if(n.indexOf("(tt)")<0&&n.indexOf("(TT)")<0)throw new Error("No meridian specified with 12-hour format: ["+e+"], ["+n+"]");("pm"==e[n.indexOf("(tt)")+1].toLowerCase()||"pm"==e[n.indexOf("(TT)")+1].toLowerCase())&&(t+=12)}return t}function c(e,n){var t=-1;return n.indexOf("(mm)")>=0&&(t=n.indexOf("(mm)")+1),t>0?parseInt(e[t]):0}function m(e,n){var t=-1;return n.indexOf("(ss)")>=0&&(t=n.indexOf("(ss)")+1),t>0?parseInt(e[t]):0}function y(e){var n=new Date;return e.year=n.getFullYear(),e.month=n.getMonth()+1,e.day=n.getDate(),e.hours=n.getHours(),e.minutes=n.getMinutes(),e.seconds=n.getSeconds(),e.meridian=g(this.hours),e}function g(e){return 12>e?"am":"pm"}function p(e){return e.meridian=g(e.hours),e}function M(e,n){for(var t="Invalid parameter for method "+e+": [",r=0;r<n.length-1;r++)t+=n[r]+", ";return t+=n[n.length-1]+"]",new Error(t)}function v(e,n){var t=O(n).replace("(yyyy)",e.year).replace("(yy)",e.year.toString().slice(2)).replace("(MMMM)",e.getMonthName()).replace("(MMM)",e.getMonthName(!0)).replace("(MM)",x(e.month)).replace("(M)",e.month).replace("(dddd)",e.getDayName()).replace("(ddd)",e.getDayName(!0)).replace("(dd)",x(e.day)).replace("(d)",e.day).replace("(HH)",x(e.hours)).replace("(H)",e.hours).replace("(hh)",x(e.getHours(!1))).replace("(h)",e.getHours(!1)).replace("(mm)",x(e.minutes)).replace("(m)",x(e.minutes)).replace("(ss)",x(e.seconds)).replace("(s)",x(e.seconds)).replace("(TT)",e.meridian.toUpperCase()).replace("(tt)",e.meridian.toLowerCase());return t}function O(e){return e.replace(/(y{2,4})/g,"($1)").replace(/(M{1,4})/g,"($1)").replace(/(d{1,4})/g,"($1)").replace(/(h{1,2})/gi,"($1)").replace(/(m{2})/g,"($1)").replace(/(s{2})/g,"($1)").replace(/(t{2})/gi,"($1)")}function x(e){return 10>e?"0"+e:""+e}function N(e){return"0"==e.substring(0,1)?e.substring(1):e}var w=function(){this.year=null,this.month=null,this.day=null,this.hours=null,this.minutes=null,this.seconds=null,this.meridian=null,this.init(arguments),this.validate()},H=["January","February","March","April","May","June","July","August","September","October","November","December"],D=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],b=3,T="yyyy-MM-dd HH:mm:ss",I=[31,28,31,30,31,30,31,31,30,31,30,31],S=/(\(d{1,4}\)|\(M{1,4}\)|\(y{2,4}\)|\([hH]{1,2}\)|\(m{1,2}\)|\(s{1,2}\)|\([tT]{2}\))/g;return w.setMonthNames=function(e){H=e},w.getMonthNames=function(){return H},w.setDayNames=function(e){D=e},w.getDayNames=function(){return D},w.setDefaultFormat=function(e){T=e},w.getDefaultFormat=function(){return T},w.setAbbreviationLength=function(e){b=e},w.getAbbreviationLength=function(){return b},w.prototype={init:function(e){if(void 0===e||0==e.length)y(this);else if(2==e.length&&"string"==typeof e[0]&&"string"==typeof e[1])a(this,e[0],e[1]);else if(1==e.length&&"string"==typeof e[0])a(this,e[0],T);else{if(!(e.length>0))throw M("#init",e);o(this,e)}return p(this),this},validate:function(){var a=!0,o=new Array,s=this;return console.log("Beginning validation of datetime: "+s),0==e(s)&&(console.log("Validation of month failed: "+s.month),o.push("month"),a=!1),0==n(s)&&(console.log("Validation of day failed: "+s.day),o.push("day"),a=!1),0==t(s)&&(console.log("Validation of hours failed: "+s.hours),o.push("hours"),a=!1),0==r(s)&&(console.log("Validation of minutes failed: "+s.minutes),o.push("minutes"),a=!1),0==i(s)&&(console.log("Validation of seconds failed: "+s.seconds),o.push("seconds"),a=!1),console.log("Validation complete. Date is "+(a?"valid":"invalid")+"."),a},getMonthName:function(e){var n=H[this.month-1];if(e===!0)return n.slice(0,b);if(e===!1||void 0===e)return n;throw M("#getMonthName",arguments)},monthName:function(e){return this.getMonthName(e)},getDayName:function(e){var n=new Date(this.year,this.month-1,this.day),t=D[n.getDay()];if(e===!0)return t.slice(0,b);if(e===!1||void 0===e)return t;throw M("#getDayName",arguments)},dayName:function(e){return this.getDayName(e)},getHours:function(e){if(e===!0)return this.hours;if(e===!1||void 0===e){var n=this.hours%12;return 0==n&&(n=12),n}throw M("#getHours",arguments)},toString:function(e){return void 0===e?v(this,T):v(this,e)}},w}();