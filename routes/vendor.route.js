const express = require('express');
const vendorRouter = express.Router();
const vendorController = require('../controllers/vendor.controller');
const jwtModule = require("../middlewares/jwt/jwt.middleware");

vendorRouter.post('/create-vendor', vendorController.createVendor);
vendorRouter.get('/get-vendors', jwtModule.verifyAccessToken, vendorController.getVendors);
vendorRouter.delete('/delete-vendor', jwtModule.verifyAccessToken, vendorController.deleteVendor);

module.exports = { vendorRouter };