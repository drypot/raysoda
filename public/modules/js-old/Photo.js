
var phtCmdUrl
var phtItemCnt;
var phtAdminF;
var phtBoxAdminF;
var phtMuNote = "&nbsp; ♪";

function phtIsAdmin() {
	if (phtAdminF == null) {
		phtAdminF = lpRole("admin") || lpRole("photoadmin");
	}
	return phtAdminF;
}

function phtIsBoxAdmin() {
	if (phtBoxAdminF == null) {
		phtBoxAdminF = lpRole("admin") || lpRole("photoadmin") || (lpIsBoxMode && lpRole("owner"));
	}
	return phtBoxAdminF;
}

function phtRatingPercent(rating, hit) {
	return hit == 0 ? 0 : Math.round(rating * 100 *100.0 / hit) / 100.0;
}

/* Photo List */

/* shared with bpPL */

function phtLBegin(viewUrl) {
	phtCmdUrl = viewUrl + lpGetParamSep(viewUrl);
	phtItemCnt = 0
	document.write(
		'<div class=fm-f>' +
		'<table class="photo-l" cellspacing="0" cellpadding="0">' +
		'<tr>'
	);
}

function phtLEnd() {
	if (phtItemCnt == 0) {
		document.write(
			'<td><div class=text>...</div></td>'
		);
	}
	document.write(
		'</tr></table>' +
		'</div>'
	);
}

function phtLICore(url, photoid, title, userid, nickName, rating, panelRating, tRating, hit, date, music, comment) { 
	phtItemCnt++;
	title = lpGetHtmlized(title);
	nickName = lpGetHtmlized(nickName);

	var toolTip = 
		'조회 ' + hit + ' | ' +
		'추천 ' + rating + ' | ' +
		(panelRating > 0 ? '패널추천 ' + panelRating + ' | ' : '') +
		'누적추천 ' + tRating + ' | ' +
		'추천율 ' + phtRatingPercent(rating, hit) + '% | ' +
		date;

	document.write(
		'<td>' +
		'<a href="' + url + '"><img src="/BDS/' + userid + '/PT/' + photoid + '.jpg" title="' + toolTip + '"></a><br>'
	);
	document.write(
		(title == "" ? "" : '<a href="' + url + '" class="cmd" title="' + toolTip + '">' + title + '</a><br>')
	);
	if (nickName != "") {
		document.write ( 
			'<a href="/user/' + userid + '" class="cmd" title="' + toolTip + '">' + nickName + '</a> ' + 
			'<a href="/Com/Photo/List.aspx?f=U&u=' + userid + '" title="이 사진가의 다른 사진들" class="cmd">~</a><br>'
		);
	}
	
	var sep = '<span style="padding:0 2 0 2">/</span>';

	document.write(
		'<span title="' + toolTip + '">'
	);
	/*
	if (rating != -1) {
		document.write(
				//rating + sep + panelRating + sep + tRating + '<br>' +
				//rating + sep + tRating + '<br>'
				rating + sep + hit
		);
	}*/
	document.write(
		rating + sep + hit
	);
	/*
	if (date != "") {
		document.write("&nbsp;&nbsp;" + date);
	}
	*/
	if (music) {
		document.write(phtMuNote);
	}
	document.write('</span><br>');
	
	if (comment != "") {
		document.write('<div class=cmt>');
		document.write(lpGetHtmlized(comment,true));
		document.write('</div>');
	}
	document.write(
			'</td>' +
		(phtItemCnt % 3 == 0 ? "</tr><tr>" : "")
	);
}


function phtLI(photoid, title, userid, nickName, rating, panelRating,tRating, date, music, hit) { 
	phtLICore(phtCmdUrl + 'p=' + photoid, photoid, title, userid, nickName, rating , panelRating, tRating, hit, date, music, "");
}


/* List with Crit */

function phtLCBegin(viewUrl) {
	phtLBegin(viewUrl);
}

function phtLCEnd() {
	phtLEnd();
}

function phtLCI(photoid, title, userid, nickName, rating, panelRating, tRating, date, music, comment, hit) {
	phtLICore(phtCmdUrl + 'p=' + photoid, photoid, title, userid, nickName, rating, panelRating, tRating, hit, date, music, comment);
}


/* Photo List on Front Page */

var phtLFType;

