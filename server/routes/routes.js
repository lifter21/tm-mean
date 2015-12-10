module.exports = function (app) {

    ///* ----- Session ----- */
    require('./../api/auth/index')(app);

    ///* ----- Users ----- */
    require('./../api/users/index')(app);

    /* ----- Tasks ----- */
    require('./../api/tasks/index')(app);

    /* ----- Comments ----- */
    require('./../api/comments/index')(app);

};