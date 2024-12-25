import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import yfinance as yf

load_dotenv()
app = Flask(__name__)
CORS(app, origins="*")

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

# Search for stocks
@app.route('/search_stock', methods=['GET'])
def search_stock():
    # body = request.get_json()
    stock_symbol = request.args.get("symbol")
    stock = yf.Ticker(stock_symbol)

    company_name = stock.info.get("longName", "N/A")

    current_price = stock.history(period="1d")["Close"][0]
    print(type(current_price))
    current_price = round(current_price, 2)
    current_price_str = f"{current_price:.2f}"
    print("Current price:", current_price_str)

    historical_data = stock.history(period="5d")  # data for the last day
    print("Historical Data:")
    print(historical_data)

    yday_price = stock.history(period="5d")["Close"][3]
    print("Yday's price:", yday_price)

    daily_percentage_change = ((current_price - yday_price) / yday_price) * 100
    print(type(daily_percentage_change))
    daily_percentage_change = round(daily_percentage_change, 2)
    daily_percentage_change_str = f"{daily_percentage_change:.2f}"
    print("daily percentage change:", daily_percentage_change_str, "%")

    return jsonify({"company_name": company_name, "current_price": current_price_str, "daily_percentage_change": daily_percentage_change_str})


if __name__ == '__main__':
    app.run(debug=True)
