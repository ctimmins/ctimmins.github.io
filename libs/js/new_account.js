$(document).ready(function() {
    
    createAccount('../libs/php/manager.php');
    
    function createAccount(handler)
    {
        var signupscreen = $('#signup'),email,name,pass1,pass2,country,state,city,acerage="",crop = [],soiltype = "Unknown",irrdays="",irrtime="";
        
        name = getUrlVars()["name"];
        email = getUrlVars()["email"];
        pass1 = getUrlVars()["pass1"];
        pass2 = getUrlVars()["pass2"];
        autoSubmit = getUrlVars()["auto"];
        
        $.getJSON(handler,{Mode: 'GetIPInfo'}, function(returnVal)
        {
            returnVal.Country = getCode(returnVal.Country);
            
            $('#signup_email').val(email);
            $('#signup_name').val(name);
            $('#signup_pass').val(pass1);
            $('#signup_pass2').val(pass2);
            country = (returnVal.Country);
            state = (returnVal.Region);
            city = (returnVal.City);
            zip = (returnVal.Postal);
            
            $("#createAccountBtn").click(function(){

                email = $('#signup_email').val();
                name = $('#signup_name').val();
                pass1 = $('#signup_pass').val();
                pass2 = $('#signup_pass2').val();
                error = $('#error');
                
                $.each($('.signup_crop'),function(e){
                    if($(this).val() != "")
                        crop.push($(this).val());
                });
                
                if(name == "")
                {
                    error.html("Please type in your name").show();
                    scrollToTop();
                    $("#signup_name").parent().toggleClass("has-error");
                    setTimeout(function() { error.hide(); $("#signup_name").parent().toggleClass("has-error");}, 10000);
                }
                else if(!(validateEmail(email)))
                {
                    error.html("Please try another email address").show();
                    scrollToTop();
                    $("#signup_email").parent().toggleClass("has-error");
                    setTimeout(function() { error.hide(); $("#signup_email").parent().toggleClass("has-error");}, 10000);
                }
                else if(pass1 != pass2)
                {
                    error.html("Please make sure the passwords match!").show();
                    scrollToTop();
                    $("#signup_pass").parent().toggleClass("has-error");
                    $("#signup_pass2").parent().toggleClass("has-error");
                    setTimeout(function() { error.hide(); $("#signup_pass").parent().toggleClass("has-error"); $("#signup_pass2").parent().toggleClass("has-error");}, 10000);
                }
                else
                {
                    $.getJSON(handler,{Email:email,Name:name,Password1:pass1,Password2:pass2,Country:country,State:state,City:city,Zip:zip,Acreage:acerage,Crop:crop,SoilType:soiltype,IrrDays:irrdays,IrrTime:irrtime, Mode: 'CreateNewUser'}, function(returnVal)
                    {
                        if(returnVal == "Success")
                            window.location = "dashboard.html";
                        else if(returnVal == "Email")
                        {
                            $('#emailinuse').show();
                            scrollToTop();
                            $("#signup_email").parent().toggleClass("has-error");
                            setTimeout(function() { $('emailinuse').hide(); $("#signup_email").parent().toggleClass("has-error");}, 10000);
                        }
                        else
                        {
                            error.html("There was an error. Please try again later.").show();
                            scrollToTop();
                            setTimeout(function() { error.hide(); }, 5000);
                        }
                    });
                }
    
            });
            
            if(autoSubmit == "True")
            {
                $("#createAccountBtn").click();
                console.log(autoSubmit);
            }
            
        });
    }
    
    function scrollToTop(){$('html, body').animate({scrollTop: '0px'}, 'fast');}
    
    function getCode (code) {
        switch (code.toUpperCase()) {
           case "AC": code = "Ascension Island"; break;
           case "AD": code = "Andorra"; break;
           case "AE": code = "United Arab Emirates"; break;
           case "AF": code = "Afghanistan"; break;
           case "AG": code = "Antigua and Barbuda"; break;
           case "AI": code = "Anguilla"; break;
           case "AL": code = "Albania"; break;
           case "AM": code = "Armenia"; break;
           case "AN": code = "Netherlands Antilles"; break;
           case "AO": code = "Angola"; break;
           case "AQ": code = "Antarctica"; break;
           case "AR": code = "Argentina"; break;
           case "AS": code = "American Samoa"; break;
           case "AT": code = "Austria"; break;
           case "AU": code = "Australia"; break;
           case "AW": code = "Aruba"; break;
           case "AZ": code = "Azerbaijan"; break;
           case "BA": code = "Bosnia and Herzegovina"; break;
           case "BB": code = "Barbados"; break;
           case "BD": code = "Bangladesh"; break;
           case "BE": code = "Belgium"; break;
           case "BF": code = "Burkina Faso"; break;
           case "BG": code = "Bulgaria"; break;
           case "BH": code = "Bahrain"; break;
           case "BI": code = "Burundi"; break;
           case "BJ": code = "Benin"; break;
           case "BM": code = "Bermuda"; break;
           case "BN": code = "Brunei"; break;
           case "BO": code = "Bolivia"; break;
           case "BR": code = "Brazil"; break;
           case "BS": code = "Bahamas"; break;
           case "BT": code = "Bhutan"; break;
           case "BV": code = "Bouvet Island"; break;
           case "BW": code = "Botswana"; break;
           case "BY": code = "Belarus"; break;
           case "BZ": code = "Belize"; break;
           case "CA": code = "Canada"; break;
           case "CC": code = "Cocos (Keeling) Islands"; break;
           case "CD": code = "Congo, Democratic People's Republic"; break;
           case "CF": code = "Central African Republic"; break;
           case "CG": code = "Congo, Republic of"; break;
           case "CH": code = "Switzerland"; break;
           case "CI": code = "Ivory Coast"; break;
           case "CK": code = "Cook Islands"; break;
           case "CL": code = "Chile"; break;
           case "CM": code = "Cameroon"; break;
           case "CN": code = "China"; break;
           case "CO": code = "Colombia"; break;
           case "CR": code = "Costa Rica"; break;
           case "CU": code = "Cuba"; break;
           case "CV": code = "Cape Verde"; break;
           case "CX": code = "Christmas Island"; break;
           case "CY": code = "Cyprus"; break;
           case "CZ": code = "Czech Republic"; break;
           case "DE": code = "Germany"; break;
           case "DJ": code = "Djibouti"; break;
           case "DK": code = "Denmark"; break;
           case "DM": code = "Dominica"; break;
           case "DO": code = "Dominican Republic"; break;
           case "DZ": code = "Algeria"; break;
           case "EC": code = "Ecuador"; break;
           case "EE": code = "Estonia"; break;
           case "EG": code = "Egypt"; break;
           case "EH": code = "Western Sahara"; break;
           case "ER": code = "Eritrea"; break;
           case "ES": code = "Spain"; break;
           case "ET": code = "Ethiopia"; break;
           case "FI": code = "Finland"; break;
           case "FJ": code = "Fiji"; break;
           case "FK": code = "Falkland Islands (Malvina)"; break;
           case "FM": code = "Micronesia, Federal State of"; break;
           case "FO": code = "Faroe Islands"; break;
           case "FR": code = "France"; break;
           case "GA": code = "Gabon"; break;
           case "GD": code = "Grenada"; break;
           case "GE": code = "Georgia"; break;
           case "GF": code = "French Guiana"; break;
           case "GG": code = "Guernsey"; break;
           case "GH": code = "Ghana"; break;
           case "GI": code = "Gibraltar"; break;
           case "GL": code = "Greenland"; break;
           case "GM": code = "Gambia"; break;
           case "GN": code = "Guinea"; break;
           case "GP": code = "Guadeloupe"; break;
           case "GQ": code = "Equatorial Guinea"; break;
           case "GR": code = "Greece"; break;
           case "GS": code = "South Georgia and the South Sandwich Islands"; break;
           case "GT": code = "Guatemala"; break;
           case "GU": code = "Guam"; break;
           case "GW": code = "Guinea-Bissau"; break;
           case "GY": code = "Guyana"; break;
           case "HK": code = "Hong Kong"; break;
           case "HM": code = "Heard and McDonald Islands"; break;
           case "HN": code = "Honduras"; break;
           case "HR": code = "Croatia"; break;
           case "HT": code = "Haiti"; break;
           case "HU": code = "Hungary"; break;
           case "ID": code = "Indonesia"; break;
           case "IE": code = "Ireland"; break;
           case "IL": code = "Israel"; break;
           case "IM": code = "Isle of Man"; break;
           case "IN": code = "India"; break;
           case "IO": code = "British Indian Ocean Territory"; break;
           case "IQ": code = "Iraq"; break;
           case "IR": code = "Iran"; break;
           case "IS": code = "Iceland"; break;
           case "IT": code = "Italy"; break;
           case "JE": code = "Jersey"; break;
           case "JM": code = "Jamaica"; break;
           case "JO": code = "Jordan"; break;
           case "JP": code = "Japan"; break;
           case "KE": code = "Kenya"; break;
           case "KG": code = "Kyrgyzstan"; break;
           case "KH": code = "Cambodia"; break;
           case "KI": code = "Kiribati"; break;
           case "KM": code = "Comoros"; break;
           case "KN": code = "Saint Kitts and Nevis"; break;
           case "KP": code = "North Korea"; break;
           case "KR": code = "South Korea"; break;
           case "KW": code = "Kuwait"; break;
           case "KY": code = "Cayman Islands"; break;
           case "KZ": code = "Kazakstan"; break;
           case "LA": code = "Laos"; break;
           case "LB": code = "Lebanon"; break;
           case "LC": code = "Saint Lucia"; break;
           case "LI": code = "Liechtenstein"; break;
           case "LK": code = "Sri Lanka"; break;
           case "LR": code = "Liberia"; break;
           case "LS": code = "Lesotho"; break;
           case "LT": code = "Lithuania"; break;
           case "LU": code = "Luxembourg"; break;
           case "LV": code = "Latvia"; break;
           case "LY": code = "Lybia"; break;
           case "MA": code = "Morocco"; break;
           case "MC": code = "Monaco"; break;
           case "MD": code = "Modolva"; break;
           case "MG": code = "Madagascar"; break;
           case "MH": code = "Marshall Islands"; break;
           case "MK": code = "Macedonia"; break;
           case "ML": code = "Mali"; break;
           case "MM": code = "Myanmar"; break;
           case "MN": code = "Mongolia"; break;
           case "MO": code = "Macau"; break;
           case "MP": code = "Northern Mariana Islands"; break;
           case "MQ": code = "Martinique"; break;
           case "MR": code = "Mauritania"; break;
           case "MS": code = "Montserrat"; break;
           case "MT": code = "Malta"; break;
           case "MU": code = "Mauritius"; break;
           case "MV": code = "Maldives"; break;
           case "MW": code = "Malawi"; break;
           case "MX": code = "Mexico"; break;
           case "MY": code = "Maylaysia"; break;
           case "MZ": code = "Mozambique"; break;
           case "NA": code = "Namibia"; break;
           case "NC": code = "New Caledonia"; break;
           case "NE": code = "Niger"; break;
           case "NF": code = "Norfolk Island"; break;
           case "NG": code = "Nigeria"; break;
           case "NI": code = "Nicaragua"; break;
           case "NL": code = "Netherlands"; break;
           case "NO": code = "Norway"; break;
           case "NP": code = "Nepal"; break;
           case "NR": code = "Nauru"; break;
           case "NU": code = "Niue"; break;
           case "NZ": code = "New Zealand"; break;
           case "OM": code = "Oman"; break;
           case "PA": code = "Panama"; break;
           case "PE": code = "Peru"; break;
           case "PF": code = "French Polynesia"; break;
           case "PG": code = "Papua New Guinea"; break;
           case "PH": code = "Philippines"; break;
           case "PK": code = "Pakistan"; break;
           case "PL": code = "Poland"; break;
           case "PM": code = "St. Pierre and Miquelon"; break;
           case "PN": code = "Pitcairn Island"; break;
           case "PR": code = "Puerto Rico"; break;
           case "PS": code = "Palestinian Territories"; break;
           case "PT": code = "Portugal"; break;
           case "PW": code = "Palau"; break;
           case "PY": code = "Paraguay"; break;
           case "QA": code = "Qatar"; break;
           case "RE": code = "Reunion"; break;
           case "RO": code = "Romania"; break;
           case "RU": code = "Russia"; break;
           case "RW": code = "Rwanda"; break;
           case "SA": code = "Saudi Arabia"; break;
           case "SB": code = "Solomon Islands"; break;
           case "SC": code = "Seychelles"; break;
           case "SU": code = "Sudan"; break;
           case "SE": code = "Sweden"; break;
           case "SG": code = "Singapore"; break;
           case "SH": code = "St. Helena"; break;
           case "SI": code = "Slovenia"; break;
           case "SJ": code = "Svalbard and Jan Mayan Islands"; break;
           case "SK": code = "Slovakia"; break;
           case "SL": code = "Sierra Leone"; break;
           case "SM": code = "San Marino"; break;
           case "SN": code = "Senegal"; break;
           case "SO": code = "Somalia"; break;
           case "SR": code = "Suriname"; break;
           case "ST": code = "S?o Tom? and Pr?ncipe"; break;
           case "SV": code = "El Salvador"; break;
           case "SY": code = "Syria"; break;
           case "SZ": code = "Swaziland"; break;
           case "TC": code = "Turks and Ciacos Islands"; break;
           case "TD": code = "Chad"; break;
           case "TF": code = "French Southern Territories"; break;
           case "TG": code = "Togo"; break;
           case "TH": code = "Thailand"; break;
           case "TJ": code = "Tajikistan"; break;
           case "TK": code = "Tokelau"; break;
           case "TM": code = "Turkmenistan"; break;
           case "TN": code = "Tunisia"; break;
           case "TO": code = "Tonga"; break;
           case "TP": code = "East Timor"; break;
           case "TR": code = "Turkey"; break;
           case "TT": code = "Trinidad and Tobago"; break;
           case "TV": code = "Tuvalu"; break;
           case "TW": code = "Taiwan"; break;
           case "TZ": code = "Tanzania"; break;
           case "UA": code = "Ukraine"; break;
           case "UG": code = "Uganda"; break;
           case "UK": code = "United Kingdom"; break;
           case "UM": code = "US Minor Outlying Islands"; break;
           case "US": code = "United States of America"; break;
           case "UY": code = "Uruguay"; break;
           case "UZ": code = "Uzbekistan"; break;
           case "VA": code = "Vatican City"; break;
           case "VC": code = "Saint Vincent and the Grenadines"; break;
           case "VE": code = "Venezuela"; break;
           case "VG": code = "British Virgin Islands"; break;
           case "VI": code = "U.S. Virgin Islands"; break;
           case "VN": code = "Vietnam"; break;
           case "VU": code = "Vanuatu"; break;
           case "WF": code = "Wallis and Futuna Islands"; break;
           case "WS": code = "Western Samoa"; break;
           case "YE": code = "Yemen"; break;
           case "YT": code = "Mayotte"; break;
           case "YU": code = "Yugoslavia"; break;
           case "ZA": code = "South Africa"; break;
           case "ZM": code = "Zambia"; break;
           case "ZR": code = "Zaire"; break;
           case "ZW": code = "Zimbabwe"; break;
        }
        return code;
    }    
    function validateEmail(email)
    { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    
    function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

});