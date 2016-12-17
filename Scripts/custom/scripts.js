// JavaScript


/*
 * Google Map with multiple markers
 */

var initializeMap = function (id) {
    var i, infowindow, locations, map, mapOptions, marker, _results;

    /* Settings */
    // Custom image marker
    // image = "assets/img/custom_icon.png"

    // Map Options
    mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(-36.7849733, 174.3546051),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false
    };

    // Markers
    locations = [
      [
        "<h5>Albany</h5> Your address<br/> Your town", // Popup text
        -36.7346287, 174.6991812,
        100 // Z-index position of the marker
      ],
      [
        "<h5>Takapuna</h5> Your address<br/> Your town",
        -36.7863996, 174.7639999,
        100
      ],
      [
        "<h5>Mt Eden</h5> Your address<br/> Your town",
        -36.883794, 174.7528696,
        100
      ],
       [
        "<h5>Mt Albert</h5> Your address<br/> Your town",
        -36.8864886, 174.7164828,
        100
       ]
    ];
    /* End Settings */

    // Initialize the map with options (inside #map element)
    map = new google.maps.Map(document.getElementById(id), mapOptions);

    // Initialize the pop up
    infowindow = new google.maps.InfoWindow();

    // Add a marker and a popup for each locations
    marker = void 0;
    i = 0;
    _results = [];
    while (i < locations.length) {
        // Marker
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            zIndex: locations[i][3],
            map: map,
            // icon: image
        });
        // Pop Up
        google.maps.event.addListener(marker, "click", (function (marker, i) {
            return function () {
                infowindow.setContent(locations[i][0]);
                infowindow.open(map, marker);
            };
        })(marker, i));
        _results.push(i++);
    }


    return _results;


};

// You can also show the map into another element
// google.maps.event.addDomListener window, "load", initializeMap("map-2")

// #region Login, Create Login
// button create login - 'Register here'
function showCreateLogin() {
    $(".create-login").show();
    $('#login-dialog').modal('show');
}

function hideCreateLogin() {
    $(".create-login").hide();
}

function hideForgotPassword() {
    $("#forgotpassword").hide();
}

// show login modal
function ShowLoginModal() {
    $('#forgotpassword').modal('hide');
    $('#login-dialog').modal('show');
    $('#register-dialog').modal('hide');
}

function hideLoginModal() {
    $('#login-dialog').modal('hide');
}

// forgot password submit
function submitForgotPassword() {
    if (!$('.errorMessage').is(':visible')) {
        $('#forgotpassword form fieldset').hide();
        $('#emailconfirmationtext').show();
        $('#forgotpasswordtext').hide();
        $('#continue').css('display', 'block');
        $('#forgotpasswordsubmit,.passwordcancle').css('display', 'none');
    }
}

function clearForgotPassword() {
    $('#forgotpassword form fieldset').show();
    $('#emailconfirmationtext').hide();
    $('#forgotpasswordtext').show();
    $('#continue').css('display', 'none');
    $('#forgotpasswordsubmit,.passwordcancle').css('display', 'block');
}



//#endregion

// Qquery
// login modal dialog - email field autofocus when modal shown
$(document).on('shown.bs.modal', function (e) {
    // email login
    $('#loginEmail').focus();

    // email forgot password
    $('#EmailInput').focus();

    // first name register
    $("#CreateLoginFirstName").focus();
});


