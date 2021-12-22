import requests
import json
import mysql.connector
import math
import time
import sys
import collections
import pymongo
from pymongo import MongoClient

class KomootSocial:
  #instantiate KommotSocial Class with given client_id, client_email and client_password
  def __init__(self, client_id=0, client_email=0, client_password=0):
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
      sql = f"CREATE TABLE IF NOT EXISTS _{self.client_id} (tour_date DATE, tour_distance FLOAT, tour_duration INT, tour_elevation_up INT, tour_elevation_down INT, tour_map_image TEXT, tour_name VARCHAR(64), tour_sport VARCHAR(64), tour_start_point VARCHAR(64), tour_type VARCHAR(64), tour_id INT UNIQUE, is_private BIT DEFAULT 1, tour_text TEXT DEFAULT NULL, tour_creator_id VARCHAR(64))"
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
        #TourStart_point_lat= TourData["start_point"]["lat"]
        #TourStart_point_lng= TourData["start_point"]["lng"]
        #responseAPI = requests.get(f"https://api.geoapify.com/v1/geocode/reverse?lat={TourStart_point_lat}&lon={TourStart_point_lng}&format=json&apiKey=d3721fd275fe456bba78e14185e8bbaf")
        TourStart_point = "not working"
        TourType = TourData["type"]
        TourID = TourData["id"]
        TourCreatorID = TourData["_embedded"]["creator"]["username"]

        try:
          mycursor = self.mydb.cursor()
          sql = f"INSERT INTO _{self.client_id} (tour_date, tour_distance, tour_duration, tour_elevation_up, tour_elevation_down, tour_map_image, tour_name, tour_sport, tour_start_point, tour_type, tour_id, tour_creator_id) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
          val = (TourDate, TourDistance, TourDuration, TourElevation_up, TourElevation_down, TourMap_image, TourName, TourSport, TourStart_point, TourType, TourID, TourCreatorID)
          mycursor.execute(sql, val)
          self.mydb.commit()

        except mysql.connector.errors.IntegrityError:
          pass
        tourcount = tourcount + 1
         
    except KeyError:
      pass
  
  def updateTour(self, is_private, tour_id="null", tour_text="null"):
    if (tour_id!="null"):
      mycursor = self.mydb.cursor()
      sql = f"UPDATE _{self.client_id} SET is_private = {is_private} WHERE tour_id = {tour_id}"
      mycursor.execute(sql)
      self.mydb.commit()
    if (tour_text!="null"):
      mycursor = self.mydb.cursor()
      sql = f"UPDATE _{self.client_id} SET tour_text = '{tour_text}' WHERE tour_id = {tour_id}"
      mycursor.execute(sql)
      self.mydb.commit()
    
    
    
  def getAllTours(self):
    mycursor = self.mydb.cursor()
    sql = f"SELECT tour_name, tour_sport, tour_distance, tour_duration, tour_date, tour_elevation_up, tour_elevation_down, tour_id, is_private, tour_text  FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    
    objects_list = []
    for row in rows:
      d = collections.OrderedDict()
      d['tour_name'] = row[0]
      d['tour_sport'] = row[1]
      d['tour_distance'] = row[2]
      d['tour_duration'] = row[3]
      d['tour_date'] = row[4]
      d['tour_elevation_up'] = row[5]
      d['tour_elevation_down'] = row[6]
      d['tour_id'] = row[7]
      d['is_private'] = row[8]
      d['tour_text'] = row[9]
      objects_list.append(d)
    j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    return j
  
  def getFeed(self):
    cluster = MongoClient("mongodb+srv://Broump:YOXVKJ3kjFZ0Qut1@cluster0.slhya.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", tls=True, tlsAllowInvalidCertificates=True)
    db = cluster["myFirstDatabase"]
    collection = db["user-data"]
    
    mycursor = self.mydb.cursor()
    sql = "SHOW TABLES FROM komoot_social"
    mycursor.execute(sql)
    tables = mycursor.fetchall()
    
    objects_list = []
    tableNumber = 0
    
    for table in tables:
      mycursor = self.mydb.cursor()
      sql = f"SELECT tour_name, tour_sport, tour_distance, tour_duration, tour_date, tour_elevation_up, tour_elevation_down, tour_id, is_private, tour_text, tour_map_image, tour_start_point, tour_type, tour_creator_id  FROM {table[tableNumber]} WHERE is_private = 0"
      mycursor.execute(sql)
      rows = mycursor.fetchall()
      for row in rows:
        d = collections.OrderedDict()
        d['tour_name'] = row[0]
        d['tour_sport'] = row[1]
        d['tour_distance'] = row[2]
        d['tour_duration'] = row[3]
        d['tour_date'] = row[4]
        d['tour_elevation_up'] = row[5]
        d['tour_elevation_down'] = row[6]
        d['tour_id'] = row[7]
        d['is_private'] = row[8]
        d['tour_text'] = row[9]
        d['tour_map_image'] = row[10]
        d['tour_start_point'] = row[11]
        d['tour_type'] = row[12]
        d['tour_creator_id'] = row[13]
        tour_creator_id = row[13]
        for x in collection.find({"komootID":tour_creator_id},{"_id": 0,"username":1}):
              d['tour_creator_username'] = x["username"]
        d['tour_user_id'] = table[tableNumber].replace("_","")
        tour_user_id = table[tableNumber].replace("_","")
        for x in collection.find({"komootID":tour_user_id},{"_id": 0,"username":1}):
              d['tour_user_username'] = x["username"]
        objects_list.append(d)
      j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    tableNumber += 1
    return j
  
  def getHowOftenSport(self):
        
    values = []
    d = collections.OrderedDict()
    objects_list = []
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'hike' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['hike'] = values[0][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'mountaineering' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['mountaineering'] = values[1][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'racebike' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['racebike'] = values[2][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'e_racebike' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['e_racebike'] = values[3][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'touringbicycle' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['touringbicycle'] = values[4][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'e_touringbicycle' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['e_touringbicycle'] = values[5][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'mtb' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['mtb'] = values[6][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'e_mtb' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['e_mtb'] = values[7][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'mtb_easy' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['mtb_easy'] = values[8][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'e_mtb_easy' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['e_mtb_easy'] = values[9][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'mtb_advanced' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['mtb_advanced'] = values[10][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'e_mtb_advanced' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['e_mtb_advanced'] = values[11][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_sport = 'jogging' AND tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['jogging'] = values[12][0][0]
    
    objects_list.append(d)
    j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    return(j)
  
  def getTotalSportValues(self):
        
    values = []
    d = collections.OrderedDict()
    objects_list = []
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalrecordedtours'] = values[0][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_type = 'tour_planned'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalplannedtours'] = values[1][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_distance) FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totaldistance'] = values[2][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_duration) FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalduration'] = values[3][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_elevation_up) FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalelevationup'] = values[4][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_elevation_down) FROM _{self.client_id} WHERE tour_type = 'tour_recorded'"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalelevationdown'] = values[5][0][0]
    
    objects_list.append(d)
    j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    return(j)
  
  def getTotalSportValuesPerYear(self, tour_year):
    values = []
    d = collections.OrderedDict()
    objects_list = []
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_type = 'tour_recorded' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalrecordedtours'] = values[0][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT COUNT(*) FROM _{self.client_id} WHERE tour_type = 'tour_planned' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalplannedtours'] = values[1][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_distance) FROM _{self.client_id} WHERE tour_type = 'tour_recorded' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totaldistance'] = values[2][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_duration) FROM _{self.client_id} WHERE tour_type = 'tour_recorded' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalduration'] = values[3][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_elevation_up) FROM _{self.client_id} WHERE tour_type = 'tour_recorded' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalelevationup'] = values[4][0][0]
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT SUM(tour_elevation_down) FROM _{self.client_id} WHERE tour_type = 'tour_recorded' AND (tour_date LIKE '{tour_year}%')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    d['totalelevationdow'] = values[5][0][0]
    
    objects_list.append(d)
    j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    return(j)
  
  def getHowManyToursInMonthPerYear(self, tour_year):
    values = []
    d = collections.OrderedDict()
    objects_list = []
    
    mycursor = self.mydb.cursor()
    sql = f"SELECT DATE_FORMAT(tour_date , '%M'), COUNT(*) FROM _673338137185 WHERE tour_date LIKE '{tour_year}%' GROUP BY DATE_FORMAT(tour_date , '%M')"
    mycursor.execute(sql)
    rows = mycursor.fetchall()
    values.append(rows)
    for i in values:
      objects_list.append(i)
      
    j = json.dumps(objects_list, indent=4, sort_keys=True, default=str)
    return(j)
  
    
"""
ks = KomootSocial(673338137185,"DanielMuenstermann18@gmail.com","DPrQh5bqv1TPutMU5uCP")
ks.getTourData()
returnData = ks.getFeed()
print(returnData)


"""
functionType = sys.argv[1]

if (functionType == "allTours"):
  ks = KomootSocial(int(sys.argv[2]), sys.argv[3], sys.argv[4])
  ks.getTourData()
  returnData = ks.getAllTours()
  print(returnData)
  
if (functionType == "howOftenSport"):
  ks = KomootSocial(int(sys.argv[2]), sys.argv[3], sys.argv[4])
  ks.getTourData()
  returnData = ks.getHowOftenSport()
  print(returnData)
  
if (functionType == "getTotalSportValues"):
  ks = KomootSocial(int(sys.argv[2]), sys.argv[3], sys.argv[4])
  ks.getTourData()
  returnData = ks.getTotalSportValues()
  print(returnData)
  
if (functionType == "getTotalSportValuesPerYear"):
  ks = KomootSocial(int(sys.argv[2]), sys.argv[3], sys.argv[4])
  ks.getTourData()
  returnData = ks.getTotalSportValues(sys.argv[5])
  print(returnData)
  
if (functionType == "updateTour"):
  ks = KomootSocial(int(sys.argv[2]), sys.argv[3], sys.argv[4])
  ks.getTourData()
  ks.updateTour(int(sys.argv[5]), int(sys.argv[6]), sys.argv[7])
  
if (functionType == "getFeed"):
  ks = KomootSocial()
  returnData = ks.getFeed()
  print(returnData)
  
  
sys.stdout.flush()