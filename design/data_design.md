# Data Design

## Diagram

```mermaid
classDiagram
direction LR

User "1..n" --o "1" Team: users
User "1" --o "1" Team: leader
class User {
  +email: str
  +password: hash
  +rank: int
  +?name: str
  +login(email: str, password: hash)$ User
}
class Team {
  -leader: User
  -user: set~User~
}

Task "0..n" --* "1" Project: tasks
User "0..n" --o "0..n" Task: users
class Task {
  +name: str
  -users: set~User~
}
Project "1" --* "1" _Assigned: assigned
class Project {
  +deadline: Datetime
  +tasks: list~Task~
  +assigned: _Assigned
  +users() set~User~
}
User "0..n" --o "0..n" _Assigned: users
Team "0..n" --o "0..n" _Assigned: teams
class _Assigned {
	+users: set~User~
	+teams: set~Team~
	+all() set~User~
}

Post "0..n" --* "1..n" Topic
class Post {
	+id: int
	+?Data: str
}
class Topic {
	+id: int
	+name: str
	+posts() set~Post~
}

```

## Decisions

- The usage of ID's will allow for the display name to be changed without breaking all references.

## To Be Decided
### Post

The data of a post depends on how we do it. If it's a wiki then we need nothing more than the link to data resource (html).
We could also include some meta data to allow for searching such as title and stuff. Depending on how dynamic these pages are, author as well. If it's a forum we will do some sort of linked list of a comment thread or something.
