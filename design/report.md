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

Requirements are taken from the client specification letter unless stated otherwise

## 1. Log in / Registration requirements.

1. The system **must** allow logging in using the user's work email.
2. The user **must** be registered in the system to be able to log in and access the system.^[20/10/2022 <https://learn.lboro.ac.uk/mod/forum/discuss.php?d=360825>]

## 2. Registration page requirements & registration requirements.

1.  A user **must** register using a link received via email by an already registered member.
2.  A member of staff **must** be able to register only one account in the system.
3.  The email address used for registering **should** be using the @makeitwork.co.uk domain.
4.  The password used for registering **must** be at least 12 characters long and contain a combination of at least one uppercase letter, number and special character (!@#$%^&\*).
5.  A user **must** input their First and Last name when registering.
6.  A confirmation email **should** be sent out to the email address used for registration to check for a valid email.

## 3. User requirements

1.  A user **must** be one of the following types: a normal user (employee), team leader or project manager.
2.  A user **must** be able to be assigned to a team.
3.  A user **should** be able to be part of multiple teams.
4.  A user **should** be able to be part of no teams, but they will not have access to any projects.
5.  A user **must** be able to be assigned to a Project.
6.  A user **should** be able to work on multiple Projects (no limit on the amount).
7.  A registered user **must** be able to invite another member of staff to join the system using their work email address.
8.  A user **must** be able to create a private task for their private to-do list.
