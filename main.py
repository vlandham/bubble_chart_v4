import uuid
import random

from flask import Flask, render_template, json


app = Flask(__name__)

POSSIBLE_STATES = ('paid', 'unpaid')


def _get_random_id():
    return uuid.uuid4()


def _get_random_price():
    return round(random.uniform(33.33, 66.66), 2)


def _create_order():
    return {
        "id": _get_random_id(),
        "amount": _get_random_price(),
        'state': 'ready',
        'date': '09-22-2022',
        'bentobox_revenue': 1.00,
        'restaurant_revenue': 9.00
    }


@app.route('/orders/', defaults={'page': 0})
@app.route('/orders/<int:page>', methods=['GET'])
def get_orders(page: int):
    return json.dumps([_create_order()])


@app.route("/")
def main():
    return render_template('index.html')
