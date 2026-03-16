// =============================================================================
// ROUTINE DATA MODEL — CONVENTIONS & FIELD SEMANTICS
// =============================================================================
//
// BLOCK TYPES
// ─────────────────────────────────────────────────────────────────────────────
// 'standard'  Regular set/rep work. series + repetitions live on the set.
//             set.rest controls rest between sets.
//             Example: 5x5 Back Squat, 3 min rest.
//
// 'superset'  Two or more exercises performed back-to-back with no rest between
//             them. rounds_per_workout drives total rounds. rest_after_round
//             controls rest between rounds. set.rest should be null.
//             Example: Bench Press + Bent Over Row, 4 rounds, 90s rest.
//
// 'circuit'   Multiple exercises performed in sequence. rounds_per_workout
//             drives total rounds. rest_after_round is optional.
//             Similar to superset but typically more exercises and lower intensity.
//             Example: 3 rounds of 5 exercises, 60s rest after each round.
//
// 'amrap'     As Many Rounds As Possible. time_to_complete defines the window.
//             rounds_per_workout is always null — that's the point.
//             Example: 15 min AMRAP: 5 Pull-ups, 10 Push-ups, 15 Air Squats.
//
// 'emom'      Every Minute On the Minute (or any fixed interval).
//             workout_duration defines the station clock (seconds per round).
//             rounds_per_workout defines how many rounds to perform.
//             Example: Clean + 2 Split Jerks every 90s for 4 rounds.
//
// 'hiit'      High Intensity Interval Training. Work/rest intervals.
//             rounds_per_workout defines total rounds.
//             time_per_series (on the set) defines the work window per round.
//             set.rest defines the rest window per round.
//             Example: Tabata — 8 rounds of 20s on / 10s off.
//
//
// CONVENTION: set.series for timed/round-based blocks
// ─────────────────────────────────────────────────────────────────────────────
// For 'emom', 'amrap', 'hiit', and 'superset', set.series should always be 1.
// Repetition at the block level is owned by rounds_per_workout (emom, hiit,
// superset) or time_to_complete (amrap). Setting series > 1 on these types
// is considered invalid and should be rejected by backend validation.
//
// For 'standard', set.series is the source of truth for how many sets to perform.
//
//
// CONVENTION: workout_duration vs time_per_series
// ─────────────────────────────────────────────────────────────────────────────
// workout_block.workout_duration  — block-level clock. Used by 'emom' to define
//                                   how long each round/station lasts. Applies
//                                   equally to all sets within the block.
//
// set.time_per_series             — set-level clock. Used by 'hiit' to define
//                                   the work window for a specific exercise.
//                                   Can vary per exercise within the same block.
//
// Rule: if both are present, time_per_series takes precedence for that set.
// In practice, emom blocks should only use workout_duration (leave
// time_per_series null), and hiit blocks should only use time_per_series
// (leave workout_duration null). Mixing both in the same block is not supported.
//
//
// FIELD REFERENCE BY TYPE
// ─────────────────────────────────────────────────────────────────────────────
//
//                        standard  superset  circuit  amrap  emom  hiit
// set.series                 ✓         1        1       1      1     1
// set.repetitions            ✓         ✓        ✓       ✓      ✓     —
// set.rest                   ✓         —        —       —      —     ✓
// set.time_per_series        —         —        —       —      —     ✓
// set.percentage / rpe       ✓         ✓        ✓       ✓      ✓     —
// set.target_weight_*        ✓         ✓        ✓       ✓      ✓     —
// block.rounds_per_workout   —         ✓        ✓       —      ✓     ✓
// block.rest_after_round     —         ✓        ✓       —      —     —
// block.rest_after_workout   ✓         ✓        ✓       ✓      ✓     ✓
// block.time_to_complete     —         —        —       ✓      —     —
// block.workout_duration     —         —        —       —      ✓     —
//
// ✓ = expected   1 = always 1   — = should be null
// =============================================================================

