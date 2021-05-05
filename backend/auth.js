const jwt = require('jsonwebtoken');
const secret = 'AlnadzmerMabbolJamil';

const createAccessToken = (user) => {
  let userCopy = {
    _id: user._id,
    username: user.username,
    role: user.role,
  };
  return jwt.sign(userCopy, secret, {});
  //jwt.sign is to encrypt
  //jwt malformed if token is invalid
};

//admin authorization
const isAdmin = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization.slice(7), secret, (err, data) => {
      if (err) {
        res.send({ error: `We cannot verify your token` });
      } else {
        console.log(req.headers.role);
        if (data.role === req.headers.role) {
          next();
        } else {
          res.send({ error: `Role is not allowed` });
        }
      }
    });
  } else {
    res.send({ error: `Authorization error` });
  }
};
const isOwner = (req, res, next) => {
  if (req.headers.authorization) {
    jwt.verify(req.headers.authorization.slice(7), secret, (err, data) => {
      if (err) {
        res.send({ error: `We cannot verify your token` });
      } else {
        // console.log(req.headers.role);
        if (data.role === req.headers.role) {
          next();
        } else {
          res.send({ error: `Role is not allowed` });
        }
      }
    });
  } else {
    res.send({ error: `Authorization error` });
  }
};

module.exports = {
  createAccessToken,
  isAdmin,
  isOwner,
};
