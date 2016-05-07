Template.tasks.helpers({
  tasks: function() {
    var tasks = Tasks.find({done: {$ne: true}, date: {$lte: moment().endOf("day").toDate()}}, {sort: {date: 1}});
    return taskJoinEnquiry(tasks);
  },
  nextTasks: function() {
    var tasks = Tasks.find({done: {$ne: true}, date: {$gt: moment().endOf("day").toDate()}}, {sort: {date: 1}});
    return taskJoinEnquiry(tasks);
  }
});

function taskJoinEnquiry(tasks) {
  return tasks.map(function(task) {
      var enquiry = Enquiries.findOne(task.enquiryId);
      if (enquiry) {
        task.enquiryNum = enquiry.enquiryNum;
        task.companyName = enquiry.companyName;
        task.contactPerson = enquiry.contactPerson;
        task.tels = enquiry.tels;
        task.description = enquiry.description;
        if (enquiry.status == "Active" || enquiry.status == "Signed") {
          task.status = enquiry.status;
        }
      }
      return task;
    });
}