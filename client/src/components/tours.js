import React from "react";
import { withRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Tours({ isAuth: isAuth, component: Component, ...rest }) {
  const [listOfTours, setListOfTours] = useState([]);

  const getAllTours = async () => {
    try {
      const tours = await axios.get("/api/all-tours", {
        headers: {
          "x-access-token": localStorage.getItem("token"),
        },
      });
      if (tours) {
        setListOfTours(tours.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAllTours();
  }, [getAllTours]);

  return (
    <div>
      <div className="tourDisplay">
        {listOfTours.length > 0 &&
          listOfTours.map((tour) => {
            return (
              <div>
                <div>----------------</div>
                <div>Tourname: {tour.tour_name}</div>
                <div>TourDate: {tour.tour_date}</div>
                <div>TourDistance: {tour.tour_distance} km</div>
                <div>TourDuration: {tour.tour_duration} min</div>
                <div>Sporttype: {tour.tour_sport}</div>
                <div>TourElevationUp: {tour.tour_elevation_up}</div>
                <div>TourElevationDown: {tour.tour_elevation_down}</div>
                <div>----------------</div>
                <br></br>
              </div>
            );
          })}
      </div>
    </div>
  );
}
export default withRouter(Tours);
