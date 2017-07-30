const mongoose = require('mongoose');
require('dotenv').config({'path': '.env'});
mongoose.connect(`${process.env.MONGODB_URI}`);

const Lead = require('../models/Lead');

const leads = [
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Google',
    jobtitle: 'Software developer',
    status: 'contacted',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1000px-Google_%22G%22_Logo.svg.png',
    contactperson: {
      name: 'Sergey Brin',
      email: 'sergey@google.com'
    }
  },
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Facebook',
    jobtitle: 'Junior Developr',
    status: 'contacted',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/2000px-F_icon.svg.png',
    contactperson: {
      name: 'Mark Zuckerberg',
      email: 'mark@facebook.com'
    }
  },
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Microsoft',
    jobtitle: 'Project Manager',
    status: 'contacted',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/2000px-Microsoft_logo.svg.png',
    contactperson: {
      name: 'Bill Gates',
      email: 'billgates@microsoft.com'
    }
  },
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Ironhack',
    jobtitle: 'Campus Manager',
    status: 'replyreceived',
    logourl: 'http://manuel.abalos.me/images/logo-ironhack.png',
    contactperson: {
      name: 'Marc Collado',
      email: 'marc@ironhack.com'
    }
  },
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Instagram',
    jobtitle: 'Frontend Developer',
    status: 'interview',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2000px-Instagram_logo_2016.svg.png',
    contactperson: {
      name: 'John Instergram',
      email: 'john@instagram.com'
    }
  },
  {
    owner: ['5968cb361ef39b7f80931bda'],
    company: 'Xing',
    jobtitle: 'Full stack Developer',
    status: 'done',
    logourl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Xing_logo.svg',
    contactperson: {
      name: 'Laura Xing',
      email: 'laura@xing.com'
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
