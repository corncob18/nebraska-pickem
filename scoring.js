function hasFinalScore(game) {
    return (
        Number.isFinite(game.awayScore) &&
        Number.isFinite(game.homeScore)
    );
}

function getActualWinner(game) {
    if (!hasFinalScore(game)) {
        throw new Error(
            'Final score is missing for game ${game.gameId}.'
        );
    }

    if (game.awayScore > game.homeScore) {
        return game.awayTeam;
    }

    if (game.homeScore > game.awayScore) {
        return game.homeTeam;
    }

    throw new Error(
        'Game ${game.gameId} ended in an unsupported tie.'
    );
}

function getNebraskaScoreInfo(game) {
    if (!hasFinalScore(game)) {
        throw new Error(
            'Final score is missing for game ${game.gameId}.'
        );
    }

    if (game.awayTeam === "Nebraska") {
        return {
            nebraskaScore: game.awayScore,
            opponentScore: game.homeScore,
            opponentTeam: game.homeTeam
        };
    }

    if (game.homeTeam === "Nebraska") {
        return {
            nebraskaScore: game.homeScore,
            opponentScore: game.awayScore,
            opponentTeam: game.awayTeam
        };
    }

    throw new Error(
        'Game ${game.gameId} does not include Nebraska.'
    );
}

function getAtsResult(game) {
    const scoreInfo = getNebraskaScoreInfo(game);

    const adjustedNebraskaScore = 
    scoreInfo.nebraskaScore + game.nebraskaSpread;

    if (adjustedNebraskaScore > scoreInfo.opponentScore) {
        return "NEBRASKA";
    }

    if (adjustedNebraskaScore < scoreInfo.opponentScore) {
        return "OPPONENT";
    }

    throw new Error(
        'Game ${game.gameId} produced an ATS Push.'
    );
}

function getOverUnderResult(game) {
    if (!hasFinalScore(game)) {
        throw new Error (
            'Final Score is missing for game ${game.gameId}.'
        );
    }

    const actualTotal = game.awayScore + game.homeScore;

    if (actualTotal > game.overUnder) {
        return "OVER";
    }

    if (actualTotal < game.overUnder) {
        return "UNDER";
    }

    throw new Error(
        'Game ${game.gameId} produced an O/U push.'
    );
}

function calculateScoreDifference(game, pick) {
    return (
        Math.abs(
            pick.predictedAwayScore - game.awayScore
        )+
        Math.abs(
            pick.predictedHomeScore - game.homeScore
        )
    );
}

function scoreNebraskaPick(game, pick) {
    const actualWinner = getActualWinner(game);
    const atsResult = getAtsResult(game);
    const overUnderResult = getOverUnderResult(game);

    const winnerCorrect =
        pick.winnerPick === actualWinner;

    const atsCorrect =
        pick.atsPick === atsResult;

    const ouCorrect =
        pick.ouPick === overUnderResult;

    const scoreDifference =
        calculateScoreDifference(game, pick);

    return {
        actualWinner,
        winnerCorrect,
        winnerPoints: winnerCorrect ? 1 : 0,

        atsResult,
        atsCorrect,
        atsPoints: atsCorrect ? 3 : 0,

        overUnderResult,
        ouCorrect,
        ouPoints: ouCorrect ? 2 : 0,

        scoreDifference,
    };
}

function createPickMap(picks) {
  return new Map(
    picks.map(function(pick) {
      return [pick.gameId, pick];
    })
  );
}

