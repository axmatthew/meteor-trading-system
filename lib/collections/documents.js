Documents = new Mongo.Collection("documents");

Meteor.methods({
  addDocument: function (documentAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var document = _.extend(documentAttributes, {
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });

    Documents.insert(document);
  },
  editDocument: function (documentAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = documentAttributes._id;
    delete documentAttributes._id;

    Documents.update(_id, {$set: documentAttributes});
  },
  deleteDocument: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Documents.remove(_id);
  }
});