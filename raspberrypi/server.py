import os
import threading

from dotenv import load_dotenv
from flask import Flask

from baby_station import BabyStation

load_dotenv()

email = os.getenv("BEDDYBYTES_USERNAME")
password = os.getenv("BEDDYBYTES_PASSWORD")

new_baby_station_input = {
    "email": email,
    "password": password
}

with BabyStation(new_baby_station_input) as baby_station:
    baby_station_thread = threading.Thread(target=baby_station.run)
    baby_station_thread.start()

    app = Flask(__name__)
    
    @app.route('/start', methods=['POST'])
    def start():
        baby_station.start()
        return 'OK', 202

    @app.route('/stop', methods=['POST'])
    def stop():
        baby_station.stop()
        return 'OK', 202

    app.run(host="0.0.0.0", port=5000)
