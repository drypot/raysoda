var lpIsBoxMode = window.lpOwnerID != null;
var lpIsOwner = lpIsBoxMode ? lpOwnerID == lpUserID : false;


/* Top */

lpTopHtml =
	'<div class=sitelogo style="left:161px; top:17px; position:absolute; z-index:1;">' +
		(lpIsBoxMode 
		? 
			'<a href="/' + lpBoxSID + '">' + lpBoxDesc + '</a>' +
			' @ '
		:
			''
		) +
		'<a href="/">RaySoda</a>' +
	'</div>' +
	'<table cellpadding=0 cellspacing=0 width=100%>' +
	'<tr><td>' +
		'<table cellpadding=0 cellspacing=0 width=100%>' + // background=/App/I/WBack.gif>' +
		'<tr><td><img src=/d.gif height=130></td></tr>' +
		'</table>' +
	'</td></tr>'
	;
	
function lpRenderTop() {
	document.write(lpTranslatedHtml(lpTopHtml));
	/*
	var size = 16;
	var objFinder;
	var siteLogo = domObject("sectionlogo")
	if (siteLogo != null) {
		while ((siteLogo.offsetHeight > 40 || siteLogo.offsetWidth > 120) && size > 8) {
			size -= 1;
			siteLogo.style.font = "bold " + size + "px/120%" + " tahoma";
		}
	}
	*/
}

/* TM1 */

lpTM1Anc = '<!--lpTM1Anc-->';
lpTM1Html =
		'<div style="left:141px; top:59px; position:absolute; z-index:1;">' +
		'<table cellpadding="0" cellspacing="0" class=tm1 id=tm1>' +
		'<tr>' +
			'<td class=m style="padding: 0"><img src=/d.gif width=20 height=1></td>' +
			lpTM1Anc +
			'<td class=m style="padding: 0"><img src=/d.gif width=120 height=1></td>' +
			(lpUserName == '' 
				?	'<td class=opt nowrap><a href=/App/Office/Auth/Login/D.aspx>로그인</a></td>' +
					'<td class=opt nowrap><a href=/App/Office/Register/Register/D.aspx>회원가입</a></td>' 
				:	'<td class=opt nowrap><a href=/user/' + lpUserID + '>' + lpUserName + '</a></td>' +
					'<td class=opt nowrap><a href=/App/Office/Auth/Logout/D.aspx>로그아웃</a></td>'
			) +
			'<td class=opt nowrap><a href="/App/Help/Info/D.aspx">도움말</a></td>' +
		'</tr>' +
		'</table>' +
		'</div>'
	;

function lpSetBoxNodeParams(parent) {
	for (var i = 0; i < lpNodeChildrenLength(parent); i++) {
		var node = parent.children[i];
		if (!lpNodeOption(node,"nopage") && !lpNodeOption(node,"noownerid")) {
			var url = lpNodeUrl(node);
			node.fixedUrl = url + lpGetParamSep(url) + "u=" + lpOwnerID;
		}
		lpSetBoxNodeParams(node);
	}
}

function lpRenderTM1() {
	var sep = "";
	var sepHtml = "";

	var parentNode;
	
	lpAppNode.childrenByLID["Box"].url = '/user/' + lpUserID;
	
	if (lpIsBoxMode) {
		var boxNode = lpAppNode.childrenByLID["Box"];
		boxNode.childrenByLID["Info"].childrenByLID["News"].url = '/' + lpBoxSID; //'/user/' + lpOwnerID;
		lpSetBoxNodeParams(boxNode);
		parentNode = lpDepth1Node;
	} else {
		parentNode = lpAppNode;
	}

	for (var lid in parentNode.childrenByLID) {
		var node = parentNode.childrenByLID[lid];
		var url = lpNodeUrl(node);
		var activeOpt;
		var html;
		var desc;

		if (node.onPath) {
			activeOpt = "active";
		} else {
			activeOpt = "";
		}

		if (lpNodeOption(node,"hide") || !lpNodeAuthorized(node)) {
			continue;
		}

		desc = node.desc;

		html = 
			sep + 
			"<td class=m nowrap><a href='" + url + "' class=" + activeOpt + " id=tm1Anc" + lid + ">" + desc + "</a></td>" +
			lpTM1Anc;
		sep = sepHtml;
		lpTM1Html = lpTM1Html.replace(lpTM1Anc, html);
	}
	document.write(lpTranslatedHtml(lpTM1Html));
}


