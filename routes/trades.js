const express = require('express');
const router = express.Router();
const db = require('../middleware/db');
const jwt = require('express-jwt');

const {SECRET_KEY} = require('../config');

router.get('/', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  let {id} = req.query;
  let {name} = req.user;


  let sql = '';
  if (id === undefined) {
    sql = `select * from trade_order where (buyer='${name}' or seller='${name}')`;
  } else {
    sql = `select * from trade_order where (id=${id}) and (buyer='${name}' or seller='${name}')`;
  }

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
      message: "Error in Server"
    })
  }
});

router.put('/', jwt({secret: SECRET_KEY}), async (req, res, next) => {
  const {name} = req.user;
  const {id, address, price, way} = req.body;
  if (id === undefined || !address || price === undefined || way === undefined) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  } else {
    try {
      const selectSql = `select * from trade where id=${id}`;
      let result = await db.query(selectSql);

      let seller = result[0].owner;
      const insertSql = `insert into trade_order (address, buyer, price, seller, trade_id, status, way) values('${address}','${name}',${price},'${seller}',${id},0,${way})`;

      let ret = await db.query(insertSql);
      const insertInfo = `insert into info (type,receiver,detail) values(1,'${seller}','${ret.insertId}')`;
      await db.query(insertInfo);

      res.json({
        status: 'success',
        data: {},
        message: 'Success'
      })
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: 'error',
        data: {},
        message: 'Error In Server'
      })
    }
  }
});


router.get('/confirm', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  let {id, ok} = req.query;
  let {name} = req.user;


  if (id === undefined) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  } else {
    const cancelSql = `update trade_order set status=2 where id='${id}' and buyer='${name}'`;
    const confirmSql = `update trade_order set status=${ok} where id='${id}' and seller='${name}'`;
    const selectTradeSql = `select trade_id, buyer from trade_order where id='${id}'`;
    const updateSql = `update trade set trader=? where id=? and owner='${name}'`;
    const updateOtherTradeSql = `update trade_order set status=2 where trade_id=?`;
    try {
      let tradeInfo = await db.query(selectTradeSql);
      await db.query(updateSql, [tradeInfo[0].buyer, tradeInfo[0].trade_id]);
      await db.query(updateOtherTradeSql, [tradeInfo[0].trade_id]);
      await db.query(cancelSql);
      await db.query(confirmSql);
      res.json({
        status: 'success',
        data: {},
        message: 'Confirm Success'
      })
    } catch (e) {
      console.log(e);
      res.status(500).json({
        status: 'error',
        data: {},
        message: "Error in Server"
      })
    }
  }
});

module.exports = router;