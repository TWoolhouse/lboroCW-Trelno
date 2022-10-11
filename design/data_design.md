# Frontend Class Diagram

```mermaid
classDiagram
direction LR

User "1..n" --o "1" Team: users
User "1" --o "1" Team: leader
class User {
  +id: int
  +email: str
  +rank: int
  +name: str
  +tasks: list~Task~
}
class Team {
  +leader: User
  +users: set~User~
  +assign(user: User) bool
  +remove(user: User) bool
}

User "1" o-- "1" Task: tasks
class Task {
  +id: int
  +done: bool
  +name: str
}

Task "1" --o "1" ProjectTask: task
ProjectTask "0..n" --* "1" Project: tasks
User "0..n" --o "0..n" ProjectTask: users
class ProjectTask {
  +task: Task
  +users: set~User~
}
Project "1" --* "1" _Assigned: assigned
class Project {
  +leader: User
  +created: Datetime
  +deadline: Datetime
  +tasks: list~ProjectTask~
  +assigned: _Assigned
  +users() set~User~
  +progress() float
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

```mermaid
classDiagram
direction RL

class DBCollection~T: DBMapper~ {
    -snapshot: Array~T~
    +url: str
    +onChange: DBCollectionEvent => void
    +add(item: T)
}

class DBCollectionEvent~T: DBMapper~ {
    +all: Array~T~
    +diff: Array~T~
}
DBCollection -- DBCollectionEvent

DBMapper --o DBCollection: T
class DBMapper~T~ {
    <<interface>>
    +ToObj(item: T) object
    +ToType(obj: object) T
}

```

# Backend Database Diagram
```mermaid
erDiagram

User {
    int id PK
    str email
    hash password
    int rank
}

User ||--o{ Team : Leads
Team {
    int id PK
    int leader FK
}
Team ||--|{ TeamMember : "Is In"
User ||--o{ TeamMember : Member
TeamMember {
    int team FK
    int user FK
}

Project{
    int id PK
    datetime deadline
}
Project ||--o{ ProjectUser : assigned
User ||--o{ ProjectUser : ""
ProjectUser {
    int task FK
    int user FK
}
Project ||--o{ ProjectTeam : assigned
Team ||--o{ ProjectTeam : ""
ProjectTeam {
    int task FK
    int team FK
}

Project ||--o{ Task : contains
Task {
    int id PK
    int project FK
    str name
    bool done
}
Task ||--o{ TaskUser : assigned
User ||--o{ TaskUser : ""
TaskUser {
    int task FK
    int user FK
}

Topic {
    int id PK
}

Post {
    int id PK
}

Post ||--|{ PostTopic : ""
Topic ||--|{ PostTopic : ""
PostTopic {
    int post FK
    int topic FK
}
```

## Decisions

- The usage of ID's will allow for the display name to be changed without breaking all references.

# To Be Decided
## Post

The data of a post depends on how we do it. If it's a wiki then we need nothing more than the link to data resource (html).
We could also include some meta data to allow for searching such as title and stuff. Depending on how dynamic these pages are, author as well. If it's a forum we will do some sort of linked list of a comment thread or something.
