import requests
import json
import mysql.connector
import math
import time

class KomootSocial:
  #instantiate KommotSocial Class with given client_id, client_email and client_password
  def __init__(self, client_id, client_email, client_password):
    self.client_id = client_id
    self.client_email = client_email
    self.client_password = client_password
    #establish connection to MySQL Database
    self.mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="komoot_social"
      )
  
  #define getTourData function for fetching TourData from Komoot and pasting it into the Databae
  def getTourData(self):
    #try is used for the KeyError when to many requests are made
    try:
      #define the Komoot API URL's for login into the Komoot Session and getting the TourData
      tour_url = f'https://www.komoot.de/api/v007/users/{self.client_id}/tours/'
      login_url = "https://account.komoot.com/v1/signin"
      signin_url = "https://account.komoot.com/actions/transfer?type=signin"

      #creating a session to login into your kommot account
      s = requests.Session()
      res = requests.get(login_url)
      cookies = res.cookies.get_dict()

      #Payload for HTTP request
      payload = json.dumps({
          "email": self.client_email,
          "password": self.client_password,
          "reason": "null"
      })

      #headers for s.post
      headers = {"Content-Type": "application/json"}
      
      #make login request
      s.post(login_url, headers=headers, data=payload, cookies=cookies)    
      s.get(signin_url)
      #getting the tour data
      #headers for s.get
      headers = {"onlyprops": "true"}
      
      #storing the respone Data and formatting it into JSON
      response = s.get(tour_url, headers=headers)
      data = response.json()
        
      #shorting the dictionary
      ListOfTours = data["_embedded"]["tours"]
      
      #function to round_up the distance
      def round_up(n, decimals=0):
        multiplier = 10 ** decimals
        return math.ceil(n * multiplier) / multiplier
      
      #checking if a Table with given client_id exists and when not creating a Table
      mycursor = self.mydb.cursor()
      sql = f"CREATE TABLE IF NOT EXISTS _{self.client_id} (tour_date DATE, tour_distance FLOAT, tour_duration INT, tour_elevation_up INT, tour_elevation_down INT, tour_map_image VARCHAR(64) UNIQUE, tour_name VARCHAR(64), tour_sport VARCHAR(64), tour_start_point VARCHAR(64), tour_type VARCHAR(64))"
      mycursor.execute(sql)
      self.mydb.commit()
      
      #iterating throw the dictionary and for each tour get the specific data and storing it into the Table
      tourcount = 0
      for tours in ListOfTours:

        TourData = data["_embedded"]["tours"][tourcount]
        TourDate = TourData["date"]
        TourDistance = TourData["distance"]
        TourDistance = round_up(TourDistance/1000, 1)
        TourDuration = TourData["duration"]
        TourDuration = TourDuration/60
        TourElevation_down = TourData["elevation_down"]
        TourElevation_up = TourData["elevation_down"]
        TourMap_image = TourData["map_image"]["src"]
        TourName = TourData["name"]
        TourSport = TourData["sport"]
        TourStart_point = str((TourData["start_point"]["alt"],TourData["start_point"]["lat"],TourData["start_point"]["lng"]))
        TourType = TourData["type"]

        try:
          mycursor = self.mydb.cursor()
          sql = f"INSERT INTO _{self.client_id} (tour_date, tour_distance, tour_duration, tour_elevation_up, tour_elevation_down, tour_map_image, tour_name, tour_sport, tour_start_point, tour_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
          val = (TourDate, TourDistance, TourDuration, TourElevation_up, TourElevation_down, TourMap_image, TourName, TourSport, TourStart_point, TourType)
          mycursor.execute(sql, val)
          self.mydb.commit()
          print(mycursor.rowcount, "record inserted.")
        except mysql.connector.errors.IntegrityError:
          print("Up-to-Date")
        tourcount = tourcount + 1
         
    except KeyError:
      print("To many requests")
    
  def distancePerYear(self, tour_year):
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_distance) FROM _{self.client_id} WHERE (tour_date LIKE '{tour_year}%') AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    data = mycursor.fetchall()
    print(data)
    
  def toursPerYear(self, tour_year):
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE (tour_date LIKE '{tour_year}%') AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    data = mycursor.fetchall()
    print(data)  

print("Script started")
ks = KomootSocial(673338137185, 'DanielMuenstermann18@gmail.com', 'DPrQh5bqv1TPutMU5uCP')
ks.getTourData()
ks.distancePerYear(2021)
ks.toursPerYear(2021)
