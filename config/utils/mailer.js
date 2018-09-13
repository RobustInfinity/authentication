const nodeMailer = require('nodemailer');
const email = require('../email');
const config = require('../config');
const mailer = {
    createMail:function(data, type){
        var that = this;
        var to = "";
        var text = "";
        var htmlBody = "";
        switch(type){
            case "forgotPassword":
                to = data.useremail;
                subject = email.forgotPassword.subject;
                text = "Please click this link to reset password "+ data.url;
                htmlBody = "Please click this link to reset password <a href=' " + data.url + " ' > Here </a> \n"
                            + "This mail was generted on your request to reset password.Ignore if not requested.";
                that.sendMail(to, subject, text, htmlBody);
                break;
            case "forgotUserName" :
                to = data.useremail;
                subject = email.forgotUserName.subject;
                text = "Please click this link to reset username "+ data.url;
                htmlBody = "Please click this link to reset username <a href=' " + data.url + " ' > Here </a> \n"
                            + "This mail was generted on your request to reset username.Ignore if not requested.";
                that.sendMail(to, subject, text, htmlBody);
                break;
        }
    },
    sendMail:function(To,Subject,EmailText,Html_Body){
        // console.log('config utils sendMail');
        // var URL="smtps://"+config.SMTPS_EMAIL+":"+config.SMTPS_PASSWORD+"@"+config.SMTPS_URL;
        
        var transporter = nodeMailer.createTransport({
            service: config.SMTP_SERVICE,
            auth: {
                user: config.SMTP_MAIL_ID,
                pass: config.SMTP_MAIL_PASS
            }
        });
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: config.COMPANY_NAME+ '<h='+email.admin+'>' , // sender address
            to: To, // list of receivers
            subject: Subject, // Subject line
            text: EmailText, // plaintext body
            html: Html_Body // html body
        };

    // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log("seinfing mail error",error);
            }
            if (info != undefined) {
                console.log('Message sent: ' + info.response);
            } else {
                console.log("error sending mail");
            }
        });
    },
};
module.exports = mailer;