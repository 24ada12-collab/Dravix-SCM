import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, CheckCircle2 } from 'lucide-react';
import Button from './Button';

// Fix Leaflet marker icon asset issue in React/Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to handle clicks on the Leaflet map
function LocationMarker({ position, setPosition, onLocationSelected }) {
  useMapEvents({
    click(e) {
      const newPos = [e.latlng.lat, e.latlng.lng];
      setPosition(newPos);
      if (onLocationSelected) {
        onLocationSelected(e.latlng.lat, e.latlng.lng);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} />
  );
}

const LocationPicker = ({ onLocationConfirm, initialLat = 19.9975, initialLng = 73.7898 }) => {
  const [position, setPosition] = useState([initialLat, initialLng]);
  const [addressDetails, setAddressDetails] = useState({
    address: 'Near Agromarket, Trimbak Road',
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422002',
  });
  const [locating, setLocating] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  // Approximate reverse geocode simulation or OpenStreetMap Nominatim lookup
  const fetchAddressDetails = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
        headers: { 'Accept-Language': 'en' },
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const district = addr.state_district || addr.county || addr.city || 'Nashik';
        const state = addr.state || 'Maharashtra';
        const pincode = addr.postcode || '422001';
        const full = data.display_name?.split(',').slice(0, 3).join(',') || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;

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

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setLocating(true);
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
          alert('Could not retrieve current location. Please click anywhere on the map to set your location.');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#1B5E20]" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1B5E20]">
              Select Farm Location on Interactive Map
            </h4>
            <p className="text-[11px] text-gray-500">
              Click anywhere on the map to drop your farm pin
            </p>
          </div>
        </div>

        <Button
          variant="outlineLight"
          size="sm"
          icon={Navigation}
          loading={locating}
          onClick={handleUseCurrentLocation}
        >
          {locating ? 'Locating...' : 'My Location'}
        </Button>
      </div>

      {/* Map Container */}
      <div className="h-64 sm:h-72 w-full rounded-xl overflow-hidden border border-[#A5D6A7] z-0 relative">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
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
            {addressDetails.address} • {addressDetails.district}, {addressDetails.state} ({addressDetails.pincode})
          </p>
        </div>

        <Button
          variant={confirmed ? 'secondary' : 'dark'}
          size="sm"
          icon={CheckCircle2}
          onClick={handleConfirm}
        >
          {confirmed ? 'Location Confirmed ✓' : 'Confirm Location'}
        </Button>
      </div>
    </div>
  );
};

export default LocationPicker;