/* TM2 */

lpTM2Anc = '<!--lpTM2Anc-->';
lpTM2Html =
		'<div style="left:161px; top:87px; position:absolute; z-index:1;">' +
			'<table cellpadding="0" cellspacing="0" class=tm2>' +
			'<tr>' +
				lpTM2Anc +
				'<td width=100%></td>' +
			'</tr>' +
			'</table>' +
		'</div>'
	;
lpTM2ActiveObj = null;

function lpRenderTM2() {
	var sep = "";
	var sepHtml = "";
	var activeDomID;
	var parentNode;

	if (lpIsBoxMode) {
		parentNode = lpDepth2Node;
	} else {
		parentNode = lpDepth1Node;
	}

	for (var lid in parentNode.childrenByLID) {
		var node = parentNode.childrenByLID[lid];
		var url = lpNodeUrl(node);
		var activeOpt = "";
		var html;

		if (lpNodeOption(node,"hide") || !lpNodeAuthorized(node)) {
			continue;
		}

		if (node.onPath) {
			activeOpt = "active";
			activeDomID = "tm2Anc" + lid;
		}

		html = 
			sep + 
			"<td nowrap><a href='" + url + "' class=" + activeOpt + " id=tm2Anc" + lid + ">" + node.desc + "</a></td>" +
			lpTM2Anc;
		sep = sepHtml;
		lpTM2Html = lpTM2Html.replace(lpTM2Anc, html);
	}
	document.write(lpTranslatedHtml(lpTM2Html));

	if (activeDomID != null) {
		lpTM2ActiveObj = domObject(activeDomID);
	}
}

/* TM3 */

lpTM3Anc = '<!--lpTM3Anc-->';
lpTM3Html =
		'<div id=tm3 style="left:161px; top:115px; position:absolute; z-index:1;">' +
			'<table cellpadding="0" cellspacing="0" class=tm3>' +
			'<tr>' +
			lpTM3Anc +
			'</tr>' +
			'</table>' +
		'</div>'
		;

function lpRenderTM3() {
	var sep = "";
	var sepHtml = "";

	var parentNode = lpDepth2Node;

	if (lpIsBoxMode) {
		parentNode = null;
	} else {
		parentNode = lpDepth2Node;
	}


	if (parentNode == null) return;
	
	for (var lid in parentNode.childrenByLID) {
		var node = parentNode.childrenByLID[lid];
		var url = lpNodeUrl(node);
		var activeOpt = node.onPath ? "active" : "";
		var html;
		
		if (lpNodeOption(node,"hide") || !lpNodeAuthorized(node)) {
			continue;
		}

		html =
			"<td nowrap><a href='" + url + "' class=" + activeOpt + ">" + node.desc + "</a></td>" +
			lpTM3Anc;
		sep = sepHtml;
		lpTM3Html = lpTM3Html.replace(lpTM3Anc, html);
	}
	document.write(lpTranslatedHtml(lpTM3Html));

	var tm3Obj = domObject("tm3");
	if (lpTM2ActiveObj != null && tm3Obj.offsetWidth > 0) {
		var rightLimit = 140 + 1 + 820;
		var leftLimit = 140 + 1 + 20;
		var width = tm3Obj.offsetWidth;
		
		var x = domObjectLeft(lpTM2ActiveObj) + Math.floor(lpTM2ActiveObj.offsetWidth / 2) - Math.floor(width / 2) + Math.floor(width * 0.08);
		
		//var x = domObjectLeft(lpTM2ActiveObj)
		
		if (x + width > rightLimit) {
			x = rightLimit - width;
		}
		if (x < leftLimit) {
			x = leftLimit;
		} 
		tm3Obj.style.left = x;
	}
}


/* LM3 */

