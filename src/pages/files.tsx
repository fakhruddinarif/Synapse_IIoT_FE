import { useEffect, useState } from "react";
import {
  deleteFile,
  getUploadConfig,
  uploadMultipleFiles,
  uploadSingleFile,
} from "../api/files";
import type { FileUploadConfig } from "../@types/synapse";
import {
  Badge,
  Button,
  Field,
  Panel,
  SectionHeader,
  TextInput,
} from "../components/Ui";
import { TrashIcon, UploadIcon } from "../components/Icons";

const FilesPage = () => {
  const [config, setConfig] = useState<FileUploadConfig | null>(null);
  const [singleFile, setSingleFile] = useState<File | null>(null);
  const [multipleFiles, setMultipleFiles] = useState<File[]>([]);
  const [subDirectory, setSubDirectory] = useState("documents");
  const [deletePath, setDeletePath] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const response = await getUploadConfig();
        setConfig(response.data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSingleUpload = async () => {
    if (!singleFile) {
      return;
    }

    const response = await uploadSingleFile(singleFile, subDirectory || null);
    setMessage(response.message ?? "File uploaded");
  };

  const handleMultipleUpload = async () => {
    if (!multipleFiles.length) {
      return;
    }

    const response = await uploadMultipleFiles(
      multipleFiles,
      subDirectory || null,
    );
    setMessage(response.message ?? "Files uploaded");
  };

  const handleDelete = async () => {
    if (!deletePath) {
      return;
    }

    await deleteFile(deletePath);
    setMessage("File deleted");
  };

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-300">
        Loading file config...
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
      <Panel>
        <SectionHeader
          eyebrow="File"
          title="Kelola berkas"
          description="Unggah file, unggah banyak file, atau hapus file dengan mudah."
        />
        <div className="mt-5 grid gap-4">
          <Field label="Folder tujuan">
            <TextInput
              value={subDirectory}
              onChange={(event) => setSubDirectory(event.target.value)}
            />
          </Field>
          <Field label="Single file">
            <input
              type="file"
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-2xl file:border-0 file:bg-cyan-400/15 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-cyan-50 hover:file:bg-cyan-400/20"
              onChange={(event) =>
                setSingleFile(event.target.files?.[0] ?? null)
              }
            />
          </Field>
          <div className="flex gap-3">
            <Button onClick={() => void handleSingleUpload()}>
              <UploadIcon className="h-4 w-4" />
              Unggah file
            </Button>
          </div>
          <Field label="Beberapa file">
            <input
              multiple
              type="file"
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-2xl file:border-0 file:bg-violet-400/15 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-violet-50 hover:file:bg-violet-400/20"
              onChange={(event) =>
                setMultipleFiles(Array.from(event.target.files ?? []))
              }
            />
          </Field>
          <div className="flex gap-3">
            <Button onClick={() => void handleMultipleUpload()}>
              <UploadIcon className="h-4 w-4" />
              Unggah banyak
            </Button>
          </div>
          <Field
            label="Path file"
            hint="Gunakan path relatif dari folder upload."
          >
            <TextInput
              value={deletePath}
              onChange={(event) => setDeletePath(event.target.value)}
            />
          </Field>
          <div className="flex gap-3">
            <Button variant="danger" onClick={() => void handleDelete()}>
              <TrashIcon className="h-4 w-4" />
              Hapus file
            </Button>
          </div>
          {message ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {message}
            </div>
          ) : null}
        </div>
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Batas upload"
          title="Aturan file"
          description="Lihat jenis file yang diterima dan ukuran maksimum yang diizinkan."
        />
        <div className="mt-5 grid gap-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white">
              Jenis yang diterima
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {config?.allowedExtensions?.map((extension) => (
                <Badge key={extension} tone="accent">
                  {extension}
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Ukuran max
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {config?.maxFileSizeMB ?? 0} MB
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                Bytes
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                {config?.maxFileSize ?? 0}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-6 text-cyan-50/90">
            <p className="font-semibold text-white">Catatan</p>
            <p className="mt-2">
              Jika file gagal diunggah, cek jenis file dan ukuran maksimum
              terlebih dahulu.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default FilesPage;
