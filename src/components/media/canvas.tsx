"use client";

import dynamic from "next/dynamic";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";

function PlacidCanvasInner({
  accessToken,
  templateUUID,
}: {
  accessToken: string;
  templateUUID: string;
}) {
  const canvasRef = useRef(null); // <div> that hosts the canvas
  const canvasInstanceRef = useRef(null); // EditorSDK instance
  const canvasRef2 = useRef(null);
  const canvasInstanceRef2 = useRef(null);
  const [layers, setLayers] = useState({
    name: "",
    portrait: "",
    epitaph: "",
    birth: "",
    death: "",
  });

  const initCanvas = () => {
    if (!window.EditorSDK || !canvasRef.current || !canvasRef2.current) return;
    canvasInstanceRef.current = window.EditorSDK.canvas.create(
      canvasRef.current,
      {
        access_token: accessToken,
        template_uuid: templateUUID,
      }
    );
    canvasInstanceRef2.current = window.EditorSDK.canvas.create(
      canvasRef2.current,
      {
        access_token: accessToken,
        template_uuid: "vjufc92a1lfq9",
      }
    );
  };

  // 1️⃣ init once
  useEffect(() => {
    if (window?.EditorSDK && canvasRef.current) initCanvas();
    return () => {
      null;
    };
  }, []);

  // 2️⃣ when `layers` changes, push all of them in one go
  useEffect(() => {
    if (!canvasInstanceRef.current || !canvasInstanceRef2.current) return;
    canvasInstanceRef.current.fillLayers({
      name: {
        text: layers.name,
      },
      portrait: {
        image: layers.portrait,
      },
      epitaph: {
        text: layers.epitaph,
      },
      birth: {
        text: layers.birth,
      },
      death: {
        text: layers.death,
      },
    });
    canvasInstanceRef2.current.fillLayers({
      name: {
        text: layers.name,
      },
      portrait: {
        image: layers.portrait,
      },
      epitaph: {
        text: layers.epitaph,
      },
      birth: {
        text: layers.birth,
      },
      death: {
        text: layers.death,
      },
    });
    return () => {
      canvasRef.current = null;
      canvasRef2.current = null;
    };
  }, [layers]);

  // 3️⃣ update state only
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setLayers((prev) => ({ ...prev, [name]: value }));
    },
    [layers]
  );

  return (
    <>
      {/* Placid editor SDK – loaded only on the client, after hydration */}
      <Script
        src="https://sdk.placid.app/editor-sdk@latest/sdk.js"
        strategy="lazyOnload"
        onLoad={initCanvas}
      />

      <div className="flex gap-4">
        <Input
          type="text"
          name="name"
          placeholder="Enter name"
          value={layers.name}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="portrait"
          placeholder="Enter portrait URL"
          value={layers.portrait}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="epitaph"
          placeholder="Enter epitaph"
          value={layers.epitaph}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="birth"
          placeholder="Enter birth date"
          value={layers.birth}
          onChange={handleChange}
        />
        <Input
          type="text"
          name="death"
          placeholder="Enter death date"
          value={layers.death}
          onChange={handleChange}
        />
      </div>

      {/* Host element for Placid */}
      <div className="flex gap-2">
        <div
          ref={canvasRef}
          style={{ width: 500, height: 500 }} // adjust as needed
        />
        <div
          ref={canvasRef2}
          style={{ width: 500, height: 500 }} // adjust as needed
        />
      </div>
    </>
  );
}

/*  Export *without* server-side rendering because the SDK depends on `window` */
export default dynamic(() => Promise.resolve(PlacidCanvasInner), {
  ssr: false,
});
