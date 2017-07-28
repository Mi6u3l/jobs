const mongoose = require('mongoose');
require('dotenv').config({'path': '.env'});
mongoose.connect(`${process.env.MONGODB_URI}`);

const Lead = require('../models/Lead');

const leads = [
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Google',
    jobtitle: 'Software developer',
    status: 'Contacted',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png',
    contactperson: {
      name: 'Sergey Brin',
      email: 'sergey@google.com'
    }
  }
]

Lead.remove({}, createLeads);

function createLeads() {
  Lead.create(leads, (err, newLeads) => {
    if (err) {
      throw err;
    }
    newLeads.forEach((lead) => {
      console.log(lead.jobtitle);
    });
    mongoose.connection.close();
  });
}
