const passportJwt = require('passport-jwt');
const ExtractJwt  = passportJwt.ExtractJwt;
require('dotenv').config({'path': '.env'});

let jwtOptions = {};

jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = process.env.JWT_SECRET;

module.exports = jwtOptions;
