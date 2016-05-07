Template.editEnquiry.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    $.each($(e.target).serializeArray(), function() {
      attributes[this.name] = this.value;
    });
    Meteor.call("editEnquiry", attributes);
    Router.go("enquiries");
    return false;
  }
});