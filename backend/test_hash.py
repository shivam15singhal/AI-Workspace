from app.auth.hashing import hash_password, verify_password

password = "shivam123"

hashed = hash_password(password)

print("Original:", password)
print("Hashed:", hashed)

print(verify_password("shivam123", hashed))
print(verify_password("wrongpassword", hashed))