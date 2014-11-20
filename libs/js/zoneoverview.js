function getZoneOverview(handler,zones,getMainPage)
{
    $("#footer").hide();
    $('.active').removeClass('active');
    $('#zoneslink').addClass('active');
    
    $('html, body').css({
        'overflow': 'initial',
        'height': '100%',
    });
    
    var zoneoverview = $("#zoneoverview"), bounds = new google.maps.LatLngBounds();
    
    zoneoverview.siblings().hide();
    zoneoverview.show();
    
    var mapOptions = {
                mapTypeId: google.maps.MapTypeId.SATELLITE,
                zoom: 14,
                draggable: true,
                panControl: true,
                overviewMapControl: true,
                scrollwheel: true,
                disableDefaultUI: false,
                tilt:0,
            },
        map = new google.maps.Map(document.getElementById('overviewmap'),mapOptions);
        
    $(window).off("resize").resize(function () 
    {   
        zoneoverview.height($(window).height()-50);
        map.fitBounds(bounds);
        map.setTilt(0); 
        google.maps.event.trigger(map, "resize");
    });
    
    $(window).trigger("resize");
    
    
    $.getJSON(handler,{Mode: 'GetZoneBorders'}, function(returnVal)
    {
        if(returnVal["Status"] == "Fail")
            window.location = "login.html";
        
        console.log(returnVal);
        
        $.each(returnVal["Zones"], function(id, val)
        {
            console.log(val);
            
            var Border = val["Border"];

            var latLons = Border.split(";");
            
            var paths = [];
            
            for(var i = 0; i < latLons.length; i++)
            {
                var latlngsplit = latLons[i].split(",");
                paths.push(new google.maps.LatLng(latlngsplit[0],latlngsplit[1]));
                bounds.extend(new google.maps.LatLng(latlngsplit[0],latlngsplit[1]));
            }
            
            var drawingOptions = {
                paths: paths,
                strokeColor: '#FFFFFF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF00FF',
                fillOpacity: 0.35
            },

            shape = new google.maps.Polygon(drawingOptions);
            
            google.maps.event.addListener(shape, 'click', function (event) {
                zoneDetails(handler, id, getMainPage,id.replace('.',''));
            });

            shape.setMap(map);
            
             var marker = new MarkerWithLabel({
                position: new google.maps.LatLng(val.Latitude,val.Longitude),
                draggable: false,
                raiseOnDrag: false,
                map: map,
                labelContent: "",
                labelAnchor: new google.maps.Point(50, 0),
                labelClass: "labels", // the CSS class for the label
                Latitude: val.Latitude,
                Longitude: val.Longitude,
            });
            
            //get the detailed view on click
            google.maps.event.addListener(marker, "click", function (e) 
            {
                zoneDetails(handler, id, getMainPage,id.replace('.',''));
            });
            
            google.maps.event.trigger(map, "resize");
            map.fitBounds(bounds);
            
            
            //Render nodes on map
            if(typeof val["Nodes"] != "undefined")
            {
                $.each(val["Nodes"],function(index,value)
                {
                    var marker = new MarkerWithLabel({
                        position: new google.maps.LatLng(value.Latitude,value.Longitude),
                        draggable: false,
                        raiseOnDrag: false,
                        map: map,
                        labelContent: value.Name,
                        labelAnchor: new google.maps.Point(50, 0),
                        labelClass: "labels", // the CSS class for the label
                        nodeID: index,
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
                        var dataString = "<br>";
                        $.each(value.Data.Values, function(index,value)
                        {
                            dataString = dataString + index + ": " + value + "<br>";
                        });
                        //Show data in a popup
                        popup.setContent(dataString);
                    });
                    
                    //get the detailed view on click
                    google.maps.event.addListener(marker, "click", function (e) 
                    { 
                    });
                });
            }
        });
    });
    
    
}