import { Template } from 'meteor/templating';

import { Tasks } from '../api/tasks.js';

import './task.html';


Template.task.onCreated(function () {
  this.state = new ReactiveDict();
  this.state.set('isEditing', false);
  Meteor.subscribe('tasks');
});


Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
  isEditing(){
    return Template.instance().state.get('isEditing');
  }
});
Template.task.events({
  'click .toggle-checked'() {
    // Set the checked property to the opposite of its current value
    Meteor.call('tasks.setChecked', this._id, !this.checked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
  'click .edit'(event, template) {
    template.state.set('isEditing', true);
    //console.log(Template.instance().state.get('isEditing'));
  },
  'click .edit-ready'(event, template){
    const updatedTask = template.find('.updated-task').value;
    //console.log(updatedTask);
    Meteor.call('tasks.edited', this._id, updatedTask);
    template.state.set('isEditing', false);
  },
  });
