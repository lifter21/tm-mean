module.exports = function (app, passport) {
//    ________ auth
    require('../api/auth')(app, passport);

//    ________ user
    require('../api/users')(app);

//    ________ task
    require('../api/tasks')(app);

//    ________ comment
    require('../api/comments')(app);
};