function phtLFB(type) {
	phtLFType = type;
	phtItemCnt = 0
	document.write(
		'<table class="photo-l" cellspacing="0" cellpadding="0">' +
		'<tr>'
	);
}

function phtLFE() {
	document.write(
		'</tr></table>'
	);
}

function phtLF(photoid, threadid, title, userid, nickName, rating, panelRating, tRating, date, music, hit) {
 	phtLICore (
		phtLFType == 'W' ? "/Com/Note/View.aspx?f=A&v=S&l=1100&t=" + threadid :
		"/Com/Photo/View.aspx?f=A&p=" + photoid, 
		photoid, title, userid, nickName, rating, panelRating, tRating, hit, date, music, "");
}

/*	Photo Folder Presen */

var pfolderCnt = 0;
var pfolderHtml = '';
var pfolderFrame;

function pfolderPLB(title, titleLink, frame) {
	pfolderCnt = 0;
	pfolderFrame = frame != false;
	title = lpGetHtmlized(title, false, false, true);
	
	if (pfolderFrame) {
		pfolderHtml = 
			'<table border=0 cellpadding=0 cellspacing=0 class=fm-f>' +
			'<tr><td><img src=/d.gif width=131 height=1></td><td><img src=/d.gif width=820 height=1></td></tr>' +
			'<tr>' +
			'<td class=c1><div class=title><a href="' + titleLink + '" class="cmd">' + title + '</a></div></td>' +
			'<td class=c2 style="padding-top:2; padding-bottom:25;">'
		;
	}
}

function pfolderPLE(render) {
	if (pfolderCnt > 0) {
		pfolderHtml +=
			'</tr></table>'
		;
	} else {
		pfolderHtml +=
			'<span class=dim style="line-height:17px">...</span>'
		;
	}
	if (pfolderFrame) {
		pfolderHtml +=
			'</td></tr>' +
			'</table>'
		;
	}
	if (render != false) {
		document.write(pfolderHtml);
	}
}

function pfolderPLI(thumbUrl, linkUrl, title, digit1, digit2, date, toolTip, music) { 

	title = lpGetHtmlized(title);

	if (pfolderCnt % 5 == 0) {
		if (pfolderCnt > 0) {
			pfolderHtml +=
				'</tr></table>'
			;
		}
		pfolderHtml +=
			'<table cellspacing=0 cellpadding=0 class=pfolder-tl><tr>'
		;
	}

	pfolderHtml +=
		'<td>' +
			'<a href=' + linkUrl + '><img src=' + thumbUrl + ' title="' + toolTip + '"></a><br>'
	;
	if (title != "") {
		pfolderHtml += '<a href=' + linkUrl + ' class="cmd" title="' + toolTip + '">' + title + '</a><br>';
	}

	var sep = '<span style="padding:0 2 0 2">/</span>';

	pfolderHtml += 
		'<span title="' + toolTip + '">'
	;
	pfolderHtml += 
		digit1 + sep + digit2
	;
	if (music) {
		pfolderHtml += phtMuNote;
	}
	pfolderHtml +=
		'</span><br>';

	/*
	if (date != "") {
		pfolderHtml += '<span class=dim sstyle="margin-left:12px">' + date.substring(0,10) + '</span>';
	}
	*/

	pfolderHtml +=
		'</td>'
	;
	pfolderCnt++;
}


/* Photo List on Home GalleryPub */

var homePLLinkBase;
var homePLThumbBase;
var homePLCnt = 0;

function homeGPubLB() {
	homePLThumbBase = "/BDS/" + lpOwnerID + "/PT/";
	homePLLinkBase = "/Com/Photo/View.aspx?f=U&s=DD&u=" + lpOwnerID + "&p=";
	pfolderPLB("갤러리 공", "/Com/Photo/List.aspx?f=U&s=DD&u=" + lpOwnerID) 
}

function homeGPubLE() {
	pfolderPLE();
}

function homeGPubLI(photoid, title, hit, rating, panelRating, tRating, date, music) {
	var thumbUrl = homePLThumbBase + photoid + '.jpg';
	var linkUrl = homePLLinkBase + photoid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'추천 ' + rating + ' | ' +
		(panelRating > 0 ? '패널추천 ' + panelRating + ' | ' : '') +
		'누적추천 ' + tRating + ' | ' +
		'추천율 ' + phtRatingPercent(rating, hit) + '% | ' +
		date;

	pfolderPLI(thumbUrl, linkUrl, title, rating, hit, date, toolTip, music);
}