lpLM3Anc = '<!--lpLM3Anc-->';
lpLM3Html =
	'<table cellpadding=0 cellspacing=0>' +
	'<tr valign=top>' +
		'<td width=140>'
		+ '<img src=/d.gif width=140 height=1><br>'
		+ '<table cellpadding=0 cellspacing=0 class=lm3>' + lpLM3Anc + '</table>'
		+ '</td>'
		;

function lpRenderLM3() {
	var parent = lpDepth3Node;
	for (var i = 0; i < lpNodeChildrenLength(parent); i++) {
		var node = parent.children[i];
		var url = lpNodeUrl(node);
		var activeOpt = node.onPath ? "active" : "";
		var html;
		if (lpNodeOption(node,"hide") || !lpNodeAuthorized(node)) {
			continue;
		}
		html =
			(lpNodeOption(node,"sep") ? '<tr><td><img src=/d.gif width=1 height=14></td></tr>' : '') +
			'<tr><td class=menu><a href="' + url + '" class=' + activeOpt + '>' + node.desc + '</a></td></tr>' +
			lpLM3Anc;
		lpLM3Html = lpLM3Html.replace(lpLM3Anc, html);
	}
	document.write(lpTranslatedHtml(lpLM3Html));
}


/* Column */

lpColumnBeginHtml =
	//'<tr><td style="background-color:#4e4e4e; padding-bottom:75px;">'
	'<tr><td style="padding-bottom:75px;">'
	;

function lpRenderColumnBegin() {
	document.write(lpTranslatedHtml(lpColumnBeginHtml));
}

lpColumnEndHtml =
	'</td></tr>'
	;

function lpRenderColumnEnd() {
	document.write(lpTranslatedHtml(lpColumnEndHtml));
}


/* Content */

lpContentBeginHtml = 
	'<td width=1>' +
		'<img src=/d.gif width=1 height=1>' +
	'</td>' +
	'<td width=100%>'
	;
		
function lpRenderContentBegin() {
	document.write(lpTranslatedHtml(lpContentBeginHtml));
}

lpContentEndHtml = 
	'</td></tr>' +
	'</table>'
	;

function lpRenderContentEnd() {
	document.write(lpTranslatedHtml(lpContentEndHtml));
}


/* Copyright */

/* Adv */

lpAdvHtml = ""

function lpAddAdv(linkUrl, imgUrl) {
	lpAdvHtml = "<div style='margin:10 0 0 161;'><a href=" + linkUrl + " target=_blank><img src=" + imgUrl + " border=0></a></div>"
}

function lpRenderCopyright() {
	var sep = '&nbsp;&nbsp;&nbsp;';
	document.write(	
		'<tr><td>' +
			lpAdvHtml +
			'<div style="margin: 9 0 0 161; font: 12px verdana;color: #A4A4A4;"> ' +
			'Sponsor :&nbsp;&nbsp;' +
			'<a href=/Com/Ad/R.aspx?id=ad14 target=_blank style="color: #A4A4A4;">National Geographic</a>' +
			'</div>' +
			'<div style="margin: 12 0 0 161; font: 12px verdana;color: #A4A4A4;"> ' +
			'About :&nbsp;&nbsp;' +
			'<a href=/App/About/RaySoda.aspx style="color: #A4A4A4;">레이소다</a>' + sep +
			'<a href=/App/About/Company.aspx style="color: #A4A4A4;">회사</a>' + sep +
			'<a href=/App/About/Ad.aspx style="color: #A4A4A4;">광고</a>' + sep +
			'<a href=/App/About/Admin.aspx style="color: #A4A4A4;">운영진</a>' + sep + sep +
			'</div>' +
			'<div style="margin: 9 0 0 161; font: 12px verdana;color: #A4A4A4;"> ' +
			'Copyright&copy; RaySoda. All Rights Reserved.' +
			'</div>' +
			'<div style="margin: 10 0 50 161; font: 12px verdana;color: #606060;"></div><img src=/d.gif width=1 height=1>' +
		'</td></tr>' +
		'</table>'
	);
	startMediaPlayer();
}


/* Title */

