Template.newProduct.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    $.each($(e.target).serializeArray(), function() {
      attributes[this.name] = this.value;
    });
    Meteor.call("addProduct", attributes);
    Router.go("products");
    return false;
  }
});