/* Photo List on Home GalleryBox */

function homeGBoxLB() {
	homePLThumbBase = "/BDS/" + lpOwnerID + "/T/";
	homePLLinkBase = "/Com/BoxPhoto/PView.aspx?f=P&s=UD&u=" + lpOwnerID + "&p=";
	pfolderPLB("갤러리 아", "/Com/BoxPhoto/FList.aspx?f=S&s=VD&u=" + lpOwnerID) 
}

function homeGBoxLE() {
	pfolderPLE();
}

function homeGBoxLI(photoid, title, hit, repCnt, date, music) {
	var thumbUrl = homePLThumbBase + photoid + '.jpg';
	var linkUrl = homePLLinkBase + photoid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'답글 ' + repCnt + ' | ' +
		date;

	pfolderPLI(thumbUrl, linkUrl, title, repCnt, hit, date, toolTip, music);
}

/* GalleryPub History List View*/

var gpubHLLinkBase;
var gpubHLThumbBase;
var gpubHLCnt = 0;

function gpubHLB(nickName, userID) {
	gpubHLThumbBase = "/BDS/" + userID + "/PT/";
	gpubHLLinkBase = "/Com/Photo/View.aspx?f=U&s=DD&u=" + userID + "&p=";
	pfolderPLB(nickName, "/user/" + userID) 
}

function gpubHLE() {
	pfolderPLE();
}

function gpubHLI(photoid, title, hit, rating, panelRating, tRating, date, music) {
	var thumbUrl = gpubHLThumbBase + photoid + '.jpg';
	var linkUrl = gpubHLLinkBase + photoid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'추천 ' + rating + ' | ' +
		(panelRating > 0 ? '패널추천 ' + panelRating + ' | ' : '') +
		'누적추천 ' + tRating + ' | ' +
		'추천율 ' + phtRatingPercent(rating, hit) + '% | ' +
		date;

	pfolderPLI(thumbUrl, linkUrl, title, rating, hit, date, toolTip, music);
}

/* Photo View */

var phtVCateHtml = "";
var phtVCateSep = "";
var phtPhotoUserID;
var phtPrevUrl = "";
var phtNextUrl = "";

function phtNavigate() {
	if (event.clientX > 140) {
		if (phtNextUrl != "") {
			if (event.shiftKey) {
				window.open(phtNextUrl, "_blank");
			} else {
				location.href = phtNextUrl;
			}
		}
	} else {
		if (phtPrevUrl != "") {
			if (event.shiftKey) {
				window.open(phtPrevUrl, "_blank");
			} else {
				location.href = phtPrevUrl;
			}
		}
	}
	event.cancelBubble = true;
}

function phtPIL(prev,next,catalog,edit,del) {
	lpRenderCmdLink("[이전]", prev, false, true, 12)
	lpRenderCmdLink("[다음]", next, false, true, 12)
	lpRenderCmdLink("[목록]", catalog, false, true, 12)
	lpRenderCmdLink("[수정]", edit, false, edit != "", 12)
	lpRenderCmdLink("[삭제]", del, false, del != "", 12)
	phtPrevUrl = prev;
	phtNextUrl = next;
	var obj = domObject("photoPanel");
	obj.style.cursor = "hand";
	obj.onclick = phtNavigate;
}
	

function phtPIC(category, desc) {
	phtVCateHtml += phtVCateSep + '<a href=/Com/Photo/List.aspx?f=C&c=' + category + ' class="cmd">' + desc + '</a>';
	phtVCateSep = "&nbsp;&nbsp;";
}

