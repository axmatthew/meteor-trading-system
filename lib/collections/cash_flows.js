CashFlows = new Mongo.Collection("cashFlows");

Meteor.methods({
  addCashFlow: function (cashFlowAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var cashFlow = _.extend(cashFlowAttributes, {
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });

    CashFlows.insert(cashFlow);
  },
  editCashFlow: function (cashFlowAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = cashFlowAttributes._id;
    delete cashFlowAttributes._id;
    cashFlowAttributes.date = new Date(cashFlowAttributes.date);

    CashFlows.update(_id, {$set: cashFlowAttributes});
  },
  deleteCashFlow: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    CashFlows.remove(_id);
  }
});