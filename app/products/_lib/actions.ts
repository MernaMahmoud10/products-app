"use server";

import { API_URL } from "./api";
import { parseProduct, type ProductErrors } from "./validation";

export type SaveProductState = {
  status: "idle" | "error" | "success";
  message?: string;
  errors?: ProductErrors;
  values?: Record<string, string>;
  redirectTo?: string;
};

export async function saveProduct(
  _prevState: SaveProductState,
  formData: FormData,
): Promise<SaveProductState> {
  const id = formData.get("id");
  const isEdit = Boolean(id);
  const values = Object.fromEntries(formData) as Record<string, string>;

  const { data, errors } = parseProduct(formData);
  if (errors) {
    return { status: "error", message: "Please fix the errors below.", errors, values };
  }

  const res = await fetch(isEdit ? `${API_URL}/${id}` : `${API_URL}/add`, {
    method: isEdit ? "PUT" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    return {
      status: "error",
      message: `The server rejected the request (${res.status}). Please try again.`,
      values,
    };
  }

  const saved: { id: number; title: string } = await res.json();

  // DummyJSON only simulates writes: nothing is stored, so the products list and
  // detail pages will still show the original data.
  return {
    status: "success",
    message: isEdit
      ? `${saved.title} was updated.`
      : `${saved.title} was created with id ${saved.id}.`,
    redirectTo: isEdit ? `/products/${id}` : "/products",
  };
}

export type DeleteProductResult =
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export async function deleteProduct(
  productId: number,
): Promise<DeleteProductResult> {
  const res = await fetch(`${API_URL}/${productId}`, { method: "DELETE" });

  if (!res.ok) {
    return {
      status: "error",
      message: `The server rejected the request (${res.status}). Please try again.`,
    };
  }

  const deleted: { title: string } = await res.json();

  return { status: "success", message: `${deleted.title} was deleted.` };
}
