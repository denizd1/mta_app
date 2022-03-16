const crypto = require('crypto');
const secret = 'c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e';
module.exports = {
    secret: crypto.createHmac('sha512', secret)
    .update('superdupersecretkey')
    .digest('hex'),
    jwtExpiration: 60,           // 1 hour
    jwtRefreshExpiration: 120,   // 24 hours
  
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
  };