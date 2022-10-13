# Requirements document

This document will contain all of the necessary information about the requirements for the "Team Projects" module coursework. The first part will contain a general list of all of the requirements, while the second one will contain a detailed overview of all the mentioned requirements. Wish us luck.

### Guidance on using the requirements list:
- **MUST**: A crucial requirement that is necessary to be implemented, no questions asked.
- **SHOULD**: A high importance requirement that most probably will be implement, but could be omitted for a certain reason.
- **COULD**: A non-essential requirement that might be added but there is a high chance it won't.
- **WON'T**: Requirement that has been downgraded or will not be added add all.

## Requirements list
***

### 1. Log in page requirements & login requirements.
   1. The log in page **must** have an email and password input field.
   2. The log in page **must** have a login button.
   3. The email address used for logging in **should** be using the @makeitwork.co.uk domain.
   4. The user **must** be registered in the system to be able to log in.

### 2. Registration page requirements & registration requirements.
   1. A user **must** register to be able to use the system.
   2. A member of staff **must** have only one account registered in the system.
   3. The email address used for registering **should** be using the @makeitwork.co.uk domain.
   4. The password used for registering **must** be at least 12 characters long and contain a combination of at least one letter, number and special character (!@#$%^&*).
   5. A registered member **must** be able to invite another member of staff to join the system using their work email address.
   6. A member of staff **must** be invited by a registered member to access the system.

### 3. User requirements
   1. A user **must** be one of the following types: a normal user, team leader or project manager.
   2. A user **must** be assigned to a team.
   3. A user **should** be able to be part of multiple teams.
   4. A user **must** be able to create a Personal task.

### 4. Team leader requirements
   1. A team **must** have a team leader.
   2. A team leader **must** be able to manage the members of their team (add, remove).
   3. A team leader **must** be able to assign tasks to users in their team.
   4. A team leader **must** be able to create tasks for a Project.

### 5. Project manager requirements
   1. A project manager **must** be able to manage their projects (description, name, deadline, etc).
   2. A project manager **must** be able to add tasks to their current projects.
   3. A project manager **must** be able to assign teams or members to Project tasks.
   4. A project manager **could** fill in the role of a team leader in a smaller project.
   5. A project manager **must** be able to manage multiple teams and their members that are assigned to the manager's project.
   6. A project manager **must** be able to assign teams and its members to projects.

### 6. Productivity Management requirements
   1. A user **must** have access to their own task list, which will contain tasks they are assigned to.
   2. A user **must** be able to add tasks to their own to-do list.

### 7. Task requirements
   1. A task **must** have a name that will be displayed in the task list.
   2. A task **must** have a maximum 100 word description of the task.
   3. A task **should** have an approximate time of completion that is assigned by the user creating the task.
   4. A task **must** be able to be categorized as either a Project (select which Project) or Personal task.

### 8. Project requirements
   1. A Project **must** only be created by a Project Manager.
   2. A Project **must** have one or multiple tasks, people and teams assigned to it during creation to be valid.
   3. A Project **should** have a date deadline assigned to it.
   4. A Project **could** have a complexity level assigned to it.
   5. A complexity level **could** be a minimum necessary amount of users/teams assigned to it.

### 9. Team leader dashboard
   1. A team leader **must** have access to the team leader dashboard via the employee dashboard (either a button or replacing the default employee dashboard).
   2. The team leader dashboard **must** show the team leader's team members as a list and the number of tasks allocated to each member.
   3. The team leader dashboard **should** show a full list of Project tasks assigned to members of that team.
   4. The list of Project tasks **should** allow to filter tasks based on Project or team member assigned to it.
   5. The team leader dashboard **should** show a list of current Projects that the team is working on.

### 10. Project manager dashboard

### 9.  Dashboard (a lot is WIP due to ambiguity of wording) requirements
   22. A team leader or project manager **must** have access to the manager's dashboard.
   23. A team leader or project manager **must** be able to see how many tasks a user currently has assigned to themselves.
   24. The manager dashboard **should** show an approximate time of completion of the project based on the tasks assigned to the project.
   25. The manager dashboard **could** warn a manager/team leader if the approximate time of completion is longer than the project's deadline.
   26. The manager dashboard **should** show how tasks are allocated to a user or a team.
   27. The manager dashboard **should** give a warning to manager/team leader if a user has too many tasks allocated.
   28. The manager dashboard **should** show how the progress of the project based on tasks completed.
   29. The manager dashboard **could** show number of users or teams working on a certain Project.
   30. The manager dashboard **could** show whether there are Topics with multiple unsolved issues.
   31. The manager dashboard **should** give a warning to manager/team leader if a project does not enough users/teams assigned to it.
   <!--WTF is a "subject areas where training should be given to employees"? Topics with lots of "Issues"?-->
   <!--WTF is a "sufficiently resourced project"?-->

### 11. Data protection requirements
   1. The system **must** follow the GDPR regulations.
   <!-- 2. The system **must** follow any data protection measures included in the current system. It's a bit ambiguous in terms of what data protection meaasures are included. -->

<!-- Anything in itallics is more of a suggestion which we can discuss when we go through it-->
### 12. General Requriements *(might want to adjust name or put these requirements in another sub title)*
   1. The website **must** be responsive and cater for different platforms (mobile etc.).
   2. The website desgin **should** be clear and self explanatory to use.
   3. *The website **must** be available at all times?*
   4. *Any issues with the website **must** be resolved shortly after being reported?*

<!-- 
We're not working on this system for the moment so I'm just leaving it commented for the moment.

### 9.  Knowledge Management requirements
   6. A user **must** be able to assign a Post to one Topics.
   7. A user **could** assign a Post to multiple Topics.
   8.  A user **must** be able to create one or multiple new Posts.
   9.  A user **could** be able to add a comment to an existing Post.
   10. A user **could** be able to reply or add a reaction to an existing comment on a Post.
   11. A user **must** be able to search for a Post based on one or multiple Topics.
   12. A user **must** be able to search for a Post based on keywords from title or body.
   13. A Topic **should** be either categorized as "Technical" or "Non-technical".
   14. A Topic **could** be categorized as a "Solution" or "Issue".
   15. A Topic **should** be created for subjects areas such as "Software Development”, “Software Issues”, and “Printing”, etc.
   16. A Post **could** have one or multiple Topics.
   17. A Post **must** have a subject title and a body.
   18. A Post **should** have its author visible.
   19. A Post **could** be set as "Solved" by the author or a manager/team leader.
   20. The knowledge management system **must** be available to be shared to all users in the company.
   21. A user **could** get a suggestion for an existing Post when creating a new one based on the Topic chosen and subject title. -->


## Requirements details
***

Will contain all the above requirements in a more detailed form.

*An idea for the format of the details. Might want to simplify as it may make the document large?*
1. Login, registration and account requirements
   1. A user **must** register to be able to use the system.
   - For a user to access the system, a registration is required to ensure sensative data is protected and no unauthorised access is permitted.
   - ...
   2. A member of staff **must** have only one account registered in the system.
   - ...
