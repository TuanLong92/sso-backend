import passport from "passport";
import LocalStrategy from "passport-local";
import loginRegisterService from '../service/loginRegisterService';
const configPassport = () =>{
    passport.use(new LocalStrategy({

    },
        async (username, password, done) => {
        const rawData = {
            valueLogin: username,
            password: password
        }
        let res =await loginRegisterService.handleUserLogin(rawData);
       // console.log(res);
        if(res && +res.EC === 0){
            return done(null, res.DT);
        }else
        {
            return done(null, false, { message: res.EM });
        }
       
      }));      
}

const handleLogout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    // req.session.destroy(function(err) {
    //     req.logout();
    //     res.redirect('/');
    // });
}


module.exports = {
    configPassport,
    handleLogout
}