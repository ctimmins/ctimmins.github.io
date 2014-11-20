function renderMap(returnVal,Back,backButton,overviewdiv,mainMap)
{  

    //make sure map is the right size
    $(window).resize(function () 
    { 
        mainMap.animate({height:$(window).height()-170},0);
    });
    
    //Trigger a resize
    $(window).trigger('resize');
    
    backButton.off().click(function(){
        renderDashboard(Back.ControllerID)
    });
    //get users location from DB
    overviewdiv.siblings().hide();
    overviewdiv.show();
    mainMap.siblings().hide();
    mainMap.show();
    //render map
    var mapOptions = {zoom: 17, mapTypeId: google.maps.MapTypeId.SATELLITE, disableDefaultUI: true}, 
        map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
        
    var pos = new google.maps.LatLng(returnVal.Latitude,returnVal.Longitude);
    map.setCenter(pos);
    
    //Drag event, constantly save the center position
    google.maps.event.addListener(map, 'dragend', function()
    {
        $.getJSON(handler,{ControllerID: Back.ControllerID, Lat: map.getCenter().lat(), Long: map.getCenter().lng(),  Mode: 'UpdateControllerPosition'}, function(returnVal)
        {
            console.log(map.getCenter());
        });
    });
    
    //Render nodes on map
    $.each(returnVal.Nodes,function(index,value)
    {
        var marker = new MarkerWithLabel({
            position: new google.maps.LatLng(value.Latitude,value.Longitude),
            draggable: false,
            raiseOnDrag: false,
            map: map,
            labelContent: value.Name,
            labelAnchor: new google.maps.Point(50, 0),
            labelClass: "labels", // the CSS class for the label
            nodeID: value.ID,
            Latitude: value.Latitude,
            Longitude: value.Longitude,
        });
        
        var popup = new google.maps.InfoWindow();
        
        //Remove popup if we mouse out
        google.maps.event.addListener(marker, "mouseout", function (e){popup.close();});
        
        //latest get node Data on mouseover
        google.maps.event.addListener(marker, "mouseover", function (e) 
        { 
            var node = this;
            popup.open(map, node);
            //Show data in a popup
            var dataString = "";
            $.each(returnVal.NodeDetails[node.nodeID].Values, function(index,value)
            {
                dataString = dataString + index + ": " + value + "<br>";
            });
            //Show data in a popup
            popup.setContent(dataString);
        });
        
        //get the detailed view on click
        google.maps.event.addListener(marker, "click", function (e) 
        { 
            backButton.off().click(function(){
                renderMap(returnVal,Back);
            });
            var node = this;
            console.log(node);
            //create new "screen"
            detailsdiv.siblings().hide( "drop", { direction: "down" }, 200);
            //hide the map with the location of the node (in case an old one is using it still)
            $('#detailMap').hide();
            //show div
            detailsdiv.show( "drop", { direction: "up" }, 200, function(){graphPage()});
        });
        
    });
}