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
   4. The user **must** be registered in the system to be able to log in and access the system.

### 2. Registration page requirements & registration requirements.
   1. A user **must** register using a link received via email by an already registered member.
   2. A member of staff **must** have only one account registered in the system.
   3. The email address used for registering **should** be using the @makeitwork.co.uk domain.
   4. The password used for registering **must** be at least 12 characters long and contain a combination of at least one letter, number and special character (!@#$%^&*).
   5. A user **must** input their First and Last name when registering.
   6. A confirmation email **should** be sent out to the email address used for registration to check for a valid email.

### 3. User requirements
   1. A user **must** be one of the following types: a normal user, team leader or project manager.
   2. A user **must** be assigned to a team.
   3. A user **should** be able to be part of multiple teams.
   4. A user **must** be able to create a Personal task.
   5. A registered user **must** be able to invite another member of staff to join the system using their work email address.
   
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
   4. A Project **must** display the teams assigned to it, with the list of members in each team displayed upon clicking on the team name.
   5. A Project **could** have a complexity level assigned to it.
   6. A complexity level **could** be a minimum necessary amount of users/teams assigned to it.

### 9. Team leader dashboard
   1. A team leader **must** have access to the team leader dashboard via the general employee dashboard (either a button or replacing the default employee dashboard).
   2. The team leader dashboard **must** show the team leader's team members as a list.
   3. The team leader dashboard **should** show a full list of Project tasks assigned to members of that team.
   4. The list of Project tasks **should** allow to filter tasks based on Project or team member assigned to it.
   5. The team leader dashboard **should** show a list of current Projects that the team is working on. The team leader will not be able to manage the Project or any settings related to it, just view the teams, the project manager and other details such as description, deadline that are relevant to the Project.

### 10. Project manager dashboard
   1. A project manager **must** have access to the project manager dashboard via the general employee dashboard (either a button or replacing the default employee dashboard).
   2. The project manager dashboard **must** show a list of current Projects that the PM is working on.
   3. The project manager **should** be able to access and manage Project details from their dashboard by clicking on one of their assigned Projects in the list.
   4. The project manager dashboard **should** allow the project manager to manage teams and users that are assigned to their Project.
   5. The project manager dashboard **must** allow the project manager to add or remove tasks to their assigned Projects.
   6. The project manager dashboard **must** show a full list of Project tasks.

### 11.  General PM/TL dashboard requirements (overlapping for both)
   1.  A team leader or project manager **must** be able to see how many tasks a user currently has assigned.
   2.  The manager dashboard **should** show an approximate time of completion of the project based on the cumulative time calculated from tasks assigned to the project.
   3.  The manager dashboard **could** display a warning to a project PM/team leader if the approximate time of completion is longer than the project's deadline.
   4.  The manager dashboard **should** display a warning to PM/team leader if a user has more than a week worth's of tasks to complete.
   5.  The manager dashboard **should** show how the progress of the project in graphical and numaerical form based on tasks completed.
   6.  The manager dashboard **should** display a warning to manager/team leader if a project has less than the recommended number of employees and teams working on it.
   <!-- 7. The manager dashboard **could** show whether there are Topics with multiple unsolved issues. -->

### 12. Data protection requirements
   1. The system **must** follow the GDPR regulations.
   <!-- 2. The system **must** follow any data protection measures included in the current system. 
   
  Calin: I think it's a bit ambiguous when saying that. We don't even know what data protection measures we should include. -->

<!-- Anything in itallics is more of a suggestion which we can discuss when we go through it -->
### 13. General Requriements (or requirements that must be sorted later)
   1. The system **must** have a responsive design that will cater for different platforms and screen sizes.
   2. The system **must** be able to be accessed 24 hours a day.
   3. The user **should** be directed to the employee dashboard after logging in.
   4. The Knowledge Management system **should** be able to be accessed via a button or icon from the employee dashboard view.
   5. The system **must** be accessed via a dedicated web address.


<!-- Non-functional requirements must be added later, they will be necessary for Part 2.-->

<!-- 
We're not working on the Knowledge Management system for the moment so I'm just leaving it commented for the moment.

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
<!-- 1. Login, registration and account requirements
   1. A user **must** register to be able to use the system.
   - For a user to access the system, a registration is required to ensure sensative data is protected and no unauthorised access is permitted.
   - ...
   2. A member of staff **must** have only one account registered in the system.
   - ... -->

*Calin: We probably can leave the list as is and not do the details for the moment. However, it would be best if we can somehow do a more detailed list as time goes on. We could always remove unecessary stuff such as rationale, dependencies, owner, etc. Keep only the important stuff: MoSCoW, Fit criteria (for some), Tags, etc.*
