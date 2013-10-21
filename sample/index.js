/**
 * Example usecase of timevine layout
 * @author Patrick Oladimeji
 * @date 10/21/13 8:46:03 AM
 */
/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, d3, require, $, timevine, window, MouseEvent */
require.config({
    baseUrl: "../"
});

require([], function () {
    "use strict";
    //generate a alist of random events
    function generateData(from, to, numBranches) {
        from = from || new Date(Date.parse("2010-05-05"));
        to = to || new Date();
        numBranches = numBranches || 15;
        var maxEventPerBranch = 8;
        var span = to - from;
        
        var eventsList = d3.range(numBranches).map(function (n, i) {
            var start = new Date(from.getTime() + Math.floor(Math.random() * span));
            var extent = Math.random() * (to - start);
            var events = d3.range(1 + Math.floor(Math.random() * maxEventPerBranch)).map(function (d) {
                return new Date(start.getTime() + Math.floor(Math.random() * extent));
            });
            return events;
        });
        
        return eventsList;
    }
    //render the data
    var eventsList = generateData();
    d3.timevine(eventsList).width(1200).height(200).orient("horizontal").branches("bottom")
        .eventSize(function (d) {
            return Math.max(1, 200 / eventsList.length) / 2;
        })
        .dateFunction(function (d) {
            return d;
        }).render("#timevine");
    
});