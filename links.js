/*
 links.js - Storing urls in urls.
 BSD license.
 by Sven Nilsen, 2012
 http://www.cutoutpro.com
 Version: 0.000 in angular degrees version notation
 http://isprogrammingeasy.blogspot.no/2012/08/angular-degrees-versioning-notation.html
 */

/*
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:
 1. Redistributions of source code must retain the above copyright notice, this
 list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright notice,
 this list of conditions and the following disclaimer in the documentation
 and/or other materials provided with the distribution.
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 The views and conclusions contained in the software and documentation are those
 of the authors and should not be interpreted as representing official policies,
 either expressed or implied, of the FreeBSD Project.
 */

var data = [];

function updateUrl() {
	var str = "";
	for (var i = 0; i < data.length; i++) {
		str += data[i][0] + "," + data[i][1] + ",";
	}
	window.location.href = "?data=" + encodeURIComponent(str);
}

function addLink() {
	var url = document.getElementById("url");
	var title = document.getElementById("title");
	data.push([title.value, url.value]);
	
	updateUrl();
}

function onLoad() {
	var str = window.location.search;
	if (str.length == 0 || str.indexOf("?data") != 0) {
		return;
	}
	
	str = decodeURIComponent(str);
	
	var valStr = str.substring(str.indexOf("=")+1);
	var vals = valStr.split(",");
	var links = document.getElementById("links");
	var n = Math.floor(vals.length / 2);
	var output = "";
	for (var i = 0; i < n; i++) {
		var title = vals[2*i];
		var url = vals[2*i+1];
		output += "<a href=\"" + url + "\" target=\"_blank\">" +
		title + "</a><br />";
		data.push([title, url]);
	}
	
	links.innerHTML = output;
}

function onClear() {
	data = [];
	updateUrl();
}
