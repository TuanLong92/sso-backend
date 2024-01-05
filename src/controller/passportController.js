import passport from "passport";
import LocalStrategy from "passport-local";
import loginRegisterService from '../service/loginRegisterService';
const configPassport = () =>{
    passport.use(new LocalStrategy(async function verify(username, password, cb) {
        const rawData = {
            valueLogin: username,
            password: password
        }
        let res =await loginRegisterService.handleUserLogin(rawData);
      //  console.log(res);
        if(res && +res.EC === 0){
            return cb(null, res.DT);
        }else
        {
            return cb(null, false, { message: res.EM });
        }
       
      }));      
}

const handleLogout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}


module.exports = {
    configPassport,
    handleLogout
}