const gs = require('gstore-node')();

const todoSchema = new gs.Schema({
  text: {
    type: String,
    required: true,
    sanitizer: 'trim'
  },
  completed: {
    type: Boolean,
    default: false,
    required: true
  },
  completedAt: {
    type: Number,
    default: null
  }
});
todoSchema.queries('list', {readAll: true});

var Todo = gs.model('Todo', todoSchema);

module.exports = {Todo};
