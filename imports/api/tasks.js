import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
      $or: [
    { private: { $ne: true } },
    { owner: this.userId },
      ],
    });
  });
}

Meteor.methods({
  //insert new task
  'tasks.insert'(text) {
    //check if text is a String
    check(text, String);
    //insert into MongoDB Collection
    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  //delete a task
  'tasks.remove'(taskId) {
    check(taskId, String);
    //delete the task with the given taskId from the collection
    Tasks.remove(taskId);
  },
  'tasks.edited'(taskId,newTask){
    check(taskId, String);
    check(newTask, String);
    //update the text field from the task with the given taskId
    Tasks.update(taskId, { $set: { text: newTask } });
  },
  'tasks.setChecked'(taskId, setChecked) {
    check(taskId, String);
    check(setChecked, Boolean);
    //update if the task is done or not with the checked field in the collection
    Tasks.update(taskId, { $set: { checked: setChecked } });
  },
  'tasks.setPrivate'(taskId, setToPrivate) {
    check(taskId, String);
    check(setToPrivate, Boolean);
    //update if the task if private or public with the private field in the collection
    Tasks.update(taskId, { $set: { private: setToPrivate } });
},
});
