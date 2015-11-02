$('document').ready(function () {

    var tasksArray = [];
    var taskInViewIndex = 0;

    $.ajax({
        url:'./tasks.json',
        dataType: 'json',
        success: function (data){
            tasksArray = data
            renderTasks()
        }
    });

    var taskInput = $('.task-field');
    var commentTextInput = $('.comment-text-field');
    var commentUserInput = $('.task-comment-user-field');
    var taskTextTemplate = $('.task-template').text();
    var commentTextTemplate = $('.comment-template').text();

    $('.task-form').submit(function (event) {
        event.preventDefault();
        var taskText = taskInput.val();
        if (taskText !== '') {
            tasksArray.push({text: taskText, comments: [] });
            taskInput.val('');
            renderTasks()
        }
    });


    $('.back-to-task-list').click(function () {
        commentTextInput.val('')
        commentUserInput.val('')
        $('.comments-section').hide()
        $('.tasks-section').show()
    });


    function addTask (task) {
        var taskIndex = tasksArray.indexOf(task)
        var $taskTemplate = $(taskTextTemplate)
        $('.task-list').append($taskTemplate)

        console.log('addTask', tasksArray);
        $taskTemplate.find('.task-list-text').text((taskIndex + 1) + '. ' + task.text)
        //console.log($taskTemplate);

        $taskTemplate.find('.task-remove').click(function () {
            tasksArray.splice(taskIndex, 1)
            renderTasks()
        })

        $taskTemplate.find('.task-cancel').click(function () {
            $taskTemplate.find('.task-comments, .task-edit, .task-remove, .task-list-text').show()
            $taskTemplate.find('.task-edit-field, .task-save, .task-cancel').hide()
            $taskTemplate.find('.task-edit-field').val('')
        })

        $taskTemplate.find('.task-edit').click(function () {
            $taskTemplate.find('.task-comments, .task-edit, .task-remove, .task-list-text').hide()
            $taskTemplate.find('.task-edit-field, .task-save, .task-cancel').show()
            $taskTemplate.find('.task-edit-field').val(task.text)
        })

        $taskTemplate.find('.task-save').click(function () {
            var newTaskValue = $taskTemplate.find('.task-edit-field').val()
            if (newTaskValue !== '') {
                tasksArray[taskIndex].text = newTaskValue
                $taskTemplate.find('.task-comments, .task-edit, .task-remove, .task-list-text').show()
                $taskTemplate.find('.task-edit-field, .task-save, .task-cancel').hide()
                $taskTemplate.find('.task-list-text').text((taskIndex + 1) + '. ' + newTaskValue)
            }
        })

        $taskTemplate.find('.task-comments').click(function () {
            taskInViewIndex = taskIndex
            $('.tasks-section').hide()
            taskInput.val('')
            $('.comments-section').show()
            renderTaskComments(task)
        })
    }

    function addTaskComment (comment, task) {
        var taskIndex = tasksArray.indexOf(task)
        var commentIndex = task.comments.indexOf(comment)
        var $comment = $(commentTextTemplate)
        $('.comments-list').append($comment)

        $comment.find('.task-comment-text').text((taskIndex+1) + '.' + (commentIndex+1) + '. ' + comment.text)
        $comment.find('.task-comment-user-text').text('Created by:' + comment.user)

        $comment.find('.task-comment-remove').click(function () {
            tasksArray[taskIndex].comments.splice(commentIndex, 1)
            renderTaskComments(task)
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
            renderTaskComments(task)

        })

    }

    $('.comment-form').submit(function (event) {
        event.preventDefault()
        //console.log(taskInViewIndex);
        //console.log(tasksArray);
        var commentUserValue = commentUserInput.val()
        var commentTextValue = commentTextInput.val()
        if (commentUserValue !== '' && commentTextValue !== '') {
            tasksArray[taskInViewIndex].comments.push({ text: commentTextValue, user: commentUserValue })
            commentUserInput.val('')
            commentTextInput.val('')
            renderTaskComments(tasksArray[taskInViewIndex])
        }

    });

    function renderTasks() {
        $('.task-list').empty()
        each(tasksArray, function (task) {
            addTask(task)
        })
    }

    function renderTaskComments (task) {
        $('.comments-list').empty()
        var taskIndex = tasksArray.indexOf(task)
        each(tasksArray[taskIndex].comments, function (comment) {
            addTaskComment(comment, task)
        })
    }
    function each (array, handler) {
        for (var i = 0; i < array.length; i++) {
            handler(array[i])
        }
    }

});

