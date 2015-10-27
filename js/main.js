$('document').ready(function () {
    var taskField = $('.task-field')
    var taskTemplate = $('.task-template').text()

    $('.task-form').submit(function (event) {
        event.preventDefault()

        var taskSection = $(taskTemplate)
        var taskFieldVal = taskField.val()

        if (taskFieldVal !== '') {
            $('.task-list').append(taskSection)
            taskSection.find('.task-list-text').text(taskFieldVal)
            taskField.val('')

            taskSection.find('.task-remove').click(function () {
                taskSection.remove()
            })

            taskSection.find('.task-edit').click(function () {
                var taskText = taskSection.find('.task-list-text').text()
                taskSection.find('.task-list-text, .task-remove, .task-edit').hide()
                taskSection.find('.task-edit-field, .task-cancel, .task-save').show()
                taskSection.find('.task-edit-field').val(taskText)
            })

            taskSection.find('.task-save').click(function () {
                var taskText = taskSection.find('.task-edit-field').val()
                if (taskText !== '') {
                    taskSection.find('.task-list-text, .task-remove, .task-edit').show()
                    taskSection.find('.task-edit-field, .task-cancel, .task-save').hide()
                    taskSection.find('.task-list-text').text(taskText)
                }

            })

            taskSection.find('.task-cancel').click(function () {
                taskSection.find('.task-edit, .task-remove, .task-list-text').show()
                taskSection.find('.task-save, .task-cancel, .task-edit-field').hide()
            })

        }


    })
})