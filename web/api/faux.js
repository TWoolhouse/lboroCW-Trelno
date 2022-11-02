import * as api from "./core.js";
import { Memoize } from "./interface/memoize.js";
import { TaskState } from "./model/task.js";
import { User, UserRank } from "./model/user.js";

export async function faux() {
  // TODO: Temporary Faux database saved in session storage
  if (sessionStorage.getItem("FAUX") != null) return;
  sessionStorage.setItem("FAUX", "1");

  const random = (max, min = 0) => {
    return Math.min(max - 1, Math.floor(Math.random() * (max - min) + min));
  };

  const range = (count) => {
    const arr = [];
    for (let index = 0; index < count; index++) {
      arr.push(index + 1);
    }
    return arr;
  };

  const userKing = await api.createUser(
    "king@make-it-all.co.uk",
    UserRank.ProjectManager,
    "Neumann",
    1
  );
  const userQueen = await api.createUser(
    "queen@make-it-all.co.uk",
    UserRank.ProjectManager,
    "Queen",
    2
  );

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
  const users = [userKing, userQueen, ...leaders];

  for (const it of range(random(8, 5))) {
    userKing.tasks.add(
      await api.createTask(
        random(TaskState.Done + 1, TaskState.Ready),
        `Task #${it}`,
        Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
        random(10, 1),
        "User Task Description"
      )
    );
  }

  const clients = [
    await api.createClient(
      "Loughborough University",
      "Firat Batmaz",
      "Haslegrave Building, University Rd, Loughborough LE11 3TP",
      "lboro.ac.uk",
      "F.Batmaz@lboro.ac.uk",
      "+44 (0) 1509 222 699"
    ),
  ];

  const projects = [
    await api.createProject(
      leaders[0],
      clients[0],
      Date.now(),
      Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
      "Really Cool Idea",
      "This is a really cool idea for a project ngl."
    ),
  ];

  projects[0].team.users.add(
    await api.createUser("coah@make-it-all.co.uk", UserRank.Employee, "Adam"),
    await api.createUser("coa?@make-it-all.co.uk", UserRank.Employee, "Arshad"),
    await api.createUser("cocc@make-it-all.co.uk", UserRank.Employee, "Calin"),
    await api.createUser("coj?@make-it-all.co.uk", UserRank.Employee, "Jack"),
    await api.createUser("cor?@make-it-all.co.uk", UserRank.Employee, "Rowan"),
    await api.createUser("cotrw@make-it-all.co.uk", UserRank.Employee, "Tom")
  );

  for (const it of range(random(8, 2))) {
    projects[0].tasks.add(
      await api.createProjectTask(
        await api.createTask(
          random(TaskState.Done + 1, TaskState.Ready),
          "Task Project",
          Date.parse(`2022-${random(13, 11)}-${random(31, 1)}`),
          random(7, 1),
          "Project Task Description"
        )
      )
    );
  }

  const topics = [
    await api.createTopic("Topic A"),
    await api.createTopic("Topic B"),
  ];
  const posts = [
    await api.createPost(
      topics[0],
      userKing,
      "The Best Guide in the World",
      "# In degravat\n\n## Aquarum murmura nitenti duxisses prosiluit nec laniata\n\nLorem markdownum super paratis dura, pete cedit essent avidaeque giganteis et levis est circumspicit usquam inposita. Et horret positosque terras gurgite iactatis, dis ait dixit. Foret fuit: quid manus, diversaque dolor cuncta, capiebant. Cannis tunc mollire modo, habet luxuriant graves, opus vox spectantem dieque. Modo trahit, deum illic humo ut miseri placuere Charybdis populos pugnam domito gravi matrem ut.\n\n## Nos congestaque pati solo tamen fretum demissus\n\nCum Orchomenosque deos socialia mollia nec inmedicabile cubito, unda nocens auditis ex *medius*; mihi vidistis. Fortissime vobis, vivis exiguam, tibi venatum pubis furor. Ilios tinxit iram verba motis: est ipse frondesque Caesaris ut coniunx signa [videntem](http://stipitetorva.io/urbe-philomela.php): et! Vestibus forma bellator, hinc Dixit faciebant tamen; terra anguigenae serpente, et commenta aurum dedecus, et. Dextera habitata *adfusaque* dominatur barbarus sacra crines nostro murmure hoc, ora orbe montes Hymenaee ceram intendens iacentes Tethys dederis.\n\n1. Faveas peregrinis totus renarro glaebae Caenis\n2. Patrio ducit\n3. Sit et iamque sed Iuppiter satis\n4. Non Iovis deiecto hasta puniceum lac\n5. Auctor magicaeque hoc alii scrutantur tibi sentiat\n6. Saxo deus laniarat et\n\n## Aurora sic tanta\n\nInsistere morisque dapes stridore ictu, resecuta geruntur utque latentia tibi victrix eiusdem. Est missus onerosa. Solo [Me pectus equinis](http://deficit.org/proxima.aspx): temporis et quod cognoscere Astraei hi. Occiduae auxilium trepident quid, fama arbore sine Lichan dubitatis.\n\n## Viri iuvenem Niobe arma Phorcidas ictus ex\n\n*Domusque inmemores* pennis corpore tibi; aera esse, si moneo, et respice adamante. Res sed revincta unde in nostri *quas habet Scyrum* cum urbi et arte; dixit saxo *exstant*. Habet per ad erat tendens lunae, huic Phocus principio; quae adeo. Dei [caeso adventuque](http://www.traxitundis.net/) solvere rubet quis matutinis hoc iuvenem et ab gravis non.\n\n```\ntouchscreenAlertFilename.ocrBurn = maximize_token_click(gibibyte, host, socket);\nfinder = characterIntranetData + cycleUtf;\nccdAnalog.simm += 59;\n```\n\nSine primus est temptat amorem, vox ullis *stridentibus* summa et unguibus ales sit rapiunt, et. Ter summo licet quove. Concordare dixit protinus inplevere sinistro pectore, dignoque signisque posita frustraque Hippocoon victa."
    ),
  ];
}
