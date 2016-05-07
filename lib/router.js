Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: "loading",
  waitOn: function () {
    return [
      Meteor.subscribe("counters"),
      Meteor.subscribe("configs"),
      Meteor.subscribe("suppliers"),
      Meteor.subscribe("products"),
      Meteor.subscribe("enquiries"),
      Meteor.subscribe("purchaseOrders"),
      Meteor.subscribe("documents"),
      Meteor.subscribe("cashFlows"),
      Meteor.subscribe("tasks")
    ];
  }
});

Router.route("/about", {name: "about"});
Router.route("/migration", {name: "migration"});
Router.route("/", {name: "tasks"});
Router.route("/new_task", {
  name: "newTask",
  template: "newTask",
  data: function() { return {}; }
});
Router.route("/new_task/:_id", {
  name: "newTaskFromEnquiry",
  template: "newTask",
  data: function() { return Enquiries.findOne(this.params._id); }
});
Router.route("/tasks/:_id/edit", {
  name: "editTask",
  data: function() { return Tasks.findOne(this.params._id); }
});
Router.route("/enquiries", {name: "enquiries"});
Router.route("/new_enquiry", {name: "newEnquiry"});
Router.route("/enquiries/:_id/edit", {
  name: "editEnquiry",
  data: function() { return Enquiries.findOne(this.params._id); }
});
Router.route("/purchase_orders", {name: "purchaseOrders"});
Router.route("/new_purchase_order/:_id", {
  name: "newPurchaseOrder",
  data: function() { return Enquiries.findOne(this.params._id); }
});
Router.route("/purchase_orders/:_id/edit", {
  name: "editPurchaseOrder",
  data: function() { return PurchaseOrders.findOne(this.params._id); }
});
Router.route("/products", function () {
  this.render("gProducts");
}, {name: "products"});
Router.route("/new_product", {name: "newProduct"});
Router.route("/products/:_id/edit", {
  name: "editProduct",
  data: function() { return Products.findOne(this.params._id); }
});
Router.route("/suppliers", {name: "suppliers"});
Router.route("/new_supplier", {name: "newSupplier"});
Router.route("/suppliers/:_id/edit", {
  name: "editSupplier",
  data: function() { return Suppliers.findOne(this.params._id); }
});
Router.route("/reports", {name: "reports"});
Router.route("/cashflows", {name: "cashFlows"});
Router.route("/cashflows/:_id/edit", {
  name: "editCashFlow",
  data: function() { return CashFlows.findOne(this.params._id); }
});
Router.route("/all_documents", {name: "allDocuments"});
Router.route("/enquiries/:_id/documents", {
  name: "documents",
  data: function() { return Enquiries.findOne(this.params._id); },
  onAfterAction: function() {
    var enquiry = Enquiries.findOne(this.params._id);
    Documents.find({enquiryId: this.params._id, generated: {$ne: true}}).forEach(function(doc) {
      var enquiryInfo = {
        date: enquiry.date,
        emails: enquiry.emails,
        address: enquiry.address,
        companyName: enquiry.companyName,
        contactPerson: enquiry.contactPerson,
        description: enquiry.description,
        status: enquiry.status,
        enquiryNum: enquiry.enquiryNum,
        deadline: enquiry.deadline,
        sales: enquiry.sales,
        tels: enquiry.tels,
        remarks: enquiry.remarks
      };

      var callFunc = "generate";
      if (doc.type === "Invoice") {
        if (doc.documentNum.indexOf("A") != -1) {
          callFunc += "Deposit" + doc.type;
        } else if (doc.documentNum.indexOf("B") != -1) {
          callFunc += "Balance" + doc.type;
        }
      } else {
        callFunc += doc.type;
      }
      callScriptFunction(callFunc, [Session.get("CONFIGS")["GSYS_ACCOUNT"], Meteor.user().username, enquiryInfo, doc.parameters], function(gSheetId) {
        if (gSheetId) {
          Meteor.call("editDocument", {_id: doc._id, gSheetId: gSheetId});
        } else {
          Meteor.call("deleteDocument", doc._id);
        }
      });
      Meteor.call("editDocument", {_id: doc._id, generated: true});
    });
  }
});

Router.onBeforeAction(function() {
  Session.set("filters", {});
  Session.set("filter1", {status: {$nin: ["Done", "Closed"]}});
  Session.set("CONFIGS", Configs.findOne({}));
  this.next();
});
