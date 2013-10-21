#timevine

timevine is a  D3js plugin for rendering list of event sequences. Event sequences are an array of objects reprensenting events on a timeline. 

This visulisation was produced as part of a BBC newsHACK event in October 2013.

![Screenshot](https://github.com/thehogfather/timevine/blob/master/sample/timevine.png?raw=true)
##Usage
See `sample/` directory.


Create a new timevine
    var tv = d3.timevine().data(yourdata);
    tv.width(100).height(900).orient("vertical").branches("left");

If your event objects do not contain a date property, you need to supply an accessor function that does something to the object and returns a javascript date object.
    tv.dateFunction(function (d, i) {
        return new Date(Date.parse(d['some property in d']));
    });
    
Render the timevine
    tv.render("#divTimeVine");
    
#License
MIT-Licensed.