function phtPI(title,userID,nickName,homePage,rating,panelRating,totalRating,hit,cdate,comment,music) {
	phtPhotoUserID = userID;
	title = lpGetHtmlized(title);
	
	document.write(
		'<div class="photo-view" style="margin-bottom:160px">' +
		'<div class=title>' + title + '</div>' +
		'<div class=info>'
	);

	document.write(
		'<a href=/user/' + userID + ' class="namebold">' + nickName + '</a> <a href="/Com/Photo/List.aspx?f=U&u=' + userID + '" title="이 사진가의 다른 사진들">~</a><br>'
	);

	if (homePage != '') {
		document.write(
			lpGetLinkHtml(homePage,homePage,true) + '<br>'
		);
	}

	if (phtVCateHtml != '') {
		document.write(
			phtVCateHtml + '&nbsp;&nbsp;&nbsp;&nbsp;'
		);
	}

	var toolTip = 
		'조회 ' + hit + ' | ' +
		'추천 ' + rating + ' | ' +
		(panelRating > 0 ? '패널추천 ' + panelRating + ' | ' : '') +
		'누적추천 ' + totalRating + ' | ' +
		'추천율 ' + phtRatingPercent(rating, hit) + '% | ' +
		cdate;

	document.write(
		'<span title="' + toolTip + '">' + rating + ' / ' + hit + '&nbsp;&nbsp;&nbsp;&nbsp;' + cdate.substring(0,16) + '</span>' +
		'<br>' +
		'</div>'
	);

	document.write(
		'<div class=comment>' + lpGetHtmlized(comment,true) + lpGetMediaHtml(music) + '</div>'
	)
	document.write(
		'</div>'
	);
}


/* Category List */

var phtCLDiv = 1;

function phtCLBegin(viewUrl) {
	phtCmdUrl = viewUrl + lpGetParamSep(viewUrl);
	phtItemCnt = 0;
	document.write(
		'<div class=text style="line-height:28px; width:920px;">' +
		'<img src=/d.gif width=920 height=1><br>'
	);
}

function phtCLEnd() {
	document.write(
		'</div>'
	);
}

function phtCL(category, desc, cnt) { 
	if (Math.floor(category / 100) != phtCLDiv) {
		document.write ("<br>");
	}
	phtCLDiv = Math.floor(category / 100);
	document.write(
		'<a href="' + phtCmdUrl + 'c=' + category + '">' + desc + '</a>/' + cnt + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
	);
	phtItemCnt++;
}


/* Photo View - Crit List */

var phtPMHtmlC = "";
var phtPMHtmlNC = "";
var phtPMCnt = 0;

function phtPMB() {
	document.write(
		'<div class="photo-view-crit">'
	);
}

function phtPME() {
	document.write(phtPMHtmlC);
	document.write(phtPMHtmlNC);
	if (phtPMCnt >= 100 && location.href.indexOf("View.aspx") > 0) {
		document.write(
			'<div class=more>' +
			'<a href=' + location.href.replace(/View\.aspx/, "ViewCrit.aspx") + ' class="cmd">[전체 감상평]</a><br>' +
			'</div>'
		)
	}
	document.write(
		'</div>'
	);}

function phtPM(userid, nickName, cdate, comment, panel) { 
	comment = comment.replace(/\n\s*\n/g,"\n");
	comment = lpGetHtmlized(comment,true);
	var html = "" ;
	
	/*
	if (phtPMCnt > 0) {
		html = '<tr><td colspan=2 height=5><div class=h-dash><img src=/d.gif></div></td></tr>';
	}
	*/

	html +=
		'<div class=set>' +
		'<div class=name>' +
			'<a href="/user/' + userid + '" class="namebold" title="' + cdate + '">' + nickName + '</a>&nbsp; ' +
			'<a href="/Com/Photo/List.aspx?f=M&s=DD&u=' + userid + '" title="이 회원의 다른 추천 사진들">~</a>&nbsp;&nbsp; ' +
			(phtIsAdmin() && panel ? ' <span style="color:indianred">*</span>' : '') + 
			(phtIsAdmin() || phtPhotoUserID == lpUserID || userid == lpUserID ? '&nbsp;&nbsp;&nbsp;<a href="EditCrit.aspx' + location.search + '&cu=' + userid + '" class="cmd">[수정]</a>' : '') + 
		'</div>';

	if (comment.length > 0) {
		html += 
			'<div class=comment>' + comment + '</div>' +
			'</div>';
		phtPMHtmlC = phtPMHtmlC + html;
	} else {
		html += 
			'</div>';
		//phtPMHtmlNC = phtPMHtmlNC + html;
		phtPMHtmlC = phtPMHtmlC + html;
	}
	phtPMCnt++;
}





/* Box Photo Var */

var bpVFunc;
var bpVFolderID;
var bpVPageNumber;
var bpVViewMode;
var bpVSort;

