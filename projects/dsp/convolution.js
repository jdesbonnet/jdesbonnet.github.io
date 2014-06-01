
function convolution (x,h) {

	var xh = [];

	var i,k,s;
	for (k = 0; k < x.length; k++) {
		s = 0;
		for (i = k; i < x.length; i++) {
			s += x[i]*h[i-k];
		}
		xh[k] = s;
	}

	return xh;

}

var learnDspApp = angular.module('learnDspApp',['ngRoute', 'ui.bootstrap']);

learnDspApp
.controller('MasterPageController', function ($scope, $interval) {	
	
	var X;
	
	// The canonical data store
	var xndata = [];
	var hndata = [];
	var xhndata = [];

	var xnChart = new ComplexNumberChart();
	var hnChart = new ComplexNumberChart();
	var xhnChart = new ComplexNumberChart();
	xnChart.initChart(".xnChart");
	hnChart.initChart(".hnChart");
	xhnChart.initChart(".xhnChart");


	/**
	 * textarea -> data
	 */
	function updateDataFromTextarea () {
		var xn = parseComplexArray($scope.xn);
		var Xk = parseComplexArray($scope.hn);
		
		var N = X.length;
		for (var i = 0; i < N; i++) {
			xndata[i].re = xn[i][0];
			xndata[i].im = xn[i][1];
			hndata[i].re = hn[i][0];
			hndata[i].im = hn[i][1];
		}
	}
	

	
	
	/** 
	 * Initialize and create charts.
	 */
	$scope.calcConvolution = function () {
		var i;

		var xn = getRealArray(xndata);
		var hn = getRealArray(hndata);

		console.log(xn);
		console.log(hn);

		var xhn = convolution (xn,hn);

		console.log(xhn);

		var xhndata = [];

		for (i = 0; i < xhn.length; i++) {
			xhndata.push({label: "x*h["+i+"]", re: xhn[i], im: 0 });
		}
		
		xhnChart.drawChart(xhndata);

	};
	
	/**
	 * Something has changed on the x[n] side. Update X[k].
	 */
	$scope.updateConvolution = function () {
		x = getRealArray(xndata);
		h = getRealArray(hndata);
		xh = calcConvolution(x,h);
		setData (xhndata, xh, "x*h");
		xnChart.updateChart();
		hnChart.updateChart();
		updateTextarea();
	};

	/**
	 * Copy from data to textarea. parseFloat( toFixed()) is a clumsy attempt at 
	 * removing small rounding errors from what should be whole numbers (eg
	 * 1.0000000012 instead of 1).
	 */
	function updateTextarea () {
			
		var data = "";
		xndata.forEach (function (d){
			data += "(" + parseFloat(d.re.toFixed(8)) + " " + parseFloat(d.im.toFixed(8)) + ") ";
		});
		$scope.xn = data.trim();

		data="";
		hndata.forEach (function (d){
			data += "(" + parseFloat(d.re.toFixed(8)) + " " + parseFloat(d.im.toFixed(8)) + ") ";
		});
		$scope.hn = data.trim();
	}
	
	
	$scope.xnTextareaChange = function () {
		xn = parseComplexArray($scope.xn);
		setData(xndata,xn,"x");
		//xnChart.updateChart();
	};
	$scope.hnTextareaChange = function () {
		hn = parseComplexArray($scope.hn);
		setData(hndata,hn,"h");
		//hnChart.updateChart();
	};
	
	// Handle user manipulation of x[n] chart
	xnChart.onChange (function() {
		$scope.$apply($scope.updateXkSide());
		$scope.$apply(updatexnTextarea());

	});
	// Handle user manipulation of h[n] chart
	hnChart.onChange (function() {
		$scope.$apply($scope.updatexnSide);
		$scope.$apply(updatehnTextarea());
	});
	
	
	$scope.xn = "0 0 0 0 1 1 1 1 1 1 1 1 ";
	$scope.hn = "1 -1 0 0 0 0 0 0 0 0 0 0";

	setData(xndata,parseComplexArray($scope.xn),"xn");
	setData(hndata,parseComplexArray($scope.hn),"hn");
	
	xnChart.drawChart(xndata);
	hnChart.drawChart(hndata);
	
})


.controller('TopNavController', function($scope,$log ) {
})
.controller('LeftNavController', function($scope,$log ) {
})

; // end of controller/services definitions

	
learnDspApp.config(function ($routeProvider) {
	$routeProvider
	.when("/dft", {controller: "PagesViewController", templateUrl: "_dft.html"} )
	.when("/convolution", {controller: "PagesViewController", templateUrl: "_convolution.html"} )
	.otherwise({redirectTo: "/pages"} )
	;
});
