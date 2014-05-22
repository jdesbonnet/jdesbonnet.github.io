function ComplexNumberChart () {
	
	var svg;
	var margin, width, height;
	var x,y, yphase;
	var xAxis;
	var yAxis;
	var yPhaseAxis;
	var drag;
	
	var dataLocal;
	var onChangeFn;
	
	var magnitudeAndPhase = false;
	
function initChart (chartSelector) {
	margin = {top: 20, right: 20, bottom: 30, left: 40},
	width = 540 - margin.left - margin.right,
	height = 300 - margin.top - margin.bottom;
	
	svg = d3.select(chartSelector)
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	x = d3.scale.ordinal()
	.rangeRoundBands([0, width], .1);

	y = d3.scale.linear()
	.range([height, 0]);
	
	yphase = d3.scale.linear()
	.range([height, 0]);
	yphase.domain( [ -Math.PI, Math.PI] );

	xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

	yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10);
	
	yPhaseAxis = d3.svg.axis()
	.scale(yphase)
	.orient("right")
	.ticks(10);
	
	
	svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(0," + height + ")")
	  .call(xAxis);

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	  /*
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("X[k]")
	  */
	  ;
	
	// Experimental phase axis on right.
	/*
	svg.append("g")
	  .attr("class", "yphase axis")
	  .attr("transform", "translate(" + (width-12) + ",0)" )
	  .call(yPhaseAxis)
	*/
	  
	drag = d3.behavior.drag()
	    .on("drag", function (d) {
	    	d3.select(this)
	    	.attr("cy", d3.event.y);
	    	if (this.className.baseVal=="lollipopc_re") {
	    		d.re = y.invert(d3.event.y);
	    	} else if (this.className.baseVal=="lollipopc_im") {
	    		d.im = y.invert(d3.event.y);
	    	}
	    })
	    .on("dragend", function (d) {
	    	drawChart(dataLocal);
	    	// onChange callback
	    	if (onChangeFn) {
	    		onChangeFn();
	    	}
	    }) ;
}

function updateChart () {
	drawChart(dataLocal);
}

function drawChart (data) {

	dataLocal = data;
	
	x.domain(data.map(function(d) { return d.label; }));

	var minv = d3.min (data, function(d) { return Math.min(d.re,d.im); });
	var maxv = d3.max (data, function(d) { return Math.max(d.re,d.im); });

	y.domain( [ (minv > 0? 0 : minv) , (maxv < 0 ? 0 : maxv) ] );

	svg.selectAll("g.x.axis").call(xAxis);
	svg.selectAll("g.y.axis").call(yAxis);

/*
svg.selectAll(".bar")
  .data(data)
.enter().append("rect")
  .attr("class", "bar_re")
  .attr("x", function(d) { return x(d.label); })
  .attr("width", x.rangeBand()/2)
  
  .attr("y", function(d) { return d.re < 0 ? y(0) : y(d.re); })  
  .attr("height", function(d) { return  Math.abs(y(d.re) - y(0)) });
  
svg.selectAll(".bar_im")
.data(data)
.enter().append("rect")
.attr("class", "bar_im")
.attr("x", function(d) { return x(d.label) + x.rangeBand()/2; })
.attr("width", x.rangeBand()/2)
.attr("y", function(d) { return d.im < 0 ? y(0) : y(d.im); })  
.attr("height", function(d) { return  Math.abs(y(d.im) - y(0)) });
*/

function redValue (d) {
	return magnitudeAndPhase ? Math.sqrt(d.re*d.re + d.im*d.im) : d.re;
}
function blueValue (d) {
	return magnitudeAndPhase ? Math.atan2(d.im,d.re) : d.im;
}

var lollipopLineRe = svg.selectAll(".lollipop_re").data(data);

lollipopLineRe
.enter().append("line")
.attr("class", "lollipop_re");

lollipopLineRe
.attr("x1", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("y1", function(d) { return y(0); })  
.attr("x2", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("y2", function(d) { return y(redValue(d))} );

lollipopLineRe
.exit().remove();


var lollipopCircleRe = svg.selectAll(".lollipopc_re").data(data);

lollipopCircleRe.enter()
.append("circle")
.attr("class", "lollipopc_re")
.attr("r","5px")
.call(drag);

lollipopCircleRe
//.attr("title",function (d) { return ""+Math.sqrt(d.re*d.re+d.im*d.im)})
.attr("cx", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("cy", function(d) { return y(redValue(d)); }) ;

lollipopCircleRe
.exit().remove();


// Imaginary part

var lollipopLineIm = svg.selectAll(".lollipop_im").data(data);

lollipopLineIm
.enter().append("line")
.attr("class", "lollipop_im");

lollipopLineIm
.attr("x1", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("y1", function(d) { return y(0); })  
.attr("x2", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("y2", function(d) { return y(blueValue(d)) });

lollipopLineIm
.exit().remove();


var lollipopCircleIm = svg.selectAll(".lollipopc_im").data(data);

lollipopCircleIm.enter()
.append("circle")
.attr("class", "lollipopc_im")
.attr("r","5px")
.call(drag);

lollipopCircleIm
.attr("cx", function(d) { return x(d.label) + x.rangeBand()/2 ; })
.attr("cy", function(d) { return y(blueValue(d)) }) ;

lollipopCircleIm
.exit().remove();






//
// grid lines
//
var gridLines = svg.selectAll("line.horizontalGrid").data(y.ticks(4));

gridLines
.enter().append("line")
.attr(
    {
        "class":"horizontalGrid",
        "x1" : margin.right,
        "x2" : width,
        "fill" : "none",
        "shape-rendering" : "crispEdges",
        "stroke" : function(d) {return d==0 ? "black" : "gray"},
        "stroke-width" : function(d) {return d==0 ? "2px" : "1px"}
    });
    
gridLines
.attr("y1",function(d){ return y(d);})
.attr("y2",function(d){ return y(d);})
.attr("stroke",function(d) {return d==0 ? "black" : "gray"})
.attr("stroke-width", function(d) {return d==0 ? "2px" : "1px"})
;

gridLines
.exit().remove() ;
    
}

return {
	initChart: function (selector) {
		initChart(selector);
	},
	drawChart: function (data) {
		drawChart(data);
	},
	updateChart: function () {
		updateChart();
	},
	onChange: function (fn) {
		onChangeFn = fn;
	}
};

}
