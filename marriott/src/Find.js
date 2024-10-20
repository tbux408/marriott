import { useNavigate, useSearchParams } from "react-router-dom";
import "./Find.css";
import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";

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

function Find() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState(usCenter);
  const [zoom, setZoom] = useState(4);
  const [mapKey, setMapKey] = useState(1);
  const [results, setResults] = useState([
    {
      name: "test",
      predictedPrice: 120,
      actualPrice: 500,
      diff: 380,
      latitude: 37.2699733,
      longitude: -80.4539393,
      marketTarget: "luxury",
      address: "703 Toms Creek",
      pois: [
        { name: "simons house", latitude: 37.2999733, longitude: -80.4539393 },
        { name: "test", latitude: 37.3699733, longitude: -80.4539393 },
      ],
    },
  ]);

  const setMapDetails = (rad, lat, lng) => {
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
    const latitude = searchParams.get("lat");
    const longitude = searchParams.get("lng");
    const rad = searchParams.get("radius");

    setMapKey((prevKey) => prevKey + 1);
    setMapDetails(rad, latitude, longitude);

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://localhost:5000/hotels?lat=${latitude}&lng=${longitude}&radius=${rad}`
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

  const [mapLoaded, setMapLoaded] = useState(false);
  const handleMapLoad = () => {
    setMapLoaded(true);
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
              libraries={["places"]}
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
                {mapLoaded &&
                  results?.map((e, i) => (
                    <MarkerF
                      key={i}
                      onClick={() => handleScroll(i)}
                      id={i}
                      position={{ lat: e.latitude, lng: e.longitude }}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: "#fa9152",
                        fillOpacity: 1,
                        scale: 10,
                        strokeColor: "#FFF",
                        strokeWeight: 2,
                      }}
                    />
                  ))}

                {mapLoaded &&
                  results
                    ?.flatMap((e) => e.pois)
                    .map((c, i) => (
                      <MarkerF
                        key={i}
                        id={i}
                        position={{ lat: c.latitude, lng: c.longitude }}
                        icon={{
                          path: window.google.maps.SymbolPath.CIRCLE,
                          fillColor: "#db4867",
                          fillOpacity: 1,
                          scale: 10,
                          strokeColor: "#FFF",
                          strokeWeight: 2,
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
                    <b>Points of Interest: </b>
                    {e.pois
                      .map((e) => {
                        return e.name;
                      })
                      .join(", ")}
                  </p>
                  <p>
                    <b>Market Target: </b>
                    {e.marketTarget}
                  </p>
                  <p>
                    <b>Address: </b>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        e.address
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {e.address}
                    </a>
                  </p>
                </div>

                <div className="container-compare">
                  <div className="box-price">
                    <div>Predicted</div>
                    <b>${e.predictedPrice}</b>
                  </div>
                  -
                  <div
                    className="box-price"
                    style={{ backgroundColor: "lightgray" }}
                  >
                    <div>Actual</div>
                    <b>${e.actualPrice}</b>
                  </div>
                  =
                  <div
                    className="box-price"
                    style={{
                      backgroundColor:
                        e.predictedPrice - e.actualPrice < 0
                          ? "coral"
                          : "lightgreen",
                    }}
                  >
                    <div>Difference</div>
                    <b>${e.predictedPrice - e.actualPrice}</b>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Find;
