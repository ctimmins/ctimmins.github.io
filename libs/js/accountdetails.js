function renderAccountDetails(returnVal,handler,getMainPage){
    
    $.getJSON(handler,{Mode: 'GetUserDetails'},function(returnVal)
    {  
        if(returnVal == "Fail")
            window.location = "login.html";
            
        $('html, body').css({
            'overflow': 'initial',
            'height': '100%'
        });
        
        //make this zone the active zone
        $('.active').removeClass('active');    
        $('#myaccountlink').addClass('active');
        $(window).off("resize");
        
        var acountpage = $("#accountview"), values = {IrrSystem:"",WaterSource:"",SoilType:""};
        acountpage.siblings().hide();
        $("#footer").hide();
        
        acountpage.show();
        
        var address_box = new google.maps.places.SearchBox($("#accountsettings_address")[0]);
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': returnVal["Zip"]}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            var latLng = new google.maps.LatLng(results[0].geometry.location.lat(),results[0].geometry.location.lng()), bounds = new google.maps.LatLngBounds(latLng,latLng);
            address_box.setBounds(bounds);
          };
        });
        
        $("#accountsettings_name").val(returnVal["Name"]);
        $("#accountsettings_address").val(returnVal["Address"]);
        $("#accountsettings_city").val(returnVal["City"]);
        $("#accountsettings_state").val(returnVal["State"]);
        $("#accountsettings_country").val(returnVal["Country"]);
        $("#accountsettings_zip").val(returnVal["Zip"]).mask("99999");
        $("#accountsettings_email").val(returnVal["Email"]);
        $("#accountsettings_phone").val(returnVal["Phone"]).mask("(999) 999-9999");
        $("#accountsettings_acreage").val(returnVal["Acreage"]);
        
        //dropdowns
        if (!(returnVal["Irrigation System"] == ""))
        {
            setVal($("#irrigationTypeDrop"),returnVal["Irrigation System"]);
        }
        if (!(returnVal["Water Source"] == ""))
        {
            setVal($("#waterSourceDrop"),returnVal["Water Source"]);
        }
        if (!(returnVal["Soil Type"] == ""))
        {
             setVal($("#soilTypeDrop"),returnVal["Soil Type"]);
        }
        
        $(".dropdown-menu li a").off().click(function () {
            setVal($("#"+$(this).parent().parent().attr('aria-labelledby')),$(this).text());
        });
            
        //Profile Completeness
        var profileCompleteness = 10;

        //Check Email Validation
        if(returnVal["Confirmed"] != "T")
            $("#accountsettings_emailveri").empty().html("<a style='color:#3498DB' href='#'>Please Verify your Email. Click here to resend your verification email.</a>").click(function()
            {
                $.getJSON(handler,{Mode:"ResendEmail"}, function(returnVal){
                    $.alert("Confirmation Email has been sent. If you do not receive the message, please check the spam folder and make sure roots.farm is added to your trusted senders list.","Email Sent");
                });
            });
            
        //Check Mobile Phone App
        if(returnVal["Has Mobile"] != "T")
            $("#accountsettings_mobile").empty().html("<a style='color:#3498DB' href='#'>Download our Mobile App to accurately map your fields and get mobile alerts.</a>").click(function()
           {
                $.alert("Thank you for your interest in our app! We will let you know when it is available!","Thank you");
           });;
            
        //At Least one Zone
        if(returnVal["Zones"].length < 1)
           $("#accountsettings_zoneadded").empty().html("<a style='color:#3498DB' href='#'>Please add your first zone to get personalized data!</a>").click(function()
           {
                addZone(returnVal,getMainPage);
           });     
        
        
        $(".accountInput").each(function( index ) {
            $(this).typeahead('destroy');
            $(this).parent().removeClass("has-error");
            if($(this).val() == "")
                $(this).parent().addClass("has-error");
        });
        
        var countries = new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),queryTokenizer: Bloodhound.tokenizers.whitespace,limit: 5,
          prefetch: 
          {
            url: '../libs/js/countries.json',
            filter: function(list) {return $.map(list, function(country) { return { name: country }; });}
          }
        });

        countries.initialize();
        $('#accountsettings_country').typeahead(null, {
          name: 'countries',
          displayKey: 'name',
          source: countries.ttAdapter()
        });
        
        
        function setVal(cont,text)
        {
            cont.html(text+'<span class="caret"></span>');
            if(cont.attr('id') == "waterSourceDrop")
                values.WaterSource = text;
            else if(cont.attr('id') == "irrigationTypeDrop")
                values.IrrSystem = text;
            else if(cont.attr('id') == "soilTypeDrop")
                values.SoilType = text;
        }
        
        function validateEmail(email)
        { 
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        
        $("#saveAccountDetails").off().click(function()
        {
            
            var out = {Name:$("#accountsettings_name").val(),
                        Address:$("#accountsettings_address").val(),
                        City:$("#accountsettings_city").val(),
                        State:$("#accountsettings_state").val(),
                        Country:$("#accountsettings_country").val(),
                        Zip:$("#accountsettings_zip").val(),
                        Phone:$("#accountsettings_phone").val(),
                        Acreage:$("#accountsettings_acreage").val(),
                        IrrSystem:values.IrrSystem,
                        WaterSource:values.WaterSource,
                        SoilType:values.SoilType,
                        Mode:'UpdateUserDetails'};
                
            $.getJSON(handler,out,function(returnVal)
            {
                $.alert("Information Updated","");
                getMainPage();
            });

        });
    });
}
