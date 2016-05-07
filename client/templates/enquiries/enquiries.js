Template.enquiries.helpers({
  enquiries: function() {
    var enquiries = Enquiries.find(_.extend(Session.get("filters"), Session.get("filter1")), {sort: {date: 1}});

    return enquiries.map(function(enquiry) {
      var task = Tasks.findOne({enquiryId: enquiry._id, done: {$ne: true}}, {sort: {date: 1}});
      if (task) {
        enquiry.nextTask = task.title;
      }
      return enquiry;
    });
  },
  allEnquiriesForFilterControl: function() {
    return Enquiries.find({});
  }
});

Template.enquiries.events({
  "change #checkbox-1": function(e) {
    if(Session.get("filter1")) {
      Session.set("filter1", null);
    } else {
      Session.set("filter1", {status: {$nin: ["Done", "Closed"]}});
    }
  }
});