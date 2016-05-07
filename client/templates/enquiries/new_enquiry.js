Template.newEnquiry.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    $.each($(e.target).serializeArray(), function() {
      attributes[this.name] = this.value;
    });
    Meteor.call("addEnquiry", attributes);
    Router.go("enquiries");
    return false;
  }
});