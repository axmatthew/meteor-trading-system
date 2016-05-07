Template.editPurchaseOrder.helpers({
  createdCashFlow: function() {
    return CashFlows.find({purchaseOrderId: this._id}).count() > 0;
  }
});
Template.editPurchaseOrder.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    var numberFields = ["cost", "price", "amount", "spareAmount", "otherCost", "logisticsCost"];
    $.each($(e.target).serializeArray(), function() {
      if (numberFields.indexOf(this.name) !== -1) this.value = Number(this.value);
      attributes[this.name] = this.value;
    });
    Meteor.call("editPurchaseOrder", attributes);
    Router.go("purchaseOrders");
    return false;
  }
});