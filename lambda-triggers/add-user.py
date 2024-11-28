import psycopg2
from psycopg2 import sql

# Environment variables for RDS connection
RDS_HOST = 'terraform-20241117210759533700000001.cqfmxw48grex.us-east-1.rds.amazonaws.com'
DB_NAME = 'chat_app_db'
DB_USER = 'master'
DB_PASSWORD = 'securepassword'
DB_PORT = 5432

def lambda_handler(event, context):
    print("Cognito Event : ", event)

    username = event['userName']

    try:
        conn = psycopg2.connect(
            host=RDS_HOST,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            port=DB_PORT
        )
        cursor = conn.cursor()

        insert_query = sql.SQL("INSERT INTO users (username) VALUES (%s) RETURNING id")
        cursor.execute(insert_query, (username,))

        user_id = cursor.fetchone()[0]
        print(f"New user inserted with ID: {user_id}")

        conn.commit()
        cursor.close()
        conn.close()

        return event

    except Exception as e:
        print("Error occurred while inserting user into RDS: ", e)
        raise Exception("Error occurred while inserting user into RDS")

