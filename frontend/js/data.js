const BRIEFINGS = {
  "2026-09-22": {
    weekday: "Tuesday",
    coverage: "Monitored 10 primary records, 12 publications, and 16 creators. Facebook personal profiles were out of scope. Two YouTube transcripts lagged the morning upload window.",
    clusters: [
      {
        id: "sara-impeachment",
        kicker: "National politics",
        title: "VP Sara impeachment",
        lede: "The Senate’s handling of the impeachment complaint against Vice President Sara Duterte remained the day’s sharpest split: newsrooms treated procedure and numbers; aligned creators treated loyalty, persecution, and unfinished accountability.",
        primary: [
          { label: "Senate records / complaint docket", href: "https://legacy.senate.gov.ph/" },
          { label: "House transmittal language (public copy)", href: "https://www.congress.gov.ph/" }
        ],
        missed: "Several creator threads omitted the calendar of remaining procedural votes. Several broadsheets underplayed how the same clips were being recut for Facebook overnight.",
        takes: [
          {
            lane: "newsroom",
            source: "Philippine Daily Inquirer",
            tier: "B · Professional reporting",
            headline: "Senate calendars next vote as camps trade numbers on the floor",
            summary: "Inquirer centers the parliamentary sequence, named votes, and what still has to happen before any trial can open — with quotes from both camps.",
            excerpt: "Whether the complaint advances still depends on a vote count the chamber has not yet locked in.",
            url: "https://www.inquirer.net/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 78, headline: 82, loaded: 28, certainty: 64, omission: 35, tone: 22 },
            alt: "Could also be read as over-indexing on process while the political temperature on social feeds is already trial-by-clip."
          },
          {
            lane: "newsroom",
            source: "The Philippine Star",
            tier: "B · Professional reporting",
            headline: "Allies call the complaint a political weapon; critics say delay is the point",
            summary: "Star pairs official statements with a shorter evidence recap, then lets both blocs describe motive. The body is more cautious than the display headline.",
            excerpt: "Critics argue the calendar itself has become the battlefield.",
            url: "https://www.philstar.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 70, headline: 61, loaded: 46, certainty: 58, omission: 42, tone: 40 },
            alt: "Headline leans into motive language that the reported facts only partially support."
          },
          {
            lane: "newsroom",
            source: "Rappler",
            tier: "B · Professional reporting",
            headline: "What the public record actually contains — and what it does not",
            summary: "A document-forward explainer that walks through annexes, missing items, and claims that have been repeated without a cited page.",
            excerpt: "Several viral assertions still point to no page in the filed complaint.",
            url: "https://www.rappler.com/",
            label: { key: "supported", text: "Supported by primary evidence" },
            signals: { evidence: 88, headline: 90, loaded: 24, certainty: 55, omission: 22, tone: 18 },
            alt: "Readers on the other side may treat document-first framing itself as oppositional."
          },
          {
            lane: "creator",
            source: "Boy Bato",
            tier: "C · Commentary / influence",
            headline: "This is not justice. This is a pile-on.",
            summary: "A high-engagement Facebook talk frames the complaint as coordinated humiliation, emphasizing crowd energy and loyalty over the docket.",
            excerpt: "Kung totoo ang laban, bakit puro palabas ang dating?",
            url: "https://www.facebook.com/",
            label: { key: "partisan", text: "Partisan argument" },
            signals: { evidence: 22, headline: 48, loaded: 86, certainty: 84, omission: 74, tone: 88 },
            alt: "Could be advocacy rather than a factual claim about secret coordination — the post does not show a paper trail."
          },
          {
            lane: "creator",
            source: "Jesus Falcis",
            tier: "C · Commentary / influence",
            headline: "Impeachment is a constitutional tool, not a personality war",
            summary: "Legal-commentary tone: cites the Constitution’s impeachment mechanics, then argues the public is being asked to pick a camp instead of reading the complaint.",
            excerpt: "You can dislike the politics and still insist the documents be read in public.",
            url: "https://www.facebook.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 62, headline: 80, loaded: 38, certainty: 60, omission: 40, tone: 34 },
            alt: "Uses constitutional framing; still selects which political motives to emphasize."
          },
          {
            lane: "creator",
            source: "Maharlika Nightly",
            tier: "C · Commentary / influence",
            headline: "The real story is who is scared of a public trial",
            summary: "Livestream recap treats remaining Senate steps as proof of guilt-avoidance. Engagement is high; citations are mostly other livestreams.",
            excerpt: "Kung malinis, bakit takot sa trial?",
            url: "https://www.youtube.com/",
            label: { key: "unsupported", text: "Unsupported assertion" },
            signals: { evidence: 18, headline: 44, loaded: 80, certainty: 90, omission: 81, tone: 79 },
            alt: "Delay can also be ordinary legislative sequencing; the clip does not distinguish those hypotheses."
          }
        ]
      },
      {
        id: "luzon-flooding",
        kicker: "Weather / public service",
        title: "Luzon flooding",
        lede: "Overnight rain flooded parts of Metro Manila, Bulacan, and southern Luzon. Professional outlets led with PAGASA warnings and local rescue counts. Creator feeds split between climate blame, government neglect, and ‘panic content’ recuts of the same underpass videos.",
        primary: [
          { label: "PAGASA weather bulletin", href: "https://www.pagasa.dost.gov.ph/" },
          { label: "NDRRMC situation reports", href: "https://ndrrmc.gov.ph/" }
        ],
        missed: "Commuter and driver testimony is still thinner than official counts on this briefing. Several pages reused yesterday’s footage without a timestamp.",
        takes: [
          {
            lane: "newsroom",
            source: "GMA News",
            tier: "B · Professional reporting",
            headline: "Class suspensions, stranded buses, and the roads still underwater at dawn",
            summary: "Broadcast recap with field reports from Marikina and Bocaue, plus the latest rainfall totals and suspension list.",
            excerpt: "Rescue units reported more stranded vehicles than overnight injuries.",
            url: "https://www.gmanetwork.com/news/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 84, headline: 88, loaded: 20, certainty: 70, omission: 30, tone: 26 },
            alt: "Strong on scene, lighter on drainage-project history."
          },
          {
            lane: "newsroom",
            source: "Inquirer",
            tier: "B · Professional reporting",
            headline: "Why the same underpasses flood first — a map of last night’s choke points",
            summary: "Pairs rainfall data with a simple map of recurring flood spots and LGU statements on pumping stations.",
            excerpt: "Several of last night’s deepest points match a five-year flood pattern, not a single storm.",
            url: "https://www.inquirer.net/",
            label: { key: "supported", text: "Supported by primary evidence" },
            signals: { evidence: 86, headline: 85, loaded: 18, certainty: 66, omission: 28, tone: 16 },
            alt: "Pattern language can be read as assigning blame even when the piece stays descriptive."
          },
          {
            lane: "newsroom",
            source: "ABS-CBN News",
            tier: "B · Professional reporting",
            headline: "Families wait on rooftops in Bulacan as water recedes slower than forecasts",
            summary: "Human-impact package: interviews, relief staging, and a cautious line on casualty figures still being verified.",
            excerpt: "Officials asked the public not to treat early social-media counts as confirmed.",
            url: "https://www.abs-cbn.com/news",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 80, headline: 83, loaded: 32, certainty: 52, omission: 33, tone: 36 },
            alt: "Emotional framing is high because the scenes are; it is not the same as overstating death counts."
          },
          {
            lane: "creator",
            source: "Kuya Trapik",
            tier: "C · Commentary / influence",
            headline: "EDSA looks fine on TV. Your side street is a river.",
            summary: "Dashcam compilation aimed at commuters. Useful locally; several clips are undated and one is from a previous weather event.",
            excerpt: "Huwag niyo akong sabihang alarmista — nandito ako sa tubig.",
            url: "https://www.facebook.com/",
            label: { key: "unverified", text: "Unverified" },
            signals: { evidence: 40, headline: 58, loaded: 55, certainty: 72, omission: 60, tone: 62 },
            alt: "Lived experience can be true for one street and still mislead if old footage is mixed in."
          },
          {
            lane: "creator",
            source: "Climate Watch PH",
            tier: "C · Commentary / influence",
            headline: "This is what a hotter sea does to a night of rain",
            summary: "Connects the flood to climate trends and dredging delays. Cites PAGASA rainfall but leaps from one night to a national indictment.",
            excerpt: "A warning is not a drainage system.",
            url: "https://www.facebook.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 58, headline: 64, loaded: 60, certainty: 68, omission: 48, tone: 50 },
            alt: "Climate context is relevant; single-storm causation is still a bigger claim than the cited bulletin."
          },
          {
            lane: "creator",
            source: "LGU Insider Clips",
            tier: "D · Unverified channel",
            headline: "They knew. They still sent people to work.",
            summary: "Anonymous page stitching official photos with accusation captions. No named author, no document, high share velocity.",
            excerpt: "Screenshot lang to pero kayo na bahala.",
            url: "https://www.facebook.com/",
            label: { key: "unsupported", text: "Unsupported assertion" },
            signals: { evidence: 8, headline: 30, loaded: 92, certainty: 88, omission: 90, tone: 94 },
            alt: "Narrative monitoring only — this tier should never be used as factual support."
          }
        ]
      },
      {
        id: "west-philippine-sea",
        kicker: "Foreign policy / security",
        title: "West Philippine Sea",
        lede: "A resupply run and competing videos of water-cannon contact again split the day’s feeds: one cluster emphasizing sovereignty and sailors; another emphasizing de-escalation, Chinese statements, and ‘who benefits from the clip.’",
        primary: [
          { label: "AFP / PCG public statements", href: "https://www.coastguard.gov.ph/" },
          { label: "UNCLOS / arbitration materials (public)", href: "https://pca-cpa.org/" }
        ],
        missed: "Full unedited bridge recordings were not in the public set this morning. Several viral crops start after the first maneuver.",
        takes: [
          {
            lane: "newsroom",
            source: "Philippine Star",
            tier: "B · Professional reporting",
            headline: "PCG: water cannon used again; Beijing repeats ‘intrusion’ line",
            summary: "Straight dual-statement piece with a still from officially released video and a timeline of the morning’s run.",
            excerpt: "Both governments released clips. They do not begin at the same second.",
            url: "https://www.philstar.com/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 82, headline: 86, loaded: 26, certainty: 62, omission: 34, tone: 24 },
            alt: "He-said structure can feel like false balance if the video record is stronger than one statement."
          },
          {
            lane: "newsroom",
            source: "BusinessWorld",
            tier: "B · Professional reporting",
            headline: "Markets shrug; shippers do not — insurance talk after another encounter",
            summary: "Trade-desk angle: routes, insurance chatter, and why a viral clip can move logistics costs before it moves diplomacy.",
            excerpt: "The clip is political. The surcharge, if it comes, is an invoice.",
            url: "https://www.bworldonline.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 74, headline: 80, loaded: 22, certainty: 57, omission: 38, tone: 20 },
            alt: "Useful extra frame; not a substitute for the encounter record."
          },
          {
            lane: "creator",
            source: "Atin Ito Watch",
            tier: "C · Commentary / influence",
            headline: "Do not look away from the boat",
            summary: "Sovereignty-forward narration over PCG footage, with repeated cuts to faces on deck. Strong emotion, thin legal citation.",
            excerpt: "This is not a dispute on paper. This is water hitting our people.",
            url: "https://www.youtube.com/",
            label: { key: "partisan", text: "Partisan argument" },
            signals: { evidence: 48, headline: 70, loaded: 78, certainty: 76, omission: 55, tone: 82 },
            alt: "The harm shown can be real even when the legal conclusions are argued rather than sourced."
          },
          {
            lane: "creator",
            source: "Peace Pulse Asia",
            tier: "C · Commentary / influence",
            headline: "Both sides have cameras. That is not the same as both sides being equal.",
            summary: "Essay-style post warning against war fever, then over-corrects by treating official Chinese copy as a matching evidence tier.",
            excerpt: "Nationalism is easy. De-escalation is the adult work.",
            url: "https://www.facebook.com/",
            label: { key: "disputed", text: "Disputed" },
            signals: { evidence: 36, headline: 60, loaded: 52, certainty: 50, omission: 64, tone: 44 },
            alt: "De-escalation is a policy view; equating evidence quality is a separate, weaker move."
          }
        ]
      },
      {
        id: "national-budget",
        kicker: "Public spending",
        title: "National budget hearings",
        lede: "Budget season soundbites traveled faster than committee transcripts. Newsrooms tracked insertions, ceilings, and agency answers. Creators tracked villains.",
        primary: [
          { label: "DBM budget documents", href: "https://www.dbm.gov.ph/" },
          { label: "Committee hearing streams / transcripts", href: "https://legacy.senate.gov.ph/" }
        ],
        missed: "Line-item PDFs remain harder to find than 15-second ‘gotcha’ cuts. Regional project lists barely appeared in national creator feeds.",
        takes: [
          {
            lane: "newsroom",
            source: "BusinessWorld",
            tier: "B · Professional reporting",
            headline: "Ceiling holds; the fight is now over which programs get squeezed",
            summary: "Numbers-led write-up of the hearing, with a table of contested allocations and what still needs bicameral action.",
            excerpt: "The political argument is about priorities. The document argument is about lines.",
            url: "https://www.bworldonline.com/",
            label: { key: "supported", text: "Supported by primary evidence" },
            signals: { evidence: 90, headline: 87, loaded: 16, certainty: 72, omission: 25, tone: 12 },
            alt: "Dry on purpose; some readers will miss the human programs behind the lines."
          },
          {
            lane: "newsroom",
            source: "Rappler",
            tier: "B · Professional reporting",
            headline: "Watch the insertions: what members asked to add, and what they would cut",
            summary: "Hearing recap that names proposed insertions and the agencies pushing back, with timestamps into the stream.",
            excerpt: "If it is not in the transcript, it is still only a claim from the hallway.",
            url: "https://www.rappler.com/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 85, headline: 84, loaded: 30, certainty: 60, omission: 32, tone: 28 },
            alt: "Insertion coverage can be read as targeting particular blocs even when the paper trail is real."
          },
          {
            lane: "creator",
            source: "Boy Bato",
            tier: "C · Commentary / influence",
            headline: "Your taxes, their sagala",
            summary: "Comedy-rage edit of hearing clips. Names are clear; numbers on screen do not match the DBM table.",
            excerpt: "Sila ang palabas. Kayo ang bayad.",
            url: "https://www.facebook.com/",
            label: { key: "partisan", text: "Partisan argument" },
            signals: { evidence: 28, headline: 42, loaded: 88, certainty: 80, omission: 70, tone: 90 },
            alt: "Satire-adjacent, but presented as a briefing rather than labeled parody."
          },
          {
            lane: "creator",
            source: "Teacher Ana Explains",
            tier: "C · Commentary / influence",
            headline: "I mapped three education line items so you do not have to",
            summary: "Classroom-funded explainer walking through DepEd-related lines with screenshots of the public PDF.",
            excerpt: "If they cut the wrong row, it is not an abstract. It is a classroom without a fan.",
            url: "https://www.facebook.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 76, headline: 82, loaded: 34, certainty: 58, omission: 30, tone: 40 },
            alt: "Affected-voice value is high; still a selection of three items, not the whole education budget."
          }
        ]
      }
    ]
  },
  "2026-09-21": {
    weekday: "Monday",
    coverage: "Monday briefing used the same watchlist. One regional paper site timed out for 40 minutes; that gap is marked on the flooding cluster.",
    clusters: [
      {
        id: "sara-impeachment",
        kicker: "National politics",
        title: "VP Sara impeachment",
        lede: "Weekend rallies and a Sunday talk-show clip set Monday’s frame before the Senate even opened. Newsrooms tried to separate crowd size from the legal calendar.",
        primary: [{ label: "Senate session calendar", href: "https://legacy.senate.gov.ph/" }],
        missed: "Independent crowd estimates were thinner than campaign-supplied photos.",
        takes: [
          {
            lane: "newsroom",
            source: "Inquirer",
            tier: "B · Professional reporting",
            headline: "From the rally ground back to the calendar",
            summary: "Monday recap treats weekend turnout as political weather, then returns to what the chamber can actually do this week.",
            excerpt: "A crowd is a signal. It is not a vote.",
            url: "https://www.inquirer.net/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 75, headline: 80, loaded: 30, certainty: 60, omission: 36, tone: 25 }
          },
          {
            lane: "creator",
            source: "Boy Bato",
            tier: "C · Commentary / influence",
            headline: "Look at the people. Tapos na ang usapan.",
            summary: "Treats rally density as verdict. No count methodology.",
            excerpt: "Kung ito ang ‘minority,’ anong majority pa ang hanap ninyo?",
            url: "https://www.facebook.com/",
            label: { key: "partisan", text: "Partisan argument" },
            signals: { evidence: 20, headline: 40, loaded: 84, certainty: 88, omission: 72, tone: 86 }
          }
        ]
      },
      {
        id: "luzon-flooding",
        kicker: "Weather / public service",
        title: "Luzon flooding",
        lede: "PAGASA’s first heavy-rain advisory went out before the evening rush. Creator pages were already circulating last year’s videos.",
        primary: [{ label: "PAGASA advisory archive", href: "https://www.pagasa.dost.gov.ph/" }],
        missed: "Regional paper timeout: Bicol situation reports were incomplete in this run.",
        takes: [
          {
            lane: "newsroom",
            source: "GMA News",
            tier: "B · Professional reporting",
            headline: "Advisory up: which LGUs moved first on suspensions",
            summary: "List-led public-service report. Timestamped.",
            excerpt: "The advisory is not yet a flood. It is a clock.",
            url: "https://www.gmanetwork.com/news/",
            label: { key: "corroborated", text: "Corroborated reporting" },
            signals: { evidence: 83, headline: 88, loaded: 14, certainty: 68, omission: 22, tone: 12 }
          },
          {
            lane: "creator",
            source: "Kuya Trapik",
            tier: "C · Commentary / influence",
            headline: "If you wait for the news, you are already late",
            summary: "Useful exit-route tips mixed with undated water clips.",
            excerpt: "Alisin niyo na ang pride. Umuwi na.",
            url: "https://www.facebook.com/",
            label: { key: "unverified", text: "Unverified" },
            signals: { evidence: 34, headline: 55, loaded: 50, certainty: 70, omission: 58, tone: 60 }
          }
        ]
      }
    ]
  },
  "2026-09-20": {
    weekday: "Sunday",
    coverage: "Sunday edition is thinner by design: fewer hearings, more creator recaps of the week.",
    clusters: [
      {
        id: "west-philippine-sea",
        kicker: "Foreign policy / security",
        title: "West Philippine Sea",
        lede: "Weekend explainers tried to catch viewers up on the month’s encounters. Quality varied from map-led to sermon-led.",
        primary: [{ label: "PCG releases", href: "https://www.coastguard.gov.ph/" }],
        missed: "No new official video dropped Sunday; most posts were recuts.",
        takes: [
          {
            lane: "newsroom",
            source: "Inquirer",
            tier: "B · Professional reporting",
            headline: "A week of encounters, in order",
            summary: "Timeline feature. Dates and vessel names checked against PCG copy.",
            excerpt: "Sequence is the first fact. Motive is the argument.",
            url: "https://www.inquirer.net/",
            label: { key: "supported", text: "Supported by primary evidence" },
            signals: { evidence: 88, headline: 90, loaded: 18, certainty: 64, omission: 26, tone: 14 }
          },
          {
            lane: "creator",
            source: "Atin Ito Watch",
            tier: "C · Commentary / influence",
            headline: "Sunday sermon: remember the boat",
            summary: "Weekly compilation. Emotional, repetitive, little new evidence.",
            excerpt: "If we forget by Monday, they win the week.",
            url: "https://www.youtube.com/",
            label: { key: "partisan", text: "Partisan argument" },
            signals: { evidence: 40, headline: 62, loaded: 74, certainty: 70, omission: 50, tone: 80 }
          }
        ]
      }
    ]
  },
  "2026-09-19": {
    weekday: "Saturday",
    coverage: "Saturday archive: public-spending explainers and a quieter impeachment docket.",
    clusters: [
      {
        id: "national-budget",
        kicker: "Public spending",
        title: "National budget hearings",
        lede: "Weekend readers got the first plain-language tables after a noisy Friday hearing.",
        primary: [{ label: "DBM documents", href: "https://www.dbm.gov.ph/" }],
        missed: "No new hearing Saturday; creator posts were recaps.",
        takes: [
          {
            lane: "newsroom",
            source: "BusinessWorld",
            tier: "B · Professional reporting",
            headline: "The Friday hearing, without the hallway",
            summary: "Transcript-based Saturday read.",
            excerpt: "What was said on the record is already enough work.",
            url: "https://www.bworldonline.com/",
            label: { key: "supported", text: "Supported by primary evidence" },
            signals: { evidence: 91, headline: 86, loaded: 12, certainty: 74, omission: 20, tone: 10 }
          },
          {
            lane: "creator",
            source: "Teacher Ana Explains",
            tier: "C · Commentary / influence",
            headline: "I printed the education pages",
            summary: "Phone photos of budget lines with classroom translation.",
            excerpt: "This is the fan, the chair, and the bond paper.",
            url: "https://www.facebook.com/",
            label: { key: "interpretation", text: "Interpretation" },
            signals: { evidence: 72, headline: 80, loaded: 28, certainty: 55, omission: 32, tone: 36 }
          }
        ]
      }
    ]
  }
};

const DATE_ORDER = ["2026-09-22", "2026-09-21", "2026-09-20", "2026-09-19"];

const SIGNAL_META = [
  { key: "evidence", name: "Evidence" },
  { key: "headline", name: "Headline fit" },
  { key: "loaded", name: "Loaded lang." },
  { key: "certainty", name: "Certainty" },
  { key: "omission", name: "Omission" },
  { key: "tone", name: "Tone" }
];
