import { v4 as uuidv4 } from 'uuid';
import loginRegisterService from '../service/loginRegisterService';
import { createJWT } from '../middleware/JWTAction';
import 'dotenv/config';

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
        const accessToken = createJWT(payload);

        //set cookie
        res.cookie('access_token', accessToken, { 
            maxAge: +process.env.MAX_AGE_ACCESS_TOKEN,
            domain: process.env.COOKIE_DOMAIN,
            path: "/",
            httpOnly: true
        })

        res.cookie('refresh_token', refreshToken, { 
            maxAge: +process.env.MAX_AGE_REFRESH_TOKEN,
            domain: process.env.COOKIE_DOMAIN,
            path: "/",    
            httpOnly: true
        })


        const resData = {
            access_token: accessToken,
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