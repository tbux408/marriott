import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript, CircleF } from "@react-google-maps/api";
import { StandaloneSearchBox, MarkerF } from "@react-google-maps/api";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const usCenter = {
  lat: 39.8283,
  lng: -98.5795,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};
const MILES_TO_METERS = 1609.34;

function Home() {
  const [coordinates, setCoordinates] = useState(usCenter);
  const [zoom, setZoom] = useState(4);
  const [searchedAddress, setSearchedAddress] = useState("");
  const searchBoxRef = useRef(null);
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

    const location = place.geometry.location;
    setCoordinates({ lat: location.lat(), lng: location.lng() });

    const zoomMap = {
      1: 11,
      2: 11,
      3: 11,
      4: 11,
      5: 11,
      10: 10,
      15: 9,
      20: 9,
      25: 9,
      30: 9,
    };
    setZoom(zoomMap[radius]);

    setSearchedAddress(place.formatted_address || "");
  };

  const handleRadiusChange = (event) => {
    const zoomMap = {
      1: 11,
      2: 11,
      3: 11,
      4: 11,
      5: 11,
      10: 10,
      15: 9,
      20: 9,
      25: 9,
      30: 9,
    };
    setZoom(zoomMap[event.target.value]);
    setRadius(event.target.value);
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
      <div className="box-map">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={["places"]}
        >
          <GoogleMap
            key={mapKey}
            mapContainerStyle={mapContainerStyle}
            center={coordinates}
            zoom={zoom}
            options={options}
          >
            {searchedAddress.length > 0 && (
              <>
                <MarkerF
                  position={coordinates}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: "rgb(113, 195, 222)",
                    fillOpacity: 1,
                    scale: 10,
                    strokeColor: "#FFF",
                    strokeWeight: 2,
                  }}
                />
                <CircleF
                  center={coordinates}
                  radius={radius * MILES_TO_METERS}
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
      <div className="container-info">
        <div className="find-box">
          <h3>Search above to find an address</h3>
          <div className="find-item">
            <h4>Searched Address</h4>
            <p>
              {searchedAddress.length === 0 ? "no address" : searchedAddress}
            </p>
          </div>

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
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
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
