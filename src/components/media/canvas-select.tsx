"use client";

import { atom, useAtom } from "jotai";
import dynamic from "next/dynamic";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const templateUUIDAtom = atom<string>("");

function PlacidCanvasInner({
  accessToken,
  templates,
}: {
  accessToken: string;
  templates: {
    uuid: string;
    title: string;
    thumbnail: string;
  }[];
}) {
  const canvasRef = useRef(null); // <div> that hosts the canvas
  const canvasInstanceRef = useRef(null); // EditorSDK instance
  const [templateUUID, setTemplateUUID] = useAtom(templateUUIDAtom);
  const [layers, setLayers] = useState({
    name: "",
    portrait: "",
    epitaph: "",
    birth: "",
    death: "",
  });

  const initCanvas = () => {
    if (!window.EditorSDK || !canvasRef.current) return;
    canvasInstanceRef.current = window.EditorSDK.canvas.create(
      canvasRef.current,
      {
        access_token: accessToken,
        template_uuid: templateUUID,
      }
    );
  };
  const updateCanvas = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setTemplateUUID(e.currentTarget.value);
      initCanvas();
    },
    [templateUUID]
  );

  // 1️⃣ init once
  useEffect(() => {
    if (window?.EditorSDK && canvasRef.current) initCanvas();
    return () => {
      null;
    };
  }, []);

  // 2️⃣ when `layers` changes, push all of them in one go
  useEffect(() => {
    if (!canvasInstanceRef.current) return;
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
    return () => {
      canvasRef.current = null;
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
        {templates.map((template) => (
          <Button
            key={template.uuid}
            onClick={(e) => updateCanvas(e)}
            value={template.uuid}
          >
            {template.title}
          </Button>
        ))}
      </div>

      {/* Host element for Placid */}
      <div className="flex gap-2">
        <div
          ref={canvasRef}
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
