Template.allDocuments.helpers({
  documents: function() {
    return Documents.find(Session.get("filters"));
  },
  allDocumentsForFilterControl: function() {
    return Documents.find({});
  }
});