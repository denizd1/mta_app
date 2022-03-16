module.exports = {
    secret:'your_secret_key',
    jwtExpiration: 60,           // 1 hour
    jwtRefreshExpiration: 120,   // 24 hours
  
    /* for test */
    // jwtExpiration: 60,          // 1 minute
    // jwtRefreshExpiration: 120,  // 2 minutes
  };