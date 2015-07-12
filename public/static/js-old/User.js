/* user info */

function userProfile(nickName, realName, email, status, cdate, adate, homePage) {
	var sep = "&nbsp;&nbsp;";
	var infoStr = "";

	if (lpBoxDesc == nickName) {
		if (nickName == realName) {
		} else {
			infoStr += realName;
		}
	} else {
		if (nickName == realName) {
			infoStr += realName;
		} else {
			infoStr += nickName;
			infoStr += sep +  "/" + sep + realName;
		}
	}

	if (adate != "") {
		if (infoStr != "") {
			infoStr += sep +  "/" + sep;
		}
		infoStr += cdate;
		infoStr += sep +  "/" + sep + adate;
	}
	if (email != "") {
		infoStr += sep +  "/" + sep + email;
	}
	if (status == 'T') {
		infoStr += sep +  "/" + sep + "서비스 사용 중지";
	}
	
	if (infoStr != "") {
		document.write(infoStr);
		document.write("<br>");
	}

	if (homePage != "") {
		document.write(lpGetLinkHtml(homePage,homePage,true));
		document.write("<br>");
	}
	if (lpBoxSID.match(/home[0-9]+/i) == null) {
		var rsAddr = "http://www.raysoda.com/" + lpBoxSID;
		if (homePage.match(new RegExp(rsAddr, "i")) == null) {
			document.write(lpGetLinkHtml(rsAddr,rsAddr,true));
			document.write("<br>");
		}
	}
}


/* user list */ 

var userItemCnt = 0;

function userLBegin() {
	document.write(
		'<table class="def" cellspacing="0" cellpadding="0">' +
		'<col width=200><col width=200><col width=200><col width=200>' +
		'<tr>'
	);
}

function userLEnd() {
	document.write(
	'</tr></table>'
	);
}


function userL(userid, name, favCnt, fIcon) /* List Item */ { 
	document.write(
		'<td nowrap>' +
			'<a href="/user/' + userid + '">' + name + '</a>' +
			(favCnt > 0 ? '<span title="즐겨찾는 회원수"> / ' + favCnt + '</span>' : '') +
		'</td>' +
		((userItemCnt + 1) % 4 == 0 ? '</tr><tr>' : '')
	);
	userItemCnt++;
}

/* 즐겨찾는 회원 목록 */

function userFLB() {
	userItemCnt = 0;
	document.write(
		'<div class="text" style="word-break:keep-all">'
	);
}

function userFLE() {
	document.write(
		'</div>'
	);
}


function userFL(userid, name) /* List Item */ { 
	document.write(
		(userItemCnt > 0 ? '&nbsp;&nbsp; ' : '') + '<a href="/user/' + userid + '">' + name + '</a>'
	);
	userItemCnt++;
}


/* 초청자 목록 / Register-Requested */

function userRRB() {
	userItemCnt = 0;
	document.write(
		'<div class="text" style="word-break:keep-all">'
	);
}

function userRRE() {
	if (userItemCnt == 0) {
		document.write(
			'...'
		);
	}
	document.write(
		'</div>'
	);
}

function userRR(id, email, date) {
	document.write(
		date + "&nbsp;&nbsp;&nbsp;" + 
		email + "&nbsp;&nbsp;&nbsp;" + 
		"<a href=D.aspx?resend=" + id + ">[초청장 재발송]</a>" + "&nbsp;&nbsp;&nbsp;" + 
		"<a href=D.aspx?del=" + id + ">[초청 취소]</a>" + "<br>"
	)
	userItemCnt++;
}


/* 초청 가입자 목록 / Register-Confirmed */

function userRCB() {
	userItemCnt = 0;
	document.write(
		'<div class="text" style="word-break:keep-all">'
	);
}

function userRCE() {
	if (userItemCnt == 0) {
		document.write(
			'...'
		);
	}
	document.write(
		'</div>'
	);
}

function userRC(id, name, date) {
	document.write(
		date + "&nbsp;&nbsp;&nbsp;" + 
		"<a href='/user/" + id + "'>" + name + "</a><br>"
	)
	userItemCnt++;
}
