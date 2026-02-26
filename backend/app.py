from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "secretkey"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# ---------- DB CONNECTION ----------
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="expense_tracker"
    )

# ---------- REGISTER ----------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    db = get_db()
    cursor = db.cursor()

    hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    cursor.execute(
        "INSERT INTO users (name,email,password_hash) VALUES (%s,%s,%s)",
        (data["name"], data["email"], hashed)
    )
    db.commit()

    return jsonify({"msg": "user created"})


# ---------- LOGIN ----------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (data["email"],))
    user = cursor.fetchone()

    if not user:
        return jsonify({"msg": "no user"}), 401

    if bcrypt.check_password_hash(user["password_hash"], data["password"]):
        token = create_access_token(identity=str(user["id"]))
        return jsonify({"token": token})

    return jsonify({"msg": "wrong password"}), 401


# ---------- CATEGORIES ----------
@app.route("/categories", methods=["GET"])
@jwt_required()
def categories():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM categories WHERE type='expense'")
    return jsonify(cursor.fetchall())


# ---------- ADD EXPENSE ----------
@app.route("/add-expense", methods=["POST"])
@jwt_required()
def add_expense():
    data = request.get_json()
    user_id = int(get_jwt_identity())

    db = get_db()
    cursor = db.cursor()

    cursor.execute("""
        INSERT INTO transactions (user_id, category_id, amount, note, transaction_date)
        VALUES (%s,%s,%s,%s,%s)
    """, (
        user_id,
        data["category_id"],
        data["amount"],
        data["note"],
        data["date"]
    ))

    db.commit()
    return jsonify({"msg": "added"})


# ---------- GET EXPENSES ----------
@app.route("/get-expenses", methods=["GET"])
@jwt_required()
def get_expenses():
    user_id = int(get_jwt_identity())

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("""
        SELECT t.id, t.amount, t.note, t.transaction_date, c.name as category
        FROM transactions t
        JOIN categories c ON t.category_id = c.id
        WHERE t.user_id=%s
        ORDER BY t.transaction_date DESC
    """, (user_id,))

    return jsonify(cursor.fetchall())


# ---------- DELETE ----------
@app.route("/delete-expense/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_expense(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute("DELETE FROM transactions WHERE id=%s", (id,))
    db.commit()
    return jsonify({"msg": "deleted"})


if __name__ == "__main__":
    app.run(debug=True)