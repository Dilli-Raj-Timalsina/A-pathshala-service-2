const AppError = require("../errors/appError");
const catchAsync = require("../errors/catchAsync");
const User = require("../models/userSchema");
const { sendMailNormal, sendMailPayMent } = require("../utils/email");

//1:) return all user profile information :
const profileControl = catchAsync(async (req, res, next) => {
    //extract all user Information:
    const { _id, name, email, course, profilePicture, contact } = req.user;
    //send required profile information:
    res.status(200).json({
        _id,
        name,
        email,
        course,
        profilePicture,
        contact,
        haveEnrolled,
    });
});

//2:) verify payment:
const verifyPaymentControl = catchAsync(async (req, res, next) => {
    //extract all user Information:
    const paymentName = req.body.name;
    const paymentEmail = req.body.email;
    const paymentContact = req.body.contact;

    if (!(await User.findOne({ email: req.user.email }))) {
        throw new AppError(
            "User doesnot Exist please signup first before registration",
            409
        );
    }

    //update the purchase of user :

    User.findOneAndUpdate(
        { email: req.user.email },
        {
            $set: {
                paymentEmail: paymentEmail,
                paymentContact: paymentContact,
                paymentName: paymentName,
                haveEnrolled: true,
            },
        }
    );
    //d) preparing credentials to send user an email:
    const options = {
        email: req.user.email,
        subject: "Hey Payment from A+ pathshala",
        message: ` 
         paymentName : ${paymentName} ,
         paymentEmail :${paymentEmail} ,
         paymentContact : ${paymentContact} ,
         from signin with:
         Email :${req.user.email} ,
        `,
    };
    //e) send reset password link to the user's email
    await sendMailPayMent(options, req.file);

    const { _id, name, course, profilePicture, role } = req.user;
    const userProfile = {
        _id,
        name,
        email,
        course,
        profilePicture,
        contact,
        role,
        haveEnrolled: true,
    };
    //f) if everything succeds then send success message
    res.status(200).json({
        status: "success",
        message: "checkout your email to see who have registered.",
        userProfile,
    });
});

// /2:) contact us route:
const contactUsControl = catchAsync(async (req, res, next) => {
    //extract all user Information:
    const { name, email, subject, message, contact } = req.body;

    //d) preparing credentials to send user an email:
    const options = {
        email: email,
        subject: subject,
        message: ` 
         Name : ${name} ,
         Email :${email} ,
         contact : ${contact} ,
         message : ${message},
        `,
    };
    //e) send reset password link to the user's email
    await sendMailNormal(options);

    //f) if everything succeds then send success message
    res.status(200).json({
        status: "success",
        message: "checkout your email for contact information",
    });
});

module.exports = {
    profileControl,
    contactUsControl,
    verifyPaymentControl,
};