function lpRenderTitle(title,url) {
	document.write(
		'<div class="content-title" style="margin-left:' + (lpRenderMode == "N" ? "0" : "161") + '">'
		+ (url != null && url != '' ? '<a href=' + url + '>' : '')
		+ (title == null ?
			lpCurrentNode.title != null ? 
				lpCurrentNode.title : 
				lpCurrentNode.desc :
			lpGetHtmlized(title, false, false, false)
		)
		+ (url != null && url != '' ? '</a>' : '') 
		+ '</div>'
	);
}


/* View Photo */

var lpPhotoPanelHtml = "";
var lpPhotoPanelOnClick;

function lpRenderPhoto() {
	if (lpPhotoPanelHtml != "") {
		document.write('<tr><td><div class=photo-panel id=photoPanel>');
		document.write('<table cellpadding=0 cellspacing=0>');
		document.write('<tr><td id=photoLeft width=161><img src=/d.gif width=161 height=1></td><td>');
		document.write(lpPhotoPanelHtml);
		document.write('</td><td id=photoRight width=100%><img src=/d.gif width=50 height=1></td></tr>');
		document.write('</table>');
		document.write('</div></td></tr>');
	}
	if (lpPhotoPanelOnClick != null) {
		var obj = domObject("photoPanel");
		obj.style.cursor = "hand";
		obj.onclick = lpPhotoPanelOnClick;
	}
}

/* Reference Photo */ 

function lpCopyrightAlert() {
	alert("이미지는 저작권자와 협의 후 사용해주십시오.\n\n저작물을 무단으로 사용하실 경우 저작권법에 따라 처벌을 받으실 수 있습니다."); 
	return true;
}

function lpRPB() {
	lpPhotoPanelHtml +=
		"<div style='margin:40 0 20 0'>"
		;
}

function lpRPE() {
	lpPhotoPanelHtml +=
		"</div>"
		;
}

function lpRP(path, border) { 
	lpPhotoPanelHtml += "<img src=" +path + " style='border:solid " + border + "px black; cursor:default;' galleryimg='no' oncontextmenu='return lpCopyrightAlert()' onclick='window.event.cancelBubble = true;'><br>";
}

function lpRPL(id) {
	lpPhotoPanelHtml += "<div style='margin: 20 0 0 0; width:300px;'><a href=/Com/Photo/View.aspx?f=A&p=" + id + " class=cmd>[사진정보]</a></div>";
}

/* Render All */

function lpCheckFrame() {
	if (window.top != window) {
		window.top.location = window.location;
	}
}

function lpGoTopSortSub(a,b) {
	return a-b;
}

function lpGoTop() {
	var objList;
	var tempTop;
	var lpDBCAAry;

	lpDBCAAry = new Array();
	tempTop = Math.max(document.body.scrollHeight - document.body.clientHeight, 0);
	if (tempTop > 0) {
		lpDBCAAry[0] = tempTop;
	}
	var objList = domObjectCollection("DBCA");
	if (objList) {
		for (var i = 0; i < objList.length; i++) {
			var tempTop = Math.max(domObjectTop(objList[i]) - document.body.clientHeight + 30, 0);
			if (tempTop > 0) {
				lpDBCAAry[lpDBCAAry.length] = tempTop;
			}
		}
		lpDBCAAry.sort(lpGoTopSortSub);
	}

	var top = 0;
	for (var i = 0; i < lpDBCAAry.length; i++) {
		if (document.body.scrollTop < lpDBCAAry[i]) {
			top = lpDBCAAry[i];
			break;
		}
	}
	window.scrollTo(0,top);
}


var lpRenderMode = 'N'; // N:Normal F:Full

function lpRenderBegin(mode) {
	document.body.ondblclick = lpGoTop;
	if (mode != null) {
		lpRenderMode = mode;
	}
	lpCheckFrame();
	lpRenderTM1();
	lpRenderTM2();
	lpRenderTM3();
	lpRenderTop();
	lpRenderPhoto();
	lpRenderColumnBegin();
	if (lpRenderMode == 'N') {
		lpRenderLM3();
		lpRenderContentBegin();
	} else {
	}
}

function lpRenderEnd() {
	if (lpRenderMode == 'N') {
		lpRenderContentEnd();
	}
	lpRenderColumnEnd();
	lpRenderCopyright();
}

/* Page List */

