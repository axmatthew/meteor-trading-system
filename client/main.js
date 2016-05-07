// Global helpers
Template.registerHelper("formatDate", function(date) {
  if (date === "Now") return moment().format("YYYY-MM-DD");
  if (!date || date.getTime() == 0 || isNaN(date.getTime())) return "";
  return moment(date).format("YYYY-MM-DD");
});
Template.registerHelper("formatPercentage", function(value) {
  if (!value) return "";
  return (value * 100).toFixed(1) + "%";
});
Template.registerHelper("CONFIG", function(key) {
  var CONFIGS = Session.get("CONFIGS");
  if (CONFIGS) {
  	return CONFIGS[key];
  } else {
  	return "";
  }
});
Template.registerHelper("salesList", function(value) {
  return Session.get("CONFIGS")["SALES"];
});
Template.registerHelper("purchasesList", function(value) {
  return Session.get("CONFIGS")["PURCHASES"];
});
Template.registerHelper("taskTitlesList", function(value) {
  return Session.get("CONFIGS")["TASK_TITLES"];
});
Template.registerHelper("limitedAccess", function() {
  return Meteor.user() ? Meteor.user().username.startsWith('_') : true;
});

Template.newTask.onRendered(function() {
  $("[id$='ate']").datepicker({dateFormat: "yy-mm-dd"});  
});

Template.editTask.onRendered(function() {
  $("[id$='ate']").datepicker({dateFormat: "yy-mm-dd"});  
});

Template.newPurchaseOrder.onRendered(function() {
  $("#deadline").datepicker({dateFormat: "yy-mm-dd"}); 
  $("[id$='ate']").datepicker({dateFormat: "yy-mm-dd"});  
});

Template.editPurchaseOrder.onRendered(function() {
  $("#deadline").datepicker({dateFormat: "yy-mm-dd"}); 
  $("[id$='ate']").datepicker({dateFormat: "yy-mm-dd"});  
});