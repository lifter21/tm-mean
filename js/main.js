$('document').ready(function () {
    var tasksArray = [];
    var taskInViewIndex = 0;
    $.ajax({
        url: './tasks.json',
        dataType: 'json',
        success: function (data) {
            tasksArray = data
            renderTasks()
        }
    })


    var taskTextTemplate = $('.task-template').text()
    var commentTextTemplate = $('.comment-template').text()

    var taskInput = $('.task-field')
    var commentTextInput = $('.comment-user-field')
    var commentUserInput = $('.comment-text-field')

    $('.task-form').submit(function (event) {
        event.preventDefault()
        var taskValue = taskInput.val()
        if (taskValue !== '') {
            tasksArray.push({ text: taskValue, comments: [] })
            taskInput.val('')
            renderTasks()
        }
    })

    $('.comment-form').submit(function (event) {
        event.preventDefault()
        var commentTextValue = commentTextInput.val()
        var commentUserValue = commentUserInput.val()
        if (commentTextValue !== '' && commentUserValue !== '') {
            tasksArray[taskInViewIndex].comments.push({ text: commentTextValue, user: commentUserValue })
            commentTextInput.val('')
            commentUserInput.val('')
            renderComments(tasksArray[taskInViewIndex])
        }
    })

    $('.back-to-task-list').click(function () {
        $('.tasks-section').show()
        $('.comments-section').hide()
        commentTextInput.val('')
        commentUserInput.val('')
    })

    function each(array, callback) {
        for (var i = 0; i < array.length; i++) {
            callback(array[i])
        }
    }

    function renderTasks () {
        $('.task-list').empty()
        each(tasksArray, function(task){
            addTask(task)
        })
    }


    function renderComments(task) {
        $('.comments-list').empty()
        var taskIndex = tasksArray.indexOf(task)
        each(tasksArray[taskIndex].comments, function(comment){
            addTaskComment(task, comment)
        })
    }

    function addTask (task) {
        var taskIndex = tasksArray.indexOf(task)
        var $task = $(taskTextTemplate)
        $('.task-list').append($task)
        $task.find('.task-list-text').text((taskIndex + 1) + '. ' + task.text)


        $task.find('.task-remove').click(function () {
            tasksArray.splice(taskIndex, 1)
            renderTasks()
        })

        $task.find('.task-edit').click(function () {
            $task.find('.task-comments, .task-list-text, .task-edit, .task-remove').hide()
            $task.find('.task-edit-field, .task-cancel, .task-save').show()
            $task.find('.task-edit-field').val(task.text)
        })

        $task.find('.task-cancel').click(function () {
            $task.find('.task-comments, .task-list-text, .task-edit, .task-remove').show()
            $task.find('.task-edit-field, .task-cancel, .task-save').hide()
            $task.find('.task-list-text').text((taskIndex + 1) + '. ' + task.text)
        })

        $task.find('.task-save').click(function () {
            var newTaskValue = $task.find('.task-edit-field').val()
            if (newTaskValue !== '') {
                tasksArray[taskIndex].text = newTaskValue
                $task.find('.task-comments, .task-list-text, .task-edit, .task-remove').show()
                $task.find('.task-edit-field, .task-cancel, .task-save').hide()
                $task.find('.task-list-text').text((taskIndex + 1) + '. ' + task.text)
                //renderTasks()
            }
        })

        $task.find('.task-comments').click(function () {
            taskInViewIndex = taskIndex
            $('.tasks-section').hide()
            $('.comments-section').show()
            taskInput.val('')
            renderComments(task)
        })

        $task.find('.task-show').click(function () {
            //taskInViewIndex = taskIndex
            $('.tasks-section').hide()
            $('.task-show-section').show()
            $('.task-show-section').find('.single-task').text(tasksArray[taskIndex].text)
            //$('.comments-section').show()
            //taskInput.val('')
            //renderComments(task)
        })
    }

    function addTaskComment (task, comment) {
        var taskIndex = tasksArray.indexOf(task)
        var commentIndex = task.comments.indexOf(comment)

        var $comment = $(commentTextTemplate)

        $('.comments-list').append($comment)

        $comment.find('.task-comment-text').text((taskIndex + 1) + '.' + (commentIndex + 1) + '. ' + comment.text)
        $comment.find('.task-comment-user-text').text('Created by: ' + comment.user)

        $comment.find('.task-comment-remove').click(function () {
            tasksArray[taskIndex].comments.splice(commentIndex, 1)
            renderComments(task)
        })

        $comment.find('.task-comment-edit').click(function () {
            $comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').show()
            $comment.find('.task-comment-text, .task-comment-edit, .task-comment-remove').hide()
            $comment.find('.task-comment-edit-field').val(comment.text)
        })

        $comment.find('.task-comment-cancel').click(function () {
            $comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').hide()
            $comment.find('.task-comment-text, .task-comment-edit, .task-comment-remove').show()
            $comment.find('.task-comment-text').text((taskIndex + 1) + '.' + (commentIndex + 1) + '. ' + comment.text)

        })

        $comment.find('.task-comment-save').click(function () {
            var newCommentValue = $comment.find('.task-comment-edit-field').val()
            tasksArray[taskIndex].comments[commentIndex].text = newCommentValue
            //$comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').hide()
            //$comment.find('.task-comment-text, .task-comment-edit, .task-comment-remove').show()
            //$comment.find('.task-comment-text').text((taskIndex + 1) + '.' + (commentIndex + 1) + '. ' + newCommentValue)
            renderComments(tasksArray[taskInViewIndex])
            //$comment.find('').show()
            //$comment.find('').hide()
        })
    }

});

