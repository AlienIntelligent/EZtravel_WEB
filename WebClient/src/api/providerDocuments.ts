import apiClient from "./client";

export async function downloadProviderDocument(id: number, fileName: string) {
  const response = await apiClient.get(`/provider/documents/${id}/download`, {
    responseType: "blob",
  });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || `provider-document-${id}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