export type Routine = {
  id: number
  name: string // Simple routine example: "Monday Push Day"
  created_by?: number // User ID of the creator
  routine_workout_blocks: Array<{
    position: number
    routine_id: number
    workout_block_id: number
  }>
  workout_blocks: Array<{
    id: number
    type: 'standard' | 'superset' | 'circuit' | 'amrap' | 'emom' | 'hiit'
    name?: string // block name: "Warmup"
    description?: string
    position: number
    workout_duration?: number
    rounds_per_workout?: number
    rest_after_round?: number
    rest_after_workout?: number
    time_to_complete?: number
    workout_block_sets: Array<{
      id: number
      position: number
      set_id: number
      workout_block_id: number
      set: {
        id: number
        exercise_id?: number
        description?: string
        series: number
        repetitions?: number
        time_per_series?: number
        percentage?: number
        target_rpe?: number
        target_weight_unisex_max?: number
        target_weight_unisex_min?: number
        target_weight_man_max?: number
        target_weight_man_min?: number
        target_weight_woman_max?: number
        target_weight_woman_min?: number
        target_weight_unit?: 'kg' | 'lbs' | 'cal'
        rest?: number
        exercise?: {
          id: number
          name: string
          description?: string
          video_url?: string
          created_at: string
          updated_at: string
        }
      }
    }>
  }>
}

