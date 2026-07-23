from app.agents.planner import Planner

planner = Planner()

queries = [
    "What is 45 * 98?",
    "What time is it?",
    "Latest AI news",
    "Who won Wimbledon 2026?",
    "Explain Docker",
]

for query in queries:
    print("=" * 60)
    print(query)
    print(planner.plan(query))