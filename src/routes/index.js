var express = require('express');
var router = express.Router();
var insertAfter = require('../scripts/fileModule');

router.get('/', (req, res, next) => {
  res.render('index');
})

router.get('/create', function(req, res, next) {
  let data = "";
  let bool = false;
  const params = req.query;
  if(params.action == "edit") {
    const selection = insertAfter.readSection("customApi.js", params.type, params.name);
    data = selection.join('\r\n');
  } 
  else {
    bool = true; 

  }

  const fileData = {data: data, bool: bool, type: params.action, replace: params.type, collection: params.name};

  res.render('api', {fileData: fileData});
});

router.get('/login', function(req, res, next) {
  res.render('login');
});
router.post('/login', function(req, res, next) {
  console.log(req.body.txt);
  if(req.body.email === "501020@vistacollege.nl" && req.body.password === "Hv7bJZnjxzNElJ2") {
    res.cookie('_login',"jSn6lX27OyVE39YzlaDEHN8SiSdDfqavehlBrobdDPsKA4S03AUfjpI3jR1npcKD", {maxAge: 24 * 60 * 60 * 1000});
  }
  res.redirect('/');
});

router.post('/insertAfter', (req, res, next) => {
  //verify token

  const data = req.body.insertText;
  let lines = data.split(/\r?\n/);
  if(req.body.type == "edit") {
    insertAfter.insertAfter("customApi.js", req.body.replace, req.body.collection, lines);
  }
  else {
    insertAfter.insertNewApi("customApi.js", req.body.collection, lines)
  }

  res.redirect('/'); 
})

router.get('/createCollection', (req, res, next) => {
  let type = req.query.type == "collection" ? "COLLECTION" : "API";
  let apiColName = req.query.colname == null ? null : req.query.colname;

  insertAfter.addCollection("customApi.js",req.query.name ,type, apiColName);
  res.send();
})

router.get('/getContentNames/:readType/:collectionName?', (req, res, next) => {
  res.header('Content-Type', 'application/json');
  res.json({data: insertAfter.getNames('customApi.js', req.params.readType)})
})
module.exports = router;
