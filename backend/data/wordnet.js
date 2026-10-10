// WordNet and Tagalog Lexical Knowledge Base

const WORDNET_DATA = {
  photosynthesis: {
    lemma: "photosynthesis",
    synsets: [
      {
        synset: "photosynthesis.n.01",
        pos: "noun [NN]",
        hypernym: "biological process → organic process",
        definition: "Synthesis of chemical compounds with the aid of radiant energy (light); formation of carbohydrates in chlorophyll-containing tissues of plants exposed to sunlight.",
        synonyms: ["light reaction", "Calvin cycle", "carbon fixation"]
      }
    ]
  },
  chlorophyll: {
    lemma: "chlorophyll",
    synsets: [
      {
        synset: "chlorophyll.n.01",
        pos: "noun [NN]",
        hypernym: "pigment → coloring material",
        definition: "Any of a group of green pigments found in photosynthetic organisms; absorbs light energy for photosynthesis.",
        synonyms: ["chlorophyl", "plant pigment"]
      }
    ]
  },
  glucose: {
    lemma: "glucose",
    synsets: [
      {
        synset: "glucose.n.01",
        pos: "noun [NN]",
        hypernym: "carbohydrate → monosaccharide",
        definition: "A simple monosaccharide sugar that serves as the primary energy source in metabolism and cellular respiration.",
        synonyms: ["dextrose", "blood sugar", "C6H12O6"]
      }
    ]
  },
  sunlight: {
    lemma: "sunlight",
    synsets: [
      {
        synset: "sunlight.n.01",
        pos: "noun [NN]",
        hypernym: "energy source → solar radiation",
        definition: "The radiant energy emitted by the sun, providing illumination and energy essential for photosynthetic chemical reactions.",
        synonyms: ["sunshine", "solar energy"]
      }
    ]
  },
  oxygen: {
    lemma: "oxygen",
    synsets: [
      {
        synset: "oxygen.n.01",
        pos: "noun [NN]",
        hypernym: "chemical gas → chemical element",
        definition: "A nonmetallic bivalent element that is normally a colorless, odorless gas; essential byproduct of photosynthetic light reactions.",
        synonyms: ["O2", "vital air"]
      }
    ]
  },
  carbon: {
    lemma: "carbon",
    synsets: [
      {
        synset: "carbon.n.01",
        pos: "noun [NN]",
        hypernym: "chemical element → nonmetal",
        definition: "An abundant nonmetallic tetravalent element occurring in all organic compounds and forms of carbonaceous matter.",
        synonyms: ["C", "carbonaceous material"]
      },
      {
        synset: "carbon.n.02",
        pos: "noun [NN]",
        hypernym: "copy → duplicate",
        definition: "A sheet of carbon paper or a carbon copy of a document or text.",
        synonyms: ["carbon copy", "duplicate", "carbon paper"]
      }
    ]
  },
  dioxide: {
    lemma: "dioxide",
    synsets: [
      {
        synset: "dioxide.n.01",
        pos: "noun [NN]",
        hypernym: "chemical compound → oxide",
        definition: "An oxide containing two atoms of oxygen in the molecule, such as carbon dioxide (CO2).",
        synonyms: ["carbon dioxide", "CO2"]
      }
    ]
  },
  respiration: {
    lemma: "respiration",
    synsets: [
      {
        synset: "respiration.n.01",
        pos: "noun [NN]",
        hypernym: "biological process → metabolism",
        definition: "The metabolic processes whereby living organisms obtain energy through the oxidation of complex organic substances.",
        synonyms: ["cellular respiration", "aerobic respiration"]
      },
      {
        synset: "respiration.n.02",
        pos: "noun [NN]",
        hypernym: "bodily process → ventilation",
        definition: "The bodily process of inhalation and exhalation; the total process of taking in oxygen and expelling carbon dioxide.",
        synonyms: ["breathing", "external respiration"]
      }
    ]
  },
  mitochondria: {
    lemma: "mitochondrion",
    synsets: [
      {
        synset: "mitochondrion.n.01",
        pos: "noun [NN]",
        hypernym: "cell organelle → cell structure",
        definition: "An organelle found in eukaryotic cells, in which respiration and ATP production occur; known as the powerhouse of the cell.",
        synonyms: ["powerhouse of the cell", "chondriosome"]
      }
    ]
  },
  membrane: {
    lemma: "membrane",
    synsets: [
      {
        synset: "membrane.n.01",
        pos: "noun [NN]",
        hypernym: "cell structure → biological barrier",
        definition: "A pliable sheetlike structure acting as a boundary or lining in a cell, regulating molecular passage.",
        synonyms: ["cell membrane", "lipid bilayer"]
      },
      {
        synset: "membrane.n.02",
        pos: "noun [NN]",
        hypernym: "anatomical tissue → biological layer",
        definition: "A thin pliable layer of tissue covering surfaces or separating spaces in an animal or plant body.",
        synonyms: ["tissue layer", "mucous membrane"]
      }
    ]
  },
  protein: {
    lemma: "protein",
    synsets: [
      {
        synset: "protein.n.01",
        pos: "noun [NN]",
        hypernym: "biomolecule → macromolecule",
        definition: "Any of a large class of nitrogenous organic compounds composed of one or more long chains of amino acids.",
        synonyms: ["polypeptide", "amino acid chain"]
      },
      {
        synset: "protein.n.02",
        pos: "noun [NN]",
        hypernym: "macronutrient → dietary nutrient",
        definition: "Dietary protein essential for growth, building, and repair of body cells and muscle tissue.",
        synonyms: ["dietary protein", "macronutrient"]
      }
    ]
  },
  enzyme: {
    lemma: "enzyme",
    synsets: [
      {
        synset: "enzyme.n.01",
        pos: "noun [NN]",
        hypernym: "biomolecule → biological catalyst",
        definition: "A substance produced by a living organism which acts as a catalyst to bring about a specific biochemical reaction.",
        synonyms: ["catalyst", "biocatalyst"]
      }
    ]
  },
  cell: {
    lemma: "cell",
    synsets: [
      {
        synset: "cell.n.01",
        pos: "noun [NN]",
        hypernym: "cellular biology → basic unit of life",
        definition: "The smallest structural and functional unit of an organism, typically microscopic and consisting of cytoplasm and a nucleus.",
        synonyms: ["eukaryote", "prokaryote", "biological unit"]
      },
      {
        synset: "cell.n.02",
        pos: "noun [NN]",
        hypernym: "room → compartment",
        definition: "A small room in which a prisoner, monk, or nun is kept, or an enclosed compartment in a larger structure.",
        synonyms: ["prison cell", "cubicle", "compartment"]
      },
      {
        synset: "cell.n.03",
        pos: "noun [NN]",
        hypernym: "device → electrochemical generator",
        definition: "A device delivering an electric current as the result of an electrochemical reaction.",
        synonyms: ["electric cell", "battery", "galvanic cell"]
      }
    ]
  },
  plant: {
    lemma: "plant",
    synsets: [
      {
        synset: "plant.n.02",
        pos: "noun [NN]",
        hypernym: "botany → living organism",
        definition: "A living organism of the vegetable kingdom, typically synthesizing energy through photosynthesis.",
        synonyms: ["flora", "vegetation"]
      },
      {
        synset: "plant.n.01",
        pos: "noun [NN]",
        hypernym: "industrial facility → factory",
        definition: "Buildings for carrying on industrial labor, manufacturing, or power generation.",
        synonyms: ["factory", "works", "industrial plant"]
      },
      {
        synset: "plant.v.01",
        pos: "verb [VB]",
        hypernym: "action → sow",
        definition: "Put or set into the ground for growth, or place firmly in position.",
        synonyms: ["sow", "seed", "embed"]
      }
    ]
  },
  leaf: {
    lemma: "leaf",
    synsets: [
      {
        synset: "leaf.n.01",
        pos: "noun [NN]",
        hypernym: "botany → plant organ",
        definition: "A flattened structure of a higher plant, specialized as the primary site of photosynthetic reactions.",
        synonyms: ["foliage", "leaves"]
      },
      {
        synset: "leaf.n.02",
        pos: "noun [NN]",
        hypernym: "sheet → paper item",
        definition: "A sheet of paper, especially in a book, notebook, or manuscript.",
        synonyms: ["folio", "page", "sheet"]
      },
      {
        synset: "leaf.v.01",
        pos: "verb [VB]",
        hypernym: "action → browse",
        definition: "Turn over pages of a book or document; browse through readings.",
        synonyms: ["flip through", "browse", "skim"]
      }
    ]
  },
  cycle: {
    lemma: "cycle",
    synsets: [
      {
        synset: "cycle.n.01",
        pos: "noun [NN]",
        hypernym: "biochemical process → pathway",
        definition: "A series of events or reactions that are regularly repeated in the same order, returning to the starting point.",
        synonyms: ["metabolic cycle", "feedback loop"]
      },
      {
        synset: "cycle.n.06",
        pos: "noun [NN]",
        hypernym: "vehicle → wheeled transport",
        definition: "A wheeled vehicle consisting of two or more wheels, such as a bicycle or tricycle.",
        synonyms: ["bicycle", "bike", "velocipede"]
      },
      {
        synset: "cycle.v.01",
        pos: "verb [VB]",
        hypernym: "recurrence → repeat",
        definition: "Pass through a recurring cycle of events, or travel by bicycle.",
        synonyms: ["recur", "repeat", "ride bike"]
      }
    ]
  },
  calvin: {
    lemma: "Calvin",
    synsets: [
      {
        synset: "calvin.nnp.cycle",
        pos: "proper noun [NNP]",
        hypernym: "biochemical process → metabolic pathway",
        definition: "Named after Melvin Calvin; the light-independent reactions of photosynthesis in which carbon dioxide is fixed into carbohydrates.",
        synonyms: ["Calvin-Benson cycle", "C3 cycle", "light-independent reactions"]
      }
    ]
  },
  reaction: {
    lemma: "reaction",
    synsets: [
      {
        synset: "reaction.n.01",
        pos: "noun [NN]",
        hypernym: "chemical reaction → chemical process",
        definition: "A process that involves rearrangement of the molecular or ionic structure of a substance, transforming reactants into products.",
        synonyms: ["chemical transformation", "process"]
      },
      {
        synset: "reaction.n.03",
        pos: "noun [NN]",
        hypernym: "behavior → response",
        definition: "An action or feeling in response to a statement, event, or situation.",
        synonyms: ["response", "feedback", "counteraction"]
      },
      {
        synset: "reaction.n.05",
        pos: "noun [NN]",
        hypernym: "medical condition → immune response",
        definition: "An extreme sensitivity to a particular substance; an allergic reaction or physiological reflex.",
        synonyms: ["allergic reaction", "hypersensitivity", "reflex"]
      }
    ]
  },
  demand: {
    lemma: "demand",
    synsets: [
      {
        synset: "demand.n.02",
        pos: "noun [NN]",
        hypernym: "economic concept → market force",
        definition: "The quantity of a commodity or service that people are ready and able to purchase at various prices.",
        synonyms: ["consumer demand", "market demand"]
      },
      {
        synset: "demand.n.01",
        pos: "noun [NN]",
        hypernym: "communication → request",
        definition: "An urgent or peremptory request or command made as of right.",
        synonyms: ["insistent request", "claim", "requirement"]
      },
      {
        synset: "demand.v.01",
        pos: "verb [VB]",
        hypernym: "speech act → ask",
        definition: "Request urgently and forcefully; call for as necessary or appropriate.",
        synonyms: ["require", "insist", "claim"]
      }
    ]
  },
  supply: {
    lemma: "supply",
    synsets: [
      {
        synset: "supply.n.01",
        pos: "noun [NN]",
        hypernym: "economic concept → market provision",
        definition: "The total amount of a specific good or service that is available to consumers at a given price level.",
        synonyms: ["stock", "market provision"]
      },
      {
        synset: "supply.n.02",
        pos: "noun [NN]",
        hypernym: "inventory → stockpile",
        definition: "An amount or quantity of something provided or stored for future use.",
        synonyms: ["inventory", "reserve", "store"]
      },
      {
        synset: "supply.v.01",
        pos: "verb [VB]",
        hypernym: "transfer → give",
        definition: "Make something needed or wanted available to someone; provide or furnish.",
        synonyms: ["provide", "furnish", "cater"]
      }
    ]
  },
  inflation: {
    lemma: "inflation",
    synsets: [
      {
        synset: "inflation.n.01",
        pos: "noun [NN]",
        hypernym: "economic concept → macroeconomic condition",
        definition: "A general and progressive increase in prices in an economy relative to available goods and services.",
        synonyms: ["price surge", "purchasing power decline"]
      },
      {
        synset: "inflation.n.02",
        pos: "noun [NN]",
        hypernym: "physical act → expansion",
        definition: "The physical act of filling something with air or gas to expand it.",
        synonyms: ["expansion", "distension", "blowing up"]
      }
    ]
  },
  market: {
    lemma: "market",
    synsets: [
      {
        synset: "market.n.01",
        pos: "noun [NN]",
        hypernym: "economic concept → commercial institution",
        definition: "A regular gathering or virtual system facilitating the purchase and sale of provisions, commodities, or services.",
        synonyms: ["marketplace", "trade exchange"]
      },
      {
        synset: "market.n.04",
        pos: "noun [NN]",
        hypernym: "commerce → business sector",
        definition: "The commercial sector or customer base for particular goods or services.",
        synonyms: ["target audience", "industry", "customer base"]
      },
      {
        synset: "market.v.01",
        pos: "verb [VB]",
        hypernym: "business operation → promote",
        definition: "Advertise or promote products or services to prospective buyers.",
        synonyms: ["promote", "merchandise", "sell"]
      }
    ]
  },
  price: {
    lemma: "price",
    synsets: [
      {
        synset: "price.n.01",
        pos: "noun [NN]",
        hypernym: "economic concept → valuation",
        definition: "The amount of money expected, required, or given in payment for something.",
        synonyms: ["cost", "monetary valuation"]
      },
      {
        synset: "price.n.02",
        pos: "noun [NN]",
        hypernym: "toll → sacrifice",
        definition: "The cost at which something is obtained, suffered, or sacrificed.",
        synonyms: ["toll", "penalty", "sacrifice"]
      }
    ]
  },
  cost: {
    lemma: "cost",
    synsets: [
      {
        synset: "cost.n.01",
        pos: "noun [NN]",
        hypernym: "economic concept → expenditure",
        definition: "An amount that has to be paid or spent to buy, produce, or obtain something.",
        synonyms: ["outlay", "expense"]
      },
      {
        synset: "cost.n.02",
        pos: "noun [NN]",
        hypernym: "toll → sacrifice",
        definition: "The effort, loss, or sacrifice necessary to achieve or obtain something.",
        synonyms: ["sacrifice", "detriment"]
      },
      {
        synset: "cost.v.01",
        pos: "verb [VB]",
        hypernym: "require → necessitate",
        definition: "Require the payment of a specified sum or loss of something.",
        synonyms: ["necessitate", "incur", "take"]
      }
    ]
  },
  exam: {
    lemma: "exam",
    synsets: [
      {
        synset: "examination.n.02",
        pos: "noun [NN]",
        hypernym: "assessment → formal evaluation",
        definition: "A formal test evaluating a student's knowledge or proficiency in a subject.",
        synonyms: ["examination", "evaluation"]
      },
      {
        synset: "examination.n.01",
        pos: "noun [NN]",
        hypernym: "inspection → scrutiny",
        definition: "A detailed inspection or medical checkup.",
        synonyms: ["medical exam", "checkup", "inspection"]
      }
    ]
  },
  quiz: {
    lemma: "quiz",
    synsets: [
      {
        synset: "quiz.n.01",
        pos: "noun [NN]",
        hypernym: "assessment → brief test",
        definition: "An examination consisting of a few short questions.",
        synonyms: ["short exam", "checkup"]
      },
      {
        synset: "quiz.v.01",
        pos: "verb [VB]",
        hypernym: "inquiry → question",
        definition: "Ask someone questions to test their knowledge.",
        synonyms: ["interrogate", "question"]
      }
    ]
  },
  test: {
    lemma: "test",
    synsets: [
      {
        synset: "test.n.02",
        pos: "noun [NN]",
        hypernym: "assessment → evaluation procedure",
        definition: "Any standardized procedure for measuring sensitivity, ability, or knowledge.",
        synonyms: ["trial", "examination"]
      },
      {
        synset: "test.n.05",
        pos: "noun [NN]",
        hypernym: "biology → shell",
        definition: "A hard outer covering as that of an echinoderm or amoeba.",
        synonyms: ["outer shell", "carapace"]
      },
      {
        synset: "test.v.01",
        pos: "verb [VB]",
        hypernym: "action → evaluate",
        definition: "Put to the test; try out or evaluate performance.",
        synonyms: ["evaluate", "try out", "assess"]
      }
    ]
  },
  homework: {
    lemma: "homework",
    synsets: [
      {
        synset: "homework.n.01",
        pos: "noun [NN]",
        hypernym: "academic work → assignment",
        definition: "Schoolwork that a student is required to complete outside the classroom.",
        synonyms: ["assignment", "schoolwork"]
      }
    ]
  },
  lecture: {
    lemma: "lecture",
    synsets: [
      {
        synset: "lecture.n.01",
        pos: "noun [NN]",
        hypernym: "academic work → educational discourse",
        definition: "An educational talk to an audience, especially one of students in a university.",
        synonyms: ["address", "presentation"]
      },
      {
        synset: "lecture.n.02",
        pos: "noun [NN]",
        hypernym: "rebuke → reprimand",
        definition: "A long reprimand or warning given to someone.",
        synonyms: ["scolding", "reprimand"]
      }
    ]
  },
  formula: {
    lemma: "formula",
    synsets: [
      {
        synset: "formula.n.01",
        pos: "noun [NN]",
        hypernym: "mathematics → symbolic rule",
        definition: "A mathematical relationship or rule expressed in symbols.",
        synonyms: ["equation", "rule"]
      },
      {
        synset: "formula.n.02",
        pos: "noun [NN]",
        hypernym: "nutritional preparation → milk substitute",
        definition: "A liquid food preparation for infant feeding.",
        synonyms: ["infant formula", "preparation"]
      }
    ]
  },
  equation: {
    lemma: "equation",
    synsets: [
      {
        synset: "equation.n.01",
        pos: "noun [NN]",
        hypernym: "mathematics → equality statement",
        definition: "A statement that the values of two mathematical expressions are equal.",
        synonyms: ["mathematical equality", "relation"]
      },
      {
        synset: "equation.n.02",
        pos: "noun [NN]",
        hypernym: "chemistry → reaction balance",
        definition: "A symbolic representation of a chemical reaction.",
        synonyms: ["chemical equation", "stoichiometry"]
      }
    ]
  },
  force: {
    lemma: "force",
    synsets: [
      {
        synset: "force.n.01",
        pos: "noun [NN]",
        hypernym: "physics concept → physical interaction",
        definition: "An influence that tends to change the motion of a body or produce motion in a stationary body.",
        synonyms: ["thrust", "physical power"]
      },
      {
        synset: "force.n.02",
        pos: "noun [NN]",
        hypernym: "power → physical strength",
        definition: "Physical power or strength exerted by a person or thing.",
        synonyms: ["might", "strength"]
      },
      {
        synset: "force.n.04",
        pos: "noun [NN]",
        hypernym: "organization → armed unit",
        definition: "An organized group of military personnel or police officers.",
        synonyms: ["police force", "military unit"]
      }
    ]
  },
  energy: {
    lemma: "energy",
    synsets: [
      {
        synset: "energy.n.01",
        pos: "noun [NN]",
        hypernym: "physics concept → capacity for work",
        definition: "The strength and vitality required for sustained activity; capacity of a physical system to perform work.",
        synonyms: ["work capacity", "power"]
      },
      {
        synset: "energy.n.03",
        pos: "noun [NN]",
        hypernym: "trait → vitality",
        definition: "An energetic style, vigor, or enthusiasm in expression or motion.",
        synonyms: ["vitality", "vigor", "enthusiasm"]
      }
    ]
  },
  gravity: {
    lemma: "gravity",
    synsets: [
      {
        synset: "gravity.n.01",
        pos: "noun [NN]",
        hypernym: "physics concept → fundamental attraction",
        definition: "The force that attracts a body toward the center of the earth or toward any physical body having mass.",
        synonyms: ["gravitation", "gravitational pull"]
      },
      {
        synset: "gravity.n.02",
        pos: "noun [NN]",
        hypernym: "quality → seriousness",
        definition: "Extreme importance, seriousness, or solemnity of a situation.",
        synonyms: ["seriousness", "solemnity", "severity"]
      }
    ]
  },
  algorithm: {
    lemma: "algorithm",
    synsets: [
      {
        synset: "algorithm.n.01",
        pos: "noun [NN]",
        hypernym: "computer science → computational procedure",
        definition: "A finite sequence of rigorous instructions, typically used to solve a class of specific problems or perform computation.",
        synonyms: ["computation rule", "step-by-step logic"]
      }
    ]
  },
  network: {
    lemma: "network",
    synsets: [
      {
        synset: "network.n.05",
        pos: "noun [NN]",
        hypernym: "computer science → interconnected system",
        definition: "An interconnected system of nodes, computers, or persons transmitting data.",
        synonyms: ["telecom grid", "data mesh"]
      },
      {
        synset: "network.n.01",
        pos: "noun [NN]",
        hypernym: "material → mesh",
        definition: "An openwork fabric of cords, threads, or wires intersecting at regular intervals.",
        synonyms: ["mesh", "web", "net"]
      },
      {
        synset: "network.n.02",
        pos: "noun [NN]",
        hypernym: "social structure → group",
        definition: "A group of interconnected people or organizations.",
        synonyms: ["social network", "association"]
      }
    ]
  },
  database: {
    lemma: "database",
    synsets: [
      {
        synset: "database.n.01",
        pos: "noun [NN]",
        hypernym: "computer science → structured data store",
        definition: "An organized body of related information stored electronically and accessible in various queries.",
        synonyms: ["datastore", "data repository"]
      }
    ]
  },
  absorb: {
    lemma: "absorb",
    synsets: [
      {
        synset: "absorb.v.01",
        pos: "verb [VB]",
        hypernym: "physical process → assimilate",
        definition: "Take in or soak up energy, radiation, liquid, or other substances by chemical or physical action.",
        synonyms: ["assimilate", "take in", "soak up", "ingest"]
      },
      {
        synset: "absorb.v.02",
        pos: "verb [VB]",
        hypernym: "mental process → engage",
        definition: "Take in, learn, or fully comprehend information or study material.",
        synonyms: ["comprehend", "learn", "grasp"]
      }
    ]
  },
  make: {
    lemma: "make",
    synsets: [
      {
        synset: "make.v.01",
        pos: "verb [VB]",
        hypernym: "creation → synthesize",
        definition: "Form or assemble by combining parts, biological reactions, or chemical reactants (e.g. plants make glucose).",
        synonyms: ["synthesize", "create", "manufacture", "produce"]
      }
    ]
  },
  produce: {
    lemma: "produce",
    synsets: [
      {
        synset: "produce.v.01",
        pos: "verb [VB]",
        hypernym: "creation → synthesize",
        definition: "Bring forth, yield, or generate naturally or biologically as a result of a cellular or chemical process.",
        synonyms: ["generate", "synthesize", "yield", "create"]
      },
      {
        synset: "produce.n.01",
        pos: "noun [NN]",
        hypernym: "agriculture → food products",
        definition: "Fresh fruits and vegetables cultivated on a farm.",
        synonyms: ["crops", "harvest", "fresh food"]
      }
    ]
  },
  important: {
    lemma: "important",
    synsets: [
      {
        synset: "important.a.01",
        pos: "adjective [JJ]",
        hypernym: "significance → crucial attribute",
        definition: "Of great significance, value, or consequence; highly essential for an exam or subject mastery.",
        synonyms: ["crucial", "essential", "significant", "vital"]
      },
      {
        synset: "important.a.02",
        pos: "adjective [JJ]",
        hypernym: "prominence → authority",
        definition: "Having high status, influence, or academic priority.",
        synonyms: ["influential", "prominent"]
      }
    ]
  },
  study: {
    lemma: "study",
    synsets: [
      {
        synset: "study.v.01",
        pos: "verb [VB]",
        hypernym: "academic activity → learn",
        definition: "Devote time and attention to acquiring knowledge on an academic subject.",
        synonyms: ["learn", "examine", "investigate", "read"]
      },
      {
        synset: "study.n.01",
        pos: "noun [NN]",
        hypernym: "academic work → investigation",
        definition: "A detailed investigation and analysis of a subject or situation.",
        synonyms: ["inquiry", "research", "investigation"]
      }
    ]
  },
  reyes: {
    lemma: "Reyes",
    synsets: [
      {
        synset: "reyes.nnp.entity",
        pos: "proper noun [NNP]",
        hypernym: "named entity → instructor / person",
        definition: "Proper noun representing an instructor or referenced person (e.g., 'Ma\\'am Reyes').",
        synonyms: ["Ma'am Reyes", "instructor reference"]
      }
    ]
  },
  mahalaga: {
    lemma: "halaga",
    synsets: [
      {
        synset: "mahalaga.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino adjective meaning 'important', 'crucial', or 'of high value'.",
        synonyms: ["important", "crucial", "makabuluhan"]
      },
      {
        synset: "mahalaga.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Costly or highly prized in monetary or sentimental value.",
        synonyms: ["precious", "valuable"]
      }
    ]
  },
  maintindihan: {
    lemma: "intindi",
    synsets: [
      {
        synset: "maintindihan.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino verb meaning 'to understand' or 'to comprehend'.",
        synonyms: ["understand", "comprehend", "maunawaan"]
      },
      {
        synset: "maintindihan.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "To empathize with someone's feelings or perspective.",
        synonyms: ["empathize", "relate"]
      }
    ]
  },
  sobrang: {
    lemma: "sobra",
    synsets: [
      {
        synset: "sobrang.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino modifier meaning 'extremely' or 'excessively'.",
        synonyms: ["very", "extremely", "labis"]
      },
      {
        synset: "sobrang.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Surplus or remainder beyond what is needed.",
        synonyms: ["excess", "surplus"]
      }
    ]
  },
  hirap: {
    lemma: "hirap",
    synsets: [
      {
        synset: "hirap.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino noun/adjective denoting difficulty, hardship, or effort required.",
        synonyms: ["difficult", "hardship"]
      },
      {
        synset: "hirap.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Poverty or economic hardship.",
        synonyms: ["poverty", "destitution"]
      }
    ]
  },
  kailangan: {
    lemma: "kailangan",
    synsets: [
      {
        synset: "kailangan.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino modal/word meaning 'need' or 'necessary'.",
        synonyms: ["necessary", "required"]
      },
      {
        synset: "kailangan.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Obligation or duty to perform an action.",
        synonyms: ["obligation", "must"]
      }
    ]
  },
  aralin: {
    lemma: "aral",
    synsets: [
      {
        synset: "aralin.tl.01",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino noun meaning 'lesson', 'subject matter', or 'topic to study'.",
        synonyms: ["lesson", "study topic"]
      },
      {
        synset: "aralin.tl.02",
        pos: "Tagalog content word",
        hypernym: "Filipino / Tagalog Vocabulary",
        definition: "Filipino verb meaning to study, examine, or investigate thoroughly.",
        synonyms: ["study", "examine", "suriin"]
      }
    ]
  }
};
// Populate top-level fields for direct compatibility
Object.keys(WORDNET_DATA).forEach(k => {
  const e = WORDNET_DATA[k];
  if (e.synsets && e.synsets.length) {
    Object.assign(e, e.synsets[0]);
  }
});

module.exports = WORDNET_DATA;
