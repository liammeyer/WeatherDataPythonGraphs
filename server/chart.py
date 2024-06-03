#Top half of code is just standard deviation graph, bottom half is with both std dev and danger zone graph

#Danger zone code is to show it could potentially throw an error message if it got below that threshold

'''
from flask import Flask, request, jsonify
import matplotlib
matplotlib.use('Agg')  # Use the non-interactive Agg backend
import matplotlib.pyplot as plt
import numpy as np
import os
from flask import url_for

app = Flask(__name__, static_folder='WeatherData/public', static_url_path='')

@app.route('/process-data', methods=['POST']) 
def process_data(): 
    temperatures = request.json['temperatures'] 
    result = sum(temperatures) 
    return jsonify({'result': result})

@app.route('/generate_histogram', methods=['POST'])
def generate_standard_deviation_chart():
    # Retrieve temperatures from the JSON data sent to the server
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400

    temperature_data = request.get_json().get('temperatures', None)
    if temperature_data is None:
        return jsonify({'error': 'No temperature data provided'}), 400


    temperatures = np.array(temperature_data)
    temperatures = temperatures[::-1]

    mean_temperature = np.mean(temperatures)
    std_deviation = np.std(temperatures)


    plt.figure(figsize=(10, 5))
    plt.axhline(y=mean_temperature, color='g', linestyle='-')
    plt.fill_between(range(len(temperatures)), mean_temperature - std_deviation, mean_temperature + std_deviation, color='blue', alpha=0.3)
    plt.plot(temperatures, marker='o', linestyle='-', color='g')
    plt.title('Temperature Fluctuations with Standard Deviation')
    plt.xlabel('Timestamp')
    plt.ylabel('Temperature (°C/F)')
    plt.xticks(range(len(temperatures)))

    plot_path = os.path.join(app.static_folder, 'standard_deviation_plot.png')
    plt.savefig(plot_path)
    plt.close()

    image_url = '/static/standard_deviation_plot.png'
    return jsonify({'message': 'Standard deviation chart generated successfully', 'image_url': image_url})


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

'''


from flask import Flask, request, jsonify
import matplotlib
matplotlib.use('Agg')  # Use the non-interactive Agg backend
import matplotlib.pyplot as plt
import numpy as np
import os

app = Flask(__name__, static_folder='WeatherData/public', static_url_path='')

@app.route('/process-data', methods=['POST'])
def process_data():
    temperatures = request.json['temperatures']
    result = sum(temperatures)
    return jsonify({'result': result})

@app.route('/generate_standard_deviation', methods=['POST'])
def generate_standard_deviation_chart():
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400

    temperature_data = request.get_json().get('temperatures', None)
    if temperature_data is None:
        return jsonify({'error': 'No temperature data provided'}), 400

    temperatures = np.array(temperature_data)
    temperatures = temperatures[::-1]

    mean_temperature = np.mean(temperatures)
    std_deviation = np.std(temperatures)

    plt.figure(figsize=(10, 5))
    plt.axhline(y=mean_temperature, color='r', linestyle='-')
    plt.fill_between(range(len(temperatures)), mean_temperature - std_deviation, mean_temperature + std_deviation, color='blue', alpha=0.3)
    plt.plot(temperatures, marker='o', linestyle='-', color='g')
    plt.title('Temperature Fluctuations with Standard Deviation')
    plt.xlabel('Numbers above are timestamp placeholders - oldest to newest from left to right')
    plt.ylabel('Temperature (°C/F)')
    plt.xticks(range(len(temperatures)))

    plot_path = os.path.join(app.static_folder, 'standard_deviation_plot.png')
    plt.savefig(plot_path)
    plt.close()

    image_url = '/static/standard_deviation_plot.png'
    return jsonify({'message': 'Standard deviation chart generated successfully', 'image_url': image_url})

@app.route('/generate_danger_zone', methods=['POST'])
def generate_danger_zone_chart():
    if not request.is_json:
        return jsonify({'error': 'Request body must be JSON'}), 400

    temperature_data = request.get_json().get('temperatures', None)
    if temperature_data is None:
        return jsonify({'error': 'No temperature data provided'}), 400

    temperatures = np.array(temperature_data)
    temperatures = temperatures[::-1]

    danger_threshold = np.percentile(temperatures, 33)  # Gets the 33rd percentile value

    plt.figure(figsize=(10, 5))
    plt.axhline(y=danger_threshold, color='r', linestyle='-', label='Danger Zone Threshold')
    plt.fill_between(range(len(temperatures)), plt.ylim()[0], danger_threshold, color='red', alpha=0.2)
    plt.plot(temperatures, marker='o', linestyle='-', color='g')
    plt.title('Temperature Fluctuations with Danger Zone (bottom 1/3 temps are in danger zone)')
    plt.xlabel('Numbers above are timestamp placeholders - oldest to newest from left to right')
    plt.ylabel('Temperature (°C/F)')
    plt.xticks(range(len(temperatures)))
    plt.legend()

    plot_path = os.path.join(app.static_folder, 'temperature_danger_zone_plot.png')
    plt.savefig(plot_path)
    plt.close()

    image_url = '/static/temperature_danger_zone_plot.png'
    return jsonify({'message': 'Temperature chart with danger zone generated successfully', 'image_url': image_url})

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
