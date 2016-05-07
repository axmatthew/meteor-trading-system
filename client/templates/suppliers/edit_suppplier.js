Template.editSupplier.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    $.each($(e.target).serializeArray(), function() {
      attributes[this.name] = this.value;
    });
    Meteor.call("editSupplier", attributes);
    Router.go("suppliers");
    return false;
  }
});