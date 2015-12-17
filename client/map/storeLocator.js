Meteor.startup(function () {
  Session.setDefault("prescription", []);
  Session.setDefault("storesList", Members.find({}, {sort: {createdAt: 1}}).fetch());
});

markersListGlobal = [];
map = undefined;

function initializeMap () {
  var styles = [
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { visibility: "simplified" }
      ]
    }, {
      featureType: "road",
      elementType: "labels.icon",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];
  map = new google.maps.Map(document.getElementById('map-canvas'), {
    center: new google.maps.LatLng(48.8588589, 2.335864),
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });
}

function addMarkers() {
  var i;
  // console.log(markersListGlobal);
  for (i = 0; i < markersListGlobal.length; i++) {
    markersListGlobal[i].setMap(map);
  }
  console.log("Markers added: " + markersListGlobal.length);
}

function clearMarkers () {
  for (var i = 0; i < markersListGlobal.length; i++) {
    markersListGlobal[i].setMap(null);
  }
}

function updateMarkers () {
  clearMarkers();
  markersListGlobal = [];
  prepareMarkers();
  addMarkers();
}

function prepareMarkers () {
  var storesList, marker, i, j, infoWindow, infoWindowContent, iconBase, markerIcon, storesListElements;

  // storesList = Stores.find({}, { sort: { lat: -1 }}).fetch();
  storesList = Session.get("storesList");
  // console.log(storesList);
  marker = [];
  infoWindow = [];
  iconBase = "http://maps.google.com/mapfiles/ms/icons/";

  var funcbinder = function (marker, infoWindow) {
    marker.addListener('click', function () {
      infoWindow.open(map, marker);
      infoWindow.ud_state = 1;
    });
  };
  var infoWindowOpener = function (infoWindow, marker) {
    if (infoWindow.ud_state === 0) {
      infoWindow.open(map, marker);
      infoWindow.ud_state = 1;
    }
  };
  var infoWindowCloser = function (infoWindow) {
    if (infoWindow.ud_state === 1) {
      infoWindow.close();
      infoWindow.ud_state = 0;
    }
  };
  var infoWindowToggler = function (infoWindow, marker) {
    if (infoWindow.ud_state) {
      infoWindow.close();
      infoWindow.ud_state = 0;
    } else {
      infoWindow.open(map, marker);
      infoWindow.ud_state = 1;
    }
  };

  for (var i = 0; i < storesList.length; i++) {
    infoWindowContent = '<p>' +
      '<strong>' + storesList[i].storeName + '</strong><br />' +
      storesList[i].address.street + '<br />' +
      storesList[i].address.postalCode + ' ' + storesList[i].address.city + ', ' + storesList[i].address.country + '<br />' +
      '</p>';
    markerIcon = iconBase + "green-dot.png";
    infoWindow[i] = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    infoWindow[i].ud_state = 0;
    marker[i] = new google.maps.Marker({
      position: new google.maps.LatLng(storesList[i].lat, storesList[i].lng),
      title: storesList[i].storeName,
      icon: markerIcon
    });

    // funcbinder(marker[i], infoWindow[i]);
    marker[i].addListener('click', _.bind(infoWindowOpener, null, infoWindow[i], marker[i]));

    infoWindow[i].addListener('closeclick', _.bind(infoWindowCloser, null, infoWindow[i]));

    map.addListener('click', _.bind(infoWindowCloser, null, infoWindow[i]));

    // DOM elements 
    storesListElements = document.getElementsByClassName("stores_list");
    for (j = 0; j < storesListElements.length; j++) {
      if ($(storesListElements[j]).find("b").html() === storesList[i].storeName) {
        storesListElements[j].addEventListener('click', _.bind(infoWindowToggler, null, infoWindow[i], marker[i]));
      }
    }

    markersListGlobal.push(marker[i]);
  }
}

