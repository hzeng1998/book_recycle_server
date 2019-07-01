const express = require('express');
const router = express.Router();
const db = require('../middleware/db');

/* GET users listing. */
router.get('/', async (req, res, next) => {
  const {email} = req.query;

  if (!email || [undefined, 'undefined'].includes(email)) {
    res.json({
      status: 'error',
      data: {},
      message: "Params Error"
    })
  } else {
    const sql = `select * from user where email='${email}'`;
    try {
      let result = await db.query(sql);
      res.json({
        status: 'success',
        data: {
          [email]: {...result[0], profile_photo: 'profile/' + result[0].profile_photo}
        },
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