if (location.pathname.indexOf("/Com/BoxPhoto/") == 0) {
	bpVFunc = urlpQueryString("f","S");
	bpVFolderID = urlpQueryString("l",0)
	bpVPageNumber = urlpQueryString("pg", 0)
	bpVViewMode = urlpQueryString("v","T")
	bpVSort = urlpQueryString("s","CD")
}
	
	
/* Box Photo Folder List */

var phtCmdPVUrl;
var bpFLSort;
var bpFolderID;

function bpFLB(sort) {
	phtItemCnt = 0;
	bpFLSort = sort;
}

function bpFLE() {
	if (phtItemCnt == 0) {
		document.write(
			'<table border=0 cellpadding=0 cellspacing=0 class=fm-f>' +
			'<tr><td><img src=/d.gif width=131 height=1></td><td><img src=/d.gif width=820 height=1></td></tr>' +
			'<tr><td class=c1>&nbsp;</td><td class=c2>...</td></tr>' +
			'</table>'
		);
	}
}

function bpFLFB(fid,func,title,pcnt,hit,mcnt,date) {
	phtItemCnt++;
	bpFolderID = fid;

	var pgParam = ""
	if (urlpQueryExists("pg")) {
		pgParam = "pg=" + urlpQueryString("pg") + "&";
	}

	phtCmdPVUrl = '/Com/BoxPhoto/PView.aspx?f=' + func + '&u=' + lpOwnerID + '&s=' + bpFLSort + '&' + pgParam;
	var folderUrl = '/Com/BoxPhoto/FView.aspx?f=' + func + '&u=' + lpOwnerID + '&s=' + bpFLSort + '&' + pgParam + 'l=' + fid

	pfolderPLB(title, folderUrl) 
}

function bpFLFE() {
	pfolderPLE();
}

function bpFLFI(pid, repCnt, hit, title, cdate) {
	var thumbUrl = '/BDS/' + lpOwnerID + '/T/' + pid + '.jpg';
	var linkUrl = phtCmdPVUrl + 'l=' + bpFolderID + '&p=' + pid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'답글 ' + repCnt + ' | ' +
		cdate;
		
	pfolderPLI(thumbUrl, linkUrl, title, repCnt, hit, cdate, toolTip, false /*music*/);
}


/* Folder View Info */

function bpFV(title, hit, cdate, comment, note, music) {
	title = lpGetHtmlized(title, false, false, false);

	document.write(
		'<div class="photo-view">' +
		'<div class=title>' + title + '</div>'
	);

	//+ '<div class=pv-info>조회수 ... &nbsp;&nbsp;' + hit + '</div>' 
	//+ '<div class=pv-info-l>등록일 ... &nbsp;&nbsp;' + cdate + '</div>' 
	//+ '<div class=pv-info-l>' + cdate + '</div>' 

	document.write(
		'<div class=comment>' + lpGetHtmlized(comment,true) + lpGetMediaHtml(music) + '</div>' +
		'<div class=comment>' + lpGetHtmlized(note,true) + '</div>'
	);
	document.write(
		'</div>'
	);
}


/* Folder View Thumbs List */

function bfFTBOnClick() {
	if (event.srcElement.tagName != "IMG") {
		location.href = "FView.aspx?u=" + lpOwnerID + "&f=" + bpVFunc + "&l=" + bpVFolderID + "&s=" + bpVSort + "&v=N" + "&pg=" + bpVPageNumber;
	}
}

function bpFTB(viewUrl) {
	phtCmdUrl = viewUrl
	phtItemCnt = 0

	pfolderPLB("", "", false) 
}

function bpFTE() {
	if (pfolderCnt > 0) {
		lpPhotoPanelOnClick = bfFTBOnClick;
	}
	pfolderPLE(false);
	lpPhotoPanelHtml = '<div style="margin-top:40px">' + pfolderHtml + '</div>';
}


