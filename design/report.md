---
title: Team 07 Report
subtitle: Part I
author:
  - Arshad Chati
  - Calin Corcimaru
  - Jack Humphrey
  - Adam Hutton
  - Rowan Murphy
  - Thomas Woolhouse
date: November 2022
toc: true
numbersections: false
geometry: margin=2.5cm
header-includes: |
  \usepackage{sectsty}
  \sectionfont{\clearpage}
---

<!-- to compile: pandoc report.md -o report.pdf -->

# Contributions

## Arshad Chati

- p1
- p2
- p3

## Calin Corcimaru

- Requirements document
  - Gathered and documented the project's requirements.
  - Delivered constant updates to the requirements document.
- Project page
  - Developed the Project page and its elements that dynamically updates based on the URL id.
  - Implemented functionality that allows Managers to assign tasks to users and a filter that shows tasks on the page based on User's rank.
- Client page
  - Modeled the Client page and included all relative information that dynamically updates based on the URL id.
- Communications with Client
  - Clarified requirements by sending messages and reminders to the Client.
  - Drafted some of the emails and messages that were sent to the Client.
- Leadership
  - Coordinated the team (planning, task allocation, decision making, etc) during meetings.
  - Ensured the team is on track with task progression and deadlines.

## Jack Humphrey

- Communication with clients
  - Completed the majority of communication with the clients. This involved drafting questions, sending questions and updating our own document with our questions and the clients responses.
- User view page
- Responsible for creating the user view page. This is a page for users to see information about other users in the system.
- User edit page
- Responsible for creating the user edit page. This is a page for users to edit their own account information (such as password).
- Login page draft
- Created an initial draft of the login page which was then reworked by Rowan.

## Adam Hutton

- Created the Dashboard/Task view
  - Including the 'Kanban' section reused elsewhere
- Created the Manager's Dashboard
- Developed ways of displaying progress to the user, including the horizontal progress bar, and the 'spinner' one used in the project page
- Created the navigation, reworked it to work on mobile
- Created the base css used everywhere in the project
  - Including the card and title styles, navigation and ensuring that the designs are consistent and responsive throughout the website.
- Contributed to the requirements document, helping to reword/rewrite requirements to aid in conciseness and reduce ambiguity

## Rowan Murphy

<!-- quick first draft, hopefully gives everyone else an idea of what im thinking this will look like, might have rambled a bit :)-->

- built and developed Login and registration pages
  - Created the front of the login and registration pages from scratch as well as the basic functionality needed.
- Search and parts of search results page
  - Created the search page elements to be used over a number of pages.
  - Used these elements to make the pages responsive and easy to use. Positioned them accordingly to aid in design and the flow of the pages
- checked through code and caught bugs and features that people missed
  - proof reading code and caught some issues such as a button missing function
  - also discovered bugs with certain elements of data usage etc.
- partook in decisions regarding the project and creation of requirements
  - assisted in creating the initial requirements draft to give a basis of what the project aimed to do
  - provided opinions and feedback to make the best decisions when designing, creating and building the project as well as suggesting changes etc. to offer an alternative solutions and a different approach to problems in development where there were multiple viable answers.

## Thomas Woolhouse

- p1
- p2
- p3

# Requirements

Requirements are taken from the client specification letter unless stated otherwise.

## 1. Log in / Registration requirements.

1. A user **must** be able to login to the system using their work email and password.
2. The email address used for logging in **must** be using the `@make-it-all.co.uk` domain.
3. A user **must** be registered in order to log in to the system.

## 2. Registration Page Requirements & Registration Requirements.

<!-- Lines ending with -  = adam re-wording of prev. line:) -->

