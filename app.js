const sampleWeek = {
  weekId: "W04",
  weekName: "Week 4 — Sample Data",
  deadline: "2026-09-25T19:00:00-05:00",
  deadlineDisplay: "Friday, September 25 at 7:00 PM CT",

  nebraskaGame: {
    gameId: "G004",
    awayTeam: "Nebraska",
    homeTeam: "Michigan State",
    nebraskaSpread: 3.5,
    overUnder: 47.5
  },

  b1gGames: [
    {
      gameId: "G005",
      awayTeam: "Illinois",
      homeTeam: "Ohio State"
    },
    {
      gameId: "G006",
      awayTeam: "Iowa",
      homeTeam: "Michigan"
    },
    {
      gameId: "G007",
      awayTeam: "Minnesota",
      homeTeam: "Washington"
    },
    {
      gameId: "G008",
      awayTeam: "Northwestern",
      homeTeam: "Indiana"
    },
    {
      gameId: "G009",
      awayTeam: "Oregon",
      homeTeam: "USC"
    },
    {
      gameId: "G010",
      awayTeam: "UCLA",
      homeTeam: "Maryland"
    },
    {
      gameId: "G011",
      awayTeam: "Wisconsin",
      homeTeam: "Penn State"
    }
  ]
};

const navButtons = document.querySelectorAll(".nav-button");
const pageSections = document.querySelectorAll(".page-section");

navButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const selectedPage = button.dataset.page;

    navButtons.forEach(function(navButton) {
      navButton.classList.toggle(
        "active",
        navButton === button
      );
    });

    pageSections.forEach(function(section) {
      section.hidden = section.id !== selectedPage;
    });
  });
});

function formatSpread(spread) {
  if (spread > 0) {
    return `+${spread}`;
  }

  return String(spread);
}

function renderWeekHeading(week) {
  const weekLabel = document.querySelector("#week-label");
  const deadlineTime = document.querySelector("#deadline-time");

  weekLabel.textContent = week.weekName;
  deadlineTime.dateTime = week.deadline;
  deadlineTime.textContent = week.deadlineDisplay;
}

function renderNebraskaGame(game) {
  const container = document.querySelector(
    "#nebraska-game-container"
  );

  const nebraskaIsAway = game.awayTeam === "Nebraska";

  const opponentTeam = nebraskaIsAway
    ? game.homeTeam
    : game.awayTeam;

  const opponentSpread = game.nebraskaSpread * -1;

  container.innerHTML = `
    <fieldset class="game-card nebraska-game">
      <legend>
        ${game.awayTeam} at ${game.homeTeam}
      </legend>

      <div class="pick-category">
        <h4>Against the Spread</h4>

        <label class="radio-option">
          <input
            type="radio"
            name="ats-${game.gameId}"
            value="NEBRASKA"
            required
          >
          <span>
            Nebraska ${formatSpread(game.nebraskaSpread)}
          </span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="ats-${game.gameId}"
            value="OPPONENT"
            required
          >
          <span>
            ${opponentTeam} ${formatSpread(opponentSpread)}
          </span>
        </label>
      </div>

      <div class="pick-category">
        <h4>Over/Under ${game.overUnder}</h4>

        <label class="radio-option">
          <input
            type="radio"
            name="ou-${game.gameId}"
            value="OVER"
            required
          >
          <span>Over</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="ou-${game.gameId}"
            value="UNDER"
            required
          >
          <span>Under</span>
        </label>
      </div>

      <div class="pick-category">
        <h4>Who will win?</h4>

        <label class="radio-option">
          <input
            type="radio"
            name="winner-${game.gameId}"
            value="${game.awayTeam}"
            required
          >
          <span>${game.awayTeam}</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="winner-${game.gameId}"
            value="${game.homeTeam}"
            required
          >
          <span>${game.homeTeam}</span>
        </label>
      </div>

      <div class="pick-category">
        <h4>Predicted Final Score</h4>

        <div class="score-grid">
          <div class="form-field">
            <label for="predicted-away-${game.gameId}">
              ${game.awayTeam}
            </label>

            <input
              id="predicted-away-${game.gameId}"
              name="predicted-away-${game.gameId}"
              type="number"
              min="0"
              max="99"
              required
            >
          </div>

          <div class="form-field">
            <label for="predicted-home-${game.gameId}">
              ${game.homeTeam}
            </label>

            <input
              id="predicted-home-${game.gameId}"
              name="predicted-home-${game.gameId}"
              type="number"
              min="0"
              max="99"
              required
            >
          </div>
        </div>
      </div>
    </fieldset>
  `;
}

function renderB1gGames(games) {
  const container = document.querySelector(
    "#b1g-games-container"
  );

  const gameCards = games.map(function(game) {
    return `
      <fieldset class="game-card">
        <legend>
          ${game.awayTeam} at ${game.homeTeam}
        </legend>

        <label class="radio-option">
          <input
            type="radio"
            name="winner-${game.gameId}"
            value="${game.awayTeam}"
            required
          >
          <span>${game.awayTeam}</span>
        </label>

        <label class="radio-option">
          <input
            type="radio"
            name="winner-${game.gameId}"
            value="${game.homeTeam}"
            required
          >
          <span>${game.homeTeam}</span>
        </label>
      </fieldset>
    `;
  });

  container.innerHTML = gameCards.join("");
}

function renderPickForm(week) {
  renderWeekHeading(week);
  renderNebraskaGame(week.nebraskaGame);
  renderB1gGames(week.b1gGames);
}

renderPickForm(sampleWeek);

const picksForm = document.querySelector("#picks-form");
const formMessage = document.querySelector("#form-message");

picksForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const formData = new FormData(picksForm);
  const nebraskaGame = sampleWeek.nebraskaGame;

  const nebraskaPick = {
    gameId: nebraskaGame.gameId,

    winnerPick: formData.get(
      `winner-${nebraskaGame.gameId}`
    ),

    atsPick: formData.get(
      `ats-${nebraskaGame.gameId}`
    ),

    ouPick: formData.get(
      `ou-${nebraskaGame.gameId}`
    ),

    predictedAwayScore: Number(
      formData.get(
        `predicted-away-${nebraskaGame.gameId}`
      )
    ),

    predictedHomeScore: Number(
      formData.get(
        `predicted-home-${nebraskaGame.gameId}`
      )
    )
  };

  const b1gPicks = sampleWeek.b1gGames.map(function(game) {
    return {
      gameId: game.gameId,
      winnerPick: formData.get(
        `winner-${game.gameId}`
      )
    };
  });

  const submission = {
    action: "submitPicks",
    playerId: formData.get("playerId"),
    pin: formData.get("playerPin"),
    weekId: sampleWeek.weekId,
    picks: [
      nebraskaPick,
      ...b1gPicks
    ]
  };

  const safeConsoleCopy = {
    ...submission,
    pin: "[REDACTED]"
  };

  console.log("Submission object:", safeConsoleCopy);

  formMessage.textContent =
    "Sample submission created successfully. Check the console.";
});