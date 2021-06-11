const express = require("express");
const body_arser = require("body-parser");

const app = express();

let parents = require("./assets/Parent.json");
let children = require("./assets/Child.json");

app.use(body_arser.json());

app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
             'Content-Type,X-Requested-With,cache-control,pragma');

  next();
});

// define simple routes
app.get('/api/jsonPageData/:page', (req, res) => {

  let parentData = parents.data.map(parent => {
    parent.paidAmount = children.data.filter(child => child.parentId == parent.id).reduce((a,b) => a + b.paidAmount, 0)
    return parent;
  });

  const currentPage = req.params.page;
  const cntPerPage = 2;
  const totalPage = Math.ceil(parentData.length/cntPerPage);

  let pageResult = [];
  if (currentPage > 0) {
    pageResult = parentData.slice((currentPage - 1) * cntPerPage, currentPage * cntPerPage)
  } else {
    pageResult = []
  }
  res.json({
    "result": pageResult,
    "totalPage": totalPage,
    "currentPage": currentPage,
  })
});

app.post('/api/jsonChildData', (req, res) => {
  let parentId = req.body.parentId;
  let parent = parents.data.filter(parent => parent.id == parentId);
  let childArr = children.data.filter(child => child.parentId == parentId);
  res.json({
    result: {
      parent: parent,
      childArr: childArr.sort((a, b) => a - b),
    }
  })
});

app.listen(8000, () => {
  console.log('Server started at port 8000!');
});
