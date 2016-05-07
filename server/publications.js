Meteor.publish("counters", function() {
  return Counters.find({});
});
Meteor.publish("configs", function() {
  return Configs.find({});
});
Meteor.publish("suppliers", function() {
  return Suppliers.find({});
});
Meteor.publish("products", function() {
  return Products.find({});
});
Meteor.publish("enquiries", function() {
  return Enquiries.find({});
});
Meteor.publish("purchaseOrders", function() {
  return PurchaseOrders.find({});
});
Meteor.publish("documents", function() {
  return Documents.find({});
});
Meteor.publish("cashFlows", function() {
  return CashFlows.find({});
});
Meteor.publish("tasks", function() {
  if (this.userId) {
    return Tasks.find({owner: Accounts.users.findOne(this.userId).username});
  } else {
    return Tasks.find(null);
  }
});
Houston.add_collection(Meteor.users);