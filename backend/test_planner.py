from app.agents.planner import Planner

planner = Planner()

queries = [
    "Send an email to shivambackup252@gmail.com saying Hello from AI Workspace",
    "Email hr@example.com thanking them for the interview",
    "Send mail to abc@gmail.com",
]

for query in queries:
    print("=" * 60)
    print(query)
    print(
        planner.plan(query)
    )