$(document).ready(function () {

    var StoreSelected = $();
    var PickupSelected = $();
    var DeliverySelected = $();
    var ChooseATime = $();
    var ProductItem = $();
    var ProductItem = $();
    var ProductTitle = $();
    var CustomisePizza = "false";

    // Just browse the menu
    $(".browse-menu").click(function () {
        window.location = "order-page-1-detailed.html";
    });

    // Resets
    function resetOrderType() {
        $(".wait-time-pickup").hide();
        $(".wait-time-delivery").hide();
        $(".choose-time").hide();
        $(".available-delivery-times").hide();
        $(".store-availble-continue").hide();
    }

    // Select order type
    function setOrderType(e) {
        $(".browse-menu").removeClass("order-type-selected");
        $(".pickup").removeClass("order-type-selected");
        $(".delivery").removeClass("order-type-selected");
        $(e).addClass("order-type-selected");
        $(".choose-region").show();
        $(".browse-menu div a i").show();
        $(".order-type div a i").removeClass("selected");
        $(".order-type div a.select-time-now i").addClass("selected");
    }
    // Conticne with order
    function contineWithOrder() {
        $(".store-availble-continue").show();
    }
    // Pickup now
    $(".pickup").click(function () {
        resetOrderType();
        setOrderType(this);
        $(".wait-time-pickup").show();
    });
    $(".pickup, .pickup a").click(function () {
        PickupSelected = "true";
        DeliverySelected = "false";
    });

    // Delivery now
    $(".delivery").click(function () {
        resetOrderType();
        setOrderType(this);
        $(".wait-time-delivery").show();
        $(".available-delivery-times").show();
    });
    $(".delivery, .delivery a").click(function () {
        PickupSelected = "false";
        DeliverySelected = "true";
    });

    // Pick or delivery, user chooses
    $(".order-type div a").click(function () {
        resetOrderType();
        setOrderType($(this).closest("div"));
        $(".order-type div a i").removeClass("selected");
        $(this).find("i").addClass("selected");
        var ChooseTime = "false";
        event.stopPropagation();

    });

    // Pick or delivery, user chooses now
    $(".order-type div a.select-time-now").click(function () {
        ChooseATime = "no";
        if (PickupSelected != "false" && StoreSelected == "yes") {
            $(".wait-time-pickup").show();
        }
        if (DeliverySelected != "false" && StoreSelected == "yes") {
            $(".wait-time-delivery").show();
            $(".available-delivery-times").show();
        }
        contineWithOrder();
    });

    // Pickup or delivery, user chooses later
    $(".order-type div a.select-time-later").click(function () {
        ChooseATime = "yes";
        if (PickupSelected != "false" && StoreSelected == "yes") {
            $(".wait-time-pickup").show();
            $(".choose-time").show();
        }
        if (DeliverySelected != "false" && StoreSelected == "yes") {
            $(".wait-time-delivery").show();
            $(".choose-time").show();
            $(".available-delivery-times").show();
        }
        contineWithOrder();
    });

    // Choose region
    $(".choose-region select").on('change', function () {
        resetOrderType();
        $(".choose-store").show();

    });

    // Choose store
    $(".choose-store select").on('change', function () {
        resetOrderType();
        StoreSelected = "yes";
        $(".store-details").show();



        if (PickupSelected != "false") {
            $(".wait-time-pickup").show();
            if (ChooseATime == "yes") {
                $(".choose-time").show();
            }
        }

        if (DeliverySelected != "false") {
            $(".wait-time-delivery").show();
            $(".available-delivery-times").show();
            if (ChooseATime == "yes") {
                $(".choose-time").show();
            }

        }
        contineWithOrder();
    });

    $(".toggle-map").click(function () {

        $(".google-map").toggle();
        google.maps.event.trigger(map, "resize");
        map.setCenter(new google.maps.LatLng(-36.8630231, 174.8654691));
    });

    // Card flip
    $(document).on("click", ".flip-me, .card h2, .card h3", function () {
        $(this).closest(".card").find(".back").toggle();
        $(this).closest(".card").find(".front").toggle();
        $(this).closest(".card").toggleClass("flipped");
        event.stopPropagation();
    });

    $(".back .title").click(function () {
        $(this).closest(".card").find(".back").toggle();
        $(this).closest(".card").find(".front").toggle();
        $(this).closest(".card").toggleClass("flipped");
        event.stopPropagation();

    });

    //$(".flip-me").next().click(function(){
    //$(this).closest(".card").toggleClass("flipped");event.stopPropagation();
    //return false;
    //});

    // Filter products

    $(".deals-page .product-filter button").click(function () {
        window.location = "order-page-1-detailed.html";
    });

    $(".product-filter button").click(function () {
        $(this).toggleClass("btn-primary");
        $(this).toggleClass("btn-info");
        $(".product-filter .btn-filter-all").removeClass("filter-all");
    });


    $(".product-filter .btn-filter-all").click(function () {
        $(".product-filter button").removeClass("btn-primary");
        $(".product-filter button").addClass("btn-info");
        $(this).removeClass("btn-info");
        $(this).addClass("filter-all");
    });

    $(".btn-filter").click(function () {
        $(this).toggleClass("filter-active");
        if (!$(".btn-filter").hasClass("initialise-filter")) {
            $(".list-pizzas").hide();
            $(".list-new").hide();
            $(".list-deals").hide();
            $(".list-sides").hide();
            $(".list-favourites").hide();
            $(".btn-filter").addClass("initialise-filter");
        }

        if (!$(".btn-filter").hasClass("filter-active")) {
            $(".list-pizzas").show();
            $(".list-new").show();
            $(".list-deals").show();
            $(".list-sides").show();
            $(".list-favourites").show();

            $(".btn-filter-all").addClass("filter-all");

        }
    });

    $(".btn-filter-all").click(function () {
        $(".list-pizzas").show();
        $(".list-new").show();
        $(".list-deals").show();
        $(".list-sides").show();
        $(".list-favourites").show();
        $(".btn-filter").removeClass("filter-active");
        $(".btn-filter").removeClass("initialise-filter");
    });

    $(".btn-filter-pizzas").click(function () {
        if ($(this).hasClass("btn-info"))
            $(".list-pizzas").hide();
        else
            $(".list-pizzas").show();
    });

    $(".btn-filter-new").click(function () {
        if ($(this).hasClass("btn-info"))
            $(".list-new").hide();
        else
            $(".list-new").show();
    });

    $(".btn-filter-deals").click(function () {
        if ($(this).hasClass("btn-info"))
            $(".list-deals").hide();
        else
            $(".list-deals").show();
    });

    $(".btn-filter-sides").click(function () {
        if ($(this).hasClass("btn-info"))
            $(".list-sides").hide();
        else
            $(".list-sides").show();
    });

    $(".btn-filter-favourites").click(function () {
        if ($(this).hasClass("btn-info"))
            $(".list-favourites").hide();
        else
            $(".list-favourites").show();
    });

    // Add deal
    $(".choose-deals .product .btn-default").click(function () {

        $(this).closest(".card").find(".deal-select").toggle();

        if ($(this).text() == "Remove from deal") {

            $(this).closest(".card").find(".btn-customise").text("Add");
        }
        else {
            $(this).closest(".card").find(".btn-customise").text("Remove from deal");
        }
    });

    // Set side panel height
    $(".side-panel").css("height", $(document).height());

    // Add to favourites
    $(".add-to-favourites").click(function () {
        var ProductTitle = $(this).closest(".face").find("h2").text();
        //$("#my-favourites").find("input").attr("value", ProductName);
        if ($(this).find('i').text() == "Add to my favourites") {
            $(this).find('i').text("Remove from my favourites");
            $(this).find('span').toggleClass("fa-heart");
            $(this).find('span').toggleClass("fa-heart-o");
        }
        else {
            $(this).find('i').text("Add to my favourites");
            $(this).find('span').toggleClass("fa-heart");
            $(this).find('span').toggleClass("fa-heart-o");
        }
    });

    // Add "Cart" to favourites
    $(".add-cart-to-favourites").click(function () {
        //$("#my-favourites").find("input").attr("value", ProductName);
        if ($(this).find('i').text() == "Add cart to favourites") {
            $(this).find('i').text("Remove cart from favourites");
            $(this).find('span').toggleClass("fa-heart");
            $(this).find('span').toggleClass("fa-heart-o");
        }
        else {
            $(this).find('i').text("Add cart to favourites");
            $(this).find('span').toggleClass("fa-heart");
            $(this).find('span').toggleClass("fa-heart-o");
        }
    });

    // Edit "Cart items" 
    $(".cart .edit").click(function () {
        //Set vars
        var ProductTitle = $(this).closest("tr").find(".cart-item-name").text();
        CustomisePizza = "true";
        // Hide and deselect stuff
        $(".side-panel .tab").removeClass("tab-selected");
        $(".cart").hide();
        $(".pickup-delivery").hide();
        $(".select-pizza-to-customise").hide();
        // Show and select stuff
        $(".side-panel").addClass("side-panel-open");
        $(".tab-customise-pizza").addClass("tab-selected");
        $(".customise-pizza").show();
        $(".customise-pizza").find("h1").text(ProductTitle);
    });

    // Add to favourites - Sidepanel rename
    $(".customise-pizza .add-custom-to-favourites").click(function () {
        var ProductItem = $(this);
        var ProductTitle = $(this).closest(".customise-pizza").find("h1.title").text();
        $("#my-favourites").find("input").attr("value", ProductTitle);

        $('#my-favourites').modal('show');


    });

    /*
	// Save to favourites - Sidepanel rename
	$(".btn-sav-to-favourites").click(function() {
		var FavsBtn = $(".customise-pizza .add-custom-to-favourites");
		if ($(FavsBtn).find('i').text() == "Add to my favourites") {
       		$(FavsBtn).find('i').text("Remove from my favourites");
			$(FavsBtn).find('span').toggleClass("fa-heart");
			$(FavsBtn).find('span').toggleClass("fa-heart-o");
		}
    	else {
      		 $(FavsBtn).find('i').text("Add to my favourites");
			$(FavsBtn).find('span').toggleClass("fa-heart");
			$(FavsBtn).find('span').toggleClass("fa-heart-o");
		}
	});
	*/

    // Customise now - open side panel
    $(".product .btn-customise, .product img").click(function () {

        //var sidePanelTop = $('.side-panel').offset().top;
        //alert (sidePanelTop);


        $('.customise-pizza .btn-add-to-cart').text('Update cart');


        //Set vars
        var ProductTitle = $(this).closest(".face").find("h2").text();

        CustomisePizza = "true";
        // Hide and deselect stuff
        $(".side-panel .tab").removeClass("tab-selected");
        $(".cart").hide();
        $(".pickup-delivery").hide();
        $(".select-pizza-to-customise").hide();

        // Show and select stuff
        //$(".side-panel").css("top", 200);
        $(".side-panel").css("top", $('.side-panel').offset().top);
        $(".side-panel").css("right", $('.side-panel').offset().right);


        $(".side-panel").addClass("side-panel-open");
        $(".side-panel").addClass("side-panel-transition");




        $(".tab-customise-pizza").addClass("tab-selected");
        $(".customise-pizza").show();
        $(".customise-pizza").find("h1.title").text(ProductTitle);



    });

    // Customise now - Add to cart
    $(".btn-add-to-cart").click(function () {
        CustomisePizza = "false";
        $(".customise-pizza").hide();
        $(".cart").show();
        $(".side-panel .tab").removeClass("tab-selected");
        $(".side-panel .tab-cart").addClass("tab-selected");
    });

    // Customise now - Cancel
    $(".customise-pizza .cancel-selection").click(function () {
        CustomisePizza = "false";
        $(".side-panel").removeClass("side-panel-open");
        $(".tab-customise-pizza").removeClass("tab-selected");
    });

    // Toggle default toppings
    $(".default-toppings button").click(function () {
        $(this).toggleClass("btn-selected");
        $(this).toggleClass("btn-deselected");
        $(this).find('i').toggle();
    });

    // Add extra toppings
    $(".add-toppings-list").change(function () {
        var ExtraToppings = $(this).find("option:selected").text();
        $(".extra-toppings").append("<button type='button' class='btn btn-selected btn-extra-topping'>" + ExtraToppings + "<i class='fa fa-times'></i></button>");
        rebindExtraToppings();
        //$("<button type='button' class='btn btn-warning btn-extra-topping'>"+ExtraToppings+"<i class='fa fa-times'></i></button>").appendTo( ".toppings-filter .extra-toppings" );
    });

    // Remove extra toppings
    function rebindExtraToppings() {
        $(".extra-toppings button").click(function () {
            $(this).remove();
        });
    }
    rebindExtraToppings();

    $(".add-to-cart").click(function () {
        $(".cart").toggleClass("side-panel-open");
    });

    // Close side panel
    $(".btn-side-panel-close").click(function () {
        $(".side-panel").css("top", 200);
        //$(".side-panel").css("right", -285);
        $(".side-panel").removeClass("side-panel-open");
        $(".tab").removeClass("tab-selected");



    });

    // Navigate side panel tabs
    $(".tab").click(function () {
        $(".tab").removeClass("tab-selected");
        $(".side-panel").addClass("side-panel-open");
        $(".cart").hide();
        $(".customise-pizza").hide();
        $(".pickup-delivery").hide();
        $(".select-pizza-to-customise").hide();
        $(this).addClass("tab-selected");
    });

    $(".tab-cart").click(function () {
        $(".cart").show();
    });

    $(".tab-delivery").click(function () {
        $(".pickup-delivery").show();
    });

    $(".tab-customise-pizza").click(function () {
        //alert (CustomisePizza);
        if (CustomisePizza != "false") {
            $(".customise-pizza").show();
        } else {
            $(".select-pizza-to-customise").show();
        }
    });

    // #region Login

    //Btn Check out
    $(".btn-check-out").click(function () {
        $(".quick-signup").show();
        $(".logged-in").hide();
        $(".create-login").hide();
        $(".login").hide();
        $(".receipt").hide();
    });

    //Btn Login
    $(".btn-login").click(function () {
        $(".quick-signup").hide();
        $(".logged-in").hide();
        $(".create-login").hide();
        $(".login").show();
        $(".receipt").hide();
    });
    //Btn Login
    $(".btn-log-in").click(function () {
        $(".quick-signup").hide();
        $(".logged-in").hide();
        $(".create-login").hide();
        $(".login").show();
        $(".receipt").hide();
    });
    //Btn Create login
    //$(".btn-create-login").click(function () {
    //    $(".quick-signup").hide();
    //    $(".logged-in").hide();
    //    $(".create-login").show();
    //    $(".login").hide();
    //    $(".receipt").hide();
    //});    

    //Btn Create login - Save and continue
    $(".create-login .btn-save-continue").click(function () {
        $(".quick-signup").hide();
        $(".logged-in").show();
        $(".create-login").hide();
        $(".login").hide();
        $(".receipt").hide();
    });

    //Btn logged in - buy now
    $(".logged-in .btn-buy-now").click(function () {
        $(".quick-signup").hide();
        $(".logged-in").hide();
        $(".create-login").hide();
        $(".login").hide();
        $(".receipt").show();
    });

    //Buy now
    $(".btn-buy-now").click(function () {
        $(".quick-signup").hide();
        $(".receipt").show();
    });

    $(".check-item p").click(function () {
        $(".check-item p i").removeClass("check-item-selected");
        //$(this).find("i").hide();
        $(this).find("i").addClass("check-item-selected");
    });


    // Validate fields
    //$("select, :text, :password").on("change keyup paste", markField);

    // #endregion

    // Edit favourites - open modal
    $(".edit-group.favourites .btn-edit").click(function () {
        var FavouriteName = $(this).closest("li").find('strong').text();
        //alert ()
        $("#edit-my-favourites").find("h1 span").text(FavouriteName);
        $("#edit-my-favourites").find("input").attr("value", FavouriteName);
        $('#edit-my-favourites').modal('show');
    });

    // Select a delivery address
    $("#SelectDeliveryAddress").change(function () {
        var PresentAddress = $(this).val();
        $(".present-address").hide();
        $("." + PresentAddress).toggle();
    });

    // Show receipt
    $(".receipt h3").click(function () {
        $(this).find("span.fa-chevron-down").toggle();
        $(this).find("span.fa-chevron-up").toggle();
        $(this).next("table").toggle();
    });

    $('a[href="#"]').click(function (e) {
        e.preventDefault();
    });

    
    $('body').on('click', '.fa-times-circle-o', function () {
        if (document.URL.toLocaleLowerCase().indexOf("payment") != -1) {
            window.location = document.URL.split('/')[0];
        }

    });

    // Display the map into the element ID (if it exists) passed to the initializeMap function (in this case into element #map)
    if ($("#map").length) {
        google.maps.event.addDomListener(window, "load", initializeMap("map"));
    }

    if (/Android/i.test(navigator.userAgent)  && !isApp()) {
        new SmartBanner({
            daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
            daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
            appStoreLanguage: 'au', // language code for the App Store (defaults to user's browser language)
            title: 'Pizza Hut NZ',
            author: 'Restaurant Brands Ltd',
            button: 'VIEW',
            store: {
                ios: 'On the App Store',
                android: 'In Google Play',
                windows: 'In Windows store'
            },
            price: {
                ios: 'FREE',
                android: 'FREE',
                windows: 'FREE'
            }
            //, force: 'android' // Uncomment for platform emulation
        });
    }

    function isApp() {
        result = new WhichBrowser();

        if (JSON.stringify(result).toLowerCase().indexOf("webview") <= -1) {
            return false;
        } else {
            return true;
        }
    }

    

    return false;
});


