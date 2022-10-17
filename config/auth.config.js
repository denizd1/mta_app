const crypto = require("crypto");
var prime_length = 512;
var diffHell = crypto.createDiffieHellman(prime_length);
const secret = diffHell.generateKeys("base64");

module.exports = {
  secret: crypto
    .createHmac("sha512", secret)
    .update("superdupersecretkey")
    .digest("hex"),
  jwtExpiration: 86400, // 1 hour
  jwtRefreshExpiration: 86400, // 24 hours

  /* for test */
  // jwtExpiration: 60,          // 1 minute
  // jwtRefreshExpiration: 120,  // 2 minutes
};
