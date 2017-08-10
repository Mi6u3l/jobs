const mongoose = require('mongoose');
require('dotenv').config({'path': '.env'});
mongoose.connect(`${process.env.MONGODB_URI}`);

const User = require('../models/user');
const Lead = require('../models/lead');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;
let seeduserId = '';


User.remove({}, createUser);

function createUser() {

  const username = 'seeduser';
  const email = 'test@test.com';
  const password = '123';

  let salt = bcrypt.genSaltSync(bcryptSalt);
  let hashPass = bcrypt.hashSync(password, salt);

  const theUser = new User({
    username,
    email,
    password: hashPass
  });

  const user = theUser.save((err, user) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log(`***** user ${user.username} saved, creating leads *****`);
      seeduserId = user._id;
      Lead.remove({}, createLeads);
    }
  });
}


function createLeads() {

  const leads = [
    {
      owner: [`${seeduserId}`],
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
      owner: [`${seeduserId}`],
      company: 'Facebook',
      jobtitle: 'Junior Developer',
      status: 'contacted',
      logourl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/F_icon.svg/2000px-F_icon.svg.png',
      contactperson: {
        name: 'Mark Zuckerberg',
        email: 'mark@facebook.com'
      }
    },
    {
      owner: [`${seeduserId}`],
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
      owner: [`${seeduserId}`],
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
      owner: [`${seeduserId}`],
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
      owner: [`${seeduserId}`],
      company: 'Glovo',
      jobtitle: 'NodeJS Dev',
      status: 'interview',
      logourl: 'https://lh3.googleusercontent.com/E_i38R4NHa61Y0zcO7EYdwI0QTmAt3SCoQbPc0plvfz1m8kEyHketi5EiOPWwbz8dWI=w300',
      contactperson: {
        name: 'Jenny Glovonder',
        email: 'jenny.glovonder@glovo.com'
      }
    },
    {
      owner: [`${seeduserId}`],
      company: 'Xing',
      jobtitle: 'Full stack Developer',
      status: 'done',
      logourl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Xing_logo.svg',
      contactperson: {
        name: 'Laura Xing',
        email: 'laura@xing.com'
      }
    },
    {
      owner: [`${seeduserId}`],
      company: 'Tesla',
      jobtitle: 'Crash test dummy',
      status: 'contacted',
      logourl: 'https://media.glassdoor.com/sqll/43129/tesla-motors-squarelogo.png',
      contactperson: {
        name: 'Elon Musk',
        email: 'elon@tesla.com'
      }
    },
    {
      owner: [`${seeduserId}`],
      company: 'NASA',
      jobtitle: 'Astronaut',
      status: 'interview',
      logourl: 'https://media.glassdoor.com/sqll/7304/nasa-squarelogo.png',
      contactperson: {
        name: 'Neil Armstrong III',
        email: 'neil@nasa.gov'
      }
    },
    {
      owner: [`${seeduserId}`],
      company: 'Twitter',
      jobtitle: 'Twitter Bird',
      status: 'replyreceived',
      logourl: 'https://media.glassdoor.com/sqll/100569/twitter-squarelogo-1502093939446.png',
      contactperson: {
        name: 'Guy from Twitter',
        email: 'tweetme@twitter.com'
      }
    }
  ]

  Lead.create(leads, (err, newLeads) => {
    if (err) {
      throw err;
    }
    newLeads.forEach((lead) => {
      console.log(lead.jobtitle);
    });
    console.log('Done!');
    mongoose.connection.close();
  });
}
