import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
import yfinance as yf
import requests

load_dotenv()
app = Flask(__name__)
CORS(app, origins="*")

# load env variables
user = os.getenv('USERNAME')
password = os.getenv('PASSWORD')
host = os.getenv('HOST')
port = os.getenv('PORT')
database = os.getenv('DATABASE')
openai_api_key = os.getenv('OPENAI_API_KEY')

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

# Search for stocks
@app.route('/search_stock', methods=['GET'])
def search_stock():
    stock_symbol = request.args.get("symbol")
    try:
        stock = yf.Ticker(stock_symbol)

        if stock.info.get("quoteType") != "EQUITY":
            raise ValueError

        stock_symbol = stock.info.get("symbol")
        company_name = stock.info.get("longName", "N/A")
        website = stock.info.get("website")
        print("WEBSITE:", website)

        current_price = stock.history(period="1d")["Close"].iloc[0]
        current_price = round(current_price, 2)
        current_price_str = f"{current_price:.2f}"

        yday_price = stock.history(period="5d")["Close"].iloc[3]

        daily_percentage_change = ((current_price - yday_price) / yday_price) * 100
        daily_percentage_change = round(daily_percentage_change, 2)
        daily_percentage_change_str = f"{daily_percentage_change:.2f}"

        return jsonify({"stock_symbol": stock_symbol, "company_name": company_name, "current_price": current_price_str, "daily_percentage_change": daily_percentage_change_str, "website": website})
    except:
        print("Stock for symbol", stock_symbol, "not found.")
        return jsonify({"error": "Stock not found"}), 500
    
# Buy/sell stock
@app.route("/create_order", methods=['POST'])
def create_order():
    try:
        body = request.get_json()

        # receive share count, stock symbol, price of one stock, user_id
        stock = body['stock_symbol']
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
    except:
        print("Error placing order")
        return jsonify({"error": "Cannot place order"}), 500
    
# Retrieve list of owned stock
@app.route('/owned_stocks', methods=['GET'])
def get_owned_stocks():
    user_id = request.args.get("user_id")
    try:
        # create query to get user's list of owned stocks
        owned_stock_query = """
        SELECT 
            stock,
            SUM(CASE WHEN purchase_type = 'BUY' THEN share_count 
                    WHEN purchase_type = 'SELL' THEN -share_count 
                    ELSE 0 END) AS net_shares
        FROM 
            order_history
        WHERE 
            user_id = %s
        GROUP BY 
            stock
        HAVING 
            SUM(CASE WHEN purchase_type = 'BUY' THEN share_count 
                    WHEN purchase_type = 'SELL' THEN -share_count 
                    ELSE 0 END) > 0;
        """
        params = (user_id)

        # retrieve from database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(owned_stock_query, params)
        owned_stocks = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()

        for data in owned_stocks:
            # retrieve stock data from search_stock endpoint
            stock = data.get("stock")
            response = requests.get('http://127.0.0.1:5000/search_stock?symbol=' + stock)
            stock_data = response.json()

            # include current price and today's percentage change
            current_price, daily_percentage_change = stock_data.get("current_price"), stock_data.get("daily_percentage_change")
            data["current_price"] = current_price
            data["daily_percentage_change"] = daily_percentage_change

        return jsonify(owned_stocks)
    except:
        print("Error retrieving list of owned stocks")
        return jsonify({"error": "Cannot retrieve owned stock"}), 500
    
# Retrieve list of owned stock
@app.route('/portfolio_value', methods=['GET'])
def get_portfolio_value():
    user_id = request.args.get("user_id")
    try:
        response = requests.get('http://127.0.0.1:5000/owned_stocks?user_id=' + user_id)
        portfolio_value = 0
        if response.status_code == 200:
            # get list of owned stocks
            owned_stocks = response.json()

            # calculate total portfolio value
            for data in owned_stocks:
                shares = data.get("net_shares")
                current_price = data.get("current_price")
                stock_value = float(shares) * float(current_price)
                portfolio_value += stock_value
            
        return jsonify({"portfolio_value":portfolio_value})
    except:
        print("Error retrieving total portfolio value")
        return jsonify({"error": "Cannot retrieve total portfolio value"}), 500
    
# Retrieve transcation history
@app.route('/order_history', methods=['GET'])
def get_order_history():
    user_id = request.args.get("user_id")
    try:
        order_history_query = '''
            SELECT stock, purchase_type, share_count, price
            FROM order_history
            WHERE user_id=%s
        '''
        params=(user_id)

        # retrieve from database
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(order_history_query, params)
        order_history = cur.fetchall()
        conn.commit()
        cur.close()
        conn.close()

        return jsonify(order_history)
    except:
        print("Error retrieving order history")
        return jsonify({"error": "Cannot retrieve order history"}), 500
    
# Retrieve historical data
@app.route("/historical_data", methods=['GET'])
def get_historical_data():
    stock_symbol = request.args.get("stock_symbol")
    try:
        stock = yf.Ticker(stock_symbol)

        if stock.info.get("quoteType") != "EQUITY":
            raise ValueError
        historical_data = stock.history(period="1mo")  # data for the last month
        historical_data = historical_data[["Close"]].reset_index().to_dict(orient="records")
        return jsonify(historical_data)
    except:
        print("Error retrieving historical data")
        return jsonify({"error": "Cannot retrieve historical data"}), 500

# good, bad, suggestion
@app.route("/stock_analysis", methods=['GET'])
def get_stock_analysis():
    # Provide one sentence about the good things about my stock portfolio. Provide one sentence about the bad things about my stock portfolio. Provide one sentence about the suggestions on stock tickers to buy or sell.
    user_id = request.args.get("user_id")

    try:
        response = requests.get('http://127.0.0.1:5000/owned_stocks?user_id=' + user_id)

        if response.status_code == 200:
            # get list of owned stocks
            owned_stocks = response.json()

            # prompt ChatGPT
            prompt = "Provide one sentence about the good things about my stock portfolio. Provide one sentence about the bad things about my stock portfolio. Provide one sentence about the suggestions on stock tickers to buy or sell."  \
            + str(owned_stocks)

            endpoint = "https://api.openai.com/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {openai_api_key}",
                "Content-Type": "application/json"
            }

            data = {
                "model": "gpt-4",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                "max_tokens": 300
            }

            response = requests.post(endpoint, headers=headers, json=data)
            result = response.json()
            print("Response:", result["choices"][0]["message"]["content"])

            return jsonify({"analysis": result["choices"][0]["message"]["content"]})
    except:
        print("Error retrieving stock analysis")
        return jsonify({"error": "Cannot retrieve stock analysis"}), 500

if __name__ == '__main__':
    app.run(debug=True)
