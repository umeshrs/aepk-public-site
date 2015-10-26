Meteor.startup(function () {
  GoogleMaps.load();
  Session.setDefault("prescription", []);
  Session.setDefault("storesList", []);
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
  exampleMapOptions: function () {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      return {
        center: new google.maps.LatLng(48.8588589, 2.335864),
        zoom: 13
      };
    }
  },
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
  //   var storesList = Session.get("storesList").length ? Session.get("storesList") : Stores.find({}, {sort: {createdAt: 1}}).fetch();
  //   Session.set("storesList", storesList);
		// return storesList;
    return Session.get("storesList").length ? Session.get("storesList") : Stores.find({}, {sort: {createdAt: 1}}).fetch();
	}
});

Template.storesList.onCreated(function () {
  // We can use the 'ready' callback to interact with the map API once the map is ready
  GoogleMaps.ready('exampleMap', function(map) {
    // Add a marker to the map once it's ready
    var storesList, markersList, lat, lng, i, infoWindow, iconBase, markerIcon;

    storesList = Stores.find({}, { sort: { lat: -1 }}).fetch();
    // storesList = Session.get("storesList");
    // console.log(storesList);
    markersList = [];
    iconBase = "http://maps.google.com/mapfiles/ms/icons/";

    for (i = 0; i < storesList.length; i++) {
      lat = storesList[i].lat;
      lng = storesList[i].lng;
      infoWindow = '<p>' +
        '<strong>' + storesList[i].name + '</strong><br />' +
        storesList[i].address.street + '<br />' +
        storesList[i].address.postalCode + ' ' + storesList[i].address.city + ', ' + storesList[i].address.country + '<br />' +
        '</p>';

      markerIcon = iconBase + "green-dot.png";
        
      if (lat !== "" && lng !== "") {
        markersList.push({
          position: new google.maps.LatLng(+lat, +lng),
          title: storesList[i].name,
          infoWindow: infoWindow,
          icon: markerIcon
        });
      }
    }

    dropMarkers(markersList, map.instance);
  });
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
  }
});

Template.storeLocator.events({
  "click #drug_short_list": function () {
    $(".tableau").show();
  },
  "click .cleartableau": function () {
    Session.set("prescription", []);
    Session.set("storesList", []);
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
      storeDetails = Stores.findOne({ _id: matchedStores[i].store_id });
      matchedStores[i].name = storeDetails.name;
      matchedStores[i].address = storeDetails.address;
      matchedStores[i].lat = storeDetails.lat;
      matchedStores[i].lng = storeDetails.lng;
    }
    Session.set("storesList", matchedStores);
  }
  else {
    Session.set("storesList", []);
  }
}
