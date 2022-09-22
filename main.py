import time
import uuid
import random
from decimal import Decimal

from flask import Flask, render_template, json


app = Flask(__name__)

POSSIBLE_STATES = ('paid', 'unpaid')


def _get_random_id():
    return uuid.uuid4()


def _get_random_price():
    return round(random.uniform(33.33, 66.66), 2)


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
        "amount":amount,
        'state': random.choice(POSSIBLE_STATES),
        'date': random_date("1/1/2022", "1/1/2023", random.random()),
        'bentobox_revenue': "{:.2f}".format(round(abs(amount - resto_rev), 2)),
        'restaurant_revenue': resto_rev
    }


@app.route('/orders/', defaults={'page': 0})
@app.route('/orders/<int:page>', methods=['GET'])
def get_orders(page: int):
    return json.dumps([_create_order()])


@app.route("/")
def main():
    return render_template('index.html')
