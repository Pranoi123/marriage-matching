from flask import Blueprint, request, jsonify
from mysql.connector import Error
from utils import get_db_connection, require_auth

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/matches', methods=['GET'])
@require_auth
def get_matches():
    try:
        token = request.headers.get('Authorization')
        user_id = request.args.get('user_id')
        
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        
        # Get matches for the user
        cursor.execute("""
            SELECT m.*, 
                   u1.name as user1_name, u1.email as user1_email,
                   u2.name as user2_name, u2.email as user2_email
            FROM Matches m
            JOIN Users u1 ON m.user1_id = u1.user_id
            JOIN Users u2 ON m.user2_id = u2.user_id
            WHERE m.user1_id = %s OR m.user2_id = %s
        """, (user_id, user_id))
        
        matches = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(matches), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

@matches_bp.route('/matches', methods=['POST'])
@require_auth
def create_match():
    try:
        data = request.get_json()
        user1_id = data.get('user1_id')
        user2_id = data.get('user2_id')
        
        if not all([user1_id, user2_id]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        
        # Check if match already exists
        cursor.execute("""
            SELECT * FROM Matches 
            WHERE (user1_id = %s AND user2_id = %s) 
            OR (user1_id = %s AND user2_id = %s)
        """, (user1_id, user2_id, user2_id, user1_id))
        
        if cursor.fetchone():
            cursor.close()
            connection.close()
            return jsonify({'error': 'Match already exists'}), 400

        # Create new match
        cursor.execute("""
            INSERT INTO Matches (user1_id, user2_id, status)
            VALUES (%s, %s, 'pending')
        """, (user1_id, user2_id))
        
        connection.commit()
        match_id = cursor.lastrowid
        cursor.close()
        connection.close()

        return jsonify({'match_id': match_id, 'message': 'Match created successfully'}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

@matches_bp.route('/matches/<int:match_id>', methods=['PUT'])
@require_auth
def update_match(match_id):
    try:
        data = request.get_json()
        status = data.get('status')
        
        if not status or status not in ['accepted', 'rejected']:
            return jsonify({'error': 'Invalid status'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("""
            UPDATE Matches 
            SET status = %s, updated_at = NOW()
            WHERE match_id = %s
        """, (status, match_id))
        
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Match updated successfully'}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500 