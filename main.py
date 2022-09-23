import time
import uuid
import random

from flask import Flask, render_template, json
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

POSSIBLE_STATES = ('unpaid', 'paid')

orders = []

def _get_random_id():
    return uuid.uuid4()


def _get_random_price():
    return round(random.uniform(3.33, 66.66), 2)


def str_time_prop(start, end, time_format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formatted in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, time_format))
    etime = time.mktime(time.strptime(end, time_format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(time_format, time.localtime(ptime))


def random_date(start, end, prop):
    return str_time_prop(start, end, '%m/%d/%Y', prop)


def _create_order():
    resto_rev = _get_random_price()
    amount = _get_random_price()
    return {
        "id": _get_random_id(),
        "amount": amount,
        'state': POSSIBLE_STATES[0],
        'date': random_date("1/1/2022", "1/1/2023", random.random()),
        'bentobox_revenue': "{:.2f}".format(round(abs(amount - resto_rev), 2)),
        'restaurant_revenue': resto_rev
    }


def _update_states(iteration: int):
    maximum_unpaid_transitions = 1
    unpaid_transitions = 0
    for index, order in enumerate(orders):
        if index > iteration:
            break

        update_state = random.randint(0, 1)

        if not update_state and not unpaid_transitions:
            break

        set_state_unpaid = not random.randint(0, max(iteration, 5)) % 7
        prev_state = order['state']
        order['state'] = POSSIBLE_STATES[0 if set_state_unpaid and maximum_unpaid_transitions > unpaid_transitions else 1]
        if order['state'] == 'unpaid':
            unpaid_transitions += 1

        if prev_state != order['state']:
            print(f'new {order["state"]} state with price $ {order["amount"]:.2f}!')


@app.route('/api/orders/', defaults={'page': 0})
@app.route('/api/orders/<int:page>', methods=['GET'])
def get_orders(page: int):

    if page > len(orders):
        for i in range(page-len(orders)):
            orders.append(_create_order())
    else:
        orders.append(_create_order())

    _update_states(page)

    return json.dumps(orders[:page+1])


@app.route("/")
def main():
    return render_template('index.html')
