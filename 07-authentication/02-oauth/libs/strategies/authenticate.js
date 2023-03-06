const User = require('../../models/User');

module.exports = function authenticate(strategy, email, displayName, done) {
    
    if (!email) return done(null, false, 'Не указан email');
    
    User.findOne({email: email}, function (err, user) {

        if (err) return done(err);

        if (!user) 
        {
            user = new User({
                email: email,
                displayName: displayName
            });

            user.save().then((user) => {
                return done(null, user);
            }, (err) => {
                return done(err);                
            });            
        }
        else return done(null, user);
    });
};
