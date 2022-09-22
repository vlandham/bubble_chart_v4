from flask import Flask, json

orders = [
    {"id": 1, "amount": 10.00, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
    {"id": 2, "amount": 25.90, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

api = Flask(__name__)

@api.route('/orders', methods=['GET'])
def get_orders():
  return json.dumps(orders)

if __name__ == '__main__':
    api.run()