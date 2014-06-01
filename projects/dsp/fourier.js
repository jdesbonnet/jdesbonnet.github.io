
var learnDspApp = angular.module('learnDspApp',['ngRoute', 'ui.bootstrap']);

learnDspApp
.controller('MasterPageController', function ($scope, $interval) {	
	
	var X;
	
	// The canonical data store
	var xndata = [];
	var Xkdata = [];
	
	var xnChart = new ComplexNumberChart();
	var XkChart = new ComplexNumberChart();
	xnChart.initChart(".xnChart");
	XkChart.initChart(".XkChart");

	/**
	 * textarea -> data
	 */
	function updateDataFromTextarea () {
		var xn = parseComplexArray($scope.xn);
		var Xk = parseComplexArray($scope.Xk);
		
		var N = X.length;
		for (var i = 0; i < N; i++) {
			xndata[i].re = xn[i][0];
			xndata[i].im = xn[i][1];
			Xkdata[i].re = Xk[i][0];
			Xkdata[i].im = Xk[i][1];
		}
	}
	
	/**
	 * Get complex array from chart data.
	 */
	function getComplexArray(data) {
		var c = [];
		data.forEach(function (item) {
			c.push([item.re, item.im]);
		});
		return c;
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
	
	
	/** 
	 * Initialize and create charts.
	 */
	$scope.calcDFT = function () {
		
		var x = parseComplexArray($scope.xn);
		X = calcDFT(x);
		
		var N = X.length;
		
		xndata = [];
		Xkdata = [];
		for (var i = 0; i < N; i++) {
			xndata.push({label: "x["+i+"]", re: x[i][0], im: x[i][1] });
			Xkdata.push({label: "X[" + i + "]", re: X[i][0], im: X[i][1] });
		}
		
		xnChart.drawChart(xndata);
		XkChart.drawChart(Xkdata);
		
		updatexnTextarea();
		updateXkTextarea();

	};
	
	/**
	 * Something has changed on the x[n] side. Update X[k].
	 */
	$scope.updateXkSide = function () {
		x = getComplexArray(xndata);
		X = calcDFT(x);
		setData (Xkdata, X, "X");
		XkChart.updateChart();
		updateXkTextarea();
	};
	/**
	 * Something has changed on the X[k] side. Update x[n].
	 */
	$scope.updatexnSide = function () {
		Xk = getComplexArray(Xkdata);
		x = calcInverseDFT(Xk);
		setData(xndata, x, "x");
		xnChart.updateChart();
		updatexnTextarea();
	};
	
	/**
	 * Copy from data to textarea. parseFloat( toFixed()) is a clumsy attempt at 
	 * removing small rounding errors from what should be whole numbers (eg
	 * 1.0000000012 instead of 1).
	 */
	function updatexnTextarea () {
			
		var data = "";
		xndata.forEach (function (d){
			data += "(" + parseFloat(d.re.toFixed(8)) + " " + parseFloat(d.im.toFixed(8)) + ") ";
		});
		$scope.xn = data.trim();
	}
	
	function updateXkTextarea () {
		var data = "";
		Xkdata.forEach (function (d){
			data += "(" + parseFloat(d.re.toFixed(8)) + " " + parseFloat(d.im.toFixed(8)) + ") ";
		});
		$scope.Xk = data.trim();
	}
	
	$scope.xnTextareaChange = function () {
		xn = parseComplexArray($scope.xn);
		setData(xndata,xn,"x");
		xnChart.updateChart();
		$scope.updateXkSide();		
	};
	$scope.XkTextareaChange = function () {
		Xk = parseComplexArray($scope.Xk);
		setData(Xkdata,Xk,"X");
		XkChart.updateChart();
		$scope.updatexnSide();		
	};
	
	// Handle user manipulation of x[n] chart
	xnChart.onChange (function() {
		$scope.$apply($scope.updateXkSide());
		$scope.$apply(updatexnTextarea());

	});
	// Handle user manipulation of X[k] chart
	XkChart.onChange (function() {
		$scope.$apply($scope.updatexnSide);
		$scope.$apply(updateXkTextarea());
	});
	
	/*
	$scope.xn = "2 1 0 -1 -2 -1 0 1  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  "
		+ "2 1 0 -1 -2 -1 0 1  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  "
		+ "2 1 0 -1 -2 -1 0 1  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  "
		+ "2 1 0 -1 -2 -1 0 1  0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0  ";
	*/
	/*
	$scope.xn = "2 1 0 -1 -2 -1 0 1   0 0 0 0 0 0 0 0"
		+ "2 1 0 -1 -2 -1 0 1   0 0 0 0 0 0 0 0"
		+ "2 1 0 -1 -2 -1 0 1    0 0 0 0 0 0 0 0"
		+ "2 1 0 -1 -2 -1 0 1  0 0 0 0 0 0 0 0 ";
    */
	//$scope.xn = "1 1 1 1 0 0 0 0 1 1 1 1 0 0 0 0 1 1 1 1 0 0 0 0 ";
	$scope.xn = "1 0 0 0 0 0 0 0";
	$scope.calcDFT();
	
})


.controller('TopNavController', function($scope,$log ) {
})
.controller('LeftNavController', function($scope,$log ) {
})

; // end of controller/services definitions

	
learnDspApp.config(function ($routeProvider) {
	$routeProvider
	.when("/dft", {controller: "PagesViewController", templateUrl: "_dft.html"} )
	.otherwise({redirectTo: "/pages"} )
	;
});
