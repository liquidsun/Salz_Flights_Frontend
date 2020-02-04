import * as d3 from "d3";
import $ from 'jquery';
import {getDataFromDB} from './db_access'
import bartip from "d3-tip"

//Creates barchart for passed data object
//data object have to have gr attribute for X axis
//and count attribute for Y axis of the barchart
function build_flights_chart(data){
    data.then(e=> {
        //console.log(e);
        d3.select('svg').remove();
        const barColor = 'orange';
        //console.log(e);
        const hGDim = {t: 20, r: 0, b: 20, l: 10};
        let width = $('#chart').width();
        let height = $('#chart').height();
        hGDim.w = width - hGDim.l - hGDim.r;
        hGDim.h = height - hGDim.t - hGDim.b;
        //console.log(e);

        //Tooltip for the bars
        const tip = bartip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(d=> {
                return "<p>Number of flights:</p> <span style='color:red'>" + d.count + "</span>";
            });
        //create svg for histogram.

        const hGsvg  = d3.select("#chart").append('svg')
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        hGsvg.call(tip);
        // Create function for y-axis map.
        const yScale = d3.scaleLinear().range([hGDim.h, 0])
            .domain([0, d3.max(e, d => Number(d.count))]);

        // create function for x-axis mapping.

        const xScale = d3.scaleBand().range([0, hGDim.w], 0.1)
            .domain(e.map(s => s.gr)).padding(0.2);

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.axisBottom(xScale));

        // Create bars for histogram to contain rectangles and freq labels.
        const bars = hGsvg.selectAll(".bar").data(e)
            .enter()
            .append("g")
            .attr("class", "bar");

        bars.append("rect")
            .attr("x", (s) => xScale(s.gr))
            .attr("y", (s) => yScale(Number(s.count)))
            .attr("width", xScale.bandwidth())
            .attr("height", (s) => hGDim.h - yScale(Number(s.count)))
            .attr('fill',barColor)
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);

    })
}

//Clears the graph area from any charts
function ClearGraph() {
    d3.select('svg').remove();
}

//Gets the data from Express server backend and builds
//barchart in the graph area
function CreateGraph(values,type){
    let data = getDataFromDB(values,type);
    build_flights_chart(data)
}

export {CreateGraph,ClearGraph}