const express = require('express');
const validUrl = require('valid-url');
const { nanoid }  = require('nanoid');
const { Url } = require('../models/url');

const router = express.Router();

router.post('/', (req, res) => {
  console.log(req.body);
  const originalUrl = req.body.originalUrl;

  if (!validUrl.isUri(originalUrl)) {
    return res.status(400).send();
  }

  Url.findOne({ originalUrl }).then(url => {
    if (!url) {
      const shortenedUrl = nanoid(6);
      const newUrlObj = new Url({
        originalUrl,
        shortenedUrl,
        urlClickCount: 0,
        lastAccessed: null,
        createdAt: Date.now()
      })

      newUrlObj.save().then(url => {
        console.log(url);
        res.send(url);
      }).catch(err => {
        console.log(err);
      })
    } else {
      res.status(200).send('URL already exists in the db.');
    }
  })
});

router.post('/custom', (req, res) => {
  const originalUrl = req.body.originalUrl;
  const shortenedUrl = req.body.shortenedUrl;

  if (!validUrl.isUri(originalUrl)) {
    res.status(400).send()
  }

  Url.findOne({ shortenedUrl }).then(url => {
    if (!url) {
      const newUrlObj = new Url({
        originalUrl,
        shortenedUrl,
        urlClickCount: 0,
        lastAccessed: null,
        createdAt: Date.now()
      })

      newUrlObj.save().then(url => {
        console.log(url);
        res.send(url);
      }).catch(err => {
        console.log(err);
      })
    } else {
      res.status(200).send('This shortcode has already been used. Please select another.')
    }
  })
});

router.get('/:shortcode', async (req, res) => {
  const code = req.params.shortcode;

  const url = await Url.findOne({ shortenedUrl: code });

  try {
    if (!url) {
      res.status(400).send('No such code exists in the database.');
    } else {
      let urlClickCount = url.urlClickCount;
      let lastAccessed = url.lastAccessed;

      let today = new Date();
      let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
      let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let dateTime = date + ' ' + time;

      urlClickCount += 1;
      lastAccessed = dateTime;
  
      await url.updateOne({ urlClickCount, lastAccessed });
      res.redirect(url.originalUrl);
    }
  } catch (err) {
    console.log(err);
  }
})

router.get('/:shortcode/stats', async (req, res) => {
  const code = req.params.shortcode;

  const url = await Url.findOne({ shortenedUrl: code });

  try {
    if (!url) {
      res.status(400).send('No such code exists in the database.');
    } else {
      const desiredStats = {
        lastAccessed: url.lastAccessed,
        urlClickCount: url.urlClickCount
      }
      res.send(desiredStats);
    }
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
