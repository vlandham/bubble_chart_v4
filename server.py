from flask import Flask, json

api = Flask(__name__)

if __name__ == '__main__':
    api.run('127.0.0.1', 3000, True)

