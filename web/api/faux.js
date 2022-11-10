import * as api from "./core.js";
import { Memoize } from "./interface/memoize.js";
import { Task, TaskState } from "./model/task.js";
import { User, UserRank } from "./model/user.js";

const dbStorage = sessionStorage;

export async function faux() {
  // TODO: Temporary Faux database saved in session storage
  if (dbStorage.getItem("FAUX") != null) return;
  dbStorage.setItem("FAUX", "1");

  // FAKE DATA GOES HERE!

  const userKing = await api.createUser(
    "king@make-it-all.co.uk",
    UserRank.ProjectManager,
    "Neumann",
    1
  );

  const managers = [
    await api.createUser(
      "queen@make-it-all.co.uk",
      UserRank.ProjectManager,
      "Queen",
      2
    ),
  ];

  const leaders = [
    await api.createUser(
      "dilip@make-it-all.co.uk",
      UserRank.TeamLeader,
      "Dilip",
      3
    ),
    await api.createUser(
      "Emma@make-it-all.co.uk",
      UserRank.TeamLeader,
      "Emma",
      4
    ),
  ];

  const employees = [
    await api.createUser(
      "alice@make-it-all.co.uk",
      UserRank.Employee,
      "Alice",
      5
    ),

    await api.createUser(
      "bert@make-it-all.co.uk",
      UserRank.Employee,
      "Bert",
      6
    ),
    await api.createUser(
      "clara@make-it-all.co.uk",
      UserRank.Employee,
      "Clara",
      7
    ),
  ];

  /** @const {Array<User>} users */
  const users = [userKing, ...managers, ...leaders, ...employees];

  userKing.tasks.add(
    // A User Task with no subtasks
    await api.createTask(
      TaskState.Ready,
      "Water the Plants",
      Date.parse("2022-11-19"),
      2,
      "Go water the tullips"
    ),
    await api.createTask(
      TaskState.Done,
      "Make Coffee for my team",
      Date.parse("2022-11-19"),
      1,
      "They really deserve it :)"
    ),
    await api.createTask(
      TaskState.Active,
      "Make notes for presentation",
      Date.parse("2022-11-10"),
      5,
      "Don't wanna slip up"
    ),
    await api.createTask(
      TaskState.Ready,
      "Buy Alan T. a Thank-You Card",
      Date.parse("2022-11-10"),
      2,
      "They did a great job on their last project"
    ),
    await api.createTask(
      TaskState.Ready,
      "Attend Meeting",
      Date.parse("2022-11-12"),
      1,
      "It's a big one!"
    ),

    // A User Task with subtasks
    await (async () => {
      const task = await api.createTask(
        TaskState.Active,
        "Create and populate database",
        Date.parse("2022-11-30"),
        5, // Doesn't matter as the subtasks will override this
        "Just an example of a task that may have multiple components"
      );
      task.subtasks.add(
        // Subtask
        await api.createTask(
          TaskState.Done, // A subtask should either be Ready OR Done, Never Active
          "Create a business account",
          Date.parse("2022-11-12"),
          2,
          "Create an account with a database provider with support for businesses"
        )
      );
      task.subtasks.add(
        // Subtask
        await api.createTask(
          TaskState.Ready, // A subtask should either be Ready OR Done, Never Active
          "Upload test data",
          Date.parse("2022-11-13"),
          2,
          "Generate some random test data to upload to the database and use for testing"
        )
      );
      task.subtasks.add(
        // Subtask
        await api.createTask(
          TaskState.Ready, // A subtask should either be Ready OR Done, Never Active
          "Publish on a test domain",
          Date.parse("2022-11-14"),
          1,
          "Even a local one will do"
        )
      );
      return task;
    })()
  );

  // TODO: Add Emma's tasks
  leaders[1].tasks.add();

  // TODO: Add Clara's tasks
  employees[2].tasks.add();

  const clients = [
    await api.createClient(
      "Loughborough University",
      "Firat Batmaz",
      "Haslegrave Building, University Rd, Loughborough LE11 3TP",
      "lboro.ac.uk",
      "F.Batmaz@lboro.ac.uk",
      "+44 (0) 1509 222 699"
    ),
    await api.createClient(
      "PepsiCo",
      "John Smith",
      "Green Park, Oak Way, Reading RG2 6UW",
      "pepsico.co.uk",
      "J.Smith@pepsico.co.uk",
      "+44 1189 160 000"
    ),
    await api.createClient(
      "Babbage and Co.",
      "Charles Babbage",
      "Green Park, Oak Way, Reading RG2 6UW",
      "babbage.co.uk",
      "Charles@babbage.co.uk",
      "+44 0123 456 789"
    ),
    await api.createClient(
      "Love Lace",
      "Ada Byron",
      "Green Park, Oak Way, Reading RG2 6UW",
      "LoveLace.co.uk",
      "ada@LoveLace.co.uk",
      "+44 0123 456 789"
    ),
  ];

  const projects = [
    await api.createProject(
      leaders[0],
      clients[0],
      Date.parse("2022-11-03"),
      Date.parse("2022-12-25"),
      "Create a Website for Tracking Tasks",
      "A website for tracking many users daily tasks."
    ),
    /* await api.createProject(
      leaders[0],
      clients[1],
      Date.parse("2022-11-06"),
      Date.parse("2023-2-05"),
      "Update Bottle Design",
      "PepsiCo wishes to update their bottle design."
    ), */
    await api.createProject(
      leaders[0],
      clients[2],
      Date.parse("2022-11-06"),
      Date.parse("2023-2-05"),
      "Edit website for new branch - Babbage's Cabbages",
      "Babbage and Co. are looking to expand into the fresh produce business"
    ),
    await api.createProject(
      leaders[0],
      clients[3],
      Date.parse("2022-11-06"),
      Date.parse("2022-11-11"),
      "Love Lace",
      "A start up selling a new kind of shoe-lace"
    ),
  ];

  projects[0].tasks.add(
    // A single project task with no subtasks
    await api.createProjectTask(
      await api.createTask(
        TaskState.Active,
        "Task that we're doing now",
        Date.parse("2022-11-31"),
        19,
        "A very important task that we are completing right now!"
      )
    ),
    // A project task with subtasks
    await api.createProjectTask(
      await (async () => {
        const task = await api.createTask(
          TaskState.Active,
          "A Big Task with lots to do",
          Date.parse("2022-12-13"),
          7,
          "This big task has a list of small tasks"
        );
        task.subtasks.add(
          await api.createTask(
            TaskState.Ready, // A subtask should either be Ready OR Done, Never Active
            "Water more plants",
            Date.parse("2022-11-19"),
            1,
            "Go water the roses"
          )
        );
        return task;
      })()
    )
  );

  const projectTask1 = await api.createProjectTask(
    await api.createTask(
      TaskState.Done,
      "Initial Design Drafts",
      Date.parse("2022-11-20"),
      37,
      "Create initial drafts before the meeting with the client."
    )
  );
  projectTask1.assignees.add(leaders[1]);

  // A single project task with no subtasks
  const projectTask2 = await api.createProjectTask(
    await api.createTask(
      TaskState.Active,
      "Final Website design",
      Date.parse("2022-11-27"),
      37,
      "More refined design ideas fit for creation"
    )
  );
  projectTask2.assignees.add(employees[0]);

  projects[1].tasks.add(
    projectTask1,
    projectTask2,
    await api.createProjectTask(
      await api.createTask(
        TaskState.Ready,
        "Initial Design Drafts",
        Date.parse("2022-12-25"),
        100,
        "Create a demonstration Landing Page for client approval"
      )
    ),
    // A project task with subtasks
    await api.createProjectTask(
      await (async () => {
        const task = await api.createTask(
          TaskState.Ready,
          "Create a finalized prototype for demonstration",
          Date.parse("2023-02-01"),
          7,
          "A prototype product"
        );
        task.subtasks.add(
          await api.createTask(
            TaskState.Ready, // A subtask should either be Ready OR Done, Never Active
            "Design",
            Date.parse("2022-12-01"),
            50,
            "Designing the prototype site"
          )
        );
        task.subtasks.add(
          await api.createTask(
            TaskState.Ready, // A subtask should either be Ready OR Done, Never Active
            "Manufacture",
            Date.parse("2022-12-20"),
            200,
            "Manufacturing the prototype line"
          )
        );
        return task;
      })()
    )
  );

  const justBarelyResourced = await api.createProjectTask(
    await api.createTask(
      TaskState.Active,
      "Shoe design",
      Date.parse("2022-11-11"),
      7,
      "More refined design ideas fit for creation"
    )
  );
  justBarelyResourced.assignees.add(employees[1]);

  projects[2].tasks.add(justBarelyResourced);

  // projects[1].assignees.add(leaders[1]);
  console.log(projects[1]);

  const topics = [
    await api.createTopic("Latin"),
    await api.createTopic("Movies"),
    await api.createTopic("PC issues"),
  ];
  const posts = [
    await api.createPost(
      topics[0],
      userKing,
      "The Best Guide to Speaking Latin in the World",
      "# In degravat\n\n## Aquarum murmura nitenti duxisses prosiluit nec laniata\n\nLorem markdownum super paratis dura, pete cedit essent avidaeque giganteis et levis est circumspicit usquam inposita. Et horret positosque terras gurgite iactatis, dis ait dixit. Foret fuit: quid manus, diversaque dolor cuncta, capiebant. Cannis tunc mollire modo, habet luxuriant graves, opus vox spectantem dieque. Modo trahit, deum illic humo ut miseri placuere Charybdis populos pugnam domito gravi matrem ut.\n\n## Nos congestaque pati solo tamen fretum demissus\n\nCum Orchomenosque deos socialia mollia nec inmedicabile cubito, unda nocens auditis ex *medius*; mihi vidistis. Fortissime vobis, vivis exiguam, tibi venatum pubis furor. Ilios tinxit iram verba motis: est ipse frondesque Caesaris ut coniunx signa [videntem](http://stipitetorva.io/urbe-philomela.php): et! Vestibus forma bellator, hinc Dixit faciebant tamen; terra anguigenae serpente, et commenta aurum dedecus, et. Dextera habitata *adfusaque* dominatur barbarus sacra crines nostro murmure hoc, ora orbe montes Hymenaee ceram intendens iacentes Tethys dederis.\n\n1. Faveas peregrinis totus renarro glaebae Caenis\n2. Patrio ducit\n3. Sit et iamque sed Iuppiter satis\n4. Non Iovis deiecto hasta puniceum lac\n5. Auctor magicaeque hoc alii scrutantur tibi sentiat\n6. Saxo deus laniarat et\n\n## Aurora sic tanta\n\nInsistere morisque dapes stridore ictu, resecuta geruntur utque latentia tibi victrix eiusdem. Est missus onerosa. Solo [Me pectus equinis](http://deficit.org/proxima.aspx): temporis et quod cognoscere Astraei hi. Occiduae auxilium trepident quid, fama arbore sine Lichan dubitatis.\n\n## Viri iuvenem Niobe arma Phorcidas ictus ex\n\n*Domusque inmemores* pennis corpore tibi; aera esse, si moneo, et respice adamante. Res sed revincta unde in nostri *quas habet Scyrum* cum urbi et arte; dixit saxo *exstant*. Habet per ad erat tendens lunae, huic Phocus principio; quae adeo. Dei [caeso adventuque](http://www.traxitundis.net/) solvere rubet quis matutinis hoc iuvenem et ab gravis non.\n\n```\ntouchscreenAlertFilename.ocrBurn = maximize_token_click(gibibyte, host, socket);\nfinder = characterIntranetData + cycleUtf;\nccdAnalog.simm += 59;\n```\n\nSine primus est temptat amorem, vox ullis *stridentibus* summa et unguibus ales sit rapiunt, et. Ter summo licet quove. Concordare dixit protinus inplevere sinistro pectore, dignoque signisque posita frustraque Hippocoon victa."
    ),
    await api.createPost(
      topics[1],
      users[2],
      "Movie Watchlist",
      "# Movie List\n- Star Wars\n- Shaw Shank Redemption\n- The Bee Movie\n- Shrek\n- E.T\n- Apollo 13\n- Cast Away\n- Forest Gump\n- Toy Story"
    ),
    await api.createPost(
      topics[1],
      users[4],
      "Best Movies",
      "# Best Movies\n- The Bee Movie\n- Joker\n- Jaws\n- Misson Impossible\n- Nightmare before Christmas\n- Avatar\n- Monty Python and the holy grail"
    ),
    await api.createPost(
      topics[2],
      users[5],
      "Monitor Not working",
      "# What to do if your monitor is not working\n- Begin by checking the power cables and switches.\n- If everything is plugged in, hold down the power button and wait for the screen to flash.\n- If nothing above works plesae bring it down to IT to have it checked out."
    ),
    await api.createPost(
      topics[2],
      users[6],
      "Keyboard Not working",
      "# What to do if your keyboard is unresponsive\n- Check if your keyboard is plugged in to the computer, if not plug it in and wait a little for it to start up.\n- If it is plugged in an nothing is happening, open the settings and type Keyboard, check to see if it is there\n- If it's not there plesae unplug your keyboard and bring it down to IT to have it checked out. "
    ),
  ];
}
