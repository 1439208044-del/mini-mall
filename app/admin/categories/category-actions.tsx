"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryActionsProps {
  mode: "create";
  category?: undefined;
}

interface CategoryEditProps {
  mode: "edit";
  category: { id: string; name: string; slug: string };
}

export function CategoryActions(props: CategoryActionsProps | CategoryEditProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(props.mode === "edit" ? props.category.name : "");
  const [slug, setSlug] = useState(props.mode === "edit" ? props.category.slug : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isCreate = props.mode === "create";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();

    if (!isCreate) {
      formData.append("id", props.category.id);
    }
    formData.append("name", name);
    formData.append("slug", slug);

    const { createCategory, updateCategory } = await import(
      "@/lib/actions/categories"
    );
    const result = isCreate
      ? await createCategory(formData)
      : await updateCategory(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
      if (isCreate) {
        setName("");
        setSlug("");
      } else {
        setEditing(false);
      }
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this category?")) return;
    setLoading(true);
    const { deleteCategory } = await import("@/lib/actions/categories");
    const result = await deleteCategory(isCreate ? "" : props.category.id);
    if (result?.error) {
      alert(result.error);
    }
    router.refresh();
    setLoading(false);
  }

  if (!isCreate && !editing) {
    return (
      <div className="flex items-center justify-between py-2 border-b border-(--color-border) last:border-0">
        <div>
          <span className="font-medium text-sm">{props.category.name}</span>
          <span className="text-xs text-(--color-muted) ml-2">
            /{props.category.slug}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <span className="text-(--color-danger)">Delete</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {error && (
        <div className="bg-red-50 text-(--color-danger) text-xs rounded-lg px-3 py-2">
          {error}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="flex-1"
        />
        <Input
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="flex-1"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading} size="sm">
          {loading ? "Saving..." : isCreate ? "Add" : "Save"}
        </Button>
        {!isCreate && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
