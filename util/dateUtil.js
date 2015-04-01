/**
 * 현재 날짜 가져오기.
 * @returns
 */
exports.nowDate = function(){
	//format : yyyyMMddHHmmss
	var ndate = new Date();
	var nyear = ndate.getFullYear();
	var nmonth = ndate.getMonth() + 1;
	var nday = ndate.getDate();
	var nhours = ndate.getHours();
	var nminutes = ndate.getMinutes();
	var nseconds = ndate.getSeconds();
	if(String(nmonth).length == 1)
		nmonth = "0" + nmonth;
	if(String(nday).length == 1)
		nday = "0" + nday;
	if(String(nhours).length == 1)
		nhours = "0" + nhours;
	if(String(nminutes).length == 1)
		nminutes = "0" + nminutes;
	if(String(nseconds).length == 1)
		nseconds = "0" + nseconds;
	s = String(nyear) + String(nmonth) + String(nday)+String(nhours)+String(nminutes)+String(nseconds);

	return s;
};

/**
 * 시간을 String으로 변환
 */
function toTimeString(date) { //formatTime(date)
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var min = date.getMinutes();
	if (("" + month).length == 1) {
		month = "0" + month;
	}
	if (("" + day).length == 1) {
		day = "0" + day;
	}
	if (("" + hour).length == 1) {
		hour = "0" + hour;
	}
	if (("" + min).length == 1) {
		min = "0" + min;
	}
	return ("" + year + month + day + hour + min);
};

/**
 * 현재 날짜를 가지고옴(yyyyMMdd)
 */
exports.getNowDate = function () {
	return toTimeString(new Date()).substr(0, 8);
};

/**
 * 현재 년
 */
exports.getYear = function () {
	return toTimeString(new Date()).substr(0, 4);
};

/**
 * 전년도
 */
exports.getPrevYear = function () {
	return new String(Number(getYear())-1);
};

/**
 * 다음년도
 */
exports.getNextYear = function () {
	return new String(Number(getYear())+1);
};

/**
 * 달
 */
exports.getMonth = function () {
	return toTimeString(new Date()).substr(4, 2);
};

/**
 * 현재 날짜(dd)
 */
exports.getDay = function () {
	return toTimeString(new Date()).substr(6, 2);
};

/**
 * 현재 시간
 */
exports.getHour = function () {
	return toTimeString(new Date()).substr(8, 2);
};

/**
 * 날짜 빼기
 *
 * @param date 기준 날짜
 * @param i 뺴기
 * @returns {string}
 */
exports.getMinusDate = function (date, i)
{
    var selectDate = date.toString();
    var changeDate = new Date();
    changeDate.setFullYear(date.substr(0,4), date.substr(4,2)-1, date.substr(6,2)-(i*1));

    var y = changeDate.getFullYear();
    var m = changeDate.getMonth() + 1;
    var d = changeDate.getDate();
    if(m < 10)    { m = "0" + m; }
    if(d < 10)    { d = "0" + d; }

    return y.toString() + m.toString() + d.toString();
};

/**
 * 현재 날짜를 가지고 온다.
 *
 * @returns {Date}
 */
exports.nowDateTypeDate = function(){
    return new Date();
};