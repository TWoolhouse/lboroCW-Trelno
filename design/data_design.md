# Frontend Class Diagram

```mermaid
classDiagram
direction TB

User "1..n" --o "1" Team: users
User "1" --o "1" Team: leader
class User {
	+id: Int
	+email: String
	+rank: Int
	+name: String
	+tasks: Array~Task~
	+tasklist() Array~TaskRef~
}

User "1" *-- "0..n" TaskRef: tasklist()
Task "1" --o "1" TaskRef: task
class TaskRef {
	<<Object>>
	+task: Task
	+source: TaskSrc
}

TaskRef "1" *-- "1" TaskSrc: source
class TaskSrc {
	<<enum>>
	User = 0
	Project = 1
}

class Team {
	+leader: User
	+users: Collection~User~
}

User "1" o-- "1" Task: tasks
class Task {
	+id: Int
	+done: Boolean
	+name: String
}

Task "1" --o "1" ProjectTask: task
ProjectTask "0..n" --* "1" Project: tasks
User "0..n" --o "0..n" ProjectTask: users
class ProjectTask {
	+task: Task
	+users: Set~User~
}
Project "1" --* "1" _Assigned: assigned
class Project {
	+leader: User
	+created: Datetime
	+deadline: Datetime
	+tasks: Array~ProjectTask~
	+assigned: _Assigned
	+users() Set~User~
	+progress() Float
}
User "0..n" --o "0..n" _Assigned: users
Team "0..n" --o "0..n" _Assigned: teams
class _Assigned {
	<<Object>>
	+users: Set~User~
	+teams: Set~Team~
	+all() Set~User~
}

Post "0..n" --* "1..n" Topic
class Post {
	+id: Int
	+?Data: String
}
class Topic {
	+id: Int
	+name: String
	+posts() Set~Post~
}

class Collection~T~ {
	+Collection(...items: T)
	+onChange(callback: CollectionEvent~T~ => void) this
	+add(...items: T) void
	+remove(...items: T) void
	-snapshot: Array~T~
	-onChangeFunc: CollectionEvent~T~ => void
}

class CollectionEvent~T~ {
	+all: Array~T~
	+add: Array~T~
	+sub: Array~T~
	#CollectionEvent(previous: Array~T~, next: Array~T~)
}
Collection <.. CollectionEvent: onChange

```

# Backend Database Diagram
```mermaid
erDiagram

User {
	int id PK
	String email
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
	String name
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
