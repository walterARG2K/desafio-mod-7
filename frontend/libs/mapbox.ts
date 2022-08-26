import { state } from "../state";
import mapboxgl from "mapbox-gl";
import * as MapboxClient from "mapbox";
var marker;
var map;
export class Mapbox {
    elementId;
    constructor(elementId) {
        this.elementId = elementId;
    }
    initMapbox() {
        let MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
        let mapboxClient = new MapboxClient(MAPBOX_TOKEN);
        const initMap = () => {
            mapboxgl.accessToken = MAPBOX_TOKEN;
            return new mapboxgl.Map({
                container: this.elementId,
                style: "mapbox://styles/walter1717/cl78pnutv003515lxvymz8hzo",
            });
        };

        function initSearchForm(callback) {
            const form = document.querySelector(".search-form");
            form!.addEventListener("submit", (e) => {
                e.preventDefault();
                mapboxClient.geocodeForward(
                    (e.target as any).q.value,
                    {
                        country: "ar",
                        autocomplete: true,
                        language: "es",
                    },
                    function (err, data, res) {
                        if (!err) callback(data.features);
                    }
                );
            });
        }

        (function () {
            map = initMap();
            initSearchForm(function (results) {
                const firstResult = results[0];
                const marker = new mapboxgl.Marker()
                    .setLngLat(firstResult.geometry.coordinates)
                    .addTo(map);
                map.setCenter(firstResult.geometry.coordinates);
                map.setZoom(14);
                const lat = firstResult.geometry.coordinates[1];
                const lng = firstResult.geometry.coordinates[0];
                state.setState({ lat, lng });
            });
            marker = new mapboxgl.Marker();
        })();
    }
}
export { marker, map };
