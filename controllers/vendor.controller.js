const httpErrors = require("http-errors");
const { vendorModel } = require("../models/vendor.model");
const bcrypt = require("bcrypt");
const jwtModule = require("../middlewares/jwt/jwt.middleware");
const joiVendor = require("../helper/joi/vendor.validation_schema")

const createVendor = async (req, res, next) => {
    try {
        const vendorDetails = await joiVendor.createVendorSchema.validateAsync(req.body);

        const doesVendorExist = await vendorModel.findOne({
            email: vendorDetails.email,
            isDeleted: false,
        });

        if (doesVendorExist) throw httpErrors.Conflict(`vendor with email: ${vendorDetails.email} already exist.`);

        vendorDetails.password = await bcrypt.hash(vendorDetails.password, 10);

        const newvendor = new vendorModel(vendorDetails);

        await newvendor.save();

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Vendor created successfully."
                }
            })
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

const getVendors = async (req, res, next) => {
    try {
        const vendors = await vendorModel.find({
            isDeleted: false,
        })

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    vendors: vendors,
                    message: "Vendor fetched successfully."
                }
            })
        }
    } catch (error) {
        next(error);
    }
}

const deleteVendor = async (req, res, next) => {
    try {
        const queryDetails = await joiVendor.deleteVendorSchema.validateAsync(req.body);

        const vendor = await vendorModel.findOne({
            _id: queryDetails.vendorId,
            isDeleted: false,
        });

        if (!vendor) throw httpErrors.NotFound('Invalid vendor id');

        await vendorModel.updateOne(
            {
                _id: queryDetails.vendorId,
                isDeleted: false,
            },
            {
                $set: {
                    isDeleted: true
                }
            },
        );

        if (res.headersSent === false) {
            res.status(200).send({
                error: false,
                data: {
                    message: "Vendor deleted successfully."
                }
            })
        }


    } catch (error) {
        next(error);
    }
}

// const loginVendor = async (req, res, next) => {
//     try {
//         const vendorDetails = await joiVendor.loginVendorSchema.validateAsync(req.body);

//         const doesVendorExist = await vendorModel.findOne({
//             email: vendorDetails.email,
//             isDeleted: false
//         })

//         if (!doesVendorExist) throw httpErrors[400]("Invalid email or password.");

//         const isPasswordMatch = await bcrypt.compare(vendorDetails.password, doesVendorExist.password);

//         if (!isPasswordMatch)
//             throw httpErrors.NotFound('invalid credentials.');

//         const jwtAccessToken = await jwtModule.signAccessToken({
//             vendorId: doesVendorExist._id,
//             email: doesVendorExist.email
//         });

//         if (res.headersSent === false) {
//             res.status(200).send({
//                 error: false,
//                 data: {
//                     vendor: {
//                         vendorId: doesVendorExist._id,
//                         vendorName: doesVendorExist.vendorName,
//                         email: doesVendorExist.email
//                     },
//                     token: jwtAccessToken,
//                     message: "Vendor login successfully",
//                 },
//             });
//         }

//     } catch (error) {
//         next(error);
//     }
// }

// const getVendorFromToken = async (req, res, next) => {
//     try {
//         const vendorDetails = {
//             vendorId: req.vendor._id,
//             vendorName: req.vendor.vendorName,
//             email: req.vendor.email,
//         };
//         if (res.headersSent === false) {
//             res.status(200).send({
//                 error: false,
//                 data: {
//                     vendor: vendorDetails,
//                     message: "Vendor fetched successfully",
//                 },
//             });
//         }
//     } catch (error) {
//         next(error);
//     }
// }

// const logoutVendor = async (req, res, next) => {
//     try {
//         // Check if Payload contains appAgentId
//         if (!req.vendor._id) {
//             throw httpErrors.UnprocessableEntity(
//                 `JWT Refresh Token error : Missing Payload Data`
//             );
//         }
//         // Delete Refresh Token from Redis DB
//         await jwtModule
//             .removeToken({
//                 vendorId: req.vendor._id,
//             })
//             .catch((error) => {
//                 throw httpErrors.InternalServerError(
//                     `JWT Access Token error : ${error.message}`
//                 );
//             });

//         res.status(200).send({
//             error: false,
//             data: {
//                 message: "Vendor logged out successfully.",
//             },
//         });
//     } catch (error) {
//         next(error);
//     }
// }


module.exports = {
    createVendor,
    getVendors,
    deleteVendor,
    // loginVendor,
    // logoutVendor,
    // getVendorFromToken
}