Template.enquiryItem.events({
  "click .generate-quotation": function(e) {
    _generateInternal.call(this, e, "Quotation", "Q");
  },
  "click .generate-e-quotation": function(e) {
    _generateInternal.call(this, e, "EQuotation", "Q");
  },
  "click .generate-sales-confirmation": function(e) {
    _generateInternal.call(this, e, "SalesConfirmation", "S");
  },
  "click .generate-deposit-invoice": function(e) {
    _generateInternal.call(this, e, "Invoice", "I", "A");
  },
  "click .generate-balance-invoice": function(e) {
    _generateInternal.call(this, e, "Invoice", "I", "B");
  },
  "click .generate-receipt": function(e) {
    var amount = prompt("Amount (Arabic number, no comma)");
    if (amount) {
      _generateInternal.call(this, e, "Receipt", "R", null, [amount]);
    }
  },
  "click .generate-dn": function(e) {
    var details = prompt("format: 荃灣海盛路3號TML廣場7樓C5-B室,2014-08-15,防水袋,16200,頭巾,16200", "荃灣海盛路3號TML廣場7樓C5-B室,2014-08-15,防水袋,16200,頭巾,16200");
    if (details) {
      _generateInternal.call(this, e, "DeliveryNote", "DN", null, [details]);
    }
  }
});

function _generateInternal(e, type, prefix, suffix, parameters) {
  e.preventDefault();
  suffix = suffix || "";
  var documentNum = prefix + this.enquiryNum + suffix;
  var count = Documents.find({documentNum: {$regex: documentNum, $options: "i"}}).count();
  if (count > 0) {
    documentNum += "_" + (count + 1);
  }
  if (!parameters) {
    var codes = this.description.match(/<[\w\-]*>/g) || ["<>"];
    for (var i = 0; i < codes.length; i++) {
      codes[i] = codes[i].substr(1, codes[i].length - 2) ;
    }
    parameters = codes;
  }
  var attributes = {
    enquiryId: this._id,
    type: type,
    documentNum: documentNum,
    parameters: parameters,
    generated: false,
    gSheetId: null
  };
  Meteor.call("addDocument", attributes);
  Router.go("documents", {_id: this._id});
  return false;
}