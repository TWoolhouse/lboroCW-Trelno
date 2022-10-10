# Requirements document 

This document will contain all of the necessary information about the requirements for the "Team Projects" module coursework. The first part will contain a general list of all of the requirements, while the second one will contain a detailed overview of all the mentioned requirements. Wish us luck.

### Guidance on using the requirements list:
- **MUST**: A crucial requirement that is necessary to be implemented, no questions asked.
- **SHOULD**: A high importance requirement that most probably will be implement, but could be omitted for a certain reason.
- **COULD**: A non-essential requirement that might be added but there is a high chance it won't.
- **WON'T**: Requirement that has been downgraded or will not be added add all.

## Requirements general list
***

1. Login, registration and account requirements
   1. A user **must** register to be able to use the system.
   2. A member of staff **must** have only one account registered in the system.
   3. The email address used for registering **should** be using the @makeitwork.co.uk domain.
   4. The password used for registering **must** be at least 12 characters long.
   5. The password **must** contain a combination of at least one letter, number and special character (!@#$%^&*).
   6. A registered member **should** be able to invite another member of staff to join the system using their work email address.
   7. A member of staff **must** be invited by a registered member to access the system.
   8. A user **must** be either a normal user, team leader or project manager.
   9. A project manager or team leader **should** be able to manage other users in the system.
  
2. Productivity Management requirements
   1. A user **must** be assigned to a team.
   2. A user **could** join a separate team.
   3. A user **must** be able to create a task.
   4. A task **should** have an approximate time of completion assigned.
   5. A user **should** be able to assign themselves to an existing task.
   6. A user **could** have a daily task dashboard.
   7. A user **must** be able to create a to-do list.
   8. A user **must** be able to add tasks to the to-do list.
   9. A team **must** be able to be assigned to one or more tasks.
   10. A team leader **must** be able to manage the members of their team.
   11. A team leader or project manager **must** be able to assign tasks to users & teams.
   12. A team **should** have a team leader.
   13. A project manager **could** fill in the role of a team leader in a smaller project.
   14. A project manager **must** be able to manage multiple teams and their members that are assigned to the manager's project.
   15. A project manager **must** be able to assign users & teams to projects.
   16. A Project **must** have one or multiple tasks assigned to it.
   17. A Project **must** have one or multiple people assigned to it.
   18. A Project **must** have one or mutliple teams assigned to it.
   19. A Project **should** have a deadline assigned to it.
   20. A Project **could** have a complexity level assigned to it.
   21. A complexity level **could** be a minimum amount of users/teams assigned to it.

3. Knowledege Management requirements
   1. A user **must** be able to assign a Post to one Topics.
   2. A user **could** assign a Post to multiple Topics.
   3. A user **must** be able to create one or multiple new Posts.
   4. A user **could** be able to add a comment to an existing Post.
   5. A user **could** be able to reply or add a reaction to an existing comment on a Post.
   6. A user **must** be able to search for a Post based on one or multiple Topics.
   7. A user **must** be able to search for a Post based on keywords from title or body.
   8. A Topic **should** be either categorized as "Technical" or "Non-technical".
   9. A Topic **could** be categorized as a "Solution" or "Issue".
   10. A Topic **should** be created for subjects areas such as "Software Development”, “Software Issues”, and “Printing”, etc.
   11. A Post **could** have one or multiple Topics.
   12. A Post **must** have a subject title and a body.
   13. A Post **should** have its author visible.
   14. A Post **could** be set as "Solved" by the author or a manager/team leader.
   15. The knowledge management system **must** be available to be shared to all users in the company.
   16. A user **could** get a suggestion for an existing Post when creating a new one based on the Topic chosen and subject title.

4. Dashboard (a lot is WIP due to ambiguity of wording) requirements
   1. A team leader or project manager **must** have access to the manager's dashboard.
   2. A team leader or project manager **must** be able to see how many tasks a user currently has assigned to themselves.
   3. The manager dashboard **should** show an approximate time of completion of the project based on the tasks assigned to the project.
   4. The manager dashboard **could** warn a manager/team leader if the approximate time of completion is longer than the project's deadline.
   5. The manager dashboard **should** show how tasks are allocated to a user or a team.
   6. The manager dashboard **should** give a warning to manager/team leader if a user has too many tasks allocated.
   7. The manager dashboard **should** show how the progress of the project based on tasks completed.
   8. The manager dashboard **could** show number of users or teams working on a certain Project. 
   9. The manager dashboard **could** show whether there are Topics with multiple unsolved issues.
   10. The manager dashboard **should** give a warning to manager/team leader if a project does not enough users/teams assigned to it.
   <!--WTF is a "subject areas where training should be given to employees"? Topics with lots of "Issues"?-->
   <!--WTF is a "sufficiently resourced project"?-->

5. Data protection requirements
   1. The system **must** follow the GDPR regulations.


## Requirements details
***

Will contain all the above requirements in a more detailed form.