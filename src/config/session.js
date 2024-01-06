import Sequelize from "sequelize";
import session from "express-session";
import passport from "passport";
const configSessions = (app) => {
  // initalize sequelize with session store
  var SequelizeStore = require("connect-session-sequelize")(session.Store);

  // create database, ensure 'sqlite3' in your package.json
  const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
    define: {
      freezeTableName: true
    },
    timezone: '+07:00'
  });
  const myStore = new SequelizeStore({
    db: sequelize,
  });

  app.use(
    session({
      secret: "keyboard cat",
      store: myStore,
      resave: false, // we support the touch method so per the express-session docs this should be set to false
      proxy: true, // if you do SSL outside of node.
      saveUninitialized : false,
      checkExpirationInterval: 500 * 1000,
      expiration: 500 * 1000,
      cookie: {
        expires: 500 * 1000
      }
    })
  );
  myStore.sync();

  app.use(passport.authenticate('session'));

    // Mã hoá dataraw
  passport.serializeUser(function(user, cb) {
  //  console.log(">>> check before",user);
    process.nextTick(function() {
      //cb(null, { id: user.id, username: user.username });
      cb(null, user);
    });
  });
  
  //Giải mã hoá dataraw
  passport.deserializeUser(function(user, cb) {
  //  console.log(">>> check after",user);
    process.nextTick(function() {
      return cb(null, user);
    });
  });

};
export default configSessions;