var pglPageUrl;
var pglHtml = '';

function pglBegin(pageUrl) {
	pglPageUrl = pageUrl;
	pglPageUrl += lpGetParamSep(pglPageUrl);
}

function pglEnd() {
	var dupeObj = domObject("PageListDupe");
	
	if (pglHtml != '') {
		document.write(
			'<div id=PageListPanel style="margin:0px 0px 15px 0px">' + 
			'<table class=pagelist cellspacing=0 cellpadding=0 border=0 style="font:12px 굴림;"><tr>'
		);
		document.write(pglHtml);
		document.write(
			'</tr></table></div>'
		);
		if (dupeObj != null) { PageListDupe.innerHTML = PageListPanel.innerHTML; }
	} else {
		if (dupeObj != null) PageListDupe.style.display = "none"
	}
}

function pglF(pg) {
	pglHtml += '<td style="padding-right:26px"><a href="' + pglPageUrl + 'pg=' + pg + '" class="cmd">' + (pg + 1) + '...&nbsp;&nbsp;</a></td>';
}

function pglI(pg, current) {
	pglHtml += '<td style="padding-right:26px"><a href="' + pglPageUrl + 'pg=' + pg + '"' 
	if (current)  {
		pglHtml += ' class="cur-cmd" style="font-weight:bold"'; 
	} else {
		pglHtml += ' class="cmd"';
	}
	pglHtml += '>' + (pg + 1) + '</a></td>';
}

function pglL(pg) {
	pglHtml += '<td style="padding-right:26px"><a href="' + pglPageUrl + 'pg=' + pg + '" class="cmd">...' + (pg + 1) + '</a></td>';
}


/* Date List */

function dtlB(pageUrl) {
	pglPageUrl = pageUrl;
	pglPageUrl += lpGetParamSep(pglPageUrl);
	document.write(
		'<div id=DayListPanel style="margin:0 0 15 0;">' + 
		'<table cellspacing=0 cellpadding=0 border=0 style="font: 12px 굴림"><tr>'
	);
}

function dtlE() {
	document.write(
		'</tr></table></div>'
	);
}

function dtlF(date, desc) {
	document.write('<td style="padding-right:22px"><a href=' + pglPageUrl + 'd=' + date + ' class="cmd">' + desc + '...</a></td>');
}

function dtlI(date, desc, current) {
	document.write('<td style="padding-right:22px"><a href=' + pglPageUrl + 'd=' + date + ' ');
	if (current)  {
		document.write(' class="cur-cmd" style="font-weight:bold"'); 
	} else {
		document.write(' class="cmd"');
	}

	 + (current ? " class=c" : "") + 
	document.write('>' + desc + '</a></td>');
}

function dtlL(date, desc) {
	document.write('<td style="padding-right:22px"><a href=' + pglPageUrl + 'd=' + date + ' class="cmd">...' + desc + '</a></td>');
}


/* Utilities */

function lpGetParamSep(url) {
	return url.indexOf("?") > 0 ? "&" : "?";
}