function bpFT(photoid, title, repCnt, hit, date, sortvalue, music) { 
/*
	phtItemCnt++;
	title = lpGetHtmlized(title);
	lpPhotoPanelHtml +=
		'<td>' 
		+ '<a href="' + phtCmdUrl + '&p=' + photoid + '" onbubble><img src="/BDS/' + lpOwnerID + '/T/' + photoid + '.jpg"></a><br>' 
		+ title + (title == "" ? "" : '<br>') 
		+ repCnt + ' / ' + hit + (lpIsOwner ? '&nbsp;&nbsp;' + sortvalue : '') + '<br>' 
		//+ date + ' ' + (music ? phtMuNote : "") 
		+ '</td>'
		+ (phtItemCnt % 5 == 0 ? "</tr><tr>" : "")
		;
*/
	var thumbUrl = '/BDS/' + lpOwnerID + '/T/' + photoid + '.jpg';
	var linkUrl = phtCmdUrl + '&p=' + photoid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'답글 ' + repCnt + ' | ' +
		'정렬 ' + sortvalue + ' | ' +
		date;
		
	pfolderPLI(thumbUrl, linkUrl, title, repCnt, hit, date, toolTip, music);
}


/* Folder View Pics List */

function bfFPBOnClick() {
	if (event.srcElement.tagName != "IMG") {
		location.href = "FView.aspx?u=" + lpOwnerID + "&f=" + bpVFunc + "&l=" + bpVFolderID + "&s=" + bpVSort + "&v=T" + "&pg=" + bpVPageNumber;
	}
}

function bpFPB(viewUrl) {
	phtCmdUrl = viewUrl
	phtItemCnt = 0;
	lpPhotoPanelHtml +=
		'<table class="pp-pic" cellspacing="0" cellpadding="0">' 
		+ '<tr>'
		;
}

function bpFPE() {
	if (phtItemCnt == 0) {
		lpPhotoPanelHtml +=
			'<td><div class=text>...</div></td>'
			;
	} else {
		lpPhotoPanelOnClick = bfFPBOnClick;
	}
	lpPhotoPanelHtml +=
		'</tr></table>'
		;
}


function bpFP(photoid, filename, title, repCnt, hit, date, music) { 
	phtItemCnt++;
	title = lpGetHtmlized(title);
	lpPhotoPanelHtml +=
		'<tr><td>' 
		+ '<a href="' + phtCmdUrl + '&p=' + photoid + '"><img src="/BDS/' + lpOwnerID + '/P/' + photoid + '/' + filename + '" galleryimg="no" oncontextmenu="return lpCopyrightAlert()"></a><br>' 
		//+  '<img src="/BDS/' + lpOwnerID + '/P/' + photoid + '/" galleryimg="no"><br>'
		//+  title + (title == '' ? '' : '&nbsp;&nbsp;&nbsp;') +  repCnt + ' / ' + hit + '<br>' 
		+  title + '<br>' 
		+ '</td></tr>'
		;
}


/* Folder/Photo Comment List */

function bpFCB(url) {
	phtCmdUrl = url + lpGetParamSep(url);
	document.write(
		'<div class="photo-view-crit">'
	);
}

function bpFCE() {
	document.write(
		'</div>'
	);
}

function bpFC(commentid, userid, nickName, cdate, comment) {
	comment = comment.replace(/\n\s*\n/g,"\n");
	comment = lpGetHtmlized(comment,true);
	
	document.write (
		'<div class=set>' +
		'<div class=name>'
	);
	if (userid > 0) {
		document.write (
			'<a href="/user/' + userid + '" class="namebold" title="' + cdate + '">' + nickName + '</a>'
		);
	} else {
		document.write (
			'<span title="' + cdate + '">' + nickName + '</span>'
		);
	}
	if (phtIsBoxAdmin() || userid == lpUserID) {
		document.write (
			'&nbsp;&nbsp;&nbsp;<a href="' + phtCmdUrl + 'cmt=' + commentid + '" class="cmd">[수정]</a>'
		);
	}		
	document.write (
		'</div>' +
		'<div class=comment>' + comment + '</div>' +
		'</div>'
	);
}


/* Box Photo View */

function bpPIF(folder, func, title, userid) {
	var fvUrl = '/Com/BoxPhoto/FView.aspx?f=' + func + '&u=' + userid + '&s=VD&l=' + folder;
	title = lpGetHtmlized(title, false, false, false);
	if (bpVPageNumber > 0 && (bpVFunc == "S" || bpVFunc == "C")) {
		fvUrl += "&pg=" + urlpQueryString("pg");
	}
	if (phtVCateHtml.length == 0) {
		var obj = domObject("photoPanel");
		obj.style.cursor = "hand";
		obj.onclick = function() { location.href = fvUrl + "&v=N" };
	}
	phtVCateHtml += phtVCateSep + '<a href=' + fvUrl + ' class="cmd">' + title + '</a>';
	phtVCateSep = ",&nbsp;&nbsp;";
}

