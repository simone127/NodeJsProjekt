import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import './task.js';
import './body.html';

Template.body.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  Meteor.subscribe('tasks');
});

Template.body.helpers({
  tasks() {
    const instance = Template.instance();
    if (instance.state.get('hideCompleted')) {
      // If hide completed is checked, filter tasks
      return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    }
      // Otherwise, return all of the tasks
      return Tasks.find({}, { sort: { createdAt: -1 } });
    },
    incompleteCount() {
      return Tasks.find({ checked: { $ne: true } }).count();
},
});

Template.body.events({
  'submit .new-task'(event) {
    //to clear the form later
    const target = event.target;
    //get the text typed into the form
    const text = target.text.value;
    // Call the insert function
    Meteor.call('tasks.insert', text);
    // Clear form
    target.text.value = '';
  },

  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
});
