import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
import psycopg2

load_dotenv()
app = Flask(__name__)

# load env variables
user = os.getenv('USERNAME')
password = os.getenv('PASSWORD')
host = os.getenv('HOST')
port = os.getenv('PORT')
database = os.getenv('DATABASE')

# Database connection setup
def get_db_connection():
    conn = psycopg2.connect(
        user=user,
        password=password,
        host=host,
        port=port,
        database=database,
    )
    return conn

# Example route to get data from a table
@app.route('/', methods=['GET'])
def home():
    return "home page"

# Example route to get data from a table
@app.route('/products', methods=['GET'])
def get_products():
    conn = get_db_connection()
    print("database connection success")
    cur = conn.cursor()
    cur.execute('SELECT * FROM products;')
    products = cur.fetchall()
    cur.close()
    conn.close()
    return jsonify(products)

# # Example route to insert data into the table
@app.route('/add_product', methods=['POST'])
def add_product():
    new_product = request.get_json()
    product_name = new_product['product_name']
    price = new_product['price']

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'INSERT INTO products (product_name, price) VALUES (%s, %s);', 
        (product_name, price)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "Product added successfully!"})

if __name__ == '__main__':
    app.run(debug=True)
