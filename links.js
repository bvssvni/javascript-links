"use strict";

/*
 links.js - Storing urls in urls.
 LGPL license: http://www.gnu.org/copyleft/lesser.html
 by Sven Nilsen, 2013
 http://www.cutoutpro.com
 Version: 0.001 in angular degrees version notation
 http://isprogrammingeasy.blogspot.no/2012/08/angular-degrees-versioning-notation.html
 */

var quotes = [
"Tip: Use a 'link shortener' to link to a 'Previous' list",
"Good titles are easier to remember",
"<--- The manual, is there",
"Be moderate: 4-5 links per list is enough",
"2000 characters is the maximum limit of a web address in most browsers",
"Like it? I love flattr-ing --->",
"One page to link them all",
"Stuck? Read more in the 'manual'",
"Welcome to the world of linkception."
];

var data = [];

// LZW-compress a string
function lzw_encode(s) {
    var dict = {};
    var data = (s + "").split("");
    var out = [];
    var currChar;
    var phrase = data[0];
    var code = 256;
    for (var i=1; i<data.length; i++) {
        currChar=data[i];
        if (dict[phrase + currChar] != null) {
            phrase += currChar;
        }
        else {
            out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
            dict[phrase + currChar] = code;
            code++;
            phrase=currChar;
        }
    }
    out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0));
    for (var i=0; i<out.length; i++) {
        out[i] = String.fromCharCode(out[i]);
    }
    return out.join("");
}

// Decompress an LZW-encoded string
function lzw_decode(s) {
    var dict = {};
    var data = (s + "").split("");
    var currChar = data[0];
    var oldPhrase = currChar;
    var out = [currChar];
    var code = 256;
    var phrase;
    for (var i=1; i<data.length; i++) {
        var currCode = data[i].charCodeAt(0);
        if (currCode < 256) {
            phrase = data[i];
        }
        else {
			phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar);
        }
        out.push(phrase);
        currChar = phrase.charAt(0);
        dict[code] = oldPhrase + currChar;
        code++;
        oldPhrase = phrase;
    }
    return out.join("");
}

function htmlEncode(s)
{
	return s.replace(/&(?!\w+([;\s]|$))/g, "&amp;")
	.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function updateUrl() {
	var str = "";
	if (data.length == 0) {
		window.location.href = "?";
		return;
	}
	
	for (var i = 0; i < data.length; i++) {
		str += encodeURIComponent(data[i][0]) + "," + encodeURIComponent(data[i][1]) + ",";
	}
	
	str = lzw_encode(str);
	window.location.href = "?data2=" + encodeURIComponent(str);
}

function addLink() {
	var url = document.getElementById("url").value;
	var title = document.getElementById("title").value;
	title = title.replace(/\,/g, "");
	data.push([title, url]);
	
	updateUrl();
}

// First format.
// Got trouble with commas in url.
// Supported for backward compability.
function readDataFormat(str) {
	str = decodeURIComponent(str);
	
	var valStr = str.substring(str.indexOf("=")+1);
	var vals = valStr.split(",");
	var links = document.getElementById("links");
	var n = Math.floor(vals.length / 2);
	var output = "";
	for (var i = 0; i < n; i++) {
		var title = vals[2*i];
		title = htmlEncode(title);
		var url = vals[2*i+1];
		url = encodeURI(url);
		output += "<a href=\"" + url + "\" target=\"_blank\">" +
		title + "</a><br />";
		data.push([title, url]);
	}
	
	links.innerHTML = output;
}

// Second format.
// Compressed and supports commas in url.
function readData2Format(str) {
	str = decodeURIComponent(str);
	
	var valStr = str.substring(str.indexOf("=")+1);
	valStr = lzw_decode(valStr);
	var vals = valStr.split(",");
	var links = document.getElementById("links");
	var n = Math.floor(vals.length / 2);
	var output = "";
	for (var i = 0; i < n; i++) {
		var title = decodeURIComponent(vals[2*i]);
		title = htmlEncode(title);
		var url = decodeURIComponent(vals[2*i+1]);
		url = encodeURI(url);
		output += "<a href=\"" + url + "\" target=\"_blank\">" +
		title + "</a><br />";
		data.push([title, url]);
	}
	
	links.innerHTML = output;
}

function onLoad() {
	var quote = document.getElementById("quote");
	var rnd = Math.floor(Math.random() * quotes.length);
	quote.textContent = "\"" + quotes[rnd % quotes.length] + "\"";
	
	var compressed = false;
	var str = window.location.search;
	var lengthZero = str.length == 0;
	var dataFormat = !lengthZero && str.indexOf("?data=") == 0;
	var data2Format = !lengthZero && str.indexOf("?data2=") == 0;
	var hasData = dataFormat || data2Format;
	if (!hasData) {
		return;
	}
	
	if (dataFormat) readDataFormat(str);
	if (data2Format) readData2Format(str);
}

function onClear() {
	data = [];
	updateUrl();
}
