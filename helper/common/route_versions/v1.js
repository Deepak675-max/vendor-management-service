const express = require("express");
const v1 = express.Router();

const { vendorRouter } = require('../../../routes/vendor.route');
v1.use('/vendor', vendorRouter);


module.exports = {
  v1
};
