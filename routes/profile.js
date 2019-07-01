const express = require('express');
const router = express.Router();
const db = require('../middleware/db');
const jwt = require('express-jwt');

const { SECRET_KEY } = require('../config');
const FILE_ROOT = 'profile/';

router.get('/', jwt({secret: SECRET_KEY}), async (req, res, next) => {

  const sql = `select * from user where email='${req.user.name}'`;

  try {
    let result = await db.query(sql);
    delete result[0].password;
    res.json({
      status: "success",
      data: {
        ...result[0],
        profile_photo: FILE_ROOT + result[0].profile_photo
      },
      message: ""
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

module.exports = router;