var bpPINHtml = "";

function bpPINA(note) {
	bpPINHtml += '<div class=pv-cmt>' + lpGetHtmlized(note,true) + '</div>';
}

function bpPIL(prev,next,folderlist,photolist,edit) {
	var isPhotoList = bpVFunc == "P" || bpVFunc == "F" || bpVFunc == "L"
	document.write(
		'<div class=sort-key style="margin: 10 0 0 0">'
	);
	//lpRenderCmdLink(prev,"[이전]",false) + '&nbsp;&nbsp;&nbsp;' +
	//lpRenderCmdLink(next,"[다음]",false) + '&nbsp;&nbsp;&nbsp;' +
	lpRenderCmdLink("[사진목록]" ,photolist,  false, isPhotoList, 12)
	lpRenderCmdLink("[폴더목록]",folderlist, false, !isPhotoList, 12)
	lpRenderCmdLink("[폴더]",photolist,  false, !isPhotoList, 12)
	lpRenderCmdLink("[사진수정]",edit,  false, edit != "", 12)
	lpRenderCmdLink("[사진삭제]", edit.replace(/PEdit\.aspx/,"PDelete.aspx"), false, edit != "", 12)
}

function bpPI(title,hit,cdate,comment,music) {
	title = lpGetHtmlized(title);
	var toolTip =
		"조회 " + hit + ' | ' + cdate;
		
	document.write(
		'<div class="photo-view" style="margin-bottom:160px">' +
		'<div class=title>' + title + '</div>'
	);

	document.write(
		'<div class=info>' +
			phtVCateHtml +  ' &nbsp;&nbsp;&nbsp;&nbsp;' + 
			'<span title="' + toolTip + '">' + hit + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + cdate.substring(0,10) + '</span>' +
		'</div>' +
		'<div class=comment>' + 
			lpGetHtmlized(comment,true) + 
			lpGetMediaHtml(music) + 
		'</div>' +
		'<div class=comment>' +
			bpPINHtml +
		'</div>'
	);

	document.write(
		'</div>'
	);
}


/* Box Photo List All */

function bpPLCore(photoid, title, userid, nickName, hit, repCnt, date, music) { 
	phtItemCnt++;
	title = lpGetHtmlized(title);
	nickName = lpGetHtmlized(nickName);

	var url = phtCmdUrl + 'p=' + photoid;
	var toolTip = 
		'조회 ' + hit + ' | ' +
		'답글 ' + repCnt + ' | ' +
		date;

	document.write(
		'<td>' +
		'<a href="' + url + '"><img src="/BDS/' + userid + '/T/' + photoid + '.jpg" title="' + toolTip + '"></a><br>'
	);
	document.write(
		(title == "" ? "" : '<a href="' + url + '" class="cmd" title="' + toolTip + '">' + title + '</a><br>')
	);

	if (nickName != '') {
		document.write(
			'<a href="/user/' + userid + '" class="cmd" title="' + toolTip + '">' + nickName + '</a> ' + 
			'<a href="/Com/BoxPhoto/FList.aspx?f=S&s=VD&u=' + userid + '" title="이 사진가의 다른 사진들" class="cmd">~</a><br>'
		);
	}

	var sep = '<span style="padding:0 2 0 2">/</span>';

	document.write(
		'<span title="' + toolTip + '">'
	);
	document.write(
		repCnt + sep + hit
	);
	/*
	if (date != "") {
		document.write("&nbsp;&nbsp;" + date);
	}
	*/
	if (music) {
		document.write(phtMuNote);
	}
	document.write('</span><br>');
	document.write(
		'</td>' +
		(phtItemCnt % 3 == 0 ? "</tr><tr>" : "")
	);
}

function bpPL(photoid, title, hit, repCnt, date, userid, music) { 
	bpPLCore(photoid, title, userid, '', hit, repCnt, date, music);
}

/* Box Photo List Fav Gallery */

function bpFPL(photoid, title, userid, nickName, hit, repCnt, date, music) { 
	bpPLCore(photoid, title, userid, nickName, hit, repCnt, date, music);
}
