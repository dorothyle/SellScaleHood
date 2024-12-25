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
    stock_symbol = request.args.get("symbol")
    try:
        stock = yf.Ticker(stock_symbol)

        if stock.info.get("quoteType") != "EQUITY":
            raise ValueError

        company_name = stock.info.get("longName", "N/A")

        current_price = stock.history(period="1d")["Close"][0]
        current_price = round(current_price, 2)
        current_price_str = f"{current_price:.2f}"

        historical_data = stock.history(period="5d")  # data for the last day

        yday_price = stock.history(period="5d")["Close"][3]

        daily_percentage_change = ((current_price - yday_price) / yday_price) * 100
        daily_percentage_change = round(daily_percentage_change, 2)
        daily_percentage_change_str = f"{daily_percentage_change:.2f}"

        return jsonify({"company_name": company_name, "current_price": current_price_str, "daily_percentage_change": daily_percentage_change_str})
    except:
        print("Stock for symbol", stock_symbol, "not found.")
        return jsonify({"error": "Stock not found"})
    
# Buy/sell stock
@app.route("/create_order", methods=['POST'])
def create_order():
    body = request.get_json()

    # receive share count, stock symbol, price of one stock, user_id
    stock = body['stock']
    purchase_type = body['purchase_type']
    share_count = body['share_count']
    price = body['price']
    user_id = body['user_id']

    # create query
    add_order_query = "INSERT INTO order_history (stock, purchase_type, share_count, price, user_id) VALUES (%s, %s, %s, %s, %s);"
    values = (stock, purchase_type, share_count, price, user_id)

    # add order to database
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(add_order_query, values)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"message": "success"})

if __name__ == '__main__':
    app.run(debug=True)
