"use strict";
// IIFE to preserve code scope
(function () {
    // Enums
    var NotificationPlatform;
    (function (NotificationPlatform) {
        NotificationPlatform["SMS"] = "SMS";
        NotificationPlatform["EMAIL"] = "EMAIL";
        NotificationPlatform["PUSH_NOTIFICATION"] = "PUSH_NOTIFICATION";
    })(NotificationPlatform || (NotificationPlatform = {}));
    var Mode;
    (function (Mode) {
        Mode["TODO"] = "TODO";
        Mode["REMINDER"] = "REMINDER";
    })(Mode || (Mode = {}));
    // Utils
    var DateUtils = {
        tomorrow: function () {
            var tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return tomorrow;
        },
        today: function () {
            return new Date();
        },
        formatDate: function (date) {
            return "".concat(date.getDate(), ".").concat(date.getMonth() + 1, ".").concat(date.getFullYear());
        },
    };
    var UUID = function () {
        return Math.random().toString(36).substr(2, 9);
    };
    var Reminder = /** @class */ (function () {
        function Reminder(description, scheduleDate, notifications) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = "";
            this.scheduleDate = DateUtils.tomorrow();
            this.notifications = [NotificationPlatform.EMAIL];
            this.description = description;
            this.scheduleDate = scheduleDate;
            this.notifications = notifications;
        }
        Reminder.prototype.render = function () {
            return "\n        ---> Reminder <--- \n\n        Description: ".concat(this.description, " \n\n        Notify by ").concat(this.notifications.join(" and "), " in ").concat(DateUtils.formatDate(this.scheduleDate), " \n\n        Created: ").concat(DateUtils.formatDate(this.dateCreated), " Last Update: ").concat(DateUtils.formatDate(this.dateUpdated), "\n        ");
        };
        return Reminder;
    }());
    var Todo = /** @class */ (function () {
        function Todo(description) {
            this.id = UUID();
            this.dateCreated = DateUtils.today();
            this.dateUpdated = DateUtils.today();
            this.description = "";
            this.done = false;
            this.description = description;
        }
        Todo.prototype.render = function () {
            var doneLabel = this.done ? "Completed" : "In Progress";
            return "\n        ---> TODO <--- \n\n        Description: ".concat(this.description, " \n\n        Status: ").concat(doneLabel, " \n\n        Created: ").concat(DateUtils.formatDate(this.dateCreated), " Last Update: ").concat(DateUtils.formatDate(this.dateUpdated), "\n        ");
        };
        return Todo;
    }());
    var taskView = {
        getTodo: function (form) {
            var todoDescription = form.todoDescription.value;
            form.reset();
            return new Todo(todoDescription);
        },
        getReminder: function (form) {
            var reminderNotifications = [
                form.notification.value,
            ];
            var reminderDate = new Date(form.scheduleDate.value);
            var reminderDescription = form.reminderDescription.value;
            form.reset();
            return new Reminder(reminderDescription, reminderDate, reminderNotifications);
        },
        render: function (tasks, mode) {
            // Clear view
            var tasksList = document.getElementById("tasksList");
            while (tasksList === null || tasksList === void 0 ? void 0 : tasksList.firstChild) {
                tasksList.removeChild(tasksList.firstChild);
            }
            // Render Tasks
            tasks.forEach(function (task) {
                var li = document.createElement("LI");
                var textNode = document.createTextNode(task.render());
                li.appendChild(textNode);
                tasksList === null || tasksList === void 0 ? void 0 : tasksList.appendChild(li);
            });
            // Render form mode
            var todoSet = document.getElementById("todoSet");
            var reminderSet = document.getElementById("reminderSet");
            if (mode === Mode.TODO) {
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: block;");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.removeAttribute("disabled");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: none;");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("disabled", "true");
            }
            else {
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.setAttribute("style", "display: block;");
                reminderSet === null || reminderSet === void 0 ? void 0 : reminderSet.removeAttribute("disabled");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("style", "display: none;");
                todoSet === null || todoSet === void 0 ? void 0 : todoSet.setAttribute("disabled", "true");
            }
        },
    };
    // Controllers
    var TaskController = function (view) {
        var _a, _b;
        var tasks = [];
        var mode = Mode.TODO;
        var handleTaskCreate = function (event) {
            event.preventDefault();
            var form = event.target;
            switch (mode) {
                case Mode.TODO:
                    tasks.push(view.getTodo(form));
                    break;
                case Mode.REMINDER:
                    tasks.push(view.getReminder(form));
                    break;
            }
            view.render(tasks, mode);
        };
        var handleModeToggle = function () {
            switch (mode) {
                case Mode.TODO:
                    mode = Mode.REMINDER;
                    break;
                case Mode.REMINDER:
                    mode = Mode.TODO;
                    break;
            }
            view.render(tasks, mode);
        };
        (_a = document
            .getElementById("toggleMode")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", handleModeToggle);
        (_b = document
            .getElementById("taskForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", handleTaskCreate);
    };
    TaskController(taskView);
})();
/*

** Anotações da aula 3 **

- O enum que nós criamos sempre garante que nosso notifications sempre irá receber um valor específico e
não uma string aleatória.

Aprimoramos a renderização tanto de TODO, quando de reminder, com a ajuda do DateUtils, que formata a data pra gente.


*/ 
