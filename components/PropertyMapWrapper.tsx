"use client";

import dynamic from "next/dynamic";
import React from "react";

const PropertyMap = dynamic(() => import("./PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[300px] bg-slate-100 rounded-lg animate-pulse flex items-center justify-center">
      <span className="material-icons text-mosque/40 text-4xl">map</span>
    </div>
  ),
});

export default function PropertyMapWrapper(props: { location: string }) {
  return <PropertyMap {...props} />;
}
