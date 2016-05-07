Template.cashFlowsReport.helpers({
  typeName: function(type) {
    var typeNames = [
      "客訂金",
      "客尾數",
      "廠訂金",
      "廠尾數"
    ];
    return typeNames[type];
  }
});