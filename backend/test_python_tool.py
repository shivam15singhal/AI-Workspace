from app.tools.python_interpreter import (
    PythonInterpreterTool,
)

tool = PythonInterpreterTool()

print("=" * 50)
print("Test 1")
print(
    tool.execute(
        """
print("Hello World")
"""
    )
)

print("=" * 50)
print("Test 2")
print(
    tool.execute(
        """
for i in range(5):
    print(i)
"""
    )
)

print("=" * 50)
print("Test 3")
print(
    tool.execute(
        """
x = 25
y = 75
print(x + y)
"""
    )
)

print("=" * 50)
print("Test 4")
print(
    tool.execute(
        """
print(10 / 0)
"""
    )
)