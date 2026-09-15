from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/convert", methods=["POST"])
def convert():
    data = request.get_json()

    try:
        value = float(data["value"])
        unit = data["unit"]

        # Absolute zero validation
        if unit == "C" and value < -273.15:
            return jsonify({"error": "Temperature cannot be below absolute zero."})

        if unit == "K" and value < 0:
            return jsonify({"error": "Kelvin cannot be below 0 K."})

        if unit == "F" and value < -459.67:
            return jsonify({"error": "Temperature cannot be below absolute zero."})

        # Conversion
        if unit == "C":
            celsius = value
            fahrenheit = (value * 9 / 5) + 32
            kelvin = value + 273.15

        elif unit == "F":
            celsius = (value - 32) * 5 / 9
            fahrenheit = value
            kelvin = celsius + 273.15

        elif unit == "K":
            celsius = value - 273.15
            fahrenheit = (celsius * 9 / 5) + 32
            kelvin = value

        else:
            return jsonify({"error": "Invalid unit."})

        return jsonify({
            "celsius": round(celsius, 2),
            "fahrenheit": round(fahrenheit, 2),
            "kelvin": round(kelvin, 2)
        })

    except (ValueError, KeyError):
        return jsonify({"error": "Please enter a valid number."})


if __name__ == "__main__":
    app.run(debug=True)