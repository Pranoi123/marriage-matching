from flask import Flask, request, jsonify
from flask_cors import CORS
from mysql.connector import Error
from utils import get_db_connection, create_token, verify_token, require_auth
import bcrypt

app = Flask(__name__)
# Configure CORS to allow requests from the frontend
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173"],  # Vite's default port
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Import and register blueprints
from matches import matches_bp
from messages import messages_bp

# Register blueprints with URL prefixes
app.register_blueprint(matches_bp, url_prefix='/api')
app.register_blueprint(messages_bp, url_prefix='/api')

# Root route to verify server is running
@app.route('/')
def index():
    return jsonify({'message': 'Marriage Matching API is running'}), 200

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        gender = data.get('gender')
        age = data.get('age')

        if not all([name, email, password, gender, age]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute(
            "INSERT INTO Users (name, email, password, gender, age) VALUES (%s, %s, %s, %s, %s)",
            (name, email, hashed_password, gender, age)
        )
        connection.commit()
        user_id = cursor.lastrowid
        cursor.close()
        connection.close()

        token = create_token(user_id)
        return jsonify({'token': token, 'user_id': user_id}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/auth/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()
        cursor.close()
        connection.close()

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            return jsonify({'error': 'Invalid password'}), 401

        token = create_token(user['user_id'])
        return jsonify({'token': token, 'user_id': user['user_id']}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['GET'])
@require_auth
def get_profile():
    try:
        token = request.headers.get('Authorization')
        payload = verify_token(token)
        user_id = payload['user_id']

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        cursor.execute("""
            SELECT u.*, up.* 
            FROM Users u 
            LEFT JOIN UserProfiles up ON u.user_id = up.user_id 
            WHERE u.user_id = %s
        """, (user_id,))
        profile = cursor.fetchone()
        cursor.close()
        connection.close()

        if not profile:
            return jsonify({'error': 'Profile not found'}), 404

        return jsonify(profile), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/profile', methods=['PUT'])
@require_auth
def update_profile():
    try:
        token = request.headers.get('Authorization')
        payload = verify_token(token)
        user_id = payload['user_id']
        data = request.get_json()

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        
        # Update basic user info
        if 'name' in data or 'email' in data:
            cursor.execute("""
                UPDATE Users 
                SET name = COALESCE(%s, name), 
                    email = COALESCE(%s, email),
                    updated_at = NOW()
                WHERE user_id = %s
            """, (data.get('name'), data.get('email'), user_id))

        # Update or insert profile
        cursor.execute("""
            INSERT INTO UserProfiles 
            (user_id, location, education, occupation, bio, profile_picture, interests)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
            location = COALESCE(%s, location),
            education = COALESCE(%s, education),
            occupation = COALESCE(%s, occupation),
            bio = COALESCE(%s, bio),
            profile_picture = COALESCE(%s, profile_picture),
            interests = COALESCE(%s, interests),
            updated_at = NOW()
        """, (
            user_id,
            data.get('location'), data.get('education'), data.get('occupation'),
            data.get('bio'), data.get('profile_picture'), data.get('interests'),
            data.get('location'), data.get('education'), data.get('occupation'),
            data.get('bio'), data.get('profile_picture'), data.get('interests')
        ))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Profile updated successfully'}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 