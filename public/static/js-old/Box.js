var boxItemCnt = 0;

/*       */

function boxLB() {
	document.write(
		'<table class="def" cellspacing="0" cellpadding="0">' +
		'<col width=200><col width=200><col width=200><col width=200>' +
		'<tr>'
	);

}

function boxLE() {
	document.write(
	'</tr></table>'
	);

}

function boxLI(nickName, boxid, boxsid, favCnt) {
	document.write(
		'<td nowrap>' +
			'<a href="/' + boxsid + '">' + nickName + ' / ' + boxsid + '</a>' +
			(favCnt > 0 ? ' / ' + favCnt : '') +
		'</td>' +
		((boxItemCnt + 1) % 4 == 0 ? '</tr><tr>' : '')
	);
	boxItemCnt++;

}

/*       */


function boxFLB() {
	boxItemCnt = 0;
	document.write(
		'<div class="text" style="word-break:keep-all">'
	);
}

function boxFLE() {
	document.write(
		'</div>'
	);
}


function boxFLI(boxsid) /* List Item */ { 
	document.write(
		(boxItemCnt > 0 ? '&nbsp;&nbsp; ' : '') + '<a href="/' + boxsid + '">' + boxsid + '</a>'
	);
	boxItemCnt++;
}
