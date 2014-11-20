function graphPage(detailTitle,detailGraphs){

    var
    detailTitle = $('#detailsTitle'),
    detailGraphs = $('#graphs'),    
    DaySelect = $('#DaySelect'),
    MonthSelect = $('#MonthSelect'),
    ThreeMonthsSelect = $('#ThreeMonthsSelect'),
    SixMonthsSelect = $('#SixMonthsSelect'),
    YearSelect = $('#YearSelect'),
    WeekSelect = $('#WeekSelect')
    OneDay = "OneDay",
    OneWeek = "OneWeek",
    OneMonth = "OneMonth",
    ThreeMonths = "ThreeMonths",
    SixMonths = "SixMonths",
    OneYear = "OneYear";

    detailTitle.empty().append(
        $("<p class='nodeName'>"+node.labelContent+" <i class='fa fa-edit'></i></p>")
            .editable({
                type: 'text',
                url: function(params){
                    var d = new $.Deferred;
                    if(params.value === '')
                        return d.reject('Please Type a New Name');
                    $.getJSON(handler,{NodeID: node.nodeID, Name: params.value, Mode: 'UpdateNodeName'}, function(returnVal)
                    {
                        d.resolve();
                    });
                    return d.promise();
                },
            })
            .click(function()
            {
                $('#detailMap').show().css('height','300px');
                var mapOptions2 = {zoom: 17, mapTypeId: google.maps.MapTypeId.SATELLITE, disableDefaultUI: true},
                map2 = new google.maps.Map(document.getElementById('detailMap'),mapOptions2),
                pos2 = new google.maps.LatLng(node.Latitude,node.Longitude),
                marker2 = new google.maps.Marker({
                    position: pos2,
                    draggable:true,
                });

                // To add the marker to the map, call setMap();
                marker2.setMap(map2);
                map2.setCenter(pos2);   
                
                google.maps.event.addListener(marker2, "dragend", function () 
                {
                    $.getJSON(handler,{NodeID: node.nodeID, Lat: marker2.getPosition().lat(), Long: marker2.getPosition().lng(),  Mode: 'UpdateNodePosition'}, function(returnVal)
                    {
                        node.Latitude = marker2.getPosition().lat();
                        node.Longitude = marker2.getPosition().lng();
                    });
                });
                
            })
    );
            
    //render map for node position
    
    
    DaySelect.click(function(e){changeRangeSelected(this, OneDay)});
    WeekSelect.click(function(e){changeRangeSelected(this, OneWeek)});
    MonthSelect.click(function(e){changeRangeSelected(this, OneMonth)});
    ThreeMonthsSelect.click(function(e){changeRangeSelected(this, ThreeMonths)});
    SixMonthsSelect.click(function(e){changeRangeSelected(this, SixMonths)});
    YearSelect.click(function(e){changeRangeSelected(this, OneYear)});
    
    
    function changeRangeSelected(Button, Duration)
    {
        $('.durationSelect').removeClass().addClass("presetdateSelector durationSelect");
        $(Button).parent().addClass("active");
        $(Button).parent().removeClass("presetdateSelector");
        genGraphs(node.nodeID, Duration, "" , "" , detailGraphs);
    }
    
    //Default setting is one week of data 
    genGraphs(node.nodeID, OneWeek, "", "", detailGraphs);
}


function genGraphs(NodeID, Duration, Start, End, detailGraphs)
{
    detailGraphs.empty().append('<div id="loading" class="col-md-4 col-md-offset-4 col-sm-12 col-xs-12 col-lg-4 col-lg-offset-4 h2 text-center">Loading</div>');
    $.getJSON(handler,{NodeID: NodeID, Duration: Duration, Start: Start, End: End, Mode: 'HistoricalNodeData'}, function(returnVal)
    {

            var MoistureValues = new google.visualization.DataTable(), 
                AirTempValues = new google.visualization.DataTable(), 
                SoilTempValues = new google.visualization.DataTable(),
                MoistureValuesOptions = 
                {
                    vAxis: {maxValue: 1, minValue: 0, format:'###%'},
                    hAxis: {format:'MMM dd yyyy hh:mm'},
                    legend: {position: 'none'},
                    height: 500,
                    colors: ['#428bca'],
                    
                },
                AirTempValuesOptions =
                {
                    vAxis: {maxValue: 150, minValue: -10, format:'### \u00B0F'},
                    hAxis: {format:'MMM dd yyyy hh:mm'},
                    legend: {position: 'none'},
                    height: 500,
                     colors: ['#428bca'],   
                },
                SoilTempValuesOptions = 
                {
                    vAxis: {maxValue: 150, minValue: -10, format:'### \u00B0F'},
                    hAxis: {format:'MMM dd yyyy hh:mm'},
                    legend: {position: 'none'},
                    height: 500,
                    colors: ['#428bca'],
                },
                MoistureChart,AirTempChart,SoilTempChart;
                
            MoistureValues.addColumn('datetime','Time');
            MoistureValues.addColumn('number','Moisture Level');
            
            AirTempValues.addColumn('datetime','Time');
            AirTempValues.addColumn('number','Air Temperature');             
            
            SoilTempValues.addColumn('datetime','Time');
            SoilTempValues.addColumn('number','Soil Temperature');


            $.each(returnVal, function(index, value){
                var date = new Date(0);
                date.setUTCSeconds(value["Time"]);
                MoistureValues.addRow([date,value["Moisture"] / 100]);
                AirTempValues.addRow([date,value["Air Temp"]]);
                SoilTempValues.addRow([date,value["Ground Temp"]]);
            });
            
            detailGraphs.empty();
            
            //Moisture
            detailGraphs.append('<div class="h3 text-center" style="border-bottom: #999 2px solid">Moisture Levels<div id="moisture" style="margin:20px 20px 50px 20px"></div></div>');
            MoistureChart = new google.visualization.LineChart(document.getElementById('moisture'));
            
            
            //Air Temp
            detailGraphs.append('<div class="h3 text-center" style="border-bottom: #999 2px solid">Air Temperatures<div id="airtemp" style="margin:20px 20px 50px 20px"></div></div>');
            AirTempChart = new google.visualization.LineChart(document.getElementById('airtemp'));
           
            
            //Soil Temp
            detailGraphs.append('<div class="h3 text-center" style="border-bottom: #999 2px solid">Soil Temperatures<div id="soiltemp" style="margin:20px 20px 50px 20px"></div></div>');
            SoilTempChart = new google.visualization.LineChart(document.getElementById('soiltemp'));
            
            
            //Draw Function with resize support
            $(window).resize(function () 
            { 
                MoistureChart.draw(MoistureValues, MoistureValuesOptions);
                AirTempChart.draw(AirTempValues, AirTempValuesOptions);
                SoilTempChart.draw(SoilTempValues, SoilTempValuesOptions);
            });
            //Trigger a resize to draw
            $(window).trigger('resize');
            $(window).trigger('resize');

    });
}