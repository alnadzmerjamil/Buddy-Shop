const express = require('express');
const app = express();
const port = process.env.port || 8080;

const mongoose = require('mongoose');
const mongourl =
  process.env.mongourl || 'mongodb://localhost:27017/fullStackDB';
mongoose.connect(mongourl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
let db = mongoose.connection;
db.once('open', () => {
  console.log('success! connected to DB');
});
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
const User = require('./models/User');
const Category = require('./models/Category');
const Item = require('./models/Item');
const Order = require('./models/Order');
const auth = require('./auth.js');
//starts here

//this is to get orders of a particular user
app.get('/users/:_id', (req, res) => {
  User.findById(req.params._id)
    .populate('orders')
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.send('no way!');
      }
    });
});
app.get('/all', (req, res) => {
  User.find().then((user) => {
    if (user) {
      res.send(user);
    } else {
      res.send('no way!');
    }
  });
});
app.post('/register', (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      res.send({ error: `Username is already used` });
    } else {
      bcrypt.hash(req.body.password, 10).then((hashedPW) => {
        const newUser = new User(req.body);
        newUser.password = hashedPW;
        newUser.save().then((user) => {
          res.send(user);
        });
      });
    }
  });
});

app.post('/login', (req, res) => {
  User.findOne({ username: req.body.username }).then((user) => {
    if (user) {
      bcrypt.compare(req.body.password, user.password).then((match) => {
        if (match) {
          let token = auth.createAccessToken(user);
          res.send({ user, token });
        } else {
          res.send({ error: 'from match' });
        }
      });
    } else {
      res.send({ error: 'from user' });
    }
  });
});

app.put('/updateuser/:_id', (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body).then((user) =>
    res.send(user)
  );
});

app.delete('/deleteuser/account/:_id', (req, res) => {
  User.findByIdAndDelete(req.params._id).then((accountname) => {
    res.send(accountname);
  });
});

// for categories

//to get all the categories
app.get('/getcategory', (req, res) => {
  Category.find().then((allCategories) => {
    console.log(allCategories);
    res.send(allCategories);
  });
});

//for new main category/new main and sub category
app.post('/addcategory', (req, res) => {
  let newCategory = new Category(req.body);
  newCategory.save().then((newSavedCategory) => res.send(newSavedCategory));
});

//for new sub category only
app.post('/addcategory/:_id/subcategory', auth.isAdmin, (req, res) => {
  Category.findById(req.params._id).then((category) => {
    category.sub.push(req.body.sub);
    category.save().then((cat) => {
      res.send(cat);
    });
  });
});

//to update the main category / sub category
app.put('/editcategory/:_id', auth.isAdmin, (req, res) => {
  Category.findByIdAndUpdate(req.params._id, req.body).then((category) => {
    res.send(category);
  });
});

//to delete maincategory only
app.delete('/deletecategory/:_id', auth.isAdmin, (req, res) => {
  Category.findByIdAndDelete(req.params._id).then((deletedCat) => {
    res.send(deletedCat);
  });
});

//get all items to display
app.get('/getitems', (req, res) => {
  Item.find().then((allItems) => {
    res.send(allItems); // console.log(allItems);
  });
});
//add item (AddItemForm)
app.post('/additem', auth.isAdmin, (req, res) => {
  let newItem = new Item(req.body);
  newItem.save().then((newSavedItem) => {
    res.send(newSavedItem);
  });
});

//update/edit item (EditItemForm.js)
app.put('/updateitem/:_id', auth.isAdmin, (req, res) => {
  Item.findByIdAndUpdate(req.params._id, req.body).then((originalItem) => {
    res.send(originalItem);
  });
});
//delete item (DisplayItem.js)
app.delete('/deleteitem/:_id', auth.isAdmin, (req, res) => {
  Item.findByIdAndDelete(req.params._id).then((deletedItem) => {
    res.send(deletedItem);
  });
});

// get order to put on local storage @ admin view
app.get('/getorder', (req, res) => {
  Order.find().then((allOrders) => {
    res.send(allOrders);
  });
});

app.post('/order', (req, res) => {
  let newOrder = new Order(req.body);
  newOrder.save().then((myOrder) => {
    User.findById(myOrder.user).then((user) => {
      user.orders.push(myOrder._id);
      user.save().then((user) => {
        res.send(user);
      });
    });
  });
});

//update order status by admin (acceptAll)
app.put('/acceptorder/:_id', auth.isAdmin, (req, res) => {
  Order.findByIdAndUpdate(req.params._id, req.body.status).then(
    (originalStatus) => {
      Order.findById(req.params._id).then((order) => {
        order.items.forEach((item) => {
          console.log(item.status);
          if (item.status === 'pending' || item.status === 'accepted') {
            console.log(item.status);
            item.status = req.body.statusOfIndividualItem;
          }
        });
        order.save().then((originalStatus) => {
          res.send(originalStatus);
        });
      });
    }
  );
});

//update order status by admin accept individual item
app.put('/acceptindividual/:_id', auth.isAdmin, (req, res) => {
  if (req.body.status) {
    Order.findByIdAndUpdate(req.params._id, req.body.status).then(
      (originalStatus) => {
        // res.send(originalStatus.items);
        Order.findById(req.params._id).then((order) => {
          order.items.forEach((item) => {
            if (item._id == req.body.idOfIndividualItem) {
              item.status = req.body.statusOfIndividualItem;
            }
          });
          order.save().then((updatedStatus) => {
            res.send(updatedStatus); //may error itong senisend
          });
        });
      }
    );
  } else {
    //only individual item has to be updated
    Order.findById(req.params._id).then((order) => {
      order.items.forEach((item) => {
        if (item._id == req.body.idOfIndividualItem) {
          item.status = req.body.statusOfIndividualItem;
        }
      });
      order.save().then((updatedStatus) => {
        res.send(updatedStatus);
      });
    });
  }
});

//received order 1x1 by user (Transaction.js)
app.put('/receiveorder/:_id', auth.isOwner, (req, res) => {
  if (req.body.status) {
    Order.findByIdAndUpdate(req.params._id, req.body.status).then(
      (originalOrder) => {
        Order.findById(req.params._id).then((order) => {
          order.items.forEach((item) => {
            if (item._id == req.body.idOfIndividualItem) {
              item.status = req.body.statusOfIndividualItem;
              console.log(item.name);
            }
          });
          order.save().then((updatedStatus) => {
            res.send(updatedStatus);
          });
        });
      }
    );
  } else {
    Order.findById(req.params._id).then((order) => {
      order.items.forEach((item) => {
        if (item._id == req.body.idOfIndividualItem) {
          item.status = req.body.statusOfIndividualItem;
          console.log(item.name);
        }
      });
      order.save().then((updatedStatus) => {
        res.send(updatedStatus);
      });
    });
  }
});

//cancel individual
app.put('/cancelorder/:_id', auth.isOwner, (req, res) => {
  Order.findById(req.params._id).then((order) => {
    order.items.forEach((item, index) => {
      if (item._id == req.body.idOfIndividualItem) {
        console.log(
          'item id  ' + item._id + ' reqbody id ' + req.body.idOfIndividualItem
        );
        order.items.splice(index, 1);
      }
    });
    order.save().then((originalStatus) => {
      res.send(originalStatus);
    });
  });
});

//cancel order/delete on myCart
app.delete('/cancelorder/:_id', auth.isOwner, (req, res) => {
  Order.findByIdAndDelete(req.params._id).then((deletedOrder) => {
    res.send(deletedOrder);
  });
});
//
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
