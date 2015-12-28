app
    .factory('Comment', function ($resource) {
        return $resource(
            '/api/tasks/:taskId/comments/:commentId',
            {
                commentId: '@_id',
                taskId: '@task'
                //taskId: '@task._id'
            },
            {
                update: {
                    method: 'PUT'
                }
            })
    })
    .factory('CommentService', function (AuthService) {
        var self = {
            isCreatorOf: function (comment) {
                var creatorId = comment.creator._id ? comment.creator._id : comment.creator;
                var userId = AuthService.user._id;

                return creatorId.toString() === userId.toString();
            }
        };

        return self;
    })
;