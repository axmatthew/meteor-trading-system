Template.gProducts.helpers({
  products: function() {
    return Products.find({}, {sort: {code: 1}});
  }
});