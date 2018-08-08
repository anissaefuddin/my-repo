require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
var uploadServer = require("./models/files.js");

var {gs} = require('./db/datastore');
var {User} = require('./models/user');
var {Todo} = require('./models/todo');
var {Upload} = require('./models/upload-file');
var {authenticate} = require('./middleware/authenticate');

const port = process.env.PORT;
var app = express();
var myBucket = "my-repo-bucket";

//configuration bodyparser
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//uploads route
//name path caption extension user_id hash public
app.post('/uploads', (req, res) => {
  var upload = new Upload({
    name: req.body.name,
    path: req.body.path,
    caption: req.body.caption,
    extension: req.body.extension,
    user_id : req.body.user_id,
    public : req.body.public
  });
  uploadServer.uploadFile(myBucket,req.body.files);
  bucket.upload(req.body.file,function(err, file){
    upload.save()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
  });  
});
app.post('/uploadsFile', (req, res)=>{
  uploadServer.uploadFile(myBucket,req.body.files);
});


app.get('/uploads', (req, res) => {
  Upload.list()
    .then((upload) => {
      res.send({upload});
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});
app.get('/uploads/:id', (req, res) => {
  var id = req.params.id;

  Uploas.get(id).then((upload) => {
    if (!upload) {
      return res.status(404).send();
    };
    res.send(upload.plain());
  }).catch((e) => {
    res.status(400).send();
  });
});

app.patch('/upload/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['name','path','caption','extension','user_id',' public']);
  body.updated_at = new Date().getTime();
  
  Upload.update(id, body).then((upload) => {
    if (!upload) {
      return res.status(404).send();
    }
    res.send(upload.plain());
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/uploads/:id', (req, res) => {
  var id = req.params.id;
  Upload.delete(id).then((result) => {
    if (!result.success) {
      return res.status(404).send();
    };
    res.send(id);
  }).catch((e) => {
    res.status(400).send();
  });

});



//todos route
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
    completedAt: req.body.completedAt
  });
  todo.save()
    .then((data) => {
      res.send(data);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});


app.get('/todos', (req, res) => {
  Todo.list()
    .then((todos) => {
      res.send({todos});
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  Todo.get(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    };
    res.send(todo.plain());

  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  Todo.delete(id).then((result) => {
    if (!result.success) {
      return res.status(404).send();
    };
    res.send(id);
  }).catch((e) => {
    res.status(400).send();
  });

});

app.patch('/todos/:id', (req,res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  };

  Todo.update(id, body).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send(todo.plain());
  }).catch((e) => {
    res.status(400).send();
  });
});

app.post('/users', (req, res) => {
  var body = _.pick(req.body,['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
     res.status(400).send(e);
  });
});


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body,['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
    
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
    console.log(`started on port ${port}`);
});

module.exports = {app};
