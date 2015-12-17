Template.fileUpload.events({
  'click #submit-btn': function () {
    var config, medicineDetails, inventory, name, purpose, key, i;

    config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results);

        for (i = 0; i < results.data.length; i++) {
          medicineDetails = results.data[i];
          inventory = [];

          for (key in medicineDetails) {
            console.log("key: '" + key + "'");
            console.log("value: '" + medicineDetails[key] + "'");
            switch (key) {
              case "medicineName":
                name = medicineDetails[key];
                break;
              case "purpose":
                purpose = medicineDetails[key];
                break;
              default:
                if (medicineDetails[key]) {
                  storeDetails = Members.findOne({ storeName: key.trim() });
                  console.log(storeDetails);
                  inventory.push({
                    store_id: storeDetails._id,
                    storeName: key,
                    stock: medicineDetails[key]
                  });
                }
            }
          }

          Medicines.insert({
            name: name,
            purpose: purpose,
            inventory: inventory,
            createdAt: new Date()
          });

        }
      }
    };

    $('#medicine-file-input').parse({
    config: config,
    before: function (file, inputElem) {
     console.log("Parsing file...", file);
    },
    error: function (err, file) {
     console.log("ERROR:", err, file);
    },
    complete: function (results) {
     console.log("Parsing complete.");
    }
    });
  }
});
