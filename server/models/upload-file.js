const gs = require('gstore-node')();

const uploadSchema = new gs.Schema({
  name: {
    type: String,
    required: true,
    sanitizer: 'trim'
  },
  path: {
    type: String,
    required: true
  },
  extension: {
    typpoe: String,
    default: null,
    required: true
  },
  caption: {
    type: Number,
    default: null
  },
  user_id: {
    type: String,
    default: " 5639445604728832",
    required:true
  },
  hash: {
    type: String,
    default: null
  },
  public: {
    type: Boolean,
    default: false,
    required: true
  },
  deleted_at: {
    type: Date, 
    default: null, 
    write: false, 
    read: false
  },
  created_at: {
    type: String, 
    default: gs.defaultValues.NOW, 
    write: false, 
    read: false
  },
  updated_at: {
    type: String, 
    default: gs.defaultValues.NOW, 
    write: false, 
    read: false
  }
});
uploadSchema.queries('list', {readAll: true});

var Upload = gs.model('Upload', uploadSchema);

module.exports = {Upload};
