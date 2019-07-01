const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const db = require('../middleware/db');

const {SECRET_KEY} = require('../config');

router.get('/', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  const {name} = req.user;
  const sql = `select * from info where receiver='${name}'`;
  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result,
      message: ''
    })
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      data: {},
      message: 'Error in Server'
    })
  }

});

router.post('/', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  const {name} = req.user;
  const {type, detail} = req.body;

  if (type === undefined || !detail) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  } else {

    const sql = `update info set info.read=1 where receiver='${name}' and type=${type} and detail='${detail}'`;
    try {
      await db.query(sql);
      res.json({
        status: 'success',
        data: {},
        message: ''
      })
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: 'error',
        data: {},
        message: 'Error in Server'
      })
    }
  }
});

module.exports = router;