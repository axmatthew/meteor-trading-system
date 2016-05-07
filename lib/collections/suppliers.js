Suppliers = new Mongo.Collection("suppliers");

Meteor.methods({
  addSupplier: function (supplierAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var supplier = _.extend(supplierAttributes, {
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });

    Suppliers.insert(supplier);
  },
  editSupplier: function (supplierAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = supplierAttributes._id;
    delete supplierAttributes._id;

    Suppliers.update(_id, {$set: supplierAttributes});
  },
  deleteSupplier: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Suppliers.remove(_id);
  }
});