module.exports = function (app) {
//    ________ auth
    require('../api/auth')(app);

//    ________ user
    require('../api/users')(app);

//    ________ task
    require('../api/tasks')(app);

//    ________ comment
    require('../api/comments')(app);
};