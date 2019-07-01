const express = require('express');
const router = express.Router();
const db = require('../middleware/db');
const multer = require('multer');
const jwt = require('express-jwt');
const uuid = require('node-uuid');

const {SECRET_KEY, FILE_ROOT} = require('../config');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, FILE_ROOT),
    filename: (req, file, cb) => {
      console.log(file);
      cb(null, `${uuid.v4()}.${file.mimetype.split('/')[1]}`);
    },
  }
);

const upload = multer({storage});

router.get('/all', async (req, res, next) => {
  if (req.query.page === undefined) {
    req.query.page = 0;
  }

  let {page, tag} = req.query;

  tag = tag ? tag.split(',') : [];

  const start = page * 12;
  const end = start + 12;

  let sql = '';

  if (tag.length)
    sql = `select * from trade where (trader is null) and (1=0 ${tag.map((t) => ('or type=' + t)).join(' ')}) limit ${start}, ${end}`;
  else
    sql = `select * from trade where trader is null limit ${start}, ${end}`;

  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result.map(r => ({...r, src: 'profile/' + r.src})),
      page: page,
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

router.get('/buy', async (req, res, next) => {
  if (req.query.page === undefined) {
    req.query.page = 0;
  }

  console.log((req.query));

  let {page, tag} = req.query;

  tag = tag ? tag.split(',') : [];

  console.log(tag);

  const start = page * 12;
  const end = start + 12;

  let sql = '';

  if (tag.length)
    sql = `select * from trade where (1=0 ${tag.map((t) => ('or type=' + t)).join(' ')}) and (order_type=0) and (trader is null) limit ${start}, ${end}`;
  else
    sql = `select * from trade where order_type=0 and trader is null limit ${start}, ${end}`;

  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result.map(r => ({...r, src: 'profile/' + r.src})),
      page: page,
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

router.get('/sell', async (req, res, next) => {
  if (req.query.page === undefined) {
    req.query.page = 0;
  }

  console.log((req.query));

  let {page, tag} = req.query;

  tag = tag ? tag.split(',') : [];

  console.log(tag);

  const start = page * 12;
  const end = start + 12;

  let sql = '';

  if (tag.length)
    sql = `select * from trade where (trader is null) and (1=0 ${tag.map((t) => ('or type=' + t)).join(' ')}) and (order_type=1) limit ${start}, ${end}`;
  else
    sql = `select * from trade where order_type=1 and trader is null limit ${start}, ${end}`;

  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result.map(r => ({...r, src: 'profile/' + r.src})),
      page: page,
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

router.get('/search', async (req, res, next) => {
  if (req.query.page === undefined) {
    req.query.page = 0;
  }

  console.log((req.query));

  let {page, word} = req.query;

  const start = page * 12;
  const end = start + 12;

  let sql = `select * from trade where title like '%${word}%' limit ${start}, ${end}`;

  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result.map(r => ({...r, src: 'profile/' + r.src})),
      page: page,
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

router.get('/my', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  const email = req.user.name;
  const sql = `select * from trade where owner='${email}'`;
  try {
    let result = await db.query(sql);
    res.json({
      status: 'success',
      data: result.map(r => ({...r, src: 'profile/' + r.src})),
      message: ''
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      status: 'error',
      data: {},
      message: 'Error in Server'
    })
  }
});


router.put('/', jwt({secret: SECRET_KEY}), (req, res, next) => {
  console.log(req.user);
  next()
});
router.put('/', upload.single('src'), async (req, res, next) => {

  let {order_type, title, intro, price, writer, fineness, type, url, isbn} = req.body;
  const email = req.user.name;
  const src = req.file.filename;

  order_type = Number(order_type);
  price = Number(price);
  fineness = Number(fineness);
  type = Number(type);

  console.log(req.body);

  if (isNaN(order_type)
    || isNaN(price)
    || title === undefined
    || intro === undefined
    || writer === undefined
    || isNaN(fineness)
    || !req.file
    || url === undefined
    || isNaN(type)
    || isbn === undefined) {
    res.json({
      status: 'error',
      data: {},
      message: 'Params Error'
    })
  } else {

    const sql = `insert into trade (order_type, owner, price, title, intro, writer, fineness, src, type, url, isbn) values(${order_type},'${email}',${price},'${title}','${intro}','${writer}',${fineness},'${src}',${type},'${url}','${isbn}')`;
    try {
      await db.query(sql);

      res.json({
        status: 'success',
        data: {},
        message: 'Publish Success'
      });
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