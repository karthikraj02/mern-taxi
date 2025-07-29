import React, { useState, useRef } from 'react';
import { LoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function LocationAutocomplete({ label, onPlaceSelected }) {
  const [inputValue, setInputValue] = useState('');
  const autocompleteRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address && place.geometry) {
      setInputValue(place.formatted_address);
      onPlaceSelected({
        address: place.formatted_address,
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      });
    }
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY" libraries={libraries}>
      <div>
        <label>{label}</label>
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder={`Enter ${label}`}
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            style={{ width: '100%', padding: '0.5em', marginTop: '0.25em' }}
          />
        </Autocomplete>
      </div>
    </LoadScript>
  );
}