const exampleRoutine: Routine = {
  id: 1,
  name: 'Full Example Routine',
  created_by: 42,
  routine_workout_blocks: [
    { position: 1, routine_id: 1, workout_block_id: 1 },
    { position: 2, routine_id: 1, workout_block_id: 2 },
    { position: 3, routine_id: 1, workout_block_id: 3 },
    { position: 4, routine_id: 1, workout_block_id: 4 },
    { position: 5, routine_id: 1, workout_block_id: 5 },
  ],
  workout_blocks: [
    // ─────────────────────────────────────────────
    // STANDARD
    // "5x5 Back Squat @ 80%, 3 min rest between sets"
    // series/repetitions live on the set.
    // rest between sets via set.rest
    // ─────────────────────────────────────────────
    {
      id: 1,
      type: 'standard',
      name: 'Strength Block',
      description: '5x5 Back Squat',
      position: 1,
      workout_block_sets: [
        {
          id: 1,
          position: 1,
          set_id: 1,
          workout_block_id: 1,
          set: {
            id: 1,
            exercise_id: 101,
            series: 5,
            repetitions: 5,
            percentage: 80,
            target_weight_unit: 'kg',
            rest: 180, // 3 min rest between sets
            exercise: {
              id: 101,
              name: 'Back Squat',
              video_url: 'https://example.com/back-squat',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      ],
    },

    // ─────────────────────────────────────────────
    // SUPERSET
    // "Bench Press + Bent Over Row, 4 rounds, 90s rest after each round"
    // rounds_per_workout drives the rep count.
    // rest_after_round is the rest between rounds.
    // set.rest is null — no rest between the two exercises within a round.
    // ─────────────────────────────────────────────
    {
      id: 2,
      type: 'superset',
      name: 'Push/Pull Superset',
      position: 2,
      rounds_per_workout: 4,
      rest_after_round: 90,
      workout_block_sets: [
        {
          id: 2,
          position: 1, // do this first
          set_id: 2,
          workout_block_id: 2,
          set: {
            id: 2,
            exercise_id: 102,
            series: 1, // 1 pass per round — rounds_per_workout handles total
            repetitions: 10,
            target_weight_unit: 'kg',
            target_weight_man_max: 80,
            target_weight_woman_max: 50,
            exercise: {
              id: 102,
              name: 'Bench Press',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 3,
          position: 2, // do this immediately after
          set_id: 3,
          workout_block_id: 2,
          set: {
            id: 3,
            exercise_id: 103,
            series: 1,
            repetitions: 10,
            target_weight_unit: 'kg',
            target_weight_man_max: 70,
            target_weight_woman_max: 45,
            exercise: {
              id: 103,
              name: 'Bent Over Row',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      ],
    },

    // ─────────────────────────────────────────────
    // AMRAP
    // "15 min AMRAP: 5 Pull-ups, 10 Push-ups, 15 Air Squats"
    // time_to_complete is the window.
    // rounds_per_workout is null — that's the point of AMRAP.
    // series on each set is 1 — you go through the list once per round.
    // ─────────────────────────────────────────────
    {
      id: 3,
      type: 'amrap',
      name: '15 Min AMRAP',
      position: 3,
      time_to_complete: 900, // 15 min in seconds
      workout_block_sets: [
        {
          id: 4,
          position: 1,
          set_id: 4,
          workout_block_id: 3,
          set: {
            id: 4,
            exercise_id: 104,
            series: 1,
            repetitions: 5,
            exercise: {
              id: 104,
              name: 'Pull-ups',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 5,
          position: 2,
          set_id: 5,
          workout_block_id: 3,
          set: {
            id: 5,
            exercise_id: 105,
            series: 1,
            repetitions: 10,
            exercise: {
              id: 105,
              name: 'Push-ups',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 6,
          position: 3,
          set_id: 6,
          workout_block_id: 3,
          set: {
            id: 6,
            exercise_id: 106,
            series: 1,
            repetitions: 15,
            exercise: {
              id: 106,
              name: 'Air Squat',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      ],
    },

    // ─────────────────────────────────────────────
    // EMOM
    // "Clean + 2 Split Jerks, every 90 seconds for 4 rounds"
    // workout_duration = 90 (seconds per station)
    // rounds_per_workout = 4
    // series = 1 on each set — you do the movement once per round
    // repetitions drives the rep count per movement
    // ─────────────────────────────────────────────
    {
      id: 4,
      type: 'emom',
      name: 'Clean & Jerk Complex',
      position: 4,
      workout_duration: 90, // 1'30'' per round
      rounds_per_workout: 4,
      workout_block_sets: [
        {
          id: 7,
          position: 1,
          set_id: 7,
          workout_block_id: 4,
          set: {
            id: 7,
            exercise_id: 107,
            series: 1,
            repetitions: 1,
            percentage: 75,
            target_weight_unit: 'kg',
            exercise: {
              id: 107,
              name: 'Clean',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
        {
          id: 8,
          position: 2,
          set_id: 8,
          workout_block_id: 4,
          set: {
            id: 8,
            exercise_id: 108,
            series: 1,
            repetitions: 2,
            percentage: 75,
            target_weight_unit: 'kg',
            exercise: {
              id: 108,
              name: 'Split Jerk',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      ],
    },

    // ─────────────────────────────────────────────
    // HIIT
    // "Assault Bike: 8 rounds of 20s on / 10s off"  (Tabata)
    // rounds_per_workout = 8
    // time_per_series = 20 (work window per round)
    // set.rest = 10 (rest window per round)
    // no repetitions — it's effort-based within the time window
    // ─────────────────────────────────────────────
    {
      id: 5,
      type: 'hiit',
      name: 'Tabata Bike',
      position: 5,
      rounds_per_workout: 8,
      rest_after_workout: 60, // 1 min rest before next block
      workout_block_sets: [
        {
          id: 9,
          position: 1,
          set_id: 9,
          workout_block_id: 5,
          set: {
            id: 9,
            exercise_id: 109,
            series: 1,
            time_per_series: 20, // 20s work
            rest: 10, // 10s rest
            exercise: {
              id: 109,
              name: 'Assault Bike',
              created_at: '2024-01-01T00:00:00Z',
              updated_at: '2024-01-01T00:00:00Z',
            },
          },
        },
      ],
    },
  ],
}
