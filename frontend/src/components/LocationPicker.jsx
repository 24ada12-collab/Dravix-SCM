import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, CheckCircle2, Search, Loader2 } from 'lucide-react';
import Button from './Button';

// Fix Leaflet marker icon asset issue in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle clicks and center changes on the Leaflet map
function MapController({ position, setPosition, onLocationSelected }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationSelected) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  React.useEffect(() => {
    if (position && position[0] && position[1]) {
      map.flyTo(position, map.getZoom(), { duration: 1.2 });
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} />;
}

const LocationPicker = ({
  onLocationConfirm,
  initialLat = 19.9975,
  initialLng = 73.7898,
  title = 'Select Location on Interactive Map',
  subtitle = 'Search for a city/area, use your current location, or click anywhere on the map',
}) => {
  const [position, setPosition] = useState([initialLat, initialLng]);
  const [addressDetails, setAddressDetails] = useState({
    address: 'Near Agromarket, Trimbak Road',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422002',
  });
  const [locating, setLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  // Approximate reverse geocode via OpenStreetMap Nominatim lookup
  const fetchAddressDetails = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const district =
          addr.state_district || addr.county || addr.city || addr.town || addr.village || 'Nashik';
        const state = addr.state || 'Maharashtra';
        const pincode = addr.postcode || '422001';
        const full =
          data.display_name?.split(',').slice(0, 3).join(',') ||
          `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

        const updated = { address: full, district, state, pincode };
        setAddressDetails(updated);
        return updated;
      }
    } catch (e) {
      // Fallback
    }
    const fallback = {
      address: `Selected Coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      district: addressDetails.district || 'Nashik',
      state: addressDetails.state || 'Maharashtra',
      pincode: addressDetails.pincode || '422001',
    };
    setAddressDetails(fallback);
    return fallback;
  };

  const handleMarkerSelect = async (lat, lng) => {
    setConfirmed(false);
    await fetchAddressDetails(lat, lng);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError(null);
    setConfirmed(false);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lng = parseFloat(results[0].lon);
          setPosition([lat, lng]);

          const addr = results[0].address || {};
          const district =
            addr.state_district || addr.county || addr.city || addr.town || addr.village || searchQuery;
          const state = addr.state || 'India';
          const pincode = addr.postcode || '';
          const full =
            results[0].display_name?.split(',').slice(0, 3).join(',') || searchQuery;

          const updated = { address: full, district, state, pincode };
          setAddressDetails(updated);
        } else {
          setSearchError('Location not found. Try searching a district, city or landmark.');
        }
      } else {
        setSearchError('Search service temporarily unavailable.');
      }
    } catch (err) {
      setSearchError('Search failed. Please try again or click directly on the map.');
    } finally {
      setSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
      setConfirmed(false);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setPosition([lat, lng]);
          await fetchAddressDetails(lat, lng);
          setLocating(false);
        },
        () => {
          setLocating(false);
          alert('Could not retrieve current location. Please click anywhere on the map or search.');
        }
      );
    }
  };

  const handleConfirm = () => {
    setConfirmed(true);
    if (onLocationConfirm) {
      onLocationConfirm({
        latitude: position[0],
        longitude: position[1],
        address: addressDetails.address,
        district: addressDetails.district,
        state: addressDetails.state,
        pincode: addressDetails.pincode,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#A5D6A7] p-4 sm:p-5 space-y-4">
      {/* Header & Current Location button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#1B5E20] shrink-0" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              {title}
            </h4>
            <p className="text-[11px] text-gray-500">
              {subtitle}
            </p>
          </div>
        </div>

        <Button
          variant="outlineLight"
          size="sm"
          icon={Navigation}
          loading={locating}
          onClick={handleUseCurrentLocation}
          type="button"
        >
          {locating ? 'Locating...' : 'My Current Location'}
        </Button>
      </div>

      {/* Map Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search city, town, PIN code or district (e.g. Erode, Tamil Nadu)"
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#A5D6A7] focus:outline-none focus:ring-2 focus:ring-[#66BB6A] bg-white text-gray-800"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <Button
          variant="secondary"
          size="sm"
          type="submit"
          loading={searching}
          disabled={!searchQuery.trim()}
        >
          Search Map
        </Button>
      </form>
      {searchError && (
        <p className="text-[11px] text-red-600 font-medium">{searchError}</p>
      )}

      {/* Map Container */}
      <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[#A5D6A7] z-0 relative">
        <MapContainer
          center={position}
          zoom={12}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController
            position={position}
            setPosition={setPosition}
            onLocationSelected={handleMarkerSelect}
          />
        </MapContainer>
      </div>

      {/* Resolved Location Overview & Confirmation */}
      <div className="p-3.5 rounded-xl bg-[#E8F5E9]/60 border border-[#A5D6A7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-gray-700">
          <div className="font-semibold text-[#1B5E20] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#66BB6A]" />
            <span>Coordinates: {position[0].toFixed(5)}, {position[1].toFixed(5)}</span>
          </div>
          <p className="text-gray-600 text-[11px] mt-0.5">
            {addressDetails.address} • {addressDetails.district}, {addressDetails.state} {addressDetails.pincode ? `(${addressDetails.pincode})` : ''}
          </p>
        </div>

        <Button
          variant={confirmed ? 'secondary' : 'dark'}
          size="sm"
          icon={CheckCircle2}
          onClick={handleConfirm}
          type="button"
        >
          {confirmed ? 'Location Confirmed ✓' : 'Confirm Location'}
        </Button>
      </div>
    </div>
  );
};

export default LocationPicker;
