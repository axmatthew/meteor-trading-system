PurchaseOrders = new Mongo.Collection("purchaseOrders");

Meteor.methods({
  addPurchaseOrder: function (purchaseOrderAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var enquiry = Enquiries.findOne(purchaseOrderAttributes.enquiryId);
    var now = new Date();
    var poNum = "P" + enquiry.enquiryNum;
    var count = PurchaseOrders.find({poNum: {$regex: poNum, $options: "i"}}).count();
    if (count > 0) {
      poNum += (count + 1);
    }
    var purchaseOrder = _.extend(purchaseOrderAttributes, {
      sales: enquiry.sales, // For filtering
      poNum: poNum,
      createdAt: now,
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
    purchaseOrder.signDate = purchaseOrder.signDate || now;
    purchaseOrder.status = purchaseOrder.status || now;

    purchaseOrder.deadline = new Date(purchaseOrder.deadline);
    purchaseOrder.sampleDate = new Date(purchaseOrder.sampleDate);
    purchaseOrder.deliveryDate = new Date(purchaseOrder.deliveryDate);
    if (isNaN(purchaseOrder.sampleDate.getTime())) purchaseOrder.sampleDate = null;
    if (isNaN(purchaseOrder.deliveryDate.getTime())) purchaseOrder.deliveryDate = purchaseOrder.deadline;

    var poId = PurchaseOrders.insert(purchaseOrder);
    createCashFlowRecords(poId, purchaseOrder, enquiry);
  },
  editPurchaseOrder: function (purchaseOrderAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = purchaseOrderAttributes._id;
    delete purchaseOrderAttributes._id;
    purchaseOrderAttributes.signDate = new Date(purchaseOrderAttributes.signDate);
    purchaseOrderAttributes.deadline = new Date(purchaseOrderAttributes.deadline);
    purchaseOrderAttributes.sampleDate = new Date(purchaseOrderAttributes.sampleDate);
    purchaseOrderAttributes.deliveryDate = new Date(purchaseOrderAttributes.deliveryDate);
    if (isNaN(purchaseOrderAttributes.sampleDate.getTime())) purchaseOrderAttributes.sampleDate = null;
    if (isNaN(purchaseOrderAttributes.deliveryDate.getTime())) purchaseOrderAttributes.deliveryDate = purchaseOrderAttributes.deadline;

    PurchaseOrders.update(_id, {$set: purchaseOrderAttributes});

    if (CashFlows.find({purchaseOrderId: _id}).count() == 0) {
      var enquiry = Enquiries.findOne(purchaseOrderAttributes.enquiryId);
      createCashFlowRecords(_id, purchaseOrderAttributes, enquiry);
    }
  },
  editPurchaseOrderStatus: function (_id, status) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    PurchaseOrders.update(_id, {$set: {status: status}});

    if (status === "Done") {
      PurchaseOrders.update(_id, {$set: {finishDate: new Date()}});
    }
  },
  deletePurchaseOrder: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    PurchaseOrders.remove(_id);
  },
  paidSample: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidSample: true}});
  },
  paidDeposit: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidDeposit: true}});
    CashFlows.update({purchaseOrderId: _id, type: 0}, {$set: {done: true}});
  },
  paidRemaining: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidRemaining: true, status: "Done", finishDate: new Date()}});
    CashFlows.update({purchaseOrderId: _id, type: 1}, {$set: {done: true}});
  },
  paidFactorySample: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidFactorySample: true, status: "Sample"}});
  },
  paidFactoryDeposit: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidFactoryDeposit: true, status: "Manufacturing"}});
    CashFlows.update({purchaseOrderId: _id, type: 2}, {$set: {done: true}});
  },
  paidFactoryRemaining: function (_id) {
    PurchaseOrders.update(_id, {$set: {paidFactoryRemaining: true, status: "Delivering"}});
    CashFlows.update({purchaseOrderId: _id, type: 3}, {$set: {done: true}});
  }
});

function createCashFlowRecords(poId, purchaseOrder, enquiry) {
  var startDate = purchaseOrder.sampleDate;
  if (!startDate) startDate = purchaseOrder.signDate;
  // In case if no deadline
  var deadline = purchaseOrder.deadline;
  var deliveryDate = purchaseOrder.deliveryDate;
  if (isNaN(deadline.getTime())) {
    deadline = new Date(purchaseOrder.signDate);
    deadline.setDate(deadline.getDate() + 30);
    deliveryDate = new Date(purchaseOrder.signDate);
    deliveryDate.setDate(deliveryDate.getDate() + 20);
  }
  var totalPrice = purchaseOrder.price * purchaseOrder.amount;
  var totalCost = purchaseOrder.cost * (purchaseOrder.amount+ purchaseOrder.spareAmount);

  if (totalCost != 0) {
    Meteor.call("addCashFlow", {
      purchaseOrderId: poId,
      sales: enquiry.sales,
      type: 2,
      title: purchaseOrder.poNum + "廠訂金 (" + enquiry.companyName + ")",
      date: startDate,
      amount: totalCost * 0.3,
      done: false
    });
    Meteor.call("addCashFlow", {
      purchaseOrderId: poId,
      sales: enquiry.sales,
      type: 3,
      title: purchaseOrder.poNum + "廠尾數 (" + enquiry.companyName + ")",
      date: deliveryDate,
      amount: totalCost * 0.7,
      done: false
    });
  }
  if (totalPrice != 0) {
    Meteor.call("addCashFlow", {
      purchaseOrderId: poId,
      sales: enquiry.sales,
      type: 0,
      title: purchaseOrder.poNum + "客訂金 (" + enquiry.companyName + ")",
      date: new Date(startDate.setDate(startDate.getDate() + 3)),
      amount: totalPrice * 0.5,
      done: false
    });
    Meteor.call("addCashFlow", {
      purchaseOrderId: poId,
      sales: enquiry.sales,
      type: 1,
      title: purchaseOrder.poNum + "客尾數 (" + enquiry.companyName + ")",
      date: new Date(deadline.setDate(deadline.getDate() + 5)),
      amount: totalPrice * 0.5,
      done: false
    });
  }
}