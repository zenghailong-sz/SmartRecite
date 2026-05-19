// Spaced Repetition Intervals in Minutes
// Standard Ebbinghaus Forgetting Curve Settings
// 
// Lv 1: 10m (Short term)
// Lv 2: 6h  (Same day review)
// Lv 3: 15h (Next day review)
// Lv 4: 2d  (Longer gap)
// Lv 5: 5d  (Mastery/Graduation)

export const INTERVALS_MINUTES = [
    0,       // Lv 0 (New/Wrong)
    10,      // Lv 1 (10 minutes)
    360,     // Lv 2 (6 hours)
    900,     // Lv 3 (15 hours)
    2880,    // Lv 4 (2 days)
    7200     // Lv 5 (5 days)
];