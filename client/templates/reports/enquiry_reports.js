drawEnquiryReportByStaff = function(containerId, filter, subTitle) {
  filter = filter || {};
  subTitle = subTitle || "All time";
  var data = [["Staff", "New", "Quoted", "Active"]];
  var sales = _.uniq(Enquiries.find(filter).map(function(enquiry) { return enquiry.sales; })).sort();

  sales.forEach(function(name) {
    data.push([name, Enquiries.find(_.extend(filter, {sales: name, status: "New"})).count(), Enquiries.find(_.extend(filter, {sales: name, status: "Quoted"})).count(), Enquiries.find(_.extend(filter, {sales: name, status: "Active"})).count()]);
  });
  var dataTable = google.visualization.arrayToDataTable(data);

  var options = {
    chart: {
      title: "Enquiry Report by Staff",
      subtitle: subTitle
    },
    colors: ["#e0e0e0", "#ffeb3b", "#e57373"]
  };

  var chart = new google.charts.Bar(document.getElementById(containerId));

  chart.draw(dataTable, options);
};

drawEnquiryReportByMonth = function(containerId) {
  var data = [["Month", "Count"]];
  var months = _.uniq(Enquiries.find({$where : function() { return this.date.getYear() === new Date().getYear(); }}).map(function(enquiry) { return (enquiry.date.getMonth()); })).sort();

  months.forEach(function(month) {
    data.push([month + 1, Enquiries.find({$where: function() { return this.date.getYear() === new Date().getYear() && this.date.getMonth() == month; }}).count()]);
  });
  var dataTable = google.visualization.arrayToDataTable(data);

  var options = {
    chart: {
      title: "Enquiry Report by Month"
    }
  };

  var chart = new google.charts.Bar(document.getElementById(containerId));

  chart.draw(dataTable, options);
};