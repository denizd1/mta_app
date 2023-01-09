module.exports = {
  HOST: global.env.HOST,
  USER: global.env.USER,
  PASSWORD: global.env.PASSWORD,
  DB: global.env.DB,
  dialect: global.env.DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    maxUses: 10000,
  },
};
