from flask import Blueprint, request, jsonify
from mysql.connector import Error
from utils import get_db_connection, require_auth

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/messages', methods=['GET'])
@require_auth
def get_messages():
    try:
        token = request.headers.get('Authorization')
        match_id = request.args.get('match_id')
        
        if not match_id:
            return jsonify({'error': 'Match ID is required'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor(dictionary=True)
        
        # Get messages for the match
        cursor.execute("""
            SELECT m.*, u.name as sender_name
            FROM Messages m
            JOIN Users u ON m.sender_id = u.user_id
            WHERE m.match_id = %s
            ORDER BY m.created_at ASC
        """, (match_id,))
        
        messages = cursor.fetchall()
        cursor.close()
        connection.close()

        return jsonify(messages), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/messages', methods=['POST'])
@require_auth
def send_message():
    try:
        data = request.get_json()
        match_id = data.get('match_id')
        sender_id = data.get('sender_id')
        receiver_id = data.get('receiver_id')
        message_text = data.get('message_text')
        
        if not all([match_id, sender_id, receiver_id, message_text]):
            return jsonify({'error': 'Missing required fields'}), 400

        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        
        # Insert new message
        cursor.execute("""
            INSERT INTO Messages (match_id, sender_id, receiver_id, message_text)
            VALUES (%s, %s, %s, %s)
        """, (match_id, sender_id, receiver_id, message_text))
        
        connection.commit()
        message_id = cursor.lastrowid
        cursor.close()
        connection.close()

        return jsonify({'message_id': message_id, 'message': 'Message sent successfully'}), 201

    except Error as e:
        return jsonify({'error': str(e)}), 500

@messages_bp.route('/messages/<int:message_id>', methods=['PUT'])
@require_auth
def mark_message_as_read(message_id):
    try:
        connection = get_db_connection()
        if not connection:
            return jsonify({'error': 'Database connection failed'}), 500

        cursor = connection.cursor()
        cursor.execute("""
            UPDATE Messages 
            SET is_read = 1
            WHERE message_id = %s
        """, (message_id,))
        
        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'message': 'Message marked as read'}), 200

    except Error as e:
        return jsonify({'error': str(e)}), 500 