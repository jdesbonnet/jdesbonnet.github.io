function calcDFTReal(x) {
	var N = x.length;
	var twoPiOverN = 2 * Math.PI / N;
	var k,n,s_re,s_im;
	var X = [];
	for (k = 0; k < N; k++) {
		s_re = 0; s_im=0;
		for (n = 0; n < N; n++) {
			s_re += Math.cos(twoPiOverN * n * k) * x[n];
			s_im += -Math.sin(twoPiOverN * n * k) * x[n];
		}
		X[k] = [s_re, s_im];
	}
	return X;
}

/**
 * Calculate DFT of sequence of complex numbers.
 * 
 * @param x Array of complex numbers. Complex numbers represented by two 
 * element array, first real component, second imaginary component.
 * 
 * @returns {Array}
 */
function calcDFT(x) {
	var N = x.length;
	var twoPiOverN = 2 * Math.PI / N;
	var k,n,s_re,s_im,x_re,x_im;
	var X = [];
	for (k = 0; k < N; k++) {
		s_re = 0; s_im=0;
		for (n = 0; n < N; n++) {
			x_re = x[n][0];
			x_im = x[n][1];
			angle = twoPiOverN * n * k;
			s_re += Math.cos(angle) * x_re + Math.sin(angle) * x_im;
			s_im += Math.cos(angle) * x_im - Math.sin(angle) * x_re;
		}
		X[k] = [s_re, s_im];
	}
	return X;
}

/**
 * Calculate inverse DFT.
 * 
 * calcInverseDFT(calcDFT(x)) == x
 * 
 * Similar to calcDFT except some over conjugated inputs and then conjugate the sum again.
 * @param x
 * @returns {Array}
 */
function calcInverseDFT(x) {
	var N = x.length;
	var twoPiOverN = 2 * Math.PI / N;
	var k,n,s_re,s_im,x_re,x_im;
	var X = [];
	for (k = 0; k < N; k++) {
		s_re = 0; s_im=0;
		for (n = 0; n < N; n++) {
			x_re = x[n][0];
			x_im = -x[n][1];
			angle = twoPiOverN * n * k;
			s_re += Math.cos(angle) * x_re + Math.sin(angle) * x_im;
			s_im += Math.cos(angle) * x_im - Math.sin(angle) * x_re;
		}
		X[k] = [s_re/N, -s_im/N];
	}
	return X;
}

