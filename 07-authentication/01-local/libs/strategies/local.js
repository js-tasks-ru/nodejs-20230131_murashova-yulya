const User = require('../../models/User');
const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    function(email, password, done) {
        
        User.findOne({email: email}, function (err, user) {
            
            if (err) return done(err);
            
            if (!user) return done(null, false, 'Нет такого пользователя');
            
            if (!password) return done(null, false, 'Неверный пароль');
            
            user.checkPassword(password).then(function (result) {
                
                if (!result) return done(null, false, 'Неверный пароль');
                
                done(null, user);
                
            }, function (error) {
                done(error);
            });            
        });
    },
);
