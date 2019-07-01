const express = require('express');
const router = express.Router();
const jwt = require('express-jwt');
const db = require('../middleware/db');

const {SECRET_KEY} = require('../config');

router.get('/list', jwt({secret: SECRET_KEY}), async (req, res, next) => {
  const {name} = req.user;
  const sql = `select * from (select * from message_log where (sender='${name}' or receiver='${name}')) a inner join (select sender,max(sendDate) as sendDate from message_log group by sender) b on a.sendDate=b.sendDate`;
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

router.get('/log', jwt({secret: SECRET_KEY}), async (req, res, next) => {
  const {name} = req.user;
  const {to} = req.query;

  if (!to || ['undefined', undefined].includes(to)) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  } else {

    const sql = `select * from message_log where (sender='${name}' and receiver='${to}') or (sender='${to}' and receiver='${name}') order by sendDate`;
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
  }
});

module.exports = router;