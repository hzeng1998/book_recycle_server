const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const pool = require('../middleware/db');
const { bcrypt } = require('../utils');
const { SECRET_KEY } = require('../config');

router.post('/', async (req, res, next) => {
  console.log(req.body);
  let sql = 'select password from user where email=?';

  const {email, password} = req.body;

  if (!email || !password) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  }

  try {
    let result = await pool.query(sql, email);
    console.log(result[0].password);

    let flag = await bcrypt.compareAsync(password, result[0].password);
    flag ? res.json({
      status: 'success',
      data: {
        token: jwt.sign({
          name: email,
          date: new Date()
        }, SECRET_KEY)
      },
      message: ""
    }) : res.json({
      status: 'error',
      data: {},
      message: "Password or Email Address Error"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      data: {},
      message: "Error in Sever"
    })
  }
});

module.exports = router;