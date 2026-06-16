"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRenderRequest } from "@/lib/generation/queue";
import {
  ACCEPTED_UPLOAD_ACCEPT,
  createPreviewUrlFromFile,
  getPersistedBeforeImageUrl,
  getRoomUploadMeta,
  persistRoomUpload,
  persistSampleRoomUpload,
  SAMPLE_ROOM_SRC,
  validateRoomUploadFile,
} from "@/lib/room-upload-store";
import { syncRoomUploadToServer } from "@/lib/room-upload-server-sync";
import { uploadStyleOptions, type UploadStyleId } from "@/lib/upload-styles";

type UploadStatus = "idle" | "uploading" | "success" | "error";

export function UploadRoomClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadSectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<string | null>(null);
  const sampleAppliedRef = useRef(false);
  const hydratedRef = useRef(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<UploadStyleId>("modern");
  const [dragOver, setDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isStartingGeneration, setIsStartingGeneration] = useState(false);

  const revokePreview = useCallback((url: string | null) => {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  }, []);

  previewRef.current = preview;

  useEffect(() => {
    return () => revokePreview(previewRef.current);
  }, [revokePreview]);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    void (async () => {
      const meta = getRoomUploadMeta();
      if (!meta) return;

      const url = await getPersistedBeforeImageUrl();
      if (!url) return;

      setPreview((prev) => {
        revokePreview(prev);
        return url;
      });
      setFileName(meta.fileName);
      setUploadStatus("success");
    })();
  }, [revokePreview]);

  useEffect(() => {
    if (searchParams.get("sample") !== "1" || sampleAppliedRef.current) return;
    sampleAppliedRef.current = true;

    void (async () => {
      setUploadStatus("uploading");
      setUploadError(null);
      try {
        const record = await persistSampleRoomUpload();
        await syncRoomUploadToServer(record);
        setPreview((prev) => {
          revokePreview(prev);
          return SAMPLE_ROOM_SRC;
        });
        setFileName(record.fileName);
        setUploadStatus("success");
      } catch {
        setUploadStatus("error");
        setUploadError("Unable to load the sample room.");
      }
    })();
  }, [searchParams, revokePreview]);

  const handleFile = useCallback(
    async (file: File) => {
      const validation = validateRoomUploadFile(file);
      if (!validation.ok) {
        setUploadStatus("error");
        setUploadError(validation.error);
        return;
      }

      setUploadStatus("uploading");
      setUploadError(null);

      const immediatePreview = createPreviewUrlFromFile(file);
      setPreview((prev) => {
        revokePreview(prev);
        return immediatePreview;
      });
      setFileName(file.name);

      try {
        const record = await persistRoomUpload(file);
        await syncRoomUploadToServer(record);
        setFileName(record.fileName);
        setUploadStatus("success");
      } catch (error) {
        revokePreview(immediatePreview);
        setPreview((prev) => (prev === immediatePreview ? null : prev));
        setFileName(null);
        setUploadStatus("error");
        setUploadError(
          error instanceof Error ? error.message : "Upload failed. Please try again.",
        );
      }
    },
    [revokePreview],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const useSampleRoom = () => {
    void (async () => {
      setUploadStatus("uploading");
      setUploadError(null);
      try {
        const record = await persistSampleRoomUpload();
        await syncRoomUploadToServer(record);
        setPreview((prev) => {
          revokePreview(prev);
          return SAMPLE_ROOM_SRC;
        });
        setFileName(record.fileName);
        setUploadStatus("success");
      } catch {
        setUploadStatus("error");
        setUploadError("Unable to load the sample room.");
      }
    })();
  };

  const onGenerate = async () => {
    if (!preview || uploadStatus !== "success" || isStartingGeneration) return;

    setIsStartingGeneration(true);
    try {
      const persistedUrl = await getPersistedBeforeImageUrl();
      if (persistedUrl && persistedUrl !== preview) {
        setPreview((prev) => {
          revokePreview(prev);
          return persistedUrl;
        });
      }

      const job = await createRenderRequest(selectedStyle);
      router.push(`/dashboard/generate/${job.id}`);
    } catch (error) {
      setIsStartingGeneration(false);
      window.alert(
        error instanceof Error ? error.message : "Unable to start generation.",
      );
    }
  };

  const isUploading = uploadStatus === "uploading";
  const canGenerate =
    Boolean(preview) && uploadStatus === "success" && !isUploading && !isStartingGeneration;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
      <section ref={uploadSectionRef} className="space-y-4 scroll-mt-28">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`premium-frame relative flex min-h-[280px] flex-col items-center justify-center rounded-2xl p-6 transition sm:min-h-[340px] sm:rounded-3xl sm:p-8 ${
            dragOver
              ? "border-gold/40 bg-gold/5"
              : "bg-surface-elevated/30 hover:border-gold/25"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_UPLOAD_ACCEPT}
            className="sr-only"
            disabled={isUploading || isStartingGeneration}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
              e.target.value = "";
            }}
          />

          {preview ? (
            <figure className="relative h-52 w-full overflow-hidden rounded-xl sm:h-64">
              <Image
                src={preview}
                alt="Room upload preview"
                fill
                className="object-cover"
                unoptimized={preview.startsWith("blob:")}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
                  <p className="rounded-full border border-gold/30 bg-background/90 px-4 py-2 text-xs font-medium text-gold">
                    Uploading...
                  </p>
                </div>
              )}
            </figure>
          ) : (
            <>
              <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <svg
                  className="h-8 w-8 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              </span>
              <p className="text-center font-medium text-foreground">Drag & drop your room photo</p>
              <p className="mt-1 text-center text-sm text-muted">
                JPG, PNG, or WEBP · up to 10MB
              </p>
            </>
          )}

          <div className="mt-6 flex w-full max-w-xs flex-col gap-2 sm:flex-row sm:max-w-none sm:justify-center">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={isUploading || isStartingGeneration}
              className="btn-primary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
            >
              {preview ? "Change Photo" : "Choose File"}
            </button>
            <button
              type="button"
              onClick={useSampleRoom}
              disabled={isUploading || isStartingGeneration}
              className="btn-secondary w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
            >
              Use Sample Room
            </button>
          </div>
          {fileName && (
            <p className="mt-3 max-w-full truncate text-xs text-muted">{fileName}</p>
          )}
          {uploadStatus === "uploading" && !preview && (
            <p className="mt-2 text-xs font-medium text-gold">Uploading...</p>
          )}
          {uploadStatus === "success" && (
            <p className="mt-2 text-xs font-medium text-gold-light">Upload successful</p>
          )}
          {uploadStatus === "error" && uploadError && (
            <p className="mt-2 max-w-sm text-center text-xs text-red-300/90">{uploadError}</p>
          )}
        </div>
      </section>

      <aside className="flex flex-col gap-6">
        <div className="premium-frame rounded-2xl bg-surface-elevated/50 p-6 sm:rounded-3xl sm:p-8">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-semibold">
            Design style
          </h2>
          <p className="mt-1 text-sm text-muted">
            Choose a direction for your AI visualization.
          </p>

          <ul className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {uploadStyleOptions.map((style) => (
              <li key={style.id}>
                <button
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                    selectedStyle === style.id
                      ? "border-gold/50 bg-gold/10 shadow-inner shadow-gold/5"
                      : "border-border bg-background/40 hover:border-gold/25"
                  }`}
                >
                  <span className="block text-sm font-semibold text-foreground">
                    {style.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{style.description}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          disabled={!canGenerate}
          onClick={() => void onGenerate()}
          className="btn-primary w-full py-4 text-base disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isStartingGeneration ? "Starting generation…" : "Generate Design"}
        </button>

        <Link
          href="/dashboard"
          className="text-center text-sm text-muted transition hover:text-gold-light"
        >
          ← Back to dashboard
        </Link>
      </aside>
    </div>
  );
}
