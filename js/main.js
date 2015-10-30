$('document').ready(function () {
    var tasksArray = []

    var taskInputField = $('.task-field')
    var taskTemplateText = $('.task-template').text()
    var taskInViewIndex = 0
    var commentTextField = $('.comment-text-field')
    var commentUserField = $('.comment-user-field')
    var commentTemplateText = $('.comment-template').text()

    $('.task-form').submit(function (event) {
        event.preventDefault()
        var taskValue = taskInputField.val()
        if(taskValue !== ''){
            tasksArray.push({text: taskValue, comments: []})
            taskInputField.val('')
            displayTasks()
        }
    })

    function displayTasks() {
        $('.task-list').empty()
        $.each(tasksArray, function (i, task) {
            addTask(task);
        })
    }

    function displayComments(task) {
        var commentsTaskIndex = tasksArray.indexOf(task)
        $('.comments-list').empty()
        console.log(commentsTaskIndex);
        console.log(tasksArray);
        console.log(task);
        $.each(tasksArray[commentsTaskIndex].comments, function (i, comment) {
            addComment(task, comment);
        })
    }

    function addTask(task) {
        var taskIndex = tasksArray.indexOf(task)
        var $task = $(taskTemplateText)
        $('.task-list').append($task)
        $task.find('.task-list-text').text((taskIndex + 1) + '. ' + task.text)
        $task.find('.task-remove').click(function () {
            tasksArray.splice(taskIndex, 1)
            displayTasks()
        })

        $task.find('.task-edit').click(function () {
            $task.find('.task-list-text, .task-comments-button, .task-remove, .task-edit').hide()
            $task.find('.task-edit-field, .task-save, .task-cancel').show()
            $task.find('.task-edit-field').val(task.text)
        })

        $task.find('.task-cancel').click(function () {
            $task.find('.task-list-text, .task-comments-button, .task-remove, .task-edit').show()
            $task.find('.task-edit-field, .task-save, .task-cancel').hide()
            $task.find('.task-edit-field').val('')
        })

        $task.find('.task-save').click(function () {
            //var newValue = $task.find('.task-edit-field').val()
            tasksArray[taskIndex].text = $task.find('.task-edit-field').val()
            $task.find('.task-list-text, .task-comments-button, .task-remove, .task-edit').show()
            $task.find('.task-edit-field, .task-save, .task-cancel').hide()
            displayTasks()
        })

        $task.find('.task-comments').click(function () {
            taskInViewIndex = taskIndex
            $('.comments-section').show()
            $('.tasks-section').hide()
            displayComments(task)

        })
    }

    $('.back-to-task-list').click(function () {
        $('.comments-section').hide()
        $('.tasks-section').show()
        commentTextField.val('')
        commentUserField.val('')
        taskInputField.val('')
    })

    $('.comment-form').submit(function (event) {
        event.preventDefault()
        var commentTextValue = commentTextField.val()
        var commentUserValue = commentUserField.val()
        if(commentTextValue !== '' && commentUserValue !== ''){
            tasksArray[taskInViewIndex].comments.push({text: commentTextValue, user: commentUserValue})
            $(commentUserField).val('')
            $(commentTextField).val('')
            displayComments(tasksArray[taskInViewIndex])
        }
    })

    function addComment(task, comment) {
        var taskIndex = tasksArray.indexOf(task)
        var commentIndex = task.comments.indexOf(comment)
        var $comment = $(commentTemplateText)
        $('.comments-list').append($comment)
        $comment.find('.task-comment-text').text((taskIndex+1) + '.' + (commentIndex+1) + '. ' + comment.text)
        $comment.find('.task-comment-user-text').text('Created by:' + comment.user)

        $comment.find('.task-comment-remove').click(function () {
            tasksArray[taskIndex].comments.splice(commentIndex, 1)
            displayComments(task)
        })

        $comment.find('.task-comment-edit').click(function () {
            $comment.find('.task-comment-text, .task-comment-remove, .task-comment-edit').hide()
            $comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').show()
            $comment.find('.task-comment-edit-field').val(comment.text)
        })

        $comment.find('.task-comment-cancel').click(function () {
            $comment.find('.task-comment-text, .task-comments-button, .task-comment-remove, .task-comment-edit').show()
            $comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').hide()
            $comment.find('.task-comment-edit-field').val('')
        })

        $comment.find('.task-comment-save').click(function () {
            tasksArray[taskIndex].comments[commentIndex].text = $comment.find('.task-comment-edit-field').val()
            $comment.find('.task-comment-text, .task-comment-remove, .task-comment-edit').show()
            $comment.find('.task-comment-edit-field, .task-comment-save, .task-comment-cancel').hide()
            displayComments(task)

        })
    }
})

