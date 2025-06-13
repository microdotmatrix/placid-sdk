"use client";

import { uploadFile } from "@/lib/api/actions";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function MediaUploader(props: { type: "url" | "file" }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, dispatch, isPending] = useActionState(uploadFile, {
    success: false,
    error: "",
  });

  useEffect(() => {
    if (state.success === false && state.error) {
      toast(state.error);
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={dispatch} className="mb-6">
      <div className="space-y-1">
        <Label>Upload (server {props.type})</Label>
        <Input
          name="files"
          multiple
          disabled={isPending}
          className="h-10 p-0 file:me-3 file:border-0 file:border-e"
          type={props.type === "file" ? "file" : "text"}
          onChange={() => {
            if (props.type === "file") {
              formRef.current?.requestSubmit();
              return;
            }
          }}
        />
      </div>

      <noscript>
        <Button type="submit" disabled={isPending}>
          {isPending ? "⏳" : `Upload (server ${props.type})`}
        </Button>
      </noscript>
    </form>
  );
}
