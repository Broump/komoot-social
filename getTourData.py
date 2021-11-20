import requests
import json
import mysql.connector

class KomootSocial:
  def __init__(self, client_id, client_email, client_password):
    self.client_id = client_id
    self.client_email = client_email
    self.client_password = client_password

  def getTourData(self):

    tour_url = f'https://www.komoot.de/api/v007/users/{self.client_id}/tours/'
    login_url = "https://account.komoot.com/v1/signin"
    signin_url = "https://account.komoot.com/actions/transfer?type=signin"

    #creating a session to login into your kommot account
    s = requests.Session()
    res = requests.get(login_url)
    cookies = res.cookies.get_dict()
 
 
    payload = json.dumps({
        "email": self.client_email,
        "password": self.client_password,
        "reason": "null"
    })

    

    mydb = mysql.connector.connect(
      host="localhost",
      user="root",
      password="",
      database="komoot_social"
    )

    

    
 
    #headers for s.post
    headers = {"Content-Type": "application/json"}
 
    s.post(login_url, headers=headers, data=payload, cookies=cookies)
 
    s.get(signin_url)
 
    #getting the tour data
    #headers for s.get
    headers = {"onlyprops": "true"}
 
    response = s.get(tour_url, headers=headers)
    data = response.json()
    ListOfTours = data["_embedded"]["tours"]

    AllTourInformation = []
    tourcount = 0
        
    mycursor = mydb.cursor()
    sql = f"CREATE TABLE IF NOT EXISTS _{self.client_id} (tour_date DATE, tour_distance INT, tour_duration INT, tour_elevation_up INT, tour_elevation_down INT, tour_map_image TEXT, tour_name TEXT, tour_sport TEXT, tour_start_point TEXT, tour_type TEXT)"
    mycursor.execute(sql)
    mydb.commit()
    
    for tours in ListOfTours:

      TourData = data["_embedded"]["tours"][tourcount]
      TourDate = TourData["date"]
      TourDistance = TourData["distance"]
      TourDuration = TourData["duration"]
      TourElevation_down = TourData["elevation_down"]
      TourElevation_up = TourData["elevation_down"]
      TourMap_image = TourData["map_image"]["src"]
      TourName = TourData["name"]
      TourSport = TourData["sport"]
      TourStart_point = str((TourData["start_point"]["alt"],TourData["start_point"]["lat"],TourData["start_point"]["lng"]))
      TourType = TourData["type"]
      userID = self.client_id

      #TourInformation = (TourDate, TourDistance, TourDuration, TourElevation_down, TourElevation_up, TourMap_image, TourName, TourSport, TourStart_point, TourType)
      mycursor = mydb.cursor()
      sql = f"INSERT INTO _{self.client_id} (tour_date, tour_distance, tour_duration, tour_elevation_up, tour_elevation_down, tour_map_image, tour_name, tour_sport, tour_start_point, tour_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s) "
      val = (TourDate, TourDistance, TourDuration, TourElevation_up, TourElevation_down, TourMap_image, TourName, TourSport, TourStart_point, TourType)
      mycursor.execute(sql, val)
      mydb.commit()
      print(mycursor.rowcount, "record inserted.")
      #AllTourInformation.append(TourInformation)
      tourcount = tourcount + 1

    #print(AllTourInformation)

print("Script started")
ks = KomootSocial(673338137185, 'DanielMuenstermann18@gmail.com', 'DPrQh5bqv1TPutMU5uCP')
ks.getTourData()
