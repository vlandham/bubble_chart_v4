from flask import Flask, render_template, send_from_directory, json


app = Flask(__name__)

orders = [
    {"id": 1, "amount": 10.00, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 1.00, 'restaurant_revenue': 9.00},
    {"id": 2, "amount": 25.90, 'state': 'ready', 'date': '09-22-2022', 'bentobox_revenue': 2.59, 'restaurant_revenue': 23.41}
]

money = [
    {
        'grant_title': 'New Mexico Business Roundtable',
    'id': 1,
'organization': 'New Mexico Business Roundtable for Educational Excellence',
'total_amount': '5000',
'group': 'low',
'Grant start date': '2/4/2010',
'start_month': '2',
'start_day': '4',
'start_year': '2010'
    },
    {
        'grant_title': 'LA NSC Match',
    'id': '2',
'organization': 'Trustees of Dartmouth College',
'total_amount': '27727',
'group': 'low',
'Grant start date': '8/3/2009',
'start_month': '8',
'start_day': '3',
'start_year': '2009'
    },
    {
        'grant_title': 'Education Equity Agenda: Improving Native Student Graduation Rates: Policy Recommendations on High School Reform',
    'id': '114',
'organization': 'National Indian Education Association',
'total_amount': '520446',
'group': 'medium',
'Grant start date': '8/31/2009',
'start_month': '8',
'start_day': '31',
'start_year': '2009'
    },
]

@app.route('/orders/', methods=['GET'])
def get_orders():
    return json.dumps(money)


@app.route("/")
def main():
    return render_template('index.html')
