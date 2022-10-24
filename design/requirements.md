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
   1. The user **must** log in using their work email and password.
   2. The email address used for logging in **should** be using the @makeitwork.co.uk domain.
   3. The user **must** be registered in the system to be able to log in and access the system.

### 2. Registration page requirements & registration requirements.
   1. A user **must** register using a link received via email by an already registered member.
   2. A member of staff **must** be able to register only one account in the system.
   3. The email address used for registering **should** be using the @makeitwork.co.uk domain.
   4. The password used for registering **must** be at least 12 characters long and contain a combination of at least one uppercase letter, number and special character (!@#$%^&*).
   5. A user **must** input their First and Last name when registering.
   6. A confirmation email **should** be sent out to the email address used for registration to check for a valid email.

### 3. User requirements
   1. A user **must** be one of the following types: a normal user (employee), team leader or project manager.
   2. A user **must** be able to be assigned to a team.
   3. A user **should** be able to be part of multiple teams. 
   4. A user **should** be able to be part of no teams, but they will not have access to any projects.
   5. A user **must** be able to be assigned to a Project.
   6. A user **should** be able to work on multiple Projects (no limit on the amount).
   8. A registered user **must** be able to invite another member of staff to join the system using their work email address.
   9. A user **must** be able to create a private task for their private to-do list.
   <!-- A user **should** be able to be part of multiple teams. -->
   
### 4. Team leader requirements
   1. A team **must** have a team leader.
   2. A team leader **must** be able to manage the members of their team (add, remove).
   3. A team leader **must** be able to assign tasks to users in their team.
   4. A team leader **must** be able to create tasks for a Project.
   5. A team leader **must** be able to supervise a Project (description, name, deadline, etc).

### 5. Project manager requirements
   1. A project manager **must** be able to add tasks to their current projects.
   2. A project manager **must** be able to assign users to Project tasks.
   3. A project manager **could** fill in the role of a team leader in a smaller project.
   4. A project manager **must** be able to manage multiple projects and the teams and members they are assigned to.
   5. A project manager **must** be able to assign teams and its members to projects.

### 6. Productivity Management requirements
   1. A user **must** have access to their own task list, which will contain task they are assigned to from Projects they are working on.
   2. A user **must** also have access to their private to-do list that is not related to any Projects and is only viewable by that user.
   3. The board **must** have at least 3 categories/columns in the Kaban view for a task to be placed into: To Do, In Progress, Done.
   4. A User **could** switch between a Kanban and to-do list view.

### 7. Task requirements
   1. A task **must** have a name that will be displayed.
   2. A task **must** have a maximum 100 word description.
   3. A task **must** have a deadline that is displayed in date form.
   4. If a task is divided into smaller sub-tasks, then its effort (deadline) **should** be calculated as a sum of the effort for the smaller tasks.
   5. A task **should** have the option of being divided into smaller sub-tasks.
   6. A task **should** have an estimated effort that is assigned by the user creating the task (determined by man hours needed to finish). 
   7. A task **must** have a completed state.
   8. A big task **should** display the percentage of completed sub-tasks.
   9. A task **should** be able to be categorized as either a Project-specific (select which Project) or private task (not related to any project).

### 8. Project requirements
   1. A Project **must** have a title.
   2. A Project **should** have a maximum 200 word description.
   3. A Project **should** have a deadline assigned to it in date form.
   4. A Project **must** have a progress displayed, which is measured by the percentage of tasks completed.
   5. A Project **should** have some client data displayed in the form of client name and a link to the client specific page.
   6. A Project **must** display the team assigned to it, its team lead and members.
   7. A Project **should** have a resourcing level assigned to it during creation (can be edited later on).
   8.  A resourcing level **could** be defined as enough users/teams assigned to it.
   <!-- Project resourcing is defined as enough employees allocated to finish project (estimated man hours to complete) within a deadline. -->

### 9. Team leader dashboard
   1. A team leader **must** have access to the team leader dashboard via the general employee dashboard (either a button or replacing the default employee dashboard).
   2. The team leader dashboard **must** show the team leader's team members.
   3. The team leader dashboard **should** show a list of current Projects that the team lead is supervising. The team leader will be able to view the teams' and project details such as description, deadline, etc.

### 10. Project manager dashboard
   1. A project manager **must** have access to the project manager dashboard via the general employee dashboard (either a button or replacing the default employee dashboard).
   2. The project manager dashboard **must** show the Projects the PM is working on.
   3. The project manager **should** be able to access and manage Project details from their dashboard by clicking on one of their assigned Projects.
   4. The project manager dashboard **should** allow the project manager to manage teams and users that are assigned to their Project.

### 11.  General PM/TL dashboard requirements (overlapping for both)
   1.  A team leader or project manager **must** be able to see how many tasks a user currently has assigned.
   2.  The Project tasks **should** be able to be filtered based on Project or team member assigned to it.
   3.  The manager dashboard **must** allow managers/team leaders to add tasks to a Project and assign users to it.
   4.  The manager dashboard **should** show an approximate time of completion of the project based on the cumulative effort value of tasks assigned to the project.
   5.  The manager dashboard **could** display a warning to a project PM/team leader if the estimated effort is longer than the project's deadline.
   6.  The manager dashboard **should** show the progress of the project based on tasks completed.
   7.  The manager dashboard **should** display a warning to manager/team leader if a project has less than the recommended number of employees and teams working on it.
   8.  A manager/team leader **should** be warned that a employee needs training if they are behind a deadline or having trouble working on a specific task. (Need clarification).
   <!-- The manager dashboard **could** show whether there are Topics with multiple unsolved issues. -->

### 12.  Knowledge Management requirements
   1. Posts **must** be in the form of guides created by Users.
   2. The knowledge management subsystem **must** have a search functionality where a User can search Posts by specific Topics.
   3. Posts **must** be viewable by all users by default. This option can be changed to be accesible only by certain levels (Manager, Team lead, User).
   4. Posts **must** only be able to be edited by a Manager or the User who has created it. 
   5. The subsystem **should** contain a FAQ page.
   6. The subsystem **should** offer users a way to contact author of post for specific questions.

### 13.  Client page requirements
   1. Client page **must** display the client company name.
   2. Client page **must** display key personal.
   3. Client page **must** display location of office (address).
   4. Client page **must** display contact information (email, phone).

### 14. Data protection requirements
   1. The system **must** follow the GDPR regulations.

### 15. General Requriements (or requirements that must be sorted later)
   1. The system **must** have a responsive design that will cater for different platforms and screen sizes.
   2. The system **must** be able to be accessed 24 hours a day.
   3. The user **should** be directed to the employee dashboard after logging in.
   4. The Knowledge Management system **should** be able to be accessed via a button or icon from the employee dashboard view.
   5. The system **must** be accessed via a dedicated web address.

<!-- Non-functional requirements must be added later, they will be necessary for Part 2.-->