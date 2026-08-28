const PICKEM_API_URL =
  "https://script.google.com/macros/s/AKfycbyq5eEsZceeCRq_bvhy_QIq-0uEZd0VHrxa_XQfT12fizKzDUukB8doBcfeEtiuwFs79A/exec";

let currentPickWeek = null;

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

navButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedPage = button.dataset.page;

    navButtons.forEach(function (navButton) {
      navButton.classList.toggle(
        "active",
        navButton === button
      );
    });

    pageSections.forEach(function (section) {
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

  const hasBettingLines =
    Number.isFinite(game.nebraskaSpread) &&
    Number.isFinite(game.overUnder);

  if (!hasBettingLines) {
    container.innerHTML = `
      <fieldset class="game-card nebraska-game">
        <legend>
          ${game.awayTeam} at ${game.homeTeam}
        </legend>

        <p>
          Nebraska betting lines have not been entered yet.
          Pick selections will appear once the spread and
          over/under are available.
        </p>
      </fieldset>
    `;

    return;
  }

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

  const gameCards = games.map(function (game) {
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

// renderPickForm(sampleWeek);

const picksForm = document.querySelector("#picks-form");
const formMessage = document.querySelector("#form-message");

picksForm.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();

    if (!currentPickWeek) {
      formMessage.textContent =
        "The weekly games have not finished loading.";

      return;
    }

    if (currentPickWeek.effectiveStatus !== "OPEN") {
      formMessage.textContent =
        "Picks cannot be submitted because this week is not open.";

      return;
    }

    const formData = new FormData(picksForm);
    const picks = [];

    const nebraskaGame =
      currentPickWeek.nebraskaGame;

    if (nebraskaGame) {
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

      picks.push(nebraskaPick);
    }

    const b1gPicks =
      currentPickWeek.b1gGames.map(function (game) {
        return {
          gameId: game.gameId,
          winnerPick: formData.get(
            `winner-${game.gameId}`
          )
        };
      });

    picks.push(...b1gPicks);

    const submission = {
      action: "submitPicks",
      playerId: formData.get("playerId"),
      pin: formData.get("playerPin"),
      weekId: currentPickWeek.weekId,
      picks: picks
    };

    const submitButton =
      picksForm.querySelector(
        'button[type="submit"]'
      );

    submitButton.disabled = true;
    submitButton.textContent =
      "Saving Picks...";

    formMessage.textContent = "";

    try {
      const response = await fetch(
        PICKEM_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },
          body: JSON.stringify(submission)
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(
          payload.error?.message ||
          "The picks could not be saved."
        );
      }

      console.log(
        "Saved pick submission:",
        payload.data
      );

      formMessage.textContent =
        "All picks saved successfully.";
    } catch (error) {
      console.error(
        "Pick submission failed:",
        error
      );

      formMessage.textContent =
        error.message;
    } finally {
      submitButton.textContent =
        "Submit Picks";

      submitButton.disabled =
        !currentPickWeek ||
        currentPickWeek.effectiveStatus !== "OPEN";
    }
  });

const sampleFinalScores = {
  G005: {
    awayScore: 17,
    homeScore: 31
  },
  G006: {
    awayScore: 24,
    homeScore: 21
  },
  G007: {
    awayScore: 20,
    homeScore: 28
  },
  G008: {
    awayScore: 14,
    homeScore: 35
  },
  G009: {
    awayScore: 34,
    homeScore: 31
  },
  G010: {
    awayScore: 21,
    homeScore: 24
  },
  G011: {
    awayScore: 27,
    homeScore: 30
  }
};

const sampleCompletedWeek = {
  ...sampleWeek,

  nebraskaGame: {
    ...sampleWeek.nebraskaGame,
    awayScore: 27,
    homeScore: 24
  },

  b1gGames: sampleWeek.b1gGames.map(function (game) {
    return {
      ...game,
      ...sampleFinalScores[game.gameId]
    };
  })
};

const correctB1gWinners = {
  G005: "Ohio State",
  G006: "Iowa",
  G007: "Washington",
  G008: "Indiana",
  G009: "Oregon",
  G010: "Maryland",
  G011: "Penn State"
};

function createSampleSubmission(
  playerId,
  playerName,
  nebraskaPick,
  b1gWinners
) {
  const b1gPicks = Object.entries(b1gWinners).map(
    function (entry) {
      const gameId = entry[0];
      const winnerPick = entry[1];

      return {
        gameId,
        winnerPick
      };
    }
  );

  return {
    playerId,
    playerName,
    picks: [
      nebraskaPick,
      ...b1gPicks
    ]
  };
}

const samplePlayerSubmissions = [
  createSampleSubmission(
    "P001",
    "Jake Bowen",
    {
      gameId: "G004",
      winnerPick: "Nebraska",
      atsPick: "NEBRASKA",
      ouPick: "OVER",
      predictedAwayScore: 27,
      predictedHomeScore: 24
    },
    correctB1gWinners
  ),

  createSampleSubmission(
    "P002",
    "Example Player",
    {
      gameId: "G004",
      winnerPick: "Michigan State",
      atsPick: "OPPONENT",
      ouPick: "UNDER",
      predictedAwayScore: 27,
      predictedHomeScore: 24
    },
    {
      ...correctB1gWinners,
      G009: "USC"
    }
  ),

  createSampleSubmission(
    "P003",
    "Test Player",
    {
      gameId: "G004",
      winnerPick: "Nebraska",
      atsPick: "NEBRASKA",
      ouPick: "OVER",
      predictedAwayScore: 28,
      predictedHomeScore: 24
    },
    correctB1gWinners
  )
];

const sampleWeeklyResults = calculateWeeklyResults(
  sampleCompletedWeek,
  samplePlayerSubmissions
);

function formatSelectionResult(
  selection,
  correct,
  points
) {
  const resultClass = correct
    ? "result-correct"
    : "result-incorrect";

  const symbol = correct ? "✓" : "✕";

  return `
    <span class="pick-value">${selection}</span>
    <span class="${resultClass}">
      ${symbol} ${points} point${points === 1 ? "" : "s"}
    </span>
  `;
}

function getNebraskaOpponent(game) {
  return game.awayTeam === "Nebraska"
    ? game.homeTeam
    : game.awayTeam;
}

function formatAtsSelection(result, game) {
  if (result.atsPick === "NEBRASKA") {
    return "Nebraska";
  }

  return getNebraskaOpponent(game);
}

function formatOuSelection(result) {
  if (result.ouPick === "OVER") {
    return "Over";
  }

  return "Under";
}

function formatScoreResult(result, game) {
  let resultText = "No score points";
  let resultClass = "result-neutral";

  if (result.scoreResult === "EXACT") {
    resultText = "Exact — 5 points";
    resultClass = "result-correct";
  } else if (result.scoreResult === "CLOSEST") {
    resultText = "Closest — 1 point";
    resultClass = "result-correct";
  }

  return `
    <span class="pick-value">
      ${result.predictedAwayScore}–${result.predictedHomeScore}
    </span>

    <span class="score-teams">
      ${game.awayTeam}–${game.homeTeam}
    </span>

    <span class="${resultClass}">
      ${resultText}
    </span>
  `;
}

function formatB1gDetails(result) {
  const detailItems = result.b1gDetails.map(
    function (detail) {
      const resultClass = detail.correct
        ? "result-correct"
        : "result-incorrect";

      const symbol = detail.correct ? "✓" : "✕";

      return `
        <li>
          <strong>
            ${detail.awayTeam} at ${detail.homeTeam}
          </strong>

          <div>Pick: ${detail.winnerPick}</div>

          <div class="${resultClass}">
            ${symbol} Actual winner: ${detail.actualWinner}
          </div>
        </li>
      `;
    }
  );

  return `
    <details class="b1g-details">
      <summary>
        ${result.b1gCorrect}/${result.b1gEligible}
      </summary>

      <ul class="b1g-detail-list">
        ${detailItems.join("")}
      </ul>
    </details>
  `;
}

function renderWeeklyResults(week, results) {
  const tableBody = document.querySelector(
    "#results-table-body"
  );

  const rows = results.map(function (result) {
    const atsSelection = formatAtsSelection(
      result,
      week.nebraskaGame
    );

    const ouSelection = formatOuSelection(result);

    return `
      <tr>
        <td>
          <strong>${result.playerName}</strong>
        </td>

        <td>
          ${formatSelectionResult(
      atsSelection,
      result.atsCorrect,
      result.atsPoints
    )}
        </td>

        <td>
          ${formatSelectionResult(
      ouSelection,
      result.ouCorrect,
      result.ouPoints
    )}
        </td>

        <td>
          ${formatSelectionResult(
      result.winnerPick,
      result.winnerCorrect,
      result.winnerPoints
    )}
        </td>

        <td>
          ${formatScoreResult(
      result,
      week.nebraskaGame
    )}
        </td>

        <td>
          ${formatB1gDetails(result)}
        </td>

        <td>
          ${result.b1gBonusPoints}
        </td>

        <td class="total-points">
          ${result.weeklyPoints}
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = rows.join("");
}

renderWeeklyResults(
  sampleCompletedWeek,
  sampleWeeklyResults
);

function createSampleSummaryResult(
  playerId,
  playerName,
  weeklyPoints,
  b1gCorrect,
  b1gAttempted,
  b1gPerfect
) {
  return {
    playerId,
    playerName,
    weeklyPoints,
    b1gCorrect,
    b1gAttempted,
    b1gPerfect
  };
}

const sampleFinalizedWeeks = [
  {
    weekId: "W01",
    results: [
      createSampleSummaryResult(
        "P001",
        "Jake Bowen",
        8,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P002",
        "Example Player",
        6,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P003",
        "Test Player",
        9,
        0,
        0,
        false
      )
    ]
  },

  {
    weekId: "W02",
    results: [
      createSampleSummaryResult(
        "P001",
        "Jake Bowen",
        7,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P002",
        "Example Player",
        10,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P003",
        "Test Player",
        5,
        0,
        0,
        false
      )
    ]
  },

  {
    weekId: "W03",
    results: [
      createSampleSummaryResult(
        "P001",
        "Jake Bowen",
        11,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P002",
        "Example Player",
        6,
        0,
        0,
        false
      ),
      createSampleSummaryResult(
        "P003",
        "Test Player",
        8,
        0,
        0,
        false
      )
    ]
  },

  {
    weekId: "W04",
    results: sampleWeeklyResults
  },

  {
    weekId: "W05",
    results: [
      createSampleSummaryResult(
        "P001",
        "Jake Bowen",
        9,
        6,
        7,
        false
      ),
      createSampleSummaryResult(
        "P002",
        "Example Player",
        13,
        7,
        7,
        true
      ),
      createSampleSummaryResult(
        "P003",
        "Test Player",
        7,
        5,
        7,
        false
      )
    ]
  }
];

const sampleLeaderboard = calculateLeaderboard(
  sampleFinalizedWeeks
);

console.table(sampleLeaderboard);

console.assert(
  sampleLeaderboard[0].playerId === "P001",
  "Jake should be first."
);

console.assert(
  sampleLeaderboard[0].totalPoints === 51,
  "Jake should have 51 points."
);

console.assert(
  sampleLeaderboard[0].b1gCorrect === 13 &&
  sampleLeaderboard[0].b1gAttempted === 14,
  "Jake should have a 13/14 B1G record."
);

console.assert(
  sampleLeaderboard[1].rank === 2 &&
  sampleLeaderboard[2].rank === 2,
  "The 40-point players should be tied for second."
);

console.assert(
  sampleLeaderboard[1].totalPoints === 40 &&
  sampleLeaderboard[2].totalPoints === 40,
  "Example Player and Test Player should each have 40 points."
);

function formatB1gAccuracy(accuracy) {
  if (accuracy === null) {
    return "—";
  }

  return `${accuracy.toFixed(1)}%`;
}

function formatB1gRecord(player) {
  if (player.b1gAttempted === 0) {
    return "—";
  }

  return (
    `${player.b1gCorrect}/` +
    `${player.b1gAttempted}`
  );
}

function renderLeaderboard(standings) {
  const tableBody = document.querySelector(
    "#leaderboard-table-body"
  );

  const rows = standings.map(function (player) {
    return `
      <tr>
        <td>${player.rank}</td>

        <td>
          <strong>${player.playerName}</strong>
        </td>

        <td class="leaderboard-points">
          ${player.totalPoints}
        </td>

        <td>
          ${formatB1gRecord(player)}
        </td>

        <td>
          ${formatB1gAccuracy(
      player.b1gAccuracy
    )}
        </td>

        <td>
          ${player.perfectB1gWeeks}
        </td>

        <td>
          ${player.weeksPlayed}
        </td>
      </tr>
    `;
  });

  tableBody.innerHTML = rows.join("");
}

renderLeaderboard(sampleLeaderboard);

console.table(
  sampleWeeklyResults.map(function (result) {
    return {
      player: result.playerName,
      atsPoints: result.atsPoints,
      ouPoints: result.ouPoints,
      winnerPoints: result.winnerPoints,
      scoreDifference: result.scoreDifference,
      scoreResult: result.scoreResult,
      scorePoints: result.scorePoints,
      b1gRecord:
        `${result.b1gCorrect}/${result.b1gEligible}`,
      b1gBonus: result.b1gBonusPoints,
      weeklyPoints: result.weeklyPoints
    };
  })
);

function normalizePickFormData(apiData) {
  return {
    weekId: apiData.week.weekId,
    weekNumber: apiData.week.weekNumber,
    weekName: apiData.week.weekName,
    deadline: apiData.week.deadline,
    deadlineDisplay: apiData.week.deadlineDisplay,
    effectiveStatus: apiData.week.effectiveStatus,
    nebraskaGame: apiData.nebraskaGame,
    b1gGames: apiData.b1gGames
  };
}

function applyPickFormStatus(status) {
  const statusElement =
    document.querySelector("#pick-form-status");

  const formControls =
    picksForm.querySelectorAll(
      '.game-card input, button[type="submit"]'
    );

  const isOpen = status === "OPEN";

  formControls.forEach(function (control) {
    control.disabled = !isOpen;
  });

  const statusMessages = {
    OPEN: "Picks are open.",
    NOT_READY:
      "This week is not open yet. The deadline or Nebraska betting lines are still being prepared.",
    LOCKED:
      "The deadline has passed. Picks are locked for this week.",
    RESULTS_ENTERED:
      "Picks are locked and results have been entered.",
    FINALIZED:
      "This week has been finalized.",
    INACTIVE:
      "This week is currently inactive."
  };

  statusElement.textContent =
    statusMessages[status] || "This week is unavailable.";
}

async function loadPickForm(weekId = null) {
  const statusElement =
    document.querySelector("#pick-form-status");

  statusElement.textContent = "Loading this week's games...";

  const requestUrl = new URL(PICKEM_API_URL);
  if (weekId) {
    requestUrl.searchParams.set(
      "action",
      "getPickForm"
    );

    requestUrl.searchParams.set(
      "weekId",
      weekId
    );
  } else {
    requestUrl.searchParams.set(
      "action",
      "getCurrentPickForm"
    );
  }

  try {
    const response = await fetch(requestUrl.toString());

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const payload = await response.json();

    if (!payload.success) {
      throw new Error(
        payload.error?.message ||
        "The week could not be loaded."
      );
    }

    currentPickWeek =
      normalizePickFormData(payload.data);

    renderPickForm(currentPickWeek);
    applyPickFormStatus(
      currentPickWeek.effectiveStatus
    );

    console.log(
      "Loaded live pick-form data:",
      currentPickWeek
    );
  } catch (error) {
    console.error("Pick form loading failed:", error);

    currentPickWeek = null;
    statusElement.textContent =
      "The weekly games could not be loaded. Please refresh the page and try again.";

    picksForm
      .querySelectorAll("input, select, button")
      .forEach(function (control) {
        control.disabled = true;
      });
  }
}

const registrationToggle =
  document.querySelector(
    "#toggle-registration-button"
  );

const registrationPanel =
  document.querySelector(
    "#registration-panel"
  );

registrationToggle.addEventListener(
  "click",
  function () {
    const isCurrentlyHidden =
      registrationPanel.hidden;

    registrationPanel.hidden =
      !isCurrentlyHidden;

    registrationToggle.setAttribute(
      "aria-expanded",
      String(isCurrentlyHidden)
    );

    registrationToggle.textContent =
      isCurrentlyHidden
        ? "Hide Registration"
        : "Register New Player";
  }
);

const registrationForm =
  document.querySelector("#registration-form");

const registrationMessage =
  document.querySelector("#registration-message");

const registerPlayerButton =
  document.querySelector("#register-player-button");

registrationForm.addEventListener(
  "submit",
  async function (event) {
    event.preventDefault();

    registrationMessage.textContent = "";

    const formData =
      new FormData(registrationForm);

    const pin =
      formData.get("pin");

    const pinConfirmation =
      formData.get("pinConfirmation");

    if (pin !== pinConfirmation) {
      registrationMessage.textContent =
        "The PIN entries do not match.";

      return;
    }

    const request = {
      action: "registerPlayer",
      playerName: formData.get("playerName"),
      pin: pin,
      registrationCode:
        formData.get("registrationCode")
    };

    registerPlayerButton.disabled = true;
    registerPlayerButton.textContent =
      "Creating Player...";

    try {
      const response = await fetch(
        PICKEM_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },
          body: JSON.stringify(request)
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      const payload = await response.json();

      if (!payload.success) {
        throw new Error(
          payload.error?.message ||
          "Registration was unsuccessful."
        );
      }

      const newPlayer = payload.data;

      const playerSelect =
        document.querySelector("#player-select");

      const emptyOption =
        playerSelect.querySelector(
          'option[value=""]'
        );

      if (emptyOption) {
        emptyOption.textContent =
          "Select your name";

        emptyOption.disabled = true;
        emptyOption.selected = false;
      }

      let playerOption =
        Array.from(playerSelect.options)
          .find(function (option) {
            return option.value ===
              newPlayer.playerId;
          });

      if (!playerOption) {
        playerOption = document.createElement(
          "option"
        );

        playerOption.value =
          newPlayer.playerId;

        playerSelect.appendChild(playerOption);
      }

      playerOption.textContent =
        newPlayer.playerName;

      playerSelect.value =
        newPlayer.playerId;
      playerSelect.disabled = false;

      registrationForm.reset();

      registrationMessage.textContent =
        `Registration successful. Your Player ID is ${newPlayer.playerId}.`;

      console.log(
        "Registered player:",
        newPlayer
      );
    } catch (error) {
      console.error(
        "Player registration failed:",
        error
      );

      registrationMessage.textContent =
        error.message;
    } finally {
      registerPlayerButton.disabled = false;
      registerPlayerButton.textContent =
        "Create Player";
    }
  }
);

const loadPicksButton =
  document.querySelector(
    "#load-picks-button"
  );

const loadPicksMessage =
  document.querySelector(
    "#load-picks-message"
  );

function clearDisplayedPicks() {
  picksForm
    .querySelectorAll(
      '.game-card input[type="radio"]'
    )
    .forEach(function (input) {
      input.checked = false;
    });

  picksForm
    .querySelectorAll(
      '.game-card input[type="number"]'
    )
    .forEach(function (input) {
      input.value = "";
    });
}

function setFormControlValue(
  controlName,
  value
) {
  if (
    value === null ||
    value === undefined
  ) {
    return;
  }

  const control =
    picksForm.elements.namedItem(
      controlName
    );

  if (control) {
    control.value = String(value);
  }
}

loadPicksButton.addEventListener(
  "click",
  async function () {
    if (!currentPickWeek) {
      loadPicksMessage.textContent =
        "The weekly games have not finished loading.";

      return;
    }

    const playerId =
      document.querySelector(
        "#player-select"
      ).value;

    const pin =
      document.querySelector(
        "#player-pin"
      ).value;

    if (!playerId) {
      loadPicksMessage.textContent =
        "Select your player name first.";

      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      loadPicksMessage.textContent =
        "Enter your four-digit PIN.";

      return;
    }

    const request = {
      action: "getPlayerPicks",
      playerId: playerId,
      pin: pin,
      weekId: currentPickWeek.weekId
    };

    loadPicksButton.disabled = true;
    loadPicksButton.textContent =
      "Loading Picks...";

    loadPicksMessage.textContent = "";

    try {
      const response = await fetch(
        PICKEM_API_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },
          body: JSON.stringify(request)
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      const payload =
        await response.json();

      if (!payload.success) {
        throw new Error(
          payload.error?.message ||
          "Saved picks could not be loaded."
        );
      }

      const savedPicks =
        payload.data.picks;

      clearDisplayedPicks();

      savedPicks.forEach(function (pick) {
        setFormControlValue(
          `winner-${pick.gameId}`,
          pick.winnerPick
        );

        setFormControlValue(
          `ats-${pick.gameId}`,
          pick.atsPick
        );

        setFormControlValue(
          `ou-${pick.gameId}`,
          pick.ouPick
        );

        setFormControlValue(
          `predicted-away-${pick.gameId}`,
          pick.predictedAwayScore
        );

        setFormControlValue(
          `predicted-home-${pick.gameId}`,
          pick.predictedHomeScore
        );
      });

      if (savedPicks.length === 0) {
        loadPicksMessage.textContent =
          "You do not have saved picks for this week.";
      } else {
        loadPicksMessage.textContent =
          "All saved picks loaded.";
      }
    } catch (error) {
      console.error(
        "Saved-pick loading failed:",
        error
      );

      loadPicksMessage.textContent =
        error.message;
    } finally {
      loadPicksButton.disabled = false;
      loadPicksButton.textContent =
        "Load My Saved Picks";
    }
  }
);

async function loadPlayers() {
  const playerSelect =
    document.querySelector("#player-select");

  playerSelect.disabled = true;
  playerSelect.innerHTML =
    '<option value="">Loading players...</option>';

  const requestUrl =
    new URL(PICKEM_API_URL);

  requestUrl.searchParams.set(
    "action",
    "getPlayers"
  );

  try {
    const response = await fetch(
      requestUrl.toString()
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error ${response.status}`
      );
    }

    const payload = await response.json();

    if (!payload.success) {
      throw new Error(
        payload.error?.message ||
        "Players could not be loaded."
      );
    }

    const players = payload.data;

    playerSelect.innerHTML =
      '<option value="">Select your name</option>';

    players.forEach(function (player) {
      const option =
        document.createElement("option");

      option.value = player.playerId;
      option.textContent = player.playerName;

      playerSelect.appendChild(option);
    });

    if (players.length === 0) {
      playerSelect.innerHTML =
        '<option value="">No players registered yet</option>';

      playerSelect.disabled = true;
    } else {
      playerSelect.disabled = false;
    }

    console.log(
      "Loaded active players:",
      players
    );
  } catch (error) {
    console.error(
      "Player loading failed:",
      error
    );

    playerSelect.innerHTML =
      '<option value="">Players could not be loaded</option>';

    playerSelect.disabled = true;
  }
}

loadPlayers();
loadPickForm();