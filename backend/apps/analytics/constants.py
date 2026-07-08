# Productivity Score Base Weights (Total 100)
# These represent the maximum points a user can earn in each category per period (e.g. daily/weekly)

PRODUCTIVITY_WEIGHTS = {
    'tasks': 30,      # Completion of tasks (high volume, daily basis)
    'goals': 25,      # Progress on goals/milestones (medium volume, high impact)
    'habits': 25,     # Consistency in habits (daily consistency)
    'journal': 10,    # Reflection and writing (daily/weekly habit)
    'journey': 10,    # Creating memories and logging activities (long term reflection)
}

BURNOUT_THRESHOLDS = {
    'low': 30,        # Under 30% stress/load
    'medium': 60,     # 30-60% stress/load
    'high': 100,      # Over 60% stress/load
}
