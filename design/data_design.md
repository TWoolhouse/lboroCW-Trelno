# Frontend Class Diagram

```mermaid
classDiagram
direction TB

User "1..n" --o "1" Team: users
User "1" --o "1" Team: leader
class User {
	+id: Int
	+email: String
	+rank: UserRank
	+name: String
	+tasks: Collection~Task~
	+tasklist() Collection~TaskRef~
	+projectlist() Collection~Project~
	+profilePicture(size: Number?) String
	+rankTitle() String
}

User "1" *-- "1" UserRank: rank
class UserRank {
	<<enum>>
	Employee = 0
	TeamLeader = 1
	ProjectManager = 2
}

User "1" o-- "0..n" Task: tasks
Task "0..n" --o "1" Task: subtasks
class Task {
	+id: Int
	+state: TaskState
	+deadline: Number
	+manhours: Number
	+name: String
	+desc: String?
	+subtasks: Collection~Task~
}
TaskState "0..n" --o "1" Task: state
class TaskState {
	<<enum>>
	Ready = 0
	Active = 1
	Done = 2
}

User "1" *-- "0..n" TaskRef: tasklist()
TaskRef "1" o-- "1" Task: task
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
	+id: Int
	+leader: User
	+users: Collection~User~
}

User "0.n" --o "0..n" ProjectTask: users
Task "0..n" --o "1" ProjectTask: task
class ProjectTask {
	+id: Int
	+task: Task
	+assignees: Collection~User~
}
Team "1" --o "1" Project: team
ProjectTask "0..n" --o "1" Project: tasks
class Project {
	+id: Int
	+team: Team
	+client: Client
	+created: Number
	+deadline: Number
	+name: String
	+desc: String
	+tasks: Collection~Task~
	+progress() Float
}

Client "0..n" --* "1" Project: client
class Client {
  +id: Number
  +name: String
  +representative: String
  +address: String
  +website: String
  +email: String
  +phone: String
}

Topic "1" *-- "0..n" Post: topic
class Topic {
	+id: Int
	+name: String
	+posts() Array~Post~
}
User "0..n" --o "1" Post: owner
class Post {
	+id: Int
	+topic: Topic
	+owner: User
	+title: String
	+markdown: String
	+created: Number
}

```

```mermaid
classDiagram

class Collection~T~ {
	+Collection(...items: T)
	+onChange(callback: CollectionEvent~T~ => void) this
	+[Symbol.iterator]() Generator~T~
	+add(...items: T) void
	+remove(...items: T) void
	+replace(...items: T) void
	-sync(func: void => void) void
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
