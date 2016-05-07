Products = new Mongo.Collection("products");

Meteor.methods({
  addProduct: function (productAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var product = _.extend(productAttributes, {
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });

    Products.insert(product);
  },
  editProduct: function (productAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = productAttributes._id;
    delete productAttributes._id;

    Products.update(_id, {$set: productAttributes});
  },
  deleteProduct: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Products.remove(_id);
  }
});