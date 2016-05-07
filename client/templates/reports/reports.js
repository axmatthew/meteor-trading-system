Template.reports.onRendered(function() {
  var charts = [
    {func: drawEnquiryReportByStaff, containerId: "enquiry-report-container"},
    {func: drawSalesReportByStaff, containerId: "sales-report-container"}
  ];
  var index = 0;
  var interval = window.setInterval(function() {
    charts[index].func(charts[index].containerId);
    index ++;
    if (index >= charts.length) {
      window.clearInterval(interval);
    }
  }, 500);
});

Template.reports.helpers({
  incomeCashFlows: function() {
    return CashFlows.find(_.extend(Session.get("filters"), {type: {$in: [0, 1]}, done: {$ne: true}, sales: Meteor.user().username}), {sort: {date: 1}});
  },
  expenseCashFlows: function() {
    return CashFlows.find(_.extend(Session.get("filters"), {type: {$in: [2, 3]}, done: {$ne: true}, sales: Meteor.user().username}), {sort: {date: 1}});
  }
});

Template.reports.events({
  "click #enquiry-report-this-month": function(e) {
    drawEnquiryReportByStaff("enquiry-report-container", {$where : function() { return this.date.getYear() === new Date().getYear() && this.date.getMonth() === new Date().getMonth(); }}, "This month");
  },
  "click #enquiry-report-all-time": function(e) {
    drawEnquiryReportByStaff("enquiry-report-container");
  },
  "click #sales-report-this-month": function(e) {
    drawSalesReportByStaff("sales-report-container");
  },
  "click #sales-report-last-month": function(e) {
    var lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    drawSalesReportByStaff("sales-report-container", {$where : function() { return this.signDate.getYear() === lastMonth.getYear() && this.signDate.getMonth() === lastMonth.getMonth(); }}, "Last month");
  },
  "click #sales-report-all-time": function(e) {
    drawSalesReportByStaff("sales-report-container", {}, "All time");
  }
});