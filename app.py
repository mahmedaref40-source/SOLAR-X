import os
import json
import requests
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# إعداد قاعدة البيانات
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///solar_x.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# مفتاح Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AQ.Ab8RN6IYNlle5-ks_4QFQY8b9bjhP4J6Syby1mihHRVhuGzzw")

class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.String(50), nullable=True)
    surveyor = db.Column(db.String(100), nullable=True)
    survey_date = db.Column(db.String(50), nullable=True)
    client_name = db.Column(db.String(150), nullable=True)
    phone = db.Column(db.String(50), nullable=True)
    whatsapp = db.Column(db.String(50), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    lat = db.Column(db.String(50), nullable=True)
    lng = db.Column(db.String(50), nullable=True)
    system_type = db.Column(db.String(50), nullable=True)
    budget = db.Column(db.String(50), nullable=True)
    grid_status = db.Column(db.String(50), nullable=True)
    loads_data = db.Column(db.Text, nullable=True)

with app.app_context():
    db.create_all()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/save-survey', methods=['POST'])
def save_survey():
    try:
        data = request.get_json() or {}
        new_project = Project(
            project_id=data.get('project_id'),
            surveyor=data.get('surveyor'),
            survey_date=data.get('survey_date'),
            client_name=data.get('client_name'),
            phone=data.get('phone'),
            whatsapp=data.get('whatsapp'),
            address=data.get('address'),
            lat=data.get('lat'),
            lng=data.get('lng'),
            system_type=data.get('system_type'),
            budget=data.get('budget'),
            grid_status=data.get('grid_status'),
            loads_data=json.dumps(data.get('loads', []))
        )
        db.session.add(new_project)
        db.session.commit()
        return jsonify({"status": "success", "message": "تم حفظ بيانات المشروع بنجاح!"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        projects = Project.query.all()
        output = []
        for p in projects:
            output.append({
                "id": p.id,
                "project_id": p.project_id,
                "client_name": p.client_name,
                "system_type": p.system_type,
                "survey_date": p.survey_date
            })
        return jsonify(output), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/chat-ai', methods=['POST'])
def chat_ai():
    try:
        data = request.get_json() or {}
        user_message = data.get('message', '').strip()
        if not user_message:
            return jsonify({"reply": "من فضلك اكتب سؤالك أولاً."}), 400

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [{
                "parts": [{"text": f"أنت المساعد الذكي لمشروع SOLAR X. أجب عن التالي بدقة واحترافية: {user_message}"}]
            }]
        }
        headers = {"Content-Type": "application/json"}
        
        res = requests.post(url, json=payload, headers=headers, timeout=12)
        res_data = res.json()

        if "candidates" in res_data and len(res_data["candidates"]) > 0:
            reply_text = res_data["candidates"][0]["content"]["parts"][0]["text"]
            return jsonify({"reply": reply_text}), 200
        else:
            return jsonify({"reply": "تعذر الحصول على رد من النموذج حالياً."}), 500

    except Exception as e:
        return jsonify({"reply": f"عذراً، حدث خطأ: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)