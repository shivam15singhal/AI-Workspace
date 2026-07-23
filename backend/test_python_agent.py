from app.agents.python_agent import PythonAgent

agent = PythonAgent()

print("=" * 60)
print(
    agent.generate_code(
        "Write Python code to print Hello World"
    )
)

print("=" * 60)
print(
    agent.generate_code(
        "Calculate 25 * 48"
    )
)