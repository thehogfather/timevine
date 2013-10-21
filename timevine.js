/*
* Copyright (c) 2013 Patrick Oladimeji. All rights reserved.
*
* Permission is hereby granted, free of charge, to any person obtaining a
* copy of this software and associated documentation files (the "Software"),
* to deal in the Software without restriction, including without limitation
* the rights to use, copy, modify, merge, publish, distribute, sublicense,
* and/or sell copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
* DEALINGS IN THE SOFTWARE.
*
*/
/**
 * 
 * @author Patrick Oladimeji
 * @date 10/19/13 20:38:24 PM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, module, self, $, brackets, window, MouseEvent */
(function () {
    "use strict";
    function property(v) {
        var p = function (_) {
            if (!arguments.length) {
                return v;
            }
            v = _;
            return this;
        };
        return p;
    }
    
    function timevine(data) {
        var o = {};
        o.width = property.call(o, 600);
        o.height = property.call(o, 600);
        o.orient = property.call(o, "vertical");//can be vertical
        o.data = property.call(o, data);//data is an array containing a list of events so [[]]
        o.dateFunction  = property.call(o, function (d) {
            return d.date;//default expects that there is a date variable in the event object
        });
        
        o.eventSize = property.call(o, function (d) {
            return 5;
        });
        
        o.eventFill = property.call(o, function (d) {
            return "rgba(98, 153, 193, 1)";
        });
        
        o.eventStroke = property.call(o, function (d) {
            return "#555";
        });
        o.events = function () {
            return d3.selectAll("circle.event");
        };
        o.vines = function () {
            return d3.selectAll("g.timevine");
        };
        o.branches = property.call(o, "top"); //left|right|top|bottom|split (used to tell how to render the branching behaviour of the events)
        
        //maybe add a class function for the events
        
        
        function sortData(data, tf) {
            var sf = function (a, b) { return tf(a) - tf(b); };
            var res = data.sort(function (a, b) {
                a.sort(sf);
                b.sort(sf);
                return tf(a[0]) - tf(b[0]);
            });
            return res;
        }
        
        o.render = function (el) {
            if (!o.data()) { throw new Error("data object missing from visualisation."); }
            
            el = el || "body";
            var margin = {top: 50, left: 120, right: 20, bottom: 20};
            var w = o.width() + margin.left + margin.right,
                h = o.height() + margin.top + margin.bottom;
            
            //update margins based on the type of branch and the orientation of the vines
            if (o.orient() === "vertical") {
                margin.left = o.branches() === "left" ? o.width() + margin.right : margin.left;
            } else {
                margin.top = o.branches() === "top" ? o.height() + margin.bottom : margin.top;
            }
           
            var tf = o.dateFunction(), orientMap = {left: "right", right: "left", top: "bottom", bottom: "top"};
            var data = sortData(o.data(), tf), firstEvent = data[0][0], lastEvent = data[data.length - 1][data[data.length - 1].length - 1];
            var trange = o.orient() === "horizontal" ? [0, o.width()] : [0, o.height()];
            var tscale = d3.time.scale().range(trange).domain([tf(firstEvent), tf(lastEvent)]);
            var brange = o.orient() === "horizontal" ? [o.height(), 0] : [o.width(), 0];
            var bdomain = [0, data.length];
            var branchScale = d3.scale.linear().range(brange).domain(bdomain);
            var mainAxis = d3.svg.axis().scale(tscale).orient(orientMap[o.branches()]);
            var xFunc = function (d, i) {
                    if (o.orient() === "horizontal") {
                        return tscale(tf(d));
                    } else {
                        if (i === 0) {
                            return 0;//maybe this isnt always 0 it is just the starting point of each subevent/subvine
                        }
                        return o.branches() === "left" ? (-1 * branchScale(d.parentIndex)) : branchScale(d.parentIndex);
                    }
                };
            var yFunc = function (d, i) {
                    if (o.orient() === "vertical") {
                        return tscale(tf(d));
                    } else {
                        if (i === 0) {
                            return 0;//maybe this isnt always 0 it is just the starting point of each subevent/subvine
                        }
                        return o.branches() === "top" ? (-1 *  branchScale(d.parentIndex)) : branchScale(d.parentIndex);
                    }
                };
            var lf = d3.svg.line().interpolate("linear")
                .x(xFunc).y(yFunc);
            
            var svg = d3.select(el).append("svg").attr("width", w)
                .attr("height", h);
            var canvas = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
            var axis = canvas.append("g").attr("class", "axis").call(mainAxis);
            //do adjustments to text orientation etc depending on the orientation of the main axis
            
            
            //container for paths
            var tvg = canvas.append("g").selectAll("g.timevine").data(data)
                .enter().append("g").attr("class", "timevine");
            //create vines using path elements
            var tvs = tvg.append("path").attr("d", function (d, i) {
                d.forEach(function (c) { c.parentIndex = i; });
                return lf(d);
            }).attr("fill", "none");
            //create event on the vines using circles
            var events = tvg.selectAll("circle.event").data(function (d) {
                return d;
            }).enter().append("circle")
                .attr("class", "event")
                .attr("cx", xFunc)
                .attr("cy", yFunc)
                .attr("r", o.eventSize());
               /* .style("fill", o.eventFill())
                .style("stroke", o.eventStroke())
                .style("stroke-width", "0.5px")*/
            
            
            return o;
        };
        
        return o;
    }
    
    d3.timevine = timevine;
}());