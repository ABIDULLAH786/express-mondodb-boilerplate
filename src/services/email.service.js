const nodemailer = require('nodemailer');
const path = require('path');

var hbs = require('nodemailer-express-handlebars');
const ErrorHandler = require('../utils/errorHandler');
const { HTTP_STATUS_CODES } = require('../utils/status_codes');

const handlebarOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: path.resolve('./src/views'),
        defaultLayout: false,
    },
    viewPath: path.resolve('./src/views'),
    extName: '.hbs',
};
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "abid.qarar2@gmail.com",// process.env.SMTP_USER,
        pass: "jgdu sija kbpb awme"//process.env.SMTP_PASSWORD,
    },
});

/**
 * Send verification email
 * @param {object} user
 * @param {string} token
 * @returns {Promise}
 */
module.exports.sendVerificationEmail = async (user, token, options = "") => {
    transport.use('compile', hbs(handlebarOptions));
    const subject = options?.subject || 'Account Verification';

    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://localhost:3000/verify-email?token=${token}`;

    const message = {
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to: user?.email || 'abidullah.bsef18@iba-suk.edu.pk',
        subject: subject,
        template: 'verifyAccount',
        context: {
            userName: user?.name || '',
            email: user?.email || '',
            url: verificationEmailUrl,
            token: token,
            companyName: "AK TECH",
        },
    };
    const mailSent = await transport.sendMail(message).catch((e) => {
        console.log('error in sending link for email varification', e)
        throw new ErrorHandler(e, HTTP_STATUS_CODES.BAD_REQUEST)
    });

};

/**
 * testing email service/configuration
 * @param {string} email
 * @returns {Promise}
 */
module.exports.testEmail = async (email) => {
    transport.use('compile', hbs(handlebarOptions));
    const subject = 'Testing Email';

    const message = {
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to: email || 'abidullah.bsef18@iba-suk.edu.pk',
        subject: subject,
        template: 'email',
        context: {
            companyName: "AK TECH",
        },
    };
    const mailSent = await transport.sendMail(message).catch((e) => {
        console.log('error in sending link for email varification', e)
        throw new ErrorHandler(e, HTTP_STATUS_CODES.BAD_REQUEST)
    });

};


/**
 * Send Verified email
 * @param {object} user
 * @param {string} options
 * @returns {Promise}
 */
module.exports.sendVerifiedConfirmation = async (user, options = {}) => {
    transport.use('compile', hbs(handlebarOptions));
    const subject = options?.subject || 'Account Verified';

    const message = {
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to: user?.email || 'abidullah.bsef18@iba-suk.edu.pk',
        subject: subject,
        template: 'verified',
        context: {
            userName: user?.name || '',
            email: user?.email || '',
        },
    };
    const res = await transport.sendMail(message).catch((e) => {
        console.log("Error in sending verification confirmation email")
        throw new ErrorHandler(e, HTTP_STATUS_CODES.BAD_REQUEST)
    });

};


/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
module.exports.sendResetPasswordEmail = async (user, token, options = {}) => {
    transport.use('compile', hbs(handlebarOptions));
    const subject = options?.subject || 'Password Rest Request';

    // replace this url with the link to the email verification page of your front-end app
    const url = `http://localhost:3000/set-new-password?token=${token}`;

    const message = {
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to: user?.email || 'abidullah.bsef18@iba-suk.edu.pk',
        subject: subject,
        template: 'forgetPassword',
        context: {
            userName: user?.name || '',
            email: user?.email || '',
            url: url,
            token: token,
            companyName: "AK TECH",
        },
    };
    const mailSent = await transport.sendMail(message).catch((e) => {
        console.log('error in sending link for password reset', e)
        throw new ErrorHandler(e, HTTP_STATUS_CODES.BAD_REQUEST)
    });

};