1. The system **must** allow existing users to invite new users to register to the system using their work email.
2. A member of staff **must** be able to register only one account in the system.
3. The email address used for registering **must** be using the `@make-it-all.co.uk` domain.
4. The password used for registering **must** be at least 12 characters long and contain a combination of at least one uppercase letter, one lowercase letter, a number, and a special character (!@#$%^&\*). [^1]
5. A confirmation email **could** be sent out to the email address used for registration to check for a valid email. [^2]

## 3. User requirements

1. The system **must** allow a user to have at least one of the following roles: Employee, Team leader or Project Manager.
2. The system **must** allow a user to have different permissions dependant on their currently assigned role. [^6]
3. A user **must** be able to be assigned to a _Project_. [^3]
4. A user **must** be able to work on any number of _Projects_. [^4]
5. A user **must** be able to create a private task for their private to-do list. [^5]
<!-- 6. A user **should** be able to be part of multiple teams. -->

## 4. Team leader requirements

1. A team **must** have a team leader.
2. The system **must** allow any user to be a team leader. [^6]
3. The system **must** allow a user to be a team leader for multiple projects. [^6]
4. A team leader **must** be able to manage the members of their team (add, remove).[^6]
5. A team leader **must** be able to assign tasks to users in their team. [^7]
6. A team leader **must** be able to create tasks for a _Project_ they supervise. [^6]
7. A team leader **must** be able to track task progress of a _Project_.
   
## 5. Project Manager requirements

1. A _Project_ manager **must** be able to manage all the _Projects_ in the system. [^6]
2. A project manager **must** be able to add tasks to any current _Project_. [^6]
3. A project manager **must** be able to assign users to _Project_ tasks. [^6]
4. A project manager **must** be able to create a new _Project_. [^6]
5. A project manager **must** be able to assign users to a team. [^6]

## 6. Productivity Management requirements

1. A user **must** also have access to their private to-do list that is not related to any _Projects_ and is only viewable by that user. [^5]
2. A user **must** have access to their personal dashboard, which will contain task they are assigned to from _Projects_ they are working on and their own private todo list. A private todo list is a users personal to-do list which contains tasks that are not related to any _Projects_.
3. The board **must** have columns in the 'Kanban' view that tasks can be placed in. [^9]
4. The system **should** allow users to switch between a Kanban and 'to-do list' view. [^9]

## 7. Task requirements

1. A task **must** have a name that will be displayed.
2. A task **should** have a description.
3. A task **must** have a date for a deadline. [^10]
4. A task **must** have an estimated number of worker-hours needed to complete the task.[^11]
5. A task **should** have the option of being divided into smaller sub-tasks. A sub-task is a task, that the parent tasks depends on.[^11]
6. If a task has sub-tasks, then its worker-hours **should** be calculated as a sum of the worker-hours of the smaller tasks. [^11]
7. A task **must** be able to display the current state it is in. (To-Do, In Progress, Complete). [^11]
8. A task with subtasks **should** display the percentage of sub-tasks that are completed. [^11]
9. A task **should** be able to be categorized as either a _Project_-specific (select which _Project_) or private task (not related to any project). [^5]
10. The system **should** allow a Project Manager/Team leader to modify and re-assign a Task. [^25]
11. The system **could** allow a Sub-Task to be divided into multiple Sub-Tasks. [^26]

## 8. Project requirements

1.  A _Project_ **must** have a title. [^12]
2.  A _Project_ **should** have a description.
3.  A _Project_ **must** have a date for a deadline.[^13]
4.  A _Project_ **must** have a progress displayed, which is measured by the percentage of tasks completed. [^14]
5.  A _Project_ **must** have a client. [^12]
6.  A _Project_ **must** have a team assigned to it. [^6]
7.  The system **should** allow users to view the teams of their projects.

## 9. _Project_ manager dashboard

1. The project manager **should** be able to access and manage _Project_ details from their dashboard. [^15]
2. The project manager dashboard **should** allow the project manager to manage teams and users that are assigned to their _Project_. [^16]

## 10. Manager dashboard requirements

1.  The manager dashboard **should** allow a team leader or project manager be able to see how many tasks a user currently has assigned.
2.  The _Project_ tasks **could** be able to be filtered based on _Project_ or team member assigned to it.
3.  A _Project_ **should** display whether it is sufficiently resourced. This is determined based on the sum of worker-hours required by its tasks, the number of workers assigned and the Project's deadline. [^17]
4.  The manager dashboard **could** display a warning to a Project Manager/Team Leader if the project is expected to fall behind the deadline, based on worker hours (see above)
5.  A manager/team leader **could** be warned that a employee needs training if they are behind a deadline or having trouble working on a specific task. [^18]

## 11. Knowledge Management requirements

1. The system **must** allow a user to create a new post.
2. The knowledge management subsystem **must** have a search functionality where a User can search Posts by specific Topics. [^19]
3. Posts **could** be viewable by all users by default. This option can be changed to be accessible only by an employee with certain permissions (Manager, Team lead, User). [^20]
4. Posts **must** only be able to be edited by a Manager or the User who has created it. [^21]
5. The subsystem **could** contain a FAQ page. [^19]
6. The subsystem **should** offer users a way to contact author of post for specific questions. [^19]
7. A Post **must** only have 1 topic assigned to it. [^22]
8. The system **must** allow a Topic have multiple Posts. [^22]

## 12. Client requirements

1. A Client **must** have key information including Company name, Client Representative, Office Address, and Contact Information. [^23]
2. The system **must** allow a new client to be added.

## 13. System Requirements

1. The system **must** have a responsive design that will cater for different platforms and screen sizes.[^24]
2. The system **must** be able to be accessed 24 hours a day.
3. A user **should** be directed to the employee dashboard after logging in.
4. The system **must** be accessed via a dedicated web address.
5. The system **must** follow the GDPR regulations.


[^1]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=358985>

[^2]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=358983#p554513>

[^3]: 22/10/2022 https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355047

[^4]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355049>

[^5]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355053#p549541>

[^6]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355151#p554145>

[^7]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355075#p549565>

[^8]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355061#p549551>

[^9]: 14/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=356809>

[^10]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355045#p549487>

[^11]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355051#p549539>

[^12]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355047#p549501>

[^13]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355067#p549557>

[^14]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355063#p549553>

[^15]: 13/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355039#p546189>

[^16]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355151#p549485>

[^17]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355067#p554135>

[^18]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355071#p549561>

[^19]: 24/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=357789#p550055>

[^20]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355057#p549547>

[^21]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355055#p549545>

[^22]: 22/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355043#p549491>

[^23]: 24/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355047#p550039>

[^24]: 11/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=355077#p545293>

[^25]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=359721#p554115>

[^26]: 04/11/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=359721#p554115>