const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Vote = require('../models/Vote');

const Pusher = require('pusher');

const keys = require('../config/keys');

var pusher = new Pusher({
  appId: keys.pusherAppId,
  key: keys.pusherKey,
  secret: keys.pusherSecret,
  cluster: keys.pusherCluster,
  encrypted: keys.pusherEncrypted
});

router.get('/', (req, res) => {
  // get last 10 items
  Vote.find().sort({$natural:-1}).limit(10).then(votes => res.json({ success: true, votes: votes }));
});

router.post('/', (req, res) => {
  const newVote = {
    ID: req.body.ID,
    temp: req.body.temp
  };

  new Vote(newVote).save().then(vote => {
    pusher.trigger('ID-poll', 'ID-vote', {
      temp: parseInt(vote.temp),
      ID: vote.ID
    });

    return res.json({ success: true, message: 'Thank you for voting' });
  });
});

module.exports = router;
