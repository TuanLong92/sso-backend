import { v4 as uuidv4 } from 'uuid';
import loginRegisterService from '../service/loginRegisterService';
import { createJWT } from '../middleware/JWTAction';

const getLoginPage = (req, res)=> {
    const serviceURL = req.query.serviceURL;
    return res.render('login.ejs', {
        redirectURL: serviceURL
    })
};

const verifyToken = async (req, res)=> {

    try{
        const ssoToken = req.body.ssoToken;
    if (req.user && req.user.code && req.user.code === ssoToken){
        const refreshToken = uuidv4();
       // console.log(req.user)
       //update user with refresh token
       await loginRegisterService.updateUserRefreshToken(req.user.email, refreshToken);

       //creat jwt
       
        let payload = {
            email: req.user.email,
            groupWithRoles: req.user.groupWithRoles,
            username: req.user.username,
        }
        const acessToken = createJWT(payload);
        const resData = {
            acess_token: acessToken,
            refresh_token: refreshToken,
            email: req.user.email,
            groupWithRoles: req.user.groupWithRoles,
            username: req.user.username
        }
        //destroy session
        req.logout(function(err) {
            if (err) { return next(err); }            
          });
        return res.status(200).json({
            EM : 'ok',
            EC: 0,
            DT: resData
        })
    } else {
        return res.status(401).json({
            EM: 'not match ssoToken',
            EC: 1,
            DT: ''
        });
    }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            EM: 'Something wrong in the server',
            EC: -1,
            DT: ''
        });
    }
   
    
    
};
module.exports = { getLoginPage, verifyToken };