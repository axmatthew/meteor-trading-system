drawSalesReportByStaff = function(containerId, filter, subTitle) {
  filter = filter || {$where : function() { return this.signDate.getYear() === new Date().getYear() && this.signDate.getMonth() === new Date().getMonth(); }};
  subTitle = subTitle || "This month";
  var data = [["Staff", "G.P."]];
  var purchaseOrders = poJoinEnquiry(PurchaseOrders.find(filter));
  var salesGps = {};
  purchaseOrders.forEach(function(po) {
    if (po.sales) {
      if (salesGps[po.sales]) {
        salesGps[po.sales] += po.gp;
      } else {
        salesGps[po.sales] = po.gp;
      }
    }
  });

  for (var sales in salesGps) {
    data.push([sales, salesGps[sales]]);
  }

  var dataTable = google.visualization.arrayToDataTable(data);

  var options = {
    chart: {
      title: "Sales Report by Staff",
      subtitle: subTitle
    }
  };

  var chart = new google.charts.Bar(document.getElementById(containerId));

  chart.draw(dataTable, options);
};

drawSalesReportByMonth = function(containerId) {
  var data = [["Month", "G.P."]];
  var purchaseOrders = poJoinEnquiry(PurchaseOrders.find({$where : function() { return this.signDate.getYear() === new Date().getYear(); }}));
  var monthGps = {};
  purchaseOrders.forEach(function(po) {
    if (monthGps[po.signDate.getMonth()]) {
      monthGps[po.signDate.getMonth()] += po.gp;
    } else {
      monthGps[po.signDate.getMonth()] = po.gp;
    }
  });

  for (var month in monthGps) {
    data.push([Number(month) + 1, monthGps[month]]);
  }

  var dataTable = google.visualization.arrayToDataTable(data);

  var options = {
    chart: {
      title: "Sales Report by Month"
    }
  };

  var chart = new google.charts.Bar(document.getElementById(containerId));

  chart.draw(dataTable, options);
};