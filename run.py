#Importing the required libraries
from flask import Flask, render_template, request, redirect, url_for, jsonify, session
import json
from flask_session import Session

from config import Config, UseDatabase

#Setting the app and its configuration
app = Flask(__name__)
app.config.from_object(Config)

#Setting the local DB
app.config['dbconfig'] = { 'host' : '127.0.0.1',
                            'user' : 'wcst_user',
                            'password' : 'password',
                            'database' : 'wcst',
                        }

# Setting the cloud DB
# app.config['dbconfig'] = { 'host' : '34.89.233.160',
#                             'user' : 'root',
#                             'password' : 'password',
#                             'database' : 'wcst',
#                         }

#Routing the opening page
@app.route('/')
def hello():
    session.permanent = True
    session['uid'] = str(request.remote_addr)
    return redirect(url_for(('disclaimer') ))

#Disclaimer page
@app.route('/disclaimer', methods=['GET','POST'])
def disclaimer() -> 'html':
    return  render_template('disclaimer.html', title='Disclaimer')

#Survey Page
@app.route('/survey', methods=['GET','POST'])
def survey():
    if request.method == "POST":
        return redirect(url_for(('wcst_page')))
    return  render_template('survey.html', title='Survey')

# WCST Page
@app.route('/wcst', methods=['GET','POST'])
def wcst_page() -> 'html':
    if request.method == "POST":
        return redirect(url_for(('stroop_page')))
    return  render_template('wcst.html', title='Wisconsin Card Sorting Game')

# Stroop Page
@app.route('/stroop', methods=['GET','POST'])
def stroop_page() -> 'html':
    if request.method == "POST":
        return redirect(url_for(('igt_page')))
    return  render_template('stroop.html', title='Stroop Task')

# IGT Page
@app.route('/igt', methods=['GET','POST'])
def igt_page() -> 'html':
    if request.method == "POST":
        return redirect(url_for(('view_igt')))
    return  render_template('igt.html', title='Iowa Gambling Task')

#Inserting WCST Records
@app.route('/insert', methods=['GET','POST'])
def insert():
    with UseDatabase(app.config['dbconfig']) as cursor:
        if request.method == "POST":
            req_data = request.get_json()
            userid = str(session['uid'])
            print('user : ' + userid)
            for rows in req_data:
                key_pressed = rows['key_pressed']
                outcome = rows['outcome']
                reaction_time = rows['reaction_time']
                _SQL = """insert into test
                        (user, key_pressed, outcome, reaction_time) 
                        values
                        (%s, %s, %s, %s)"""
                cursor.execute(_SQL,(userid, key_pressed, outcome, reaction_time))
        return "Data Inserted"

#Inserting Survey Records
@app.route('/insert_survey', methods=['GET','POST'])
def insert_survey():
    with UseDatabase(app.config['dbconfig']) as cursor:
        if request.method == "POST":
            req_data = request.get_json()
            userid = str(session['uid'])
            print('user : ' + userid)
            for rows in req_data:
                print(rows)
                gender = rows['gender']
                age = rows['age']
                pain = rows['pain']
                _SQL = """insert into survey
                        (user, gender, age, pain) 
                        values
                        (%s, %s, %s, %s)"""
                cursor.execute(_SQL,(userid, gender, age, pain))
        return "Data Inserted"

#Inserting Stroop Records
@app.route('/insert_stroop', methods=['GET','POST'])
def insert_stroop():
    with UseDatabase(app.config['dbconfig']) as cursor:
        if request.method == "POST":
            req_data = request.get_json()
            userid = str(session['uid'])
            print('user : ' + userid)
            for rows in req_data:
                word = rows['word']
                color = rows['color']
                time = rows['time']
                keypressed = rows['keyPressed']
                correct = rows['correct']
                compatible = rows['compatible']
                _SQL = """insert into stroop
                        (user, word, color, time, keypressed, correct, compatible) 
                        values
                        (%s, %s, %s, %s, %s, %s, %s)"""
                cursor.execute(_SQL,(userid, word, color, time, keypressed, correct, compatible))
        return "Data Inserted"

#Inserting IGT Records
@app.route('/insert_igt', methods=['GET','POST'])
def insert_igt():
    with UseDatabase(app.config['dbconfig']) as cursor:
        print("in inset iGT")
        if request.method == "POST":
            req_data = request.get_json()
            userid = str(session['uid'])
            print('user : ' + userid)
            for rows in req_data:
                choice = rows['selected']
                gain = rows['profit']
                loss = rows['loss']
                net_profit = rows['netamt']
                total_amt = rows['finalcash']
                _SQL = """insert into igt
                        (user, choice, gain, loss, net_profit, total_amt) 
                        values
                        (%s, %s, %s, %s, %s, %s)"""
                cursor.execute(_SQL,(userid, choice, gain, loss, net_profit, total_amt))
        return "Data Inserted"

#Viewing WCST Records
@app.route('/viewrecords')
def view() -> 'html':
    with UseDatabase(app.config['dbconfig']) as cursor:
        _SQL = """select * from test"""
        cursor.execute(_SQL)
        contents = cursor.fetchall()
    return render_template('view.html', the_data=contents)

#Viewing Stroop Records
@app.route('/view_stroop')
def view_stroop() -> 'html':
    with UseDatabase(app.config['dbconfig']) as cursor:
        _SQL = """select * from stroop"""
        cursor.execute(_SQL)
        contents = cursor.fetchall()
    return render_template('view.html', the_data=contents)

#Viewing IGT Records
@app.route('/view_igt')
def view_igt() -> 'html':
    with UseDatabase(app.config['dbconfig']) as cursor:
        _SQL = """select * from igt"""
        cursor.execute(_SQL)
        contents = cursor.fetchall()
    return render_template('view.html', the_data=contents)

# Running the app
if __name__ == '__main__':
    app.run(debug=True)
