const gs = require('gstore-node')();
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const userSchema = new gs.Schema({
  email: {
    type: String,
    required: true,
    sanitize: 'trim',
    validate: 'isEmail'
  },
  password: {
    type: String,
    required: true,
    excludedFromIndexes: true
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

function hashPassword () {
  const user = this;
  password = user.password;

  if (!password) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
          user.password = hash;
      });
    });

    return resolve();
  });
};
userSchema.pre('save', hashPassword);
userSchema.queries('list', {readAll: false});

userSchema.methods.toJSON = function () {
  var user = this;
  return _.pick(user, ['entityKey.id', 'email']);
};

userSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({id: user.entityKey.id.toString(), access}, 'abc123').toString();
  user.tokens = [];
  user.tokens.push({access, token});

  return user.save().then(() => {
    return token;
  });
};

userSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject();
  };
  return User.findOne({
    // 'entityKey.id': decoded.id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({
    email: email
  }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
           resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};


var User = gs.model('User', userSchema);

module.exports = {User};
