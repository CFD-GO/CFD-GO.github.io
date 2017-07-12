	function parseUnit(text) {
		var match = /^([-+]?[0-9]*(\.[0-9]*)?([eE][+-]?[0-9]*)?)(.*)$/.exec(text);
		var val, unit;
		val = parseFloat(match[1]);
		unit = match[4];
		units = /^([^\/]*)(\/([^\/]*))?$/.exec(unit);
		units = [ units[1], units[3] ];
		console.log(units);
		if (! units[1]) {
		return val + " [" + units[0] + "]";
		} else {
		return val + " [<sup>" + units[0] + "</sup>&frasl;<sub>" + units[1] + "</sub>]";
		}
	}
	
	unitTable = {
		'mm':  { value: 1e-3,unit:[ 1,  0, 0, 0, 0, 0, 0 ] },
		'cm':  { value: 1e-2,unit:[ 1,  0, 0, 0, 0, 0, 0 ] },
		'ms':  { value: 1e-3,unit:[ 0,  1, 0, 0, 0, 0, 0 ] },
		'mg':  { value: 1e-6,unit:[ 0,  0, 1, 0, 0, 0, 0 ] },
		'm':   { value: 1,   unit:[ 1,  0, 0, 0, 0, 0, 0 ] },
		'km':  { value: 1e3, unit:[ 1,  0, 0, 0, 0, 0, 0 ] },
		's':   { value: 1,   unit:[ 0,  1, 0, 0, 0, 0, 0 ] },
		'ms':  { value: 1e-3,unit:[ 0,  1, 0, 0, 0, 0, 0 ] },
		'kg':  { value: 1,   unit:[ 0,  0, 1, 0, 0, 0, 0 ] },
		'g':   { value: 1e-3,unit:[ 0,  0, 1, 0, 0, 0, 0 ] },
		'Pa':  { value: 1,   unit:[-1, -2, 1, 0, 0, 0, 0 ] },
		'N':   { value: 1,   unit:[ 1, -2, 1, 0, 0, 0, 0 ] },
		'J':   { value: 1,   unit:[ 2, -2, 1, 0, 0, 0, 0 ] },
		'K':   { value: 1,   unit:[ 0,  0, 0, 1, 0, 0, 0 ] },
		'x':   { value: 1,   unit:[ 0,  0, 0, 0, 1, 0, 0 ] },
		'y':   { value: 1,   unit:[ 0,  0, 0, 0, 0, 1, 0 ] },
		'z':   { value: 1,   unit:[ 0,  0, 0, 0, 0, 0, 1 ] },
	}
	unitRegExp = "^(";
	for (var k in unitTable) {
		unitRegExp = unitRegExp + k + "|";
	}
	unitRegExp = unitRegExp + "\/)([0-9]*)(.*)$";
	unitRegExp = RegExp(unitRegExp);
	unitScale = [ 0, 0, 0, 0, 0, 0, 0 ];

	function getUnitless( x ) {
		return (Math.exp(-numeric.sum(numeric.mul(unitScale, x.unit))) * x.value).toExponential(3);
	}

	function parseUnit(text) {
		var match = /^([-+]?[0-9]*(\.[0-9]*)?([eE][+-]?[0-9]*)?)([^-+]*)([+-].*)?$/.exec(text);
		console.log(match);
		var val, unit;
		val = parseFloat(match[1]);
		full = { value: val, unit:[ 0,  0, 0, 0, 0, 0, 0 ] };
		unit = match[4];
		t = unit;
		w = "";
		mp = 1;
		er = "";
		while (t != "") {
		 a = unitRegExp.exec(t);
		 if (a == undefined) break;
		 s = a[1];
		 if (s == "/") {
		  if (mp < 0) break;
		  if (a[2] != "") break;
		  mp = -1;
		  if (w == "") {
		  	w = "<sup>1</sup>&frasl;<sub>"
		  } else {
		  	w = "<sup>" + w + "</sup>&frasl;<sub>"
		  }
		 } else {
		  p = 1;
		  u = a[1];
		  w = w + a[1];
		  if (a[2] != "") { 
		   p = parseInt(a[2]);
		   w = w + "<sup>" + p + "</sup>";
		  }
		  u = unitTable[u];
		  p = p * mp;
		  full.value = full.value * Math.pow(u.value,p);
		  full.unit = numeric.add(full.unit, numeric.mul(u.unit,p));
		 }
		 t = a[3];
		}
		if (mp < 0) w = w + "</sub>";
		if (t != "") {
			w = w + '<span style="color:red">' + t + '</span>';
			full.value = NaN;
			return { value: full, text: text, html: val + " " + w };
		} else {
			return { value: full, text: text, html: val + " " + w };
		}
	}

