Template.editCashFlow.events({
  "submit form": function (e) {
    e.preventDefault();
    var attributes = {};
    $.each($(e.target).serializeArray(), function() {
      attributes[this.name] = this.value;
    });
    Meteor.call("editCashFlow", attributes);
    Router.go("cashFlows");
    return false;
  }
});