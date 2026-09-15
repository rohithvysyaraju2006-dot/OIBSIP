```python
from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Profile information
profile = {
    "name": "V. Rohithraju",
    "course": "BCA",
    "college": "Gayatri College of Science and Management",
    "year": "3rd Year / 6th Semester",
    "skills": ["HTML", "CSS"],
    "internship": "Short-Term Internship on AI Tools",
    "email": "rohithvysyaraju2006@gmail.com",
    "phone": "+91 8374521059",
    "location": "Makhivalasa Village"
}


# Home page
@app.route("/")
def home():
    return render_template("index.html")


# Profile API
@app.route("/profile")
def get_profile():
    return jsonify(profile)


# Contact information
@app.route("/contact")
def contact():
    return jsonify({
        "name": profile["name"],
        "email": profile["email"],
        "phone": profile["phone"],
        "location": profile["location"]
    })


if __name__ == "__main__":
    app.run(debug=True)
```
