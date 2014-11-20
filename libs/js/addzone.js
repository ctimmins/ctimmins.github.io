function addZone(returnVal,getMainPage)
{
    var handler = '../libs/php/manager.php',
        actionButton = $("#actionbutton"),
        accoutSettings = $("#accountview"),
        dashboard = $('#dashboard'),
        overviewdiv =  $('#overview'),
        backButton = $('#back'),
        addZoneDiv = $('#addzone'),
        addZoneNameDiv = $('#newZoneName'),
        addZoneCropDiv = $('#newZoneCrop'),
        addZoneMapDiv = $('#newZoneMapHolder'),
        addZoneAddressDiv = $('#newZoneAddress'),
        zone_name = $('#zone_name'),
        zone_crop = $('#zone_crop'),
        zone_address = $('#zone_address'),
        mapHolder = $("#newZoneMap");

    backButton.off();
    addZoneDiv.siblings().hide();

    addZoneCropDiv.hide();
    addZoneNameDiv.hide();
    addZoneMapDiv.hide();
    addZoneAddressDiv.hide();
    addZoneDiv.show();
    $(".navbar").show();
    actionButton.off();
    
    zone_name.val("");
    zone_crop.val("");
    zone_address.val("");
    
    $('.zoneAddField').off().keypress(function (e) 
    {
      if (e.which == 13)
        actionButton.click();
    });
    
    //make sure map is the right size
    $(window).off("resize").resize(function () 
    { 
        if( $(window).width() < 768)
            mapHolder.animate({height:$(window).height()-280},0);
        else
            mapHolder.animate({height:$(window).height()-230},0);
    });
    
    $(window).trigger('resize'); 
        
    var crops = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),queryTokenizer: Bloodhound.tokenizers.whitespace,limit: 5,
      prefetch: 
      {
        url: handler+'?Mode=GetCrops',
        filter: function(list) {return $.map(list, function(crop) { return { name: crop }; });}
      }
    });

    crops.initialize();
    zone_crop.typeahead('destroy').typeahead(null, {
      name: 'crops',
      displayKey: 'name',
      source: crops.ttAdapter()
    });
    
    
    var drawingOptions = {
            drawingMode: google.maps.drawing.OverlayType.POLYGON,
            drawingControl: false,
            polygonOptions:{
                fillColor: "#FF00FF",
                strokeColor: "#FFFFFF",
                editable: true,
                clickable: false
            },
            drawingControlOptions: {
              position: google.maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
              ]
            }
        },
       
    instructions = '<iframe width="560" height="315" src="//www.youtube.com/embed/HA2v_rTQInY" frameborder="0" allowfullscreen></iframe>',

    map,drawingManager;

    $("#footer").show();
    
    $("#resetmap").click(function()
    {
        //Reset
        genMap();
    });
    
    $("#helpbtn").click(function()
    {
        $.alert(instructions,"Instructions");
            window.setTimeout(function () {
              $("#instpic").height($("#instpic").prev().height());
            },300);
    });
    
    
    //Generate the Map
    getName();

    function getCrop()
    {
        addZoneCropDiv.show();
        addZoneNameDiv.hide();
        addZoneMapDiv.hide();
        addZoneAddressDiv.hide();
        zone_crop.focus();
        actionButton.off().show().html("Next").click(function(){
            if(zone_crop.val() != "")
                getAddress();
            else
                $.alert("Please let us know what crop you are growing here!", "Hold on there!");
        });
    }
    
    function getName()
    {
        addZoneCropDiv.hide();
        addZoneNameDiv.show();
        addZoneMapDiv.hide();
        addZoneAddressDiv.hide();
        zone_crop.focus();
        actionButton.off().show().html("Next").click(function(){
            if(zone_name.val() != "")
                getCrop();
            else
                $.alert("Please Enter a name for your zone!", "Hold on there!");
        });
    }
    
    function getAddress()
    {
        addZoneAddressDiv.show();
        addZoneCropDiv.hide();
        addZoneNameDiv.hide();
        addZoneMapDiv.hide();
        if(returnVal.address != "")
            zone_address.val(returnVal.Address);
        else
            zone_address.val(returnVal.City+", "+returnVal.State+", "+ returnVal.Zip);
            
        zone_address.focus();
        
        var address_box = new google.maps.places.SearchBox(zone_address[0]);
        
        actionButton.off().show().html("Next").click(function(){
        
            //In case the remove everything, put back the original stuff
            if(zone_crop.val() == "")
                zone_address.val(returnVal.City+", "+returnVal.State+", "+ returnVal.ZipCode);
                
            genMap();
        });
    }
    
    function genMap()
    {
        addZoneCropDiv.hide();
        addZoneNameDiv.hide();
        addZoneMapDiv.show();
        actionButton.hide();
        addZoneAddressDiv.hide();
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({"address": zone_address.val()}, function(results) 
        {
            var Lat,Long;
                
            if(typeof results[0] == "undefined")
            {
                $.getJSON(handler,{Zip:returnVal.ZipCode,Mode:"ZipToLatLon"}, function(returnVal){
                    Lat = returnVal.Lat, Long = returnVal.Long;
                    render();
                });
            }
            else
            {
                Lat = results[0].geometry.location.lat(), Long = results[0].geometry.location.lng();
                render();
            }
            
            function render()
            {
                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.SATELLITE,
                    center: new google.maps.LatLng(Lat, Long),
                    zoom: 17,
                    tilt:0,
                };
           
                map = new google.maps.Map(document.getElementById('newZoneMap'),mapOptions);
                drawingManager = new google.maps.drawing.DrawingManager(drawingOptions);
                drawingManager.setMap(map);
                
                google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                    drawingManager.setDrawingMode(null);
                    //Action Button
                    actionButton.off().show().html("Save").click(function(){
                        saveData(event);
                    });
                });

                google.maps.event.trigger(map, "resize");
                
                var bounds = map.getBounds(),
                    input = $('<input class="pac-input" class="controls" type="text" value="'+zone_address.val()+'">'),
                    searchBox = new google.maps.places.SearchBox(input[0]);
                
                searchBox.setBounds(bounds);
                
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[0]);
        
                google.maps.event.addListener(searchBox, 'places_changed', function() {
                    var location, places = searchBox.getPlaces();
                    for (var i = 0, place; place = places[i]; i++) {
                        location = place.geometry.location;
                    }
                    map.setCenter(location);
                    map.setTilt(0); 
                });
            }

        });

    }
    
    function saveData(event)
    {
        var path = event.overlay.getPaths().getAt(0), i = 0,
            pathList=[],center,bounds;
        $.each(path, function()
        {
            try
            {
                pathList.push([path.getAt(i).lat(),path.getAt(i).lng()]);
                i++;
            }
            catch(e)
            {}
        });
        
        bounds = new google.maps.LatLngBounds();
        for (i = 0; i<pathList.length; i++) {
           bounds.extend(new google.maps.LatLng(pathList[i][0], pathList[i][1]));
        }
        center = bounds.getCenter();
        
        if(zone_name.val() == "" || zone_crop.val() == "")
        {
            $.alert("Sorry, something went wrong! Please try again", ":(");
            addZone(returnVal,getMainPage)
        }
        else
        {
            $.getJSON(handler,{Name:zone_name.val(),Crop:zone_crop.val(),Lat:center.lat(),Long:center.lng(),Border:pathList.join(";"),Mode:"CreateZone"}, function(returnVal){
                if(returnVal == "Success")
                {
                    zone_name.val("");
                    zone_crop.val(""); 
                    getMainPage();
                }
                else
                {
                    $.alert("Please Log In Again","Security Time Out");
                    window.location = "login.html";
                }
            });
        }
    }
}