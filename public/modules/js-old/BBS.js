var bbsViewUrl
var bbsViewUrlSep
var bbsBaseDir
var bbsQueryString

var bbsCurThreadID
var bbsFolderID
var bbsTLEmpty = true;
var bbsFLEmpty = true;
var bbsDrawLine = true;

/* 폴더 목록 */

/* FL: Folder List */

function bbsFLB()  {
	document.write(
		'<table border=0 cellpadding=0 cellspacing=0 class=fm-f style="margin-bottom:15">' +
		//'<tr><td class=line><img src=/d.gif width=131 height=1></td><td class=line><img src=/d.gif width=820 height=1></td></tr>'
		'<tr><td><img src=/d.gif width=131 height=1></td><td><img src=/d.gif width=820 height=1></td></tr>'
	);
}

function bbsFLE() {
	if (bbsFLEmpty) {
		bbsFLSFB('');
		bbsFLSFE();
	}
	document.write(
		'</table>'
	);
}

/* FL SF : Single Folder */

function bbsFLSFB(title) {
	bbsFLEmpty = false;
	title = lpGetHtmlized(title);
	document.write(
			'<tr>' +
				'<td class=c1><div class=title>' + /*title +*/ '</div></td>' +
				'<td class=c2>'
	);
}

function bbsFLSFE() {
	document.write(
				'</td></tr>'
			//'<tr><td colspan=2 class=line><img src=/d.gif></td></tr>'
	);
}


/* FL F : Folders */

function bbsFLFB(viewUrl, folderID, title, hidden) { 
	bbsFolderID = folderID;
	bbsFLEmpty = false;
	
	bbsViewUrl = viewUrl;
	bbsViewUrlSep = lpGetParamSep(bbsViewUrl);
	bbsCurThreadID = urlpQueryString("t",0);

	title = lpGetHtmlized(title);
	
	document.write (
		'<tr>' +
			'<td class=c1><div class=title style="line-height:21px"><a href="' + bbsViewUrl + bbsViewUrlSep + (folderID > 0 ? "l=" + folderID  + "&" : "") + 'v=S" class=bold-cmd>' + title + (hidden ? " (비공개)" : "") + '</a></div></td>' +
			'<td class=c2>'
	);
}

function bbsFLFE() {
	document.write(
			'</td></tr>'
		//'<tr><td colspan=2 class=line><img src=/d.gif></td></tr>'
	);
}

/* TL : Thread List */

var bbsTLIIDSeed = 0;
var bbsTLIOptOrgColor = "";

function bbsTLB(viewUrl) {
	bbsTLEmpty = true;
	if (viewUrl) {
		bbsViewUrl = viewUrl;
		bbsViewUrlSep = lpGetParamSep(viewUrl);
		bbsCurThreadID = urlpQueryString("t",0);
	}
	document.write(
		'<table class="bbs-tl" cellspacing="0" cellpadding="0" style="margin-bottom:35px">'
	)
}

function bbsTLE() {
	if (bbsTLEmpty) {
		document.write('<tr class="item"><td>...</td></tr>');
	}
	document.write(
		'</table>'
	);
}

/*
function bbsTLIOptOn(tid) {
	var obj = document.getElementById("bbstlio" + tid);
	bbsTLIOptOrgColor = obj.style.color;
	obj.style.color = "#808080";
}

function bbsTLIOptOff(tid) {
	var obj = document.getElementById("bbstlio" + tid);
	obj.style.color = bbsTLIOptOrgColor;
}
*/

function bbsTLI(userID, nickName, threadID, title, repCnt, hidden, hit, date) { 
	nickName = lpGetHtmlized(nickName);
	title = lpGetHtmlized(title);
	if (title == "") {
		title = "..."
	}
	var isCurrent = threadID == bbsCurThreadID;
	/*
	document.write(
		'<tr class="item">' +
		'<td><div class="ellipsis" style="width:100px"><b><a href=/user/' + userID + '>' + nickName + '</a></b></div></td>' +
		'<td>' +
			'<div nowrap style="width:680px">' +
				'<a href="' + bbsViewUrl + bbsViewUrlSep + 't=' + threadID + '" class="' + (isCurrent ? 'current' : '') + '" onmouseover="bbsTLIOptOn(' + bbsTLIIDSeed + ')" onmouseout="bbsTLIOptOff(' + bbsTLIIDSeed + ')" >' + title + '&nbsp; [' + repCnt + ']' + (hidden ? '&nbsp;[비]' : '') + '</a>' + 
				'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span id=bbstlio' + bbsTLIIDSeed + ' class=opt locolor="#4e4e4e" hicolor="#909090">' + hit + '&nbsp;&nbsp;&nbsp;&nbsp;' + date + '</span></td>' +
			'</div>' + 
			(isCurrent ? '<div id="DBCA"></div>' : '') +
		'</td>'
	);
	*/
	var toolTip = ' 답글 ' + repCnt + '  |  조회수 ' + hit + '  |  ' + date + ' ';
	document.write(
		'<tr class="item">' +
		'<td nowrap>' +
			'<a href="' + bbsViewUrl + bbsViewUrlSep + 't=' + threadID + '" class="' + (isCurrent ? 'current' : 'normal') + '" title="' + toolTip + '">' + title + '&nbsp; [' + repCnt + (hidden ? ':비' : '') + ']' + '</a>' + 
			'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href=/user/' + userID + ' title="' + toolTip + '" class="cmd">by ' + nickName + '</a>' +
			(isCurrent ? '<div id="DBCA"></div>' : '') +
		'</td>'
	);
	bbsTLEmpty = false;
	bbsTLIIDSeed++;
}