function lpGetHtmlized(text, activateUrl, renderImgLink, insertLineBreak) {
	text = text.replace(/</g, "&lt;")
	text = text.replace(/>/g, "&gt;")

	if (insertLineBreak != false) {
		text = text.replace(/(\r\n|\n|\r)/g, "<br>")
	}

	if (renderImgLink == true) {
		text = text.replace(/([^"'\=]|^)(http\:\/\/[^ \n\r\<"']+\.(jpg|jpgeg|gif))/gi, "$1<a href=\"$2\" target=_blank><img src=\"$2\" border=0></a>");
		text = text.replace(/&lt;object src="([^"]+\.swf)" width="(\d+)" height="(\d+)"&gt;&lt;\/object&gt;/i, 
			"<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"$2\" height=\"$3\" style=\"border: solid 1px black\">" +
				"<param name=\"AllowScriptAccess\" value=\"never\">" +
				"<param name=\"movie\" value=\"$1\">" +
				"<param name=\"quality\" value=\"high\">" +
				//"<embed src=\"$1\" quality=\"high\" type=\"application/x-shockwave-flash\" width=\"$2\" height=\"$3\"></embed>" +
			"</object>"
		);
	}
	
	if (activateUrl == true) {
		text = text.replace(/([^"'\=]|^)((http|mms|ftp|telnet)\:\/\/[^ \n\r\<"'\)]+)/g, "$1<a href=\"$2\" target=_blank>$2</a>");
		text = text.replace(/([A-Za-z0-9_\-\.]+@([A-Za-z0-9_\-]+\.)+[A-Za-z0-9_\-]+)/g, "<a href=\"mailto:$1\">$1</a>");
	}
	return text;
}

function lpGetNumberFormat(n) {
	var str = "" ;
	n = "" + n;
	while (n.length > 3) {
		str = "," + n.substr(n.length - 3, 3) + str;
		n = n.substring(0, n.length - 3);
	}
	str = n + str;
	return str;
}

/*
function lpGetPDSDir(key, number) {
	return "/PDS/" + key + "/" + number;
}
*/

function lpGetBDSDir(ownerID, key, number) {
	return "/BDS/" + ownerID + "/" + key + "/" + number;
}

function lpGetCmdLinkHtml(text, linkUrl, newWindow, display, marginRight) {
	var html = '';
	var styleHtml = '';
	
	if (display != false) {
		if (marginRight != null) {
			styleHtml = ' style="margin-right:' + marginRight + '"';
		}
		if (linkUrl == "") {
			html = '<span class="dim-cmd"' + styleHtml + '>' + text + '</span>';
		} else {
			html = '<a href="' + linkUrl + '"' + (newWindow ? ' target=_blank' : '') + ' class="cmd"' + styleHtml + '>' + text + '</a>';
		}
	}
	return html;
}

function lpRenderCmdLink(text, linkUrl, newWindow, display, marginRight) {
	document.write(lpGetCmdLinkHtml(text, linkUrl, newWindow, display, marginRight));
	
}

function lpGetLinkHtml(text, linkUrl, newWindow) {
	return linkUrl == "" ? desc : '<a href="' + linkUrl + '"' + (newWindow ? ' target=_blank' : '') + '>' + text + '</a>';
}


function lpRenderHtmlized(html) {
	document.write(lpGetHtmlized(html, true, true));
}

/* for Media Player */

var mediaStarted = false;
var mediaCnt = 0;
var lastMediaUrl;

function getMediaObjectHtml(url) {
	return	url.indexOf("\"") != -1 ?
		'[음악링크의 불필요한 인자들은 삭제해 주십시오.]' :
		'<embed ' +
			'src="' + url + '" ' +
			'height=61 ' +
			'width=320 ' +
			'volume=100 ' +
			'playCount=999 ' +
			'autostart=true ' +
		' />';

		/*
		'<OBJECT CLASSID=CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6 height=61 width=320>' +
		'<PARAM name=playCount value=999>' +
		'<PARAM name=volume value=100>' +
		'<PARAM name=url value="' + url + '">' +
		'<PARAM name=autostart value=1>' +
		'</OBJECT>';
		*/
}

function fillMediaPlayer(num, url) {
	var panel = domObject('mediaPlayPanel' + num);
	panel.innerHTML = getMediaObjectHtml(url);
}


function lpGetMediaHtml(url) {
	var html = "";
	if (url != "") {
		url = url.replace(/\'/g, "\\'").replace(/\"/g, "\\&#34;");
		html =
			'<div id=mediaPlayPanel' + mediaCnt + ' class=music>' +
			'<a href="javascript: void(0);" onclick="fillMediaPlayer(' + mediaCnt + ',\'' + url + '\');return false;" title="음악듣기" class="cmd">[음악듣기]</a>' +
			'</div>'
			;
		mediaStarted = true;
		lastMediaUrl = url;
	}
	mediaCnt++;
	return html;
}

function startMediaPlayer() {
	if (userFMusic && mediaStarted) {
		var lastMusicDiv;
		for(var i = 0; i < document.all.length; i++){
			if (document.all(i).className == 'music') {
				lastMusicDiv = document.all(i);
			}
		}
		lastMusicDiv.innerHTML = getMediaObjectHtml(lastMediaUrl);
	}
}
