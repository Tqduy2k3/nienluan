import { DEFAULT_IMAGE } from '@/constants'; // Ensure you define a default image constant
/**
 * @param {string} url
 * @param {RequestInit} options
 * @returns Promise<Response>
 */
async function efetch(url, options = {}) {
  let result = {};
  let json = {};
  try {
    result = await fetch(url, options);
    json = await result.json();
  } catch (error) {
    throw new Error(error.message);
  }
  if (!result.ok || json.status !== 'success') {
    throw new Error(json.message);
  }
  return json.data;
}

function makeProductsService() {
  const baseUrl = '/api/v1/products';

  async function fetchProducts(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.products = data.products.map((product) => {
      return {
        ...product,
        P_image_url: product.P_image_url ?? DEFAULT_IMAGE // Use a default image if URL is missing
      };
    });
    return data;
  }

  async function fetchProduct(id) {
    const { product } = await efetch(`${baseUrl}/${id}`);
    return {
      ...product,
      P_image_url: product.P_image_url ?? DEFAULT_IMAGE
    };
  }

  async function createProduct(product) {
    // Assuming product is an object that includes the necessary fields
    return efetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify(product), // Ensure the body is properly formatted
      headers: {
        'Content-Type': 'application/json' // Add the content type header
      }
    });
  }

  async function updateProduct(id, product) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json' // Add the content type header
      }
    });
  }

  async function deleteProduct(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}

export default makeProductsService();
