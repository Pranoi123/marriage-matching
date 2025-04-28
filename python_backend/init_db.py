import mysql.connector
from mysql.connector import Error

def init_database():
    connection = None
    cursor = None
    try:
        # Connect to MySQL server
        connection = mysql.connector.connect(
            host='localhost',
            user='your_username',
            password='PranavKrishna'
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Read and execute the schema.sql file
            with open('schema.sql', 'r') as file:
                sql_commands = file.read().split(';')
                
                for command in sql_commands:
                    if command.strip():
                        cursor.execute(command)
            
            connection.commit()
            print("Database initialized successfully!")
            
    except Error as e:
        print(f"Error initializing database: {e}")
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None and connection.is_connected():
            connection.close()

if __name__ == '__main__':
    init_database() 