/* Articles */

var bbsShowCP;
var bbsEditUrl;
var bbsDeleteUrl;
var bbsEditUrlSep;
var bbsAttach;
var bbsFolderOwnerType;
var bbsFolderOwnerID;
var bbsArticleID;
var bbsText;
var bbsArticleUserID;

function bbsTB(showcp,editurl,folderOwnerType,folderOwnerID) {
	bbsShowCP = showcp;
	bbsEditUrl = editurl;
	bbsDeleteUrl = editurl.replace(/TEdit\.aspx/, "TDelete.aspx");
	bbsEditUrlSep = lpGetParamSep(editurl);
	bbsFolderOwnerType = folderOwnerType;
	bbsFolderOwnerID = folderOwnerID;
	bbsAttach = "";

	document.write (
		//'<div style="margin-bottom:0px">'
	);
}

function bbsTE() {
	document.write (
		//'<table cellpadding=0 cellspacing=0 class=bbs-a><tr><td class=line><img src=/d.gif width=1 height=1></td></tr></table>'
		//'</div>'
	);
}

function bbsAB(articleid, userID, text) {
	bbsArticleID = articleid;
	bbsArticleUserID = userID;
	bbsText = lpGetHtmlized(text,true,true);		
}

function GetLiteralRegExp(str) {
	str =
		str
		.replace(/\$/g,"\\$")
		.replace(/\./g,"\\.")
		.replace(/\^/g,"\\^")
		.replace(/\{/g,"\\{")
		.replace(/\}/g,"\\}")
		.replace(/\[/g,"\\[")
		.replace(/\]/g,"\\]")
		.replace(/\(/g,"\\(")
		.replace(/\)/g,"\\)")
		.replace(/\|/g,"\\|")
		;
	return str;
}

function bbsAA(file) {
	//var baseDir = bbsFolderOwnerType == "B" ? lpGetBDSDir(bbsFolderOwnerID, "BBS", bbsArticleID) : lpGetPDSDir("BBS", bbsArticleID);
	var baseDir = lpGetBDSDir(bbsArticleUserID, "BBS", bbsArticleID);

	if (file.match(/\.jpg$/i) != null || file.match(/\.jpeg$/i) != null || file.match(/\.gif$/i)) {
		var fileTag = GetLiteralRegExp("{" + file + "}");
		var re = new RegExp(fileTag, "ig");
		if (bbsText.match(re) != null) {
			bbsText = bbsText.replace(re, '<img src=' + baseDir + '/' + file + ' galleryimg=no>');
		} else {
			bbsAttach += '<img src=' + baseDir + '/' + file + ' galleryimg=no style="margin-bottom:32px"><br>';
		}
	} else {
		bbsAttach += '<a href=' + baseDir + '/' + file+ '>[첨부문서: ' + file + ']</a><br><br>';
	}
}

function bbsAE(nickName, fIcon, cdate, music) {
	var iconHtml = "";
	var editHtml = "";

	/*
	if (fIcon) {
		iconHtml = 
			"<a href=/Com/User/Photo.aspx?u=" + bbsArticleUserID + ">" +
			//"<img src=" + lpGetPDSDir("U", bbsArticleUserID) + "/ft.jpg class=icon>" +
			"<img src=/BDS/" + bbsArticleUserID + "/UI/ft.jpg class=icon>" +
			"</a><br>";
	}
	*/
	 
	if (bbsShowCP && ( bbsArticleUserID == lpUserID || (lpRole("pageowner") && lpCurrentNode.func != "W") || lpRole("owner") || lpRole("admin") || lpRole("bbsadmin"))) {
		editHtml = 
			"<a href=" + bbsEditUrl + bbsEditUrlSep + "a=" + bbsArticleID + " class=cmd>[수정]</a> " +
			"<a href=" + bbsDeleteUrl + bbsEditUrlSep + "a=" + bbsArticleID + " class=cmd>[삭제]</a>";
	}
		
	document.write(	
		//'<table cellpadding=0 cellspacing=0 class=bbs-a>' +
		//'<tr><td colspan=2 class=line><img src=/d.gif width=1 height=1></td></tr>' +
		//'</table>' +
		'<table cellpadding=0 cellspacing=0 class=fm-f>' +
		'<tr><td><img src=/d.gif width=131 height=1></td><td><img src=/d.gif width=820 height=1></td></tr>' +
		'<tr>' +
		'<td class=bbs-info>' + 
			'<div style="margin-bottom:60px; text-align:right;">' +
			iconHtml + '<a href=/user/' + bbsArticleUserID + ' class="bold-cmd" style="line-height:21px;">' + nickName + '</a><br>' +
			'<span class=date>' + cdate + '</span><br>' +
			'<img src=/d.gif width=115 height=8><br>' +
			editHtml +
			'</div>' +
		'</td>' +
		'<td class=c2>' +
			'<div class="bbs-cont" style="margin-bottom:60px">' +
				bbsAttach +
				'<div class="text2">' + bbsText + lpGetMediaHtml(music) + '</div>' +
			'</div>' +
		'</td>' +
		'</tr>' +
		'</table>'
	);
	bbsAttach = "";
}

