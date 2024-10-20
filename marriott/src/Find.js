import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "./Find.css";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, CircleF } from "@react-google-maps/api";
import { StandaloneSearchBox, MarkerF } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const usCenter = {
  lat: 39.8283, // Latitude for the center of the US
  lng: -98.5795, // Longitude for the center of the US
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MILES_TO_METERS = 1609.34; // Conversion factor from miles to meters

function Find() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [radius, setRadius] = useState(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([
    {
      name: "test",
      pred: 120,
      actual: 500,
      diff: 380,
      lat: 37.2699733,
      lng: -80.4539393,
      places: [
        { name: "simons house", lat: 37.2999733, lng: -80.4539393 },
        { name: "test", lat: 37.3699733, lng: -80.4539393 },
      ],
    },
    {
      name: "test2",
      pred: 500,
      actual: 120,
      diff: -380,
      lat: 37.2295733,
      lng: -80.4139393,
      places: [
        { name: "simons house", lat: 37.2119733, lng: -80.4539393 },
        { name: "test", lat: 37.3191733, lng: -80.4539393 },
      ],
    },
  ]);

  const [coordinates, setCoordinates] = useState(usCenter); // Store selected coordinates
  const [zoom, setZoom] = useState(4); // Set initial zoom
  const [searchedAddress, setSearchedAddress] = useState(""); // State for the searched address
  const searchBoxRef = useRef(null); // Reference to the search box
  const [mapKey, setMapKey] = useState(1);

  const setMapDetails = (rad, lat, lng) => {
    const zoomMap = { 5: 11, 10: 10, 15: 9, 20: 9, 25: 9, 30: 9 };
    try {
      setZoom(zoomMap[rad]);
    } catch {
      setZoom(10);
    }

    if (!isNaN(lat) && !isNaN(lng)) {
      setCoordinates({ lat: Number(lat), lng: Number(lng) });
    } else {
      console.error("Invalid latitude or longitude:", lat, lng);
    }

    console.log(lat, lng);
  };

  useEffect(() => {
    // Get the query params
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lng");
    const rad = searchParams.get("radius");

    // Set state with the values from the URL
    setLat(latitude);
    setLong(longitude);
    setRadius(rad);
    setMapDetails(rad, latitude, longitude);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://your-api-url.com/search?lat=${latitude}&lng=${longitude}&radius=${rad}`
        );
        const result = await response.json();
        setResults(result); // Store the response data in the state
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (latitude && longitude && rad) {
      //   fetchData();
      setTimeout(() => {
        setLoading(false);
      }, "1000");
    }
  }, [searchParams]);

  const handleScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [mapLoaded, setMapLoaded] = useState(false); // Track if the map is loaded

  const handleMapLoad = () => {
    setMapLoaded(true); // Mark the map as loaded when ready
  };

  return (
    <div>
      {loading ? (
        <div className="container-loading ">
          <div className="loader"></div>
          <p>fetching nearby hotels</p>
        </div>
      ) : (
        <div>
          <div>
            <LoadScript
              googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
              libraries={["places"]} // Load the places library
            >
              <GoogleMap
                key={mapKey}
                mapContainerStyle={mapContainerStyle}
                center={coordinates}
                zoom={zoom}
                options={options}
                className="map-details"
                onLoad={handleMapLoad}
              >
                {/* Marker at the selected location */}

                {mapLoaded &&
                  results?.map((e, i) => (
                    <MarkerF
                      key={i}
                      onClick={() => handleScroll(i)}
                      id={i}
                      position={{ lat: e.lat, lng: e.lng }}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: "#fa9152", // Change to desired color
                        fillOpacity: 1,
                        scale: 10, // Size of the marker
                        strokeColor: "#FFF", // Optional: border color
                        strokeWeight: 2, // Optional: border weight
                      }}
                    />
                  ))}

                {mapLoaded &&
                  results
                    ?.flatMap((e) => e.places)
                    .map((c, i) => (
                      <MarkerF
                        key={i}
                        id={i}
                        position={{ lat: c.lat, lng: c.lng }}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          fillColor: "#db4867", // Change to desired color
                          fillOpacity: 1,
                          scale: 10, // Size of the marker
                          strokeColor: "#FFF", // Optional: border color
                          strokeWeight: 2, // Optional: border weight
                        }}
                      />
                    ))}
              </GoogleMap>
            </LoadScript>
          </div>
          <div className="container-result">
            <div className="container-result-map">
              <div className="container-key">
                <div className="box-key">
                  Hotels: <div className="hotel-circle"></div>
                </div>
                <div className="box-key">
                  Places: <div className="place-circle"></div>
                </div>
              </div>

              <button className="button-find" onClick={() => navigate(`/`)}>
                Search more hotels
              </button>
            </div>
            {results?.map((e, i) => (
              <div className="box-result" key={i} id={i}>
                <div>
                  <h2>{e.name}</h2>
                  <p>
                    <b>Places: </b>
                    {e.places
                      .map((e) => {
                        return e.name;
                      })
                      .join(", ")}
                  </p>
                </div>

                <div className="container-compare">
                  <div
                    className="box-price"
                    style={{ backgroundColor: "lightgray" }}
                  >
                    <div>Actual</div>
                    <b>${e.actual}</b>
                  </div>
                  -
                  <div className="box-price">
                    <div>Predicted</div>
                    <b>${e.pred}</b>
                  </div>
                  =
                  <div
                    className="box-price"
                    style={{
                      backgroundColor: e.diff < 0 ? "coral" : "lightgreen",
                    }}
                  >
                    <div>Difference</div>
                    <b>${e.diff}</b>
                  </div>
                </div>
              </div>
            ))}

            {/* <h2>Location Search</h2>
      <p>Latitude: {lat}</p>
      <p>Longitude: {long}</p>
      <p>Radius: {radius} miles</p> */}
          </div>
        </div>
      )}
    </div>
  );
}

export default Find;
