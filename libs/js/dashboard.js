$(document).ready(function() {
    
    var loadingTimer, pleaseWaitDiv = $('#loading');
    $.fn.editable.defaults.mode = 'inline';
    
    //loading screens
     $(document).ajaxStart(function () {
        loadingTimer = setTimeout(function () {
            pleaseWaitDiv.modal('show');
        }, 200);
    });
    
    $.ajaxSetup({
      "error":function() { $.alert("Please Make sure you disable AdBlock on this ");  }
    });

    $(document).ajaxStop(function () {
        clearTimeout(loadingTimer);
        pleaseWaitDiv.modal('hide');
    });
    
    var handler = '../libs/php/manager.php',
        overviewdiv =  $('#overview'),
        backButton = $('#back'),
        mainMap = $("#map-canvas");

    backButton.off();
    mainMap.hide();
    getMainPage();
    
    $("#logout").click(function(){
        $.getJSON(handler,{Mode: 'Logout'}, function(returnVal)
        {
            window.location = "login.html";
        });
    });
   
    function getMainPage()
    {
        $("#footer").hide();
        $('.active').removeClass('active');
        $('#dashboardlink').addClass('active');
        
        $('html, body').css({
            'overflow': 'initial',
            'height': '100%',
        });
        
        overviewdiv.siblings().hide();
        overviewdiv.children().hide();
        //clear the zone div
        $("#zones").empty().show();
        $("#zonesidebar").empty();
         $(window).off("resize");
        
        $.getJSON(handler,{Mode: 'GetUserDetails'},function(returnVal)
        {   

            var zones = returnVal.Zones;
            if(returnVal == "Fail")
                    window.location = "login.html";
                    
            //Profile Completeness
            var profileCompleteness = 0;
            
            //check basic info
            if(returnVal["Name"] != "" && returnVal["State"] != "" && returnVal["City"] != "" && returnVal["Zip"] != "" && returnVal["Country"] != "")
                profileCompleteness += 10;
            
            //Check Email Validation
            if(returnVal["Confirmed"] == "T")
                profileCompleteness += 10;
                
            //Check Mobile Phone App
            if(returnVal["Has Mobile"] == "T")
                profileCompleteness += 10;
                
            //Check Total Acreage
            if(returnVal["Acreage"] != "")
                profileCompleteness += 10;
                
            //Check Address
            if(returnVal["Address"] != "")
                profileCompleteness += 10;
                
            //Check Soil Type
            if(returnVal["Soil Type"] != "")
                profileCompleteness += 10;
                
            //Irrigation Type
            if(returnVal["Irrigation System"] != "")
                profileCompleteness += 10;
                
            //Water Source
            if(returnVal["Water Source"] != "")
                profileCompleteness += 10;
                
            //Phone Number
            if(returnVal["Phone"] != "")
                profileCompleteness += 10;
                
            //At Least one Zone
            if(returnVal["Zones"].length > 0)
                profileCompleteness += 10;
                
            if(profileCompleteness < 30)
                $("#profileCompleteness").css({"color":"black"});
            else
                $("#profileCompleteness").css({"color":"white"});
                
            $("#myaccountlink").off().click(function()
            {
                renderAccountDetails(returnVal, handler, getMainPage);
            });

            overviewdiv.show();
            
            $("#addNewZoneButton").off().show().click(function () {
                    addNewZonePage(returnVal);
            });
            
            $("#profileCompleteness").width(profileCompleteness+"%");
            $("#profileCompleteness").html(profileCompleteness+"% Complete");
                
            $(".restart").off().click(function()
            {
                getMainPage();
            });
            
            $("#zoneslink").off().click(function()
            {
                getZoneOverview(handler,zones,getMainPage);
            });
                
            if(zones.length > 0)
           {
                //.removeClass("btn-success btn-danger btn-warning btn-info btn-primary btn-default").addClass("btn-success").html("Add new zone")
                $.each(zones, function(zone, id)
                {
                    $.getJSON(handler,{ZID: id, onlyCurrent: true, Mode: 'GetZoneOverview'}, function(returnVal)
                    {
                        if(returnVal["Status"] == "Fail")
                            window.location = "login.html";
                            
                        var zone_details = returnVal,
                            status = zone_details["Status"],
                            name = zone_details["Name"],
                            crop = zone_details["Crop"],
                            data = zone_details["Data"],
                            crop_status = zone_details["Status"],
                            Border = zone_details["Border"], 
                            Lat = zone_details["Latitude"], 
                            Long = zone_details["Longitude"];
                            
                        var mapNum = id.replace('.','');
                        

                        //initialize custom-body
                        var custombody = '<div class="row"><div class="col-md-7 col-xs-12">';

                        //build custom body
                        $.each(data, function(key, value)
                        {
                            $.each(value, function(type, value)
                            {
                                if(type == "Historical")
                                {
                                    var detail_type = key,
                                        detail_value = value.CurrentValue,
                                        detail_units = value.Units.Unit,
                                        bar_max_value = value.Units.Max,
                                        bar_min_value = value.Units.Min,
                                        detail_status = value.Status,
                                        bar_range = bar_max_value - bar_min_value,
                                        cur_value = parseInt(value.CurrentValue),
                                        bar_progress = cur_value*100/bar_range;
                                    
                                    if(bar_progress > 30)
                                    {
                                        crop_item = ([key,
                                                        '<div class="progress zone-progress" style="background: #f5f5f5; font-color:">',
                                                        '   <div class="progress-bar progress-bar-' + detail_status + ' zone-progress-bar" role="progressbar" aria-valuenow="' + detail_value + '" aria-valuemin="' +  bar_min_value + '0" aria-valuemax="' + bar_max_value + '" style="width: ' + bar_progress + '%">',
                                                        '      <div class="phoneHeader"><p>' + detail_value + ' ' + detail_units + '</p></div>',
                                                        '   </div>',
                                                        '</div>'].join(""));
                                    }
                                    else
                                    {
                                        crop_item = ([key,
                                                    '<div class="progress zone-progress" style="background: #f5f5f5; font-color:">',
                                                    '   <div class="progress-bar progress-bar-' + detail_status + ' zone-progress-bar" role="progressbar" aria-valuenow="' + detail_value + '" aria-valuemin="' +  bar_min_value + '0" aria-valuemax="' + bar_max_value + '" style="width: ' + bar_progress + '%">',
                                                    '   <div style="position:absolute;width:100%;text-align:center;" class="phoneHeader"><p>' + detail_value + ' ' + detail_units + '</p></div>',
                                                    '   </div>',
                                                    '</div>'].join(""));
                                    }
                                    custombody+=crop_item;
                                }
                            });
                        });

                        //thumbnail/Picture of farm
                        
                        
                        var thumbnail = (['</div><div class="col-md-5 hidden-xs" id="mapholder-'+mapNum+'">',
                                            '    <div class="col-xs-6 col-md-3 mapholder" style="cursor:;width:100%;height:100%;" id="map-'+mapNum+'">',
                                            '    </div>',
                                            '</div>',
                                            '    <div style="margin-top:10px" class="col-lg-6 col-lg-offset-3 col-md-6 col-md-offset-3 col-sm-12 col-xs-12">',
                                            '       <button class="btn btn-primary btn-block">View Zone Details</button>',
                                            '    </div>',].join(""));
                        custombody+=thumbnail;
                        

                        // close custom body div (remove one of the closing divs when thumbnail becomes active)
                        custombody+='</div>';

                        //build panel
                        var zonepanel = $([ '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12"> <div class="panel panel-' + crop_status + ' zone-panel">',
                                                    '   <div class="panel-heading">',
                                                    '       <div class="h5 phoneHeader">' + name + '',
                                                    '           <span style="float:right"> ' + crop + '</span>',
                                                    '       </div>',
                                                    '   </div>',
                                                    '       <div style="padding:20px">' + custombody,                                                    
                                                    '       </div>',
                                                    '</div></div>'].join(""));

                        $("#zones").append(zonepanel);
                        
                        zonepanel.off().click(function() {
                            clickZone();
                        });
                        
                        var zoneNum = mapNum, zonesidepanel = $("<li id='sidepanel"+zoneNum+"'><a>"+name+"</a></li>");
                        
                        $("#zonesidebar").append(zonesidepanel);
                        
                        zonesidepanel.off().click(function() {
                            clickZone();
                        });
                        
                        function clickZone()
                        {
                            //$.getScript('../libs/js/zonedetails.js', function () {
                                zoneDetails(handler, id, getMainPage,zoneNum);
                            //});
                        }
                        
                        $('#map-'+mapNum).empty();

                        var latLons = Border.split(";");
                        
                        var paths = [];
                        
                        for(var i = 0; i < latLons.length; i++)
                        {
                            var latlngsplit = latLons[i].split(",");
                            paths.push(new google.maps.LatLng(latlngsplit[0],latlngsplit[1]));
                        }
                        
                        var mapOptions = {
                            mapTypeId: google.maps.MapTypeId.SATELLITE,
                            center: new google.maps.LatLng(Lat, Long),
                            zoom: 14,
                            draggable: false,
                            panControl: false,
                            overviewMapControl: false,
                            scrollwheel: false,
                            disableDefaultUI: true,
                        },
                        drawingOptions = {
                            paths: paths,
                            strokeColor: '#FFFFFF',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF00FF',
                            fillOpacity: 0.35
                        },
                        
                        map = new google.maps.Map(document.getElementById('map-'+mapNum),mapOptions),
                        shape = new google.maps.Polygon(drawingOptions);
                        
                        $("#mapholder-"+mapNum).height($("#mapholder-"+mapNum).prev().height());
                        
                        shape.setMap(map);
                        
                        $(window).resize(function () 
                        { 
                            map.fitBounds(shape.getBounds());
                        });
                        
                        google.maps.event.trigger(map, "resize");
                        map.fitBounds(shape.getBounds());
                    });
                });
            }
            else
            {
                $("#zones").hide();
                $("#nozone").show();
                $("#newzonebutton").off().click(function () {
                   addNewZonePage(returnVal);
                });
            }
        });
        function addNewZonePage(returnVal)
        {
            //$.getScript('../libs/js/addzone.js', function () {
                addZone(returnVal, getMainPage);
            //});
        }

    }

});

//Golbal Function
$.alert = function(content, title)
{
    //if title is not set, then make it blank
    title = typeof title !== 'undefined' ? title : "";
    
    $('#popup').modal('show');
    $('#popup-title').html(title);
    $('#popup-content').html(content);
}

google.maps.Polygon.prototype.getBounds = function() {
    var bounds = new google.maps.LatLngBounds();
    var paths = this.getPaths();
    var path;        
    for (var i = 0; i < paths.getLength(); i++) {
        path = paths.getAt(i);
        for (var ii = 0; ii < path.getLength(); ii++) {
            bounds.extend(path.getAt(ii));
        }
    }
    return bounds;
}
