const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const router = express.Router();
const uuid = require('node-uuid');

const db = require('../middleware/db');
const {bcrypt} = require('../utils');
const {SECRET_KEY, FILE_ROOT} = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, FILE_ROOT),
    filename: (req, file, cb) => {console.log(file);cb(null, `${uuid.v4()}.${file.mimetype.split('/')[1]}`);},
  }
);

const upload = multer({storage});

router.post('/', upload.single('file'), async (req, res, next) => {

  delete req.body.code;
  req.body.profile_photo = req.file.filename;
  let sql = 'select * from user where email=?';
  let insert = `insert into user (${Object.keys(req.body).join(',')}) values(${Array.apply(null, Array(Object.keys(req.body).length)).map(() => '?').join()})`;

  const {email, password} = req.body;

  if (!email || !password) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    });
  }

  console.log(req.file);

  try {
    let result = await db.query(sql, email);

    if (result.length) {
      res.json({
        status: 'error',
        data: {},
        message: "Email address already exist, please log in."
      })
    } else {
      let hashed = await bcrypt.hashAsync(password, 10);
      console.log(hashed);
      req.body.password = hashed;
      await db.query(insert, Object.values(req.body));
      res.json({
        status: 'success',
        data: {
          token: jwt.sign({
            name: email,
            date: new Date()
          }, SECRET_KEY)
        },
        message: "",
      })
    }
  } catch (e) {
    console.log(e);
    res.json(500, {
      status: 'error',
      data: {},
      message: "Error in Sever"
    })
  }
});

module.exports = router;