function scoreB1gPicks(games, pickMap) {
  let correctCount = 0;
  let attemptedCount = 0;

  const details = games.map(function(game) {
    const pick = pickMap.get(game.gameId);
    const actualWinner = getActualWinner(game);

    const winnerPick = pick
      ? pick.winnerPick
      : null;

    const correct = winnerPick === actualWinner;

    if (pick) {
      attemptedCount++;
    }

    if (correct) {
      correctCount++;
    }

    return {
      gameId: game.gameId,
      awayTeam: game.awayTeam,
      homeTeam: game.homeTeam,
      winnerPick,
      actualWinner,
      correct
    };
  });

  const eligibleCount = games.length;

  const perfect =
    eligibleCount > 0 &&
    attemptedCount === eligibleCount &&
    correctCount === eligibleCount;

  return {
    correctCount,
    attemptedCount,
    eligibleCount,
    perfect,
    bonusPoints: perfect ? 5 : 0,
    details
  };
}

function createEmptyNebraskaResult() {
  return {
    actualWinner: null,
    winnerCorrect: null,
    winnerPoints: 0,

    atsResult: null,
    atsCorrect: null,
    atsPoints: 0,

    overUnderResult: null,
    ouCorrect: null,
    ouPoints: 0,

    scoreDifference: null
  };
}

function calculateWeeklyResults(
  completedWeek,
  playerSubmissions
) {
  if (playerSubmissions.length === 0) {
    return [];
  }

  const preliminaryResults = playerSubmissions.map(
    function(submission) {
      const pickMap = createPickMap(submission.picks);

      let nebraskaPick = null;
      let nebraskaResult =
        createEmptyNebraskaResult();

      if (completedWeek.nebraskaGame) {
        nebraskaPick = pickMap.get(
          completedWeek.nebraskaGame.gameId
        );

        if (!nebraskaPick) {
          throw new Error(
            `${submission.playerName} is missing a Nebraska pick.`
          );
        }

        nebraskaResult = scoreNebraskaPick(
          completedWeek.nebraskaGame,
          nebraskaPick
        );
      }

      const b1gResult = scoreB1gPicks(
        completedWeek.b1gGames,
        pickMap
      );

      return {
        playerId: submission.playerId,
        playerName: submission.playerName,
        nebraskaPick,
        nebraskaResult,
        b1gResult
      };
    }
  );

  const scoreDifferences = preliminaryResults
    .map(function(result) {
      return result.nebraskaResult.scoreDifference;
    })
    .filter(function(difference) {
      return Number.isFinite(difference);
    });

  const minimumDifference =
    scoreDifferences.length > 0
      ? Math.min(...scoreDifferences)
      : null;

  const exactScoreExists =
    minimumDifference === 0;

  return preliminaryResults.map(function(result) {
    const nebraskaResult = result.nebraskaResult;
    const difference = nebraskaResult.scoreDifference;

    let scoreResult = null;
    let scorePoints = 0;

    if (difference === 0) {
      scoreResult = "EXACT";
      scorePoints = 5;
    } else if (
      Number.isFinite(difference) &&
      !exactScoreExists &&
      difference === minimumDifference
    ) {
      scoreResult = "CLOSEST";
      scorePoints = 1;
    }

    const weeklyPoints =
      nebraskaResult.winnerPoints +
      nebraskaResult.atsPoints +
      nebraskaResult.ouPoints +
      scorePoints +
      result.b1gResult.bonusPoints;

    return {
      playerId: result.playerId,
      playerName: result.playerName,
      winnerPick:
        result.nebraskaPick?.winnerPick ?? null,

    atsPick:
        result.nebraskaPick?.atsPick ?? null,

    ouPick:
        result.nebraskaPick?.ouPick ?? null,

    predictedAwayScore:
        result.nebraskaPick?.predictedAwayScore ?? null,

    predictedHomeScore:
        result.nebraskaPick?.predictedHomeScore ?? null,

      ...nebraskaResult,

      scoreResult,
      scorePoints,

      b1gCorrect: result.b1gResult.correctCount,
      b1gAttempted: result.b1gResult.attemptedCount,
      b1gEligible: result.b1gResult.eligibleCount,
      b1gPerfect: result.b1gResult.perfect,
      b1gBonusPoints:
        result.b1gResult.bonusPoints,
      b1gDetails: result.b1gResult.details,

      weeklyPoints
    };
  });
}