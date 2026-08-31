# nebraska-pickem
NU and B1G CFB Pick'em Website

## Weekly Admin Workflow

Routine weekly administration is performed in Google Sheets. No website code changes or Apps Script deployment should be required.

### Before picks open

1. Confirm the week is Active in the Weeks sheet.
2. Enter the weekly deadline.
   - Use the earliest kickoff among every included contest game.
3. Confirm the correct games are Active in the Games sheet.
4. Enter Nebraska's spread and over/under.
5. Run:
   - Pick'Em Admin → Validate Week Setup
6. Refresh the website and confirm the week displays as OPEN.

The website automatically remains NOT_READY until the required setup is complete.

### During the submission period

- Players may submit or revise picks until the weekly deadline.
- Resubmissions replace the player's existing picks.
- Picks lock automatically at the deadline.
- The server independently rejects late submissions.

### After the deadline

- Submitted picks remain stored in the Picks sheet.
- Players may load their own saved picks using their PIN.
- Other players' picks are not publicly available before lock.

### After games are complete

1. Enter the Away Score and Home Score for every active game.
2. Review the Results tab.
3. Run:
   - Pick'Em Admin → Validate & Finalize Week
4. Confirm the game and participant counts.
5. Finalize the week.

Finalization:

- Publishes the week to the season Leaderboard.
- Keeps the week available in Weekly Results.
- Automatically advances the Picks page to the next active unfinished week.

### Player administration

Use the Pick'Em Admin menu to:

- Reset Player PIN
- Activate or deactivate a player
- Assign missing Game IDs

PIN resets replace the protected hash. The old PIN cannot be recovered, and plain PINs must never be stored in the Sheet or source code.

Deactivating a player removes them from the Picks dropdown but preserves historical Results and Leaderboard records.

### Important reminders

- Nebraska spreads and totals should use half-point lines to prevent pushes.
- Nebraska games are never included in the B1G pick pool.
- Nebraska's bye week operates as a B1G-only week.
- Week 3 intentionally contains no B1G bonus games.
- The contest ends with the regular season; the B1G Championship is excluded.
- Do not place registration codes, PINs, PIN hashes, or API secrets in GitHub.