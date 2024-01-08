
const isLogin = (req, res, next) => {
   // console.log("check path " , req.path);
    if(req.isAuthenticated()){
        if(req.path === '/login') {
           return res.redirect('/');
        }
        next();
    } else{
        if(req.path === '/login') {
            next();
        } else {
            return res.redirect("/login");
        }
    }
}

module.exports = { isLogin }