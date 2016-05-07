Template.filterControl.onRendered(function() {
  if (Template.currentData().default) {
    var filters = Session.get("filters") || {};
    filters[Template.currentData().field] = {$regex: Template.currentData().default, $options: "i"};
    Session.set("filters", filters);
  }
});

Template.filterControl.helpers({
  defaultValue: function() {
    return this.default || "All";
  },
  values: function() {
    var showValues = (this.showValues === undefined) ? true : this.showValues;
    if (showValues) {
      var field = this.field;
      return _.uniq(this.cursor.map(function(doc) { return doc[field]; })).sort();
    } else {
      return [];
    }
  }
});

Template.filterControl.events({
  "change input": function(e) {
    e.preventDefault();
    if (!e.target.value || e.target.value === "All") {
      var filters = Session.get("filters") || {};
      delete filters[this.field];
      Session.set("filters", filters);
    } else {
      var filters = Session.get("filters") || {};
      filters[this.field] = {$regex: e.target.value, $options: "i"};
      Session.set("filters", filters);
    }
    return false;
  }
});