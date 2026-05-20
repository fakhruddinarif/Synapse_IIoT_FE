import { useEffect, useMemo, useState } from "react";
import { listDevices } from "../api/device";
import { createTag, deleteTag, listTags, updateTag } from "../api/tags";
import type { DataType, TagResponseDto } from "../@types/synapse";
import {
  Badge,
  Button,
  EmptyState,
  Field,
  Panel,
  Select,
  SectionHeader,
  TextInput,
} from "../components/Ui";
import {
  CheckIcon,
  EditIcon,
  PlusIcon,
  RefreshIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
} from "../components/Icons";

type TagEditorState = {
  deviceId: string;
  name: string;
  address: string;
  dataType: DataType;
  accessMode: "READONLY" | "READWRITE";
  rawMin: number;
  rawMax: number;
  euMin: number;
  euMax: number;
  unit: string;
  opcUaNodeId: string;
};

const DEFAULT_TAG_EDITOR: TagEditorState = {
  deviceId: "",
  name: "",
  address: "0",
  dataType: "FLOAT",
  accessMode: "READONLY",
  rawMin: 0,
  rawMax: 4095,
  euMin: 0,
  euMax: 100,
  unit: "",
  opcUaNodeId: "",
};

const TagsPage = () => {
  const [tags, setTags] = useState<TagResponseDto[]>([]);
  const [devices, setDevices] = useState<Array<{ id: string; name: string }>>(
    [],
  );
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editor, setEditor] = useState<TagEditorState>(DEFAULT_TAG_EDITOR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    try {
      const [tagResult, deviceResult] = await Promise.all([
        listTags({ page: 1, pageSize: 100 }),
        listDevices({ page: 1, pageSize: 100 }),
      ]);
      setTags(tagResult.data ?? []);
      setDevices(
        (deviceResult.data ?? []).map((device) => ({
          id: device.id,
          name: device.name,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  useEffect(() => {
    const selectedTag = tags.find((tag) => tag.id === selectedId);
    if (!selectedTag) {
      setEditor(DEFAULT_TAG_EDITOR);
      return;
    }

    setEditor({
      deviceId: selectedTag.deviceId,
      name: selectedTag.name,
      address: selectedTag.address,
      dataType: selectedTag.dataType,
      accessMode: selectedTag.accessMode,
      rawMin: selectedTag.rawMin,
      rawMax: selectedTag.rawMax,
      euMin: selectedTag.euMin,
      euMax: selectedTag.euMax,
      unit: selectedTag.unit ?? "",
      opcUaNodeId: selectedTag.opcUaNodeId ?? "",
    });
  }, [selectedId, tags]);

  const filteredTags = useMemo(
    () =>
      tags.filter((tag) =>
        `${tag.name} ${tag.address} ${tag.deviceId}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search, tags],
  );

  const saveTag = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const payload = {
        deviceId: editor.deviceId,
        name: editor.name,
        address: editor.address,
        dataType: editor.dataType,
        accessMode: editor.accessMode,
        rawMin: editor.rawMin,
        rawMax: editor.rawMax,
        euMin: editor.euMin,
        euMax: editor.euMax,
        unit: editor.unit || undefined,
        opcUaNodeId: editor.opcUaNodeId || undefined,
      };

      if (selectedId) {
        await updateTag(selectedId, payload);
        setMessage("Tag updated.");
      } else {
        await createTag(payload);
        setMessage("Tag created.");
      }

      await reload();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to save tag.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removeTag = async (tagId: string) => {
    if (!globalThis.confirm("Delete this tag?")) {
      return;
    }

    await deleteTag(tagId);
    setSelectedId(null);
    await reload();
  };

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center text-slate-300">
        Loading tags...
      </div>
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.95fr)]">
      <Panel>
        <SectionHeader
          eyebrow="Tag scaling"
          title="Tags"
          description="Definisi tag, scaling, dan access mode tersedia lewat endpoint backend."
          actions={
            <>
              <Button variant="secondary" onClick={() => setSelectedId(null)}>
                <PlusIcon className="h-4 w-4" />
                New tag
              </Button>
              <Button variant="secondary" onClick={reload}>
                <RefreshIcon className="h-4 w-4" />
                Reload
              </Button>
            </>
          }
        />
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <SearchIcon className="h-4 w-4 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
              placeholder="Search tags"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3">
          {filteredTags.length ? (
            filteredTags.map((tag) => (
              <div
                key={tag.id}
                className={`rounded-3xl border p-4 ${selectedId === tag.id ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-white/5"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {tag.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">{tag.address}</p>
                  </div>
                  <Badge tone={tag.isDeleted ? "danger" : "success"}>
                    {tag.isDeleted ? "Deleted" : "Active"}
                  </Badge>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-4">
                  <div>
                    <span className="block text-xs text-slate-400">Type</span>
                    {tag.dataType}
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Mode</span>
                    {tag.accessMode}
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Scale</span>
                    {tag.scalingFactor.toFixed(2)}
                  </div>
                  <div>
                    <span className="block text-xs text-slate-400">Unit</span>
                    {tag.unit ?? "-"}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedId(tag.id)}
                  >
                    <EditIcon className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => void removeTag(tag.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState
              title="No tags found"
              description="Buat tag baru untuk scaling dan address mapping."
              icon={<TagIcon className="h-7 w-7" />}
            />
          )}
        </div>
        {message ? (
          <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
            {message}
          </div>
        ) : null}
      </Panel>

      <Panel>
        <SectionHeader
          eyebrow="Tag editor"
          title={selectedId ? "Update tag" : "Create tag"}
          description="Semua field mengikuti DTO backend tag."
        />
        <div className="mt-5 grid gap-4">
          <Field label="Device">
            <Select
              value={editor.deviceId}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  deviceId: event.target.value,
                }))
              }
            >
              <option value="">Select device</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Name">
            <TextInput
              value={editor.name}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
            />
          </Field>
          <Field label="Address">
            <TextInput
              value={editor.address}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Data type">
              <Select
                value={editor.dataType}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    dataType: event.target.value as DataType,
                  }))
                }
              >
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="INT16">INT16</option>
                <option value="UINT16">UINT16</option>
                <option value="INT32">INT32</option>
                <option value="UINT32">UINT32</option>
                <option value="FLOAT">FLOAT</option>
                <option value="STRING">STRING</option>
              </Select>
            </Field>
            <Field label="Access mode">
              <Select
                value={editor.accessMode}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    accessMode: event.target.value as "READONLY" | "READWRITE",
                  }))
                }
              >
                <option value="READONLY">READONLY</option>
                <option value="READWRITE">READWRITE</option>
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Raw min">
              <TextInput
                type="number"
                value={editor.rawMin}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    rawMin: Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field label="Raw max">
              <TextInput
                type="number"
                value={editor.rawMax}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    rawMax: Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field label="EU min">
              <TextInput
                type="number"
                value={editor.euMin}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    euMin: Number(event.target.value),
                  }))
                }
              />
            </Field>
            <Field label="EU max">
              <TextInput
                type="number"
                value={editor.euMax}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    euMax: Number(event.target.value),
                  }))
                }
              />
            </Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Unit">
              <TextInput
                value={editor.unit}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    unit: event.target.value,
                  }))
                }
              />
            </Field>
            <Field label="OPC UA Node ID">
              <TextInput
                value={editor.opcUaNodeId}
                onChange={(event) =>
                  setEditor((current) => ({
                    ...current,
                    opcUaNodeId: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => void saveTag()} disabled={saving}>
              <CheckIcon className="h-4 w-4" />
              {saving ? "Saving..." : selectedId ? "Update tag" : "Create tag"}
            </Button>
            <Button variant="secondary" onClick={() => setSelectedId(null)}>
              Reset
            </Button>
          </div>
        </div>
      </Panel>
    </div>
  );
};

export default TagsPage;