Template.googleMaps.onRendered(function () {
  initializeMap();
  google.maps.event.addListenerOnce(map, 'idle', function(){
    // do something only the first time the map is loaded
    google.maps.event.trigger(map, 'resize');
    clearMarkers();
    markersListGlobal = [];
    prepareMarkers();
    addMarkers();
    
    $(".map_plot_page > aside").height($(window).innerHeight() - 94 - 80 - 76);
    $(".map_plot_page > article").height($(window).innerHeight() - 94 - 80 - 76);
    
    $(window).resize(function(){
      $(".map_plot_page > aside").height($(window).innerHeight() - 94 - 80 - 76);
      $(".map_plot_page > article").height($(window).innerHeight() - 94 - 80 - 76);
    });
  });
  
  
});

Template.registerHelper("enteredDrugsList", function () {
  var prescription, drugslist, i;
  prescription = Session.get("prescription");
  drugsList = "";
  for (i = 0; i < prescription.length - 1; i++) {
    drugsList += prescription[i].name + ", ";
  }
  drugsList += (prescription.length > 0) ? prescription[i].name : "";
  return drugsList;
});

Template.storeLocator.helpers({
  settings: function () {
    return {
      position: "bottom",
      limit: 10,
      rules: [
        {
          collection: Medicines,
          field: "name",
          matchAll: true,
          template: Template.medicine
        }
      ]
    };
  },
  medicines: function () {
    return Session.get("prescription");
  }
});

Template.storeLocator.onRendered(function () {
  $(".map_plot_page > aside").height($(window).innerHeight() - 92);
  $(".map_plot_page > article").height($(window).innerHeight() - 92);
  
  $(window).resize(function(){
  	$(".map_plot_page > aside").height($(window).innerHeight() - 92);
  	$(".map_plot_page > article").height($(window).innerHeight() - 92);
  });
});


Template.storesList.helpers({
	stores: function () {
    var storesList = Session.get("storesList").length ? Session.get("storesList") : Members.find({}, {sort: {createdAt: 1}}).fetch();
    Session.set("storesList", storesList);
		return storesList;
    // return Session.get("storesList").length ? Session.get("storesList") : Stores.find({}, {sort: {createdAt: 1}}).fetch();
	}
});

var dropMarkers = function (markersList, map) {
  for (var i = 0; i < markersList.length; i++) {
    addMarkerWithTimeout(markersList[i], map, i * 50);
  }
}

var addMarkerWithTimeout = function (markerOptions, map, timeout) {

  var addMarker = function () {
    var marker, infoWindow, storesList, i;

    marker = new google.maps.Marker({
      position: markerOptions.position,
      title: markerOptions.title,
      map: map,
      icon: markerOptions.icon
      // animation: google.maps.Animation.DROP
    });

    infoWindow = new google.maps.InfoWindow({
      content: markerOptions.infoWindow
    });

    // using the z index property of info window object to store
    // the toggle state of each info window
    // undefined = closed; 1 = open;

    marker.addListener('click', function () {
      infoWindow.open(map, marker);
      infoWindow.setZIndex(1);
    });

    infoWindow.addListener('closeclick', function () {
      infoWindow.close();
      infoWindow.setZIndex(undefined);
    });

    map.addListener('click', function () {
      infoWindow.close();
      infoWindow.setZIndex(undefined);
    });

    storesList = document.getElementsByClassName("stores_list");
    for (i = 0; i < storesList.length; i++) {
      if (storesList[i].getElementsByTagName("b")[0].innerHTML === markerOptions.title) {
        storesList[i].addEventListener('click', function () {
          if (infoWindow.getZIndex() === undefined) {
            infoWindow.open(map, marker);
            infoWindow.setZIndex(1);
          }
          else {
            infoWindow.close();
            infoWindow.setZIndex(undefined);
          }
        });
      }
    }
  }

  window.setTimeout(addMarker, timeout);
}

Template.store.events({
  'click button': function (event) {
    $("#float_over").css({"display":"table"});
    var orderDetails = {
      date: new Date(),
      store: this,
      prescription: Session.get("prescription")
    };
    Session.set("orderDetails", orderDetails);
  }
});

