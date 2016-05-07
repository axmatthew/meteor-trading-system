Template.migration.events({
  'submit #enquiries-form': function(e) {
    e.preventDefault();

    var rows = e.target.enquiriesData.value.split("\n");
    var i = 0;

    rows.forEach(function(row) {
      var data = row.split('\t');
      if (data.length < 12) {
        console.log("Invalid data, rejected: " + row);
      } else {
        var attributes = {
          date: new Date(data[0]),
          sales: data[1],
          companyName: data[2],
          contactPerson: data[3],
          tels: data[4],
          emails: data[5],
          address: data[6],
          description: data[7],
          deadline: data[8],
          status: data[9],
          enquiryNum: data[10],
          remarks: data[11],
          noTask: true
        };
        i ++;
        Meteor.call("addEnquiry", attributes);
      }
      document.querySelector('#p1').MaterialProgress.setProgress((i / rows.length) * 100);
    });

    //Router.go("enquiries");
    return false;
  },
  'submit #purchase-orders-form': function(e) {
    e.preventDefault();

    var rows = e.target.purchaseOrdersData.value.split("\n");
    var i = 0;

    rows.forEach(function(row) {
      var data = row.split('\t');
      if (data.length < 29) {
        console.log("Invalid data, rejected: " + row);
      } else {
        var enquiry = Enquiries.findOne({enquiryNum: data[1]});
        if (!enquiry) {
          console.log("No matching enquiry, rejected: " + row);
        } else {
          var attributes = {
            enquiryId: enquiry._id,
            signDate: new Date(data[0]),
            purchase: data[2],
            deliveryAddress: data[8],
            description: data[9],
            deadline: data[10],
            factory: data[14],
            cost: Number(data[15]),
            price: Number(data[16]),
            amount: Number(data[17]),
            spareAmount: Number(data[18]),
            otherCost: Number(data[19]),
            logisticsCost: Number(data[20]),
            sampleDate: data[21],
            deliveryDate: data[22],
            status: data[26],
            finishDate: new Date(data[27]),
            remarks: data[28]
          };
          Meteor.call("addPurchaseOrder", attributes);
        }
      }
      i ++;
      document.querySelector('#p2').MaterialProgress.setProgress((i / rows.length) * 100);
    })

    //Router.go("purchaseOrders");
    return false;
  }
});