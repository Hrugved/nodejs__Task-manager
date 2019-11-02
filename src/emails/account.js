const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

sendWelcomeEmail = (email,name) => {
    sgMail.send({ // this is async but there is no need to 'await' as its not neccesary for user to get instant email
        to: email,
        from: 'pineappleiitian@gmail.com',
        subject: 'Welcome Email',
        text: `Hi ${name}! Welcome to our family`
    })
}

sendCancellationEmail = (email,name) => {
    sgMail.send({ // this is async but there is no need to 'await' as its not neccesary for user to get instant email
        to: email,
        from: 'pineappleiitian@gmail.com',
        subject: 'Cancellation Email',
        text: `Hi ${name}! Goodbye from our family`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}