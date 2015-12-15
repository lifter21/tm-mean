module.exports = function (app) {

    ///* ----- Session ----- */
    require('./../api/auth/')(app);

    ///* ----- users ----- */
    require('./../api/users/')(app);

    /* ----- Tasks ----- */
    require('./../api/tasks/')(app);

    /* ----- Comments ----- */
    require('./../api/comments/')(app);

};