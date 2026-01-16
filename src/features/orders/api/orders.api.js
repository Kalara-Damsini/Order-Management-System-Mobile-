import { httpDelete, httpGet, httpPatch, httpPost, httpPostMultipart } from "../../../shared/api/http";

export async function getOrdersApi() {
  return httpGet("/orders");
}

export async function getOrderApi(id) {
  return httpGet(`/orders/${id}`);
}

export async function createOrderApi(payload) {
  return httpPost("/orders", payload);
}

export async function updateOrderApi(id, payload) {
  return httpPatch(`/orders/${id}`, payload);
}

export async function deleteOrderApi(id) {
  return httpDelete(`/orders/${id}`);
}

export async function uploadOrderProofApi(id, pickedAssets) {
  const formData = new FormData();

  pickedAssets.forEach((asset, idx) => {
    // asset from ImagePicker usually has: uri, fileName (sometimes), type (sometimes)
    const uri = asset.uri;
    const name =
      asset.fileName ||
      `proof_${Date.now()}_${idx}.jpg`;
    const type =
      asset.mimeType || asset.type || "image/jpeg";

    formData.append("files", { uri, name, type });
  });

  return httpPostMultipart(`/orders/${id}/proof`, formData);
}
