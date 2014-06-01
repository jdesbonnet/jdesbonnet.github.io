	/**
	 * Get complex array from chart data.
	 */
	function getComplexArray(chartData) {
		var c = [];
		chartData.forEach(function (item) {
			c.push([item.re, item.im]);
		});
		return c;
	}
	
	/**
	 * Get real array from chart data.
	 */
	function getRealArray(chartData) {
		var r = [];
		chartData.forEach(function (item) {
			r.push(item.re);
		});
		return r;
	}

	/**
	 * Set chart data from complex array 'c' in params.
	 */
	function setData (data, c, label) {
		var N = c.length;
		var i;
		for (i = 0; i < N; i++) {
			if (data[i]) {
				data[i].re = c[i][0];
				data[i].im = c[i][1];
			} else {
				// create new data points
				data.push({re: c[i][0], im: c[i][1], label: label+"["+i+"]"});
			}
		}
		// remove unneeded data points
		if (N < data.length) {
			data.splice (N, data.length-N);
		}
	}

function isNumeric(n) {
	  return !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Turn array of complex numbers into string representation.
 * 
 * @param x
 * @returns
 */
function complexArrayToString (x) {
	var s = "";
	x.forEach (function (c){
		s += "(" + c[0] + " " + c[1] + ") ";
	});
	return s.trim();
}

/**
 * Turn a string representation of an array of complex numbers into a array.
 * 
 * @param s
 * @returns {Array}
 */
function parseComplexArray (s) {
	var bits = s.trim().split(/\s+/);
	var x = [];
	var state = 0;
	var x_re,x_im;
	for (var i = 0; i < bits.length; i++) {
		
		// state == 0 means expecting a real component next
		
		if (state == 0 && bits[i] == "(" && i < bits.length-1) {
			x_re = +bits[++i];
			state = 1; // next number im
			continue;
		} 
		if (state == 0 && bits[i].length>0 && bits[i].charAt(0)=='(') {
			x_re = +bits[i].substr(1);
			state = 1; // next number im
			continue;
		}
		
		// Numbers without brackets are treated as real numbers
		if (state == 0 && isNumeric(bits[i]) ) {
			x.push ([+bits[i], 0]);
			continue;
		}
		
		
		// state==1 means expecting a imaginary component next
		
		if (state == 1 && isNumeric(bits[i]) ) {
			x_im = +bits[i];
			x.push ([x_re, x_im]);
			state = 0;
			continue;
		}
		if (state == 1 && bits[i].charAt(bits[i].length-1)==')') {
			x_im = +bits[i].substr(0,bits[i].length-1);
			x.push ([x_re, x_im]);
			state = 0;
			continue;
		}
	}
	return x;
}

