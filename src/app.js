const express = require("express");
const validateZip = require("./middleware/validateZip");
const getZoos = require("./utils/getZoos");
const app = express();

app.get("/zoos/all", (req, res, next) => {
  const allZoos = getZoos();
  const admin = req.query.admin;
  if (admin === "true" && allZoos) {
    res.send(`All zoos: ${allZoos.join("; ")}`);
  } else {
    next("You do not have access to that route.");
  }
});

app.get("/check/:zip", validateZip, (req, res) => {
  const zip = req.params.zip;
  console.log(zip);

  const zooZips = getZoos(zip);
  if (zooZips) {
    res.send(`${zip} exists in our records.`);
  } else {
    res.send(`${zip} does not exist in our records.`);
  }
});

app.get("/zoos/:zip", validateZip, (req, res, next) => {
  const zip = req.params.zip;
  const zooZips = getZoos(zip);
  if (zooZips && zooZips.length) {
    res.send(`${zip} zoos: ${zooZips.join("; ")}`);
  } else {
    next(`${zip} has no zoos.`);
  }
});
app.use((req, res, next) => {
  next("That route could not be found!");
});

app.use((error, req, res, next) => {
  console.error(error);
  res.send(error);
});

module.exports = app;
