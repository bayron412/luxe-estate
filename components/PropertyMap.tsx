"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import * as L from 'leaflet';
import 'leaflet-defaulticon-compatibility';

interface PropertyMapProps {
  location: string;
  lat: number;
  lng: number;
  className?: string;
}

export default function PropertyMap({ location, lat, lng, className = "h-[300px]" }: PropertyMapProps) {
  const center: [number, number] = [lat, lng];

  // Leaflet needs to render only on client
  return (
    <div className={`relative w-full rounded-lg overflow-hidden z-0 ${className}`}>
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Marker position={center}>
          <Popup>
            <div className="font-display font-medium text-nordic-dark">
              {location}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
