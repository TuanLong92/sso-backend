const getLoginPage = (req, res)=> {
    const serviceURL = req.query.serviceURL;
    return res.render('login.ejs', {
        redirectURL: serviceURL
    })
};
module.exports = { getLoginPage };