import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, CircleF } from "@react-google-maps/api";
import { StandaloneSearchBox, MarkerF } from "@react-google-maps/api";
import "./Home.css";
import { useNavigate, useLocation } from "react-router-dom";
// import {AdvancedMarker} from '@vis.gl/react-google-maps';

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

function Home() {
  const [coordinates, setCoordinates] = useState(usCenter); // Store selected coordinates
  const [zoom, setZoom] = useState(4); // Set initial zoom
  const [searchedAddress, setSearchedAddress] = useState(""); // State for the searched address
  const searchBoxRef = useRef(null); // Reference to the search box
  const [radius, setRadius] = useState(5);
  const navigate = useNavigate();
  const [mapKey, setMapKey] = useState(1);

  const onPlacesChanged = () => {
    const places = searchBoxRef.current.getPlaces();
    if (places.length === 0) return;

    const place = places[0];
    if (!place.geometry || !place.geometry.location) {
      console.error("Place has no geometry.");
      return;
    }

    // Set map coordinates to the selected place
    const location = place.geometry.location;
    setCoordinates({ lat: location.lat(), lng: location.lng() }); // Update coordinates to the selected place

    const zoomMap = { 5: 11, 10: 10, 15: 9, 20: 9, 25: 9, 30: 9 };

    setZoom(zoomMap[radius]); // Zoom in to the place

    // Store the address in state
    setSearchedAddress(place.formatted_address || ""); // Use formatted_address if available
  };

  const handleRadiusChange = (event) => {
    const zoomMap = { 5: 11, 10: 10, 15: 9, 20: 9, 25: 9, 30: 9 };
    setZoom(zoomMap[event.target.value]); // Zoom in to the place
    setRadius(event.target.value); // Update the radius state with the selected value
  };

  const handleFindHotels = () => {
    navigate(
      `/find?lat=${coordinates.lat}&lng=${coordinates.lng}&radius=${radius}`
    );
  };

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div>
      {/* Google Map */}
      <div className="box-map">
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
          >
            {/* Marker at the selected location */}
            {searchedAddress.length > 0 && (
              <>
                <MarkerF
                  position={coordinates}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "rgb(113, 195, 222)", // Change to desired color
                    fillOpacity: 1,
                    scale: 10, // Size of the marker
                    strokeColor: "#FFF", // Optional: border color
                    strokeWeight: 2, // Optional: border weight
                  }}
                />
                <CircleF
                  center={coordinates}
                  radius={radius * MILES_TO_METERS} // Convert radius to meters
                  options={{
                    strokeColor: "#000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#000",
                    fillOpacity: 0.35,
                  }}
                />
              </>
            )}

            {/* This will place a marker at the searched coordinates */}
            {/* SearchBox - Link it to the input field */}
            <StandaloneSearchBox
              onLoad={(ref) => (searchBoxRef.current = ref)}
              onPlacesChanged={onPlacesChanged}
            >
              <input
                id="pac-input"
                type="text"
                placeholder="Search for a location"
                className="pac-input search-box"
                style={{
                  position: "absolute",
                  left: "50%",
                  marginLeft: "-250px",
                  marginTop: "5px",
                  width: "500px",
                  zIndex: "1",
                }}
              />
            </StandaloneSearchBox>
          </GoogleMap>
        </LoadScript>
      </div>
      {/* Display the selected coordinates and searched address */}
      <div className="container-info">
        <div className="find-box">
          <h3>Search above to find an address</h3>
          <div className="find-item">
            <h4>Searched Address</h4>
            <p>
              {searchedAddress.length === 0 ? "no address" : searchedAddress}
            </p>
          </div>

          {/* Radius selector */}
          <div className="find-item">
            <h4>Radius</h4>
            <p>
              <select
                name="radius"
                id="radius"
                value={radius}
                onChange={handleRadiusChange}
                className="find-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
                <option value={30}>30</option>
              </select>
              miles
            </p>
          </div>
          <button
            className="find-button"
            disabled={searchedAddress.length === 0}
            onClick={handleFindHotels}
          >
            Find Hotels
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
