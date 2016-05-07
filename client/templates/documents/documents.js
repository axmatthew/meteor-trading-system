Template.documents.helpers({
  documentTypes: function() {
    var types = _.uniq(Documents.find({enquiryId: this._id}).map(function(doc) { return doc.type; }));

    var enquiryId = this._id;
    return types.map(function(type) {
      return {name: type, documents: Documents.find({enquiryId: enquiryId, type: type})};
    });
  }
});