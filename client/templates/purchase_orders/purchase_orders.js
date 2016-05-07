Template.purchaseOrders.helpers({
  purchaseOrders: function() {
    var purchaseOrders = PurchaseOrders.find(_.extend(Session.get("filters"), Session.get("filter1")), {sort: {signDate: 1}});
    return poJoinEnquiry(purchaseOrders);
  },
  allPurchaseOrdersForFilterControl: function() {
    return PurchaseOrders.find({});
  }
});

Template.purchaseOrders.events({
  "change #checkbox-1": function(e) {
    if(Session.get("filter1")) {
      Session.set("filter1", null);
    } else {
      Session.set("filter1", {status: {$nin: ["Done", "Closed"]}});
    }
  }
});

poJoinEnquiry = function(purchaseOrders) {
  return purchaseOrders.map(function(po) {
    var enquiry = Enquiries.findOne(po.enquiryId);
    po.gp = calculateGp(po);
    if (po.price * po.amount != 0) {
      po.gpPercent = po.gp / (po.price * po.amount);
    }
    // po.cashFlowsCount = CashFlows.find({purchaseOrderId: po._id}).count();

    if (enquiry) {
      po.sales = enquiry.sales;
      po.companyName = enquiry.companyName;
      po.contactPerson = enquiry.contactPerson;
      po.tels = enquiry.tels;
      po.emails = enquiry.emails;
    } else {
      // No matching enquiry
    }

    return po;
  });
};

calculateGp = function(po) {
  var EX_HKD_RMB = 0.843;
  return Math.round(po.price * po.amount - (po.cost * (po.amount + po.spareAmount) + po.otherCost + po.logisticsCost) / EX_HKD_RMB);
};