// IIFE to preserve code scope
(() => {
    // Enums
    enum NotificationPlatform {
      SMS = "SMS",
      EMAIL = "EMAIL",
      PUSH_NOTIFICATION = "PUSH_NOTIFICATION",
    }
  
    enum Mode {
      TODO = "TODO",
      REMINDER = "REMINDER",
    }
  
    // Utils
    const DateUtils = {
      tomorrow(): Date {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
      today(): Date {
        return new Date();
      },
      formatDate(date: Date): string {
        return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
      },
    };
  
    const UUID = (): string => {
      return Math.random().toString(36).substr(2, 9);
    };
  
    // Interfaces
    interface Task {
      id: string;
      dateCreated: Date;
      dateUpdated: Date;
      description: string;
      render(): string;
    }
  
    class Reminder implements Task {
      id: string = UUID();
      dateCreated: Date = DateUtils.today();
      dateUpdated: Date = DateUtils.today();
      description: string = "";
  
      scheduleDate: Date = DateUtils.tomorrow();
      notifications: Array<NotificationPlatform> = [NotificationPlatform.EMAIL];
  
      constructor(
        description: string,
        scheduleDate: Date,
        notifications: Array<NotificationPlatform>
      ) {
        this.description = description;
        this.scheduleDate = scheduleDate;
        this.notifications = notifications;
      }
  
      render(): string {
        return `
        ---> Reminder <--- \n
        Description: ${this.description} \n
        Notify by ${this.notifications.join(" and ")} in ${DateUtils.formatDate(
          this.scheduleDate
        )} \n
        Created: ${DateUtils.formatDate(
          this.dateCreated
        )} Last Update: ${DateUtils.formatDate(this.dateUpdated)}
        `;
      }
    }
  
    class Todo implements Task {
      id: string = UUID();
      dateCreated: Date = DateUtils.today();
      dateUpdated: Date = DateUtils.today();
      description: string = "";
  
      done: boolean = false;
  
      constructor(description: string) {
        this.description = description;
      }
  
      render(): string {
        const doneLabel = this.done ? "Completed" : "In Progress";
        return `
        ---> TODO <--- \n
        Description: ${this.description} \n
        Status: ${doneLabel} \n
        Created: ${DateUtils.formatDate(
          this.dateCreated
        )} Last Update: ${DateUtils.formatDate(this.dateUpdated)}
        `;
      }
    }
  
    const taskView = {
      getTodo(form: HTMLFormElement): Todo {
        const todoDescription = form.todoDescription.value;
        form.reset();
        return new Todo(todoDescription);
      },
      getReminder(form: HTMLFormElement): Reminder {
        const reminderNotifications = [
          form.notification.value as NotificationPlatform,
        ];
        const reminderDate = new Date(form.scheduleDate.value);
        const reminderDescription = form.reminderDescription.value;
        form.reset();
        return new Reminder(
          reminderDescription,
          reminderDate,
          reminderNotifications
        );
      },
      render(tasks: Array<Task>, mode: Mode) {
        // Clear view
        const tasksList = document.getElementById("tasksList");
        while (tasksList?.firstChild) {
          tasksList.removeChild(tasksList.firstChild);
        }
  
        // Render Tasks
        tasks.forEach((task) => {
          const li = document.createElement("LI");
          const textNode = document.createTextNode(task.render());
          li.appendChild(textNode);
          tasksList?.appendChild(li);
        });
  
        // Render form mode
        const todoSet = document.getElementById("todoSet");
        const reminderSet = document.getElementById("reminderSet");
        if (mode === Mode.TODO) {
          todoSet?.setAttribute("style", "display: block;");
          todoSet?.removeAttribute("disabled");
          reminderSet?.setAttribute("style", "display: none;");
          reminderSet?.setAttribute("disabled", "true");
        } else {
          reminderSet?.setAttribute("style", "display: block;");
          reminderSet?.removeAttribute("disabled");
          todoSet?.setAttribute("style", "display: none;");
          todoSet?.setAttribute("disabled", "true");
        }
      },
    };
  
    // Controllers
    const TaskController = (view: typeof taskView) => {
      const tasks: Array<Task> = [];
      let mode: Mode = Mode.TODO;
  
      const handleTaskCreate = (event: Event) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        switch (mode as Mode) {
          case Mode.TODO:
            tasks.push(view.getTodo(form));
            break;
          case Mode.REMINDER:
            tasks.push(view.getReminder(form));
            break;
        }
        view.render(tasks, mode);
      };
  
      const handleModeToggle = () => {
        switch (mode as Mode) {
          case Mode.TODO:
            mode = Mode.REMINDER;
            break;
          case Mode.REMINDER:
            mode = Mode.TODO;
            break;
        }
        view.render(tasks, mode);
      };
  
      document
        .getElementById("toggleMode")
        ?.addEventListener("click", handleModeToggle);
      document
        .getElementById("taskForm")
        ?.addEventListener("submit", handleTaskCreate);
    };
  
    TaskController(taskView);
  })();
  
  
  
  
  

  /* 
  
  ** Anotações da aula 3 **  
  
  - O enum que nós criamos sempre garante que nosso notifications sempre irá receber um valor específico e 
  não uma string aleatória. 

  Aprimoramos a renderização tanto de TODO, quando de reminder, com a ajuda do DateUtils, que formata a data pra gente. 


  */