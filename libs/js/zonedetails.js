function zoneDetails(handler,id,getMainPage,zoneNum){
    //make this zone the active zone
    $('.active').removeClass('active');
    $('#footer').hide();
    $('#sidepanel'+zoneNum).addClass('active');
    $('#zoneslink').addClass('active');
    $(window).off("resize");
    
    var details = $("#detailview"),DateObj = {date1:moment().subtract('days', 3),date2:moment().add('days', 3)};
    details.siblings().hide();
    
    details.empty().show();
    
    $('html, body').css({
        'overflow': 'hidden',
        'height': '100%'
    });
    
    //Sidebar
    details.append($(['<div class="col-sm-3 col-md-2 sidebarright" style="color:black">',
                            "<span><b>Zone:</b></span>",
                            "<span id='detailsTitle'></span><br>",
                            "<span><b>Crop:</b></span>",
                            "<span id='detailsCrop'></span>",                            
                          '<ul class="nav nav-sidebar" id="dataSelect">',
                          '</ul>',
                          '<button id="removeZoneButton" class="btn btn-danger" style="width: 100%;margin-top: 20px;">Delete This Zone</button>',
                        '</div>',
                        ].join("")));
    
    //Graphs
    details.append($(([                                 
                        "<div id='graphs'>",
                            "<div style='padding-left: 5px;padding-right: 30px;' class='col-md-10'>",
                                '<div id="message">',
                                '</div>',
                                '<div class="row">',
                                    '<div class="col-md-9" style="padding-left:40px;padding-top:10px" id="historicalLegend"></div>',
                                    "<div id='daterange' class='col-md-3' style='cursor:pointer;padding-top:15px'><div class='row' id='daterangerow'><div class='col-md-12'><small id ='daterangebtn' class='btn btn-info'><i class='fa fa-calendar'></i><span>&nbsp;&nbsp;"+moment().subtract('days', 3).format("MMM DD")+" - "+moment().add('days', 3).format("MMM DD")+"&nbsp;&nbsp;</span><b class='caret'></b></small></div></div></div>",
                                '</div>',
                                '<div class="row">',
                                    '<div id="historical" style="height:500px"></div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        ].join(""))));
     
    $('#daterangebtn')
        .dateRangePicker(
        {
            format: 'YYYY-MM-DD',
            separator: ' to ',
            language: 'auto',
            startOfWeek: 'sunday',
            getValue: function()
            {
                return this.value;
            },
            setValue: function(s)
            {
                this.value = s;
            },
            startDate: false,
            endDate: moment().add('days', 8).format("YYYY-MM-DD"),
            minDays: 0,
            maxDays: 0,
            showShortcuts: true,
            time: {
                enabled: false
            },
            showShortcuts: false,
            customShortcuts : [],
            inline:false,
            container: 'body', 
            alwaysOpen:false,
            singleDate:false,
            batchMode:false,
        })
        .bind('datepicker-change',function(event,obj)
        {
            DateObj = obj;
            DateObj.change = true;
        })
        .bind('datepicker-close',function()
        {
            if(DateObj.change)
            {
                DateObj.change = false;
                $("#daterangebtn").html("<i class='fa fa-calendar'></i><span>&nbsp;&nbsp;"+moment(DateObj.date1).format("MMM DD")+" - "+moment(DateObj.date2).format("MMM DD")+"&nbsp;&nbsp;</span><b class='caret'></b>");
                generateData(moment(DateObj.date1).format("YYYY-MM-DD"),moment(DateObj.date2).format("YYYY-MM-DD"));
            }
        });
    
    generateData(moment().subtract('days', 3).format("YYYY-MM-DD"),moment().add('days', 3).format("YYYY-MM-DD"));
    
    function generateData(start,end)
    {    
        $.getJSON(handler,{ZID: id, Start:start, End:end, onlyCurrent: false, Mode: 'GetZoneOverview'}, function(returnVal)
        {
            if(returnVal["Status"] == "Fail")
                window.location = "login.html";
                            
            var zone_details = returnVal,
                groups = [],
                groupsValue = {},
                status = zone_details["Status"],
                name = zone_details["Name"],
                crop = zone_details["Crop"],
                data = zone_details["Data"],
                crop_status = zone_details["Status"],
                Border = zone_details["Border"], 
                Lat = zone_details["Latitude"], 
                Long = zone_details["Longitude"],
                HasSensors = zone_details["Sensor"],
                title = $("#detailsTitle"),
                croptitle = $("#detailsCrop");
            
            title.empty().append($("<p class='phoneHeader' style='display: inline; margin-left:15px; cursor:pointer; color: #000'>"+name+" <i class='fa fa-edit'></i></p>")
                .editable({
                    placement: 'bottom',
                    type: 'text',
                    showbuttons: 'bottom',
                    url: function(params){
                        var d = new $.Deferred;
                        if(params.value === '')
                            return d.reject('Please Type a New Name');
                        $.getJSON(handler,{ZID: id, Name: params.value, Mode: 'UpdateZone'}, function(returnVal)
                        {
                            d.resolve();
                        });
                        return d.promise();
                    },
                })
            );
            
            var crops = new Bloodhound({
              datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),queryTokenizer: Bloodhound.tokenizers.whitespace,limit: 5,
              prefetch: 
              {
                url: handler+'?Mode=GetCrops',
                filter: function(list) {return $.map(list, function(crop) { return { name: crop }; });}
              }
            });

            crops.initialize();

            croptitle.empty().append($("<p class='phoneHeader' style='display: inline; margin-left:15px; cursor:pointer; color: #000'>"+crop+" <i class='fa fa-edit'></i></p>")
                .editable({
                    placement: 'bottom',
                    type: 'text',
                    showbuttons: 'bottom',
                    url: function(params){
                        var d = new $.Deferred;
                        if(params.value === '')
                            return d.reject('Please Type a New Name');
                        $.getJSON(handler,{ZID: id, Crop: params.value, Mode: 'UpdateZone'}, function(returnVal)
                        {
                            d.resolve();
                        });
                        return d.promise();
                    },
                    typeahead: {
                        name: 'crops',
                        displayKey: 'name',
                        source: crops.ttAdapter()
                    }
                })
            );
            
            //Sensor Selector Dropdown
            var sensorIds = [], selectedSensor = "allsensors", selectedData = "";
            if(HasSensors == "T" && $("#sensorSelectorDrop").length == 0)
            {
                $("#daterangerow").append('<div class="col-md-12" id="sensorselectorcont" style="margin-top:10px"><div class="dropdown"><button class="btn dropdown-toggle btn-info" type="button" id="sensorSelector" data-toggle="dropdown">All Sensors<span class="caret"></span></button><ul class="dropdown-menu" role="menu" aria-labelledby="sensorSelector" id="sensorSelectorDrop"><li role="presentation"><a role="menuitem" tabindex="-1" id="allsensors">All Sensors</a></li></ul></div></div>');
            }
            
            $("#sensorSelectorDrop").empty();
            
            //Build Data Groups
            $.each(data, function(key, value)
            {
                $.each(value, function(type, value)
                {  
                    if(type == "Sensor")
                    {
                        $.each(value, function(nodeID, value)
                        {
                            if(_.indexOf(sensorIds, nodeID) < 0)
                            {
                                $("#sensorSelectorDrop").append('<li rel="0"><a id="'+nodeID+'">'+value.Name+'</a></li>');
                                sensorIds.push(nodeID);
                            }
                            if (_.findWhere(groups, value.Group) == null)
                            {
                                groups.push(value.Group);
                                groupsValue[value.Group] = {};
                            }
                            if(groupsValue[value.Group][type] == null)
                                groupsValue[value.Group][type] = [];
                            value.Name = key + " - " + value.Name;
                            value.NodeID = nodeID;
                            groupsValue[value.Group][type].push(value);
                        });
                    }
                    else 
                    {
                        if (_.findWhere(groups, value.Group) == null)
                        {
                            groups.push(value.Group);
                            groupsValue[value.Group] = {};
                        }
                        if(groupsValue[value.Group][type] == null)
                            groupsValue[value.Group][type] = [];
                        value.Name = key;
                        groupsValue[value.Group][type].push(value);
                    }
                });
            });
            
            $("#sensorSelectorDrop li a").off().click(function () {
                selectedSensor = this.id;
                $("#sensorSelector").html($(this).text() + '<span class="caret"></span>');
                getData(selectedData);
            });
            
            $("#dataSelect").empty();
            $.each(groups, function(i)
            {
                $("#dataSelect").append($('<li role="presentation"><a role="menuitem" tabindex="-1" data-target="#'+groups[i]+'">'+groups[i]+'</a></li>'));
            });
            
            $("#dataSelect li a").off().click( function() {
                //reset color
                $("#dataSelect").find(">:first-child").css('background-color','');
                $("#dataSelect li a").css("color","#7EB0E6");
                //set this one to black
                $(this).css("color","#000");
                selectedData = $(this).text();
                getData(selectedData);
            });

            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $(window).trigger('resize');
            });
            
            $("#dataSelect").find(">:first-child").css('background-color','rgba(238, 238, 238, 1)');
            $("#dataSelect").find(">:first-child").find(">:first-child").css("color","#000");
            selectedData = groups[0];
            getData(selectedData);
            
            $("#removeZoneButton").off().click(function () {
                removeZone(id);
            });
            
            function removeZone(id)
            {
                if (window.confirm("Are you sure you want to remove this zone? You can't undo this action!")) {
                    $.getJSON(handler,{ZID: id, Mode: 'DeleteZone'}, function(returnVal)
                    {
                        getMainPage();
                    });
                }
            }
            
            function getData(type)
            {
                var data = groupsValue[type],

                options = {
                    grid: {
                        borderWidth: 0,
                        minBorderMargin: 20,
                        labelMargin: 10,
                        tickColor: "#dddddd",
                        margin: {
                            top: 8,
                            bottom: 20,
                            left: 20
                        },
                        hoverable: true, 
                        clickable: false,
                    },
                    series: {
                        lines: { show: true },
                        points: { show: false },
                        shadowSize: 0,
                    },
                    xaxis: {
                        mode: "time",
                        minTickSize: [.25, "day"],
                        timeformat : "%b %d ",
                        timezone: "browser"
                    },
                    legend: { 
                        noColumns: 2,
                    },
                    tooltip: true,
                    tooltipOpts: {
                        xDateFormat: "%b %d %I:%M %p",
                        content: "%s <br> %x <br> %y",
                    },
                },
                text = "",
                usedNames = [],
                
                hist_values = [], forecast_values = [], sensor_values = [], unit, min = 9999999999, max = 0;
                
                if(HasSensors == "T")
                    options.legend.noColumns = 4;
                
                //Process Data
                if(typeof data.Historical !== 'undefined')
                {
                    $.each(data.Historical, function(type, value)
                    {
                        if(value.DisplayType == 'Range' || value.DisplayType == 'Range-Map' || value.DisplayType == 'Vector')
                        {
                            hist_values.push({label:"Public " + value.Name, data: _.zip(value.Time,value.Value)});
                            min = Math.min(value.Units.Min,min);
                            max = Math.max(value.Units.Max,max);
                            unit = value.Units.Unit;
                            if(usedNames.indexOf(value.Name) == -1)
                            {
                                text += value.Name + ": " + value.CurrentValue + value.Units.Unit + "<br>";
                                usedNames.push(value.Name);
                            }
                        }
                    });
                }
                
                if(typeof data.Forecast !== 'undefined')
                {
                    $.each(data.Forecast, function(type, value)
                    {
                        if(value.DisplayType == 'Range' || value.DisplayType == 'Range-Map' || value.DisplayType == 'Vector')
                        {
                            forecast_values.push({label:"Forecast " + value.Name, data: _.zip(value.Time,value.Value)});
                            min = Math.min(value.Units.Min,min);
                            max = Math.max(value.Units.Max,max);
                            unit = value.Units.Unit;
                            if(usedNames.indexOf(value.Name) == -1)
                            {
                                text += value.Name + ": " + value.CurrentValue + value.Units.Unit + "<br>";
                                usedNames.push(value.Name);
                            }
                        }
                    });
                }
                
                if(typeof data.Sensor !== 'undefined')
                {
                    $.each(data.Sensor, function(type, value)
                    {
                        if(value.DisplayType == 'Range' || value.DisplayType == 'Range-Map' || value.DisplayType == 'Vector')
                        {
                            if(selectedSensor != "allsensors")
                            {
                                if(selectedSensor != value.NodeID)
                                {
                                    return true;
                                }
                            }
                            sensor_values.push({label:"Sensor " + value.Name, data: _.zip(value.Time,value.Value)});
                            min = Math.min(value.Units.Min,min);
                            max = Math.max(value.Units.Max,max);
                            unit = value.Units.Unit;
                            if(usedNames.indexOf(value.Name) == -1)
                            {
                                text += value.Name + ": " + value.CurrentValue + value.Units.Unit + "<br>";
                                usedNames.push(value.Name);
                            }
                        }
                    });
                }
                
                formatYAxis = function(val, axis){
                   return val + " " + unit;
                }
                
                //Graph Settings
                
                options.yaxis = {min:min,max:max,tickFormatter:formatYAxis};
                
                $(window).off("resize").resize(function () 
                { 
                    //Graphs
                    $("#historicalLegend").empty();
                    $("#forecastLegend").empty();
                    
                    var graphValues = _.union(hist_values,forecast_values,sensor_values);
                    
                    options.legend.container = $("#historicalLegend");
                    if(_.size(graphValues) > 0)
                        var HistoricalGraph = $.plot($('#historical'), graphValues, options);
                    else
                        $('#historical').html("<div style='position: relative;top: 50%;text-align:center;transform: translateY(-50%);'>No data available in your region</div>");
                });
                
                $(window).trigger('resize');

            }
            
        });
    }
}
