Template.newPurchaseOrder.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    var numberFields = ["cost", "price", "amount", "spareAmount", "otherCost", "logisticsCost"];
    $.each($(e.target).serializeArray(), function() {
      if (numberFields.indexOf(this.name) !== -1) this.value = Number(this.value);
      attributes[this.name] = this.value;
    });
    console.log(attributes);
    Meteor.call("addPurchaseOrder", attributes);
    Router.go("purchaseOrders");
    return false;
  }
});