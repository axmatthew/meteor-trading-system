Tasks = new Mongo.Collection("tasks");

Meteor.methods({
  addTask: function (taskAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var task = _.extend(taskAttributes, {
      done: false,
      createdAt: new Date(),
      userId: Meteor.userId(),
      username: Meteor.user().username
    });
    task.date = new Date(task.date);

    Tasks.insert(task);
  },
  editTask: function (taskAttributes) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    var _id = taskAttributes._id;
    delete taskAttributes._id;
    taskAttributes.date = new Date(taskAttributes.date);

    Tasks.update(_id, {$set: taskAttributes});
  },
  deleteTask: function (_id) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.remove(_id);
  },
  editTaskDone: function (_id, done) {
    if (! Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Tasks.update(_id, {$set: {done: done}});
  }
});