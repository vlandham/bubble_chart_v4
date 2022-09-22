from flask import Flask, render_template, json


app = Flask(__name__)

orders = [
    {"id": 1, "amount": 10.00, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
    {"id": 2, "amount": 25.90, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]


@app.route('/orders', methods=['GET'])
def get_orders():
    return json.dumps(orders)


@app.route("/")
def main():
    return render_template('index.html')