Template.storeLocator.events({
  "click #drug_short_list": function () {
    $(".tableau").show();
    $("#search-box").focus();
  },
  "click .cleartableau": function () {
    Session.set("prescription", []);
    Session.set("storesList", Members.find({}, {sort: {createdAt: 1}}).fetch());
    updateMarkers();
  },
  'submit .search-form': function (event) {
    var searchTerm, quantity, prescription, medicinesList, isValidName, isValidQuantity, index, storeName;

    event.preventDefault();

    searchTerm = $("#search-box")[0].value;
    quantity = $("#quantity")[0].value;
    isValidQuantity = function() {
      return (+$("#quantity")[0].value > 0);
    }

    if (searchTerm.length > 0) {
      // medicinesList is the list of medicines matching the searchTerm
      medicinesList = Medicines.find({ name: new RegExp(searchTerm, 'i') }).fetch();
      // checking if entered medicine name is equal to one of the names in the mathched medicines list
      isValidName = medicinesList.some(function (element, i) {
        if (element.name.toLowerCase() === searchTerm.toLowerCase()) {
          index = i;
          return true;
        }
      });
      if (! isValidName) {
        alert("The entered medicine is not in the database.");
        if (medicinesList.length > 0) {
          console.log("Did you mean " + medicinesList[0].name + "?");
        }
        return;
      }
    } else {
      alert("Please enter a medicine name.");
      return;
    }

    if (quantity.length >  0) {
      if (! isValidQuantity()) {
        alert("Quantity should be a positive number.");
        return;
      }
    } else {
      alert("Please fill the quantity field.");
      return;
    }

    prescription = Session.get("prescription");
    prescription.push({
      name: medicinesList[index].name,
      quantity: quantity
    });
    Session.set('prescription', prescription);

    matchStores(prescription);

    // clear the text input
    $("#search-box")[0].value = "";
    $("#quantity")[0].value = "";
    $("#search-box")[0].focus();
  },
  'click .rowremover': function (event) {
    var medicineName, index, prescription;

    medicineName = $(event.target).siblings("span").eq(0).text();
    prescription = Session.get("prescription");
    prescription.some(function (element, i) {
      if (element.name === medicineName)
        index = i;
    });
    prescription.splice(index, 1);
    Session.set("prescription", prescription);
    matchStores(prescription);
  },
  'click #ordering_form > button': function (event) {
    $("#ordering_form").get(0).reset();
    $("#float_over").css({"display":"none"});
  }
});

function matchStores (prescription) {
  var medicineDetails, matchedStores, i, j, isPresent, quantity, storeDetails;

  if (prescription.length > 0) {
    medicineDetails = Medicines.findOne({ name: prescription[0].name });
    matchedStores = medicineDetails.inventory;
    for (i = 0; i < matchedStores.length; i++) {
      matchedStores[i].stock = [{ medicineName: medicineDetails.name, quantity: matchedStores[i].stock }];
    }
    // console.log(matchedStores);
    for (i = 1; i < prescription.length; i++) {
      medicineDetails = Medicines.findOne({ name: prescription[i].name });
      for (j = 0; j < matchedStores.length; j++) {
        isPresent = medicineDetails.inventory.some(function (element, index) {
          if (element.storeName === matchedStores[j].storeName) {
            quantity = element.stock;
            return true;
          }
        });
        if (isPresent) {
          matchedStores[j].stock.push({ medicineName: medicineDetails.name, quantity: quantity });
        }
        else {
          matchedStores.splice(j, 1);
          j--;  // all elements after index j are shifted left by 1 after the splice
        }
      }
      // console.log(matchedStores);
    }
    for (i = 0; i < matchedStores.length; i++) {
      storeDetails = Members.findOne({ _id: matchedStores[i].store_id });
      matchedStores[i].name = storeDetails.storeName;
      matchedStores[i].address = storeDetails.address;
      matchedStores[i].lat = storeDetails.lat;
      matchedStores[i].lng = storeDetails.lng;
    }
    Session.set("storesList", matchedStores);
  }
  else {
    Session.set("storesList", Members.find({}, {sort: {createdAt: 1}}).fetch());
  }
  updateMarkers();
}
