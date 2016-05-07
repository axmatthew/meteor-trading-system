Enquiries = new Mongo.Collection("enquiries");

Meteor.methods({
  addEnquiry: function (enquiryAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var now = new Date();
    var enquiry = _.extend(enquiryAttributes, {
      createdAt: now,
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
    enquiry.status = enquiry.status || "New";
    enquiry.enquiryNum = enquiry.enquiryNum || moment(now).format("YYMM") + getNextSequence("enquiryNum");
    enquiry.date = enquiry.date || now;

    var _id = Enquiries.insert(enquiry);

    // Create task
    if (!enquiry.noTask) {
      Meteor.call("addTask", {
        enquiryId: _id,
        owner: enquiry.sales,
        date: new Date(),
        title: "first call",
        remarks: ""
      });
    }
  },
  editEnquiry: function (enquiryAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = enquiryAttributes._id;
    delete enquiryAttributes._id;

    Enquiries.update(_id, {$set: enquiryAttributes});
  },
  editEnquiryStatus: function (_id, status) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Enquiries.update(_id, {$set: {status: status}});
  },
  deleteEnquiry: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Enquiries.remove(_id);
  }
});