import { DEFAULT_IMAGE } from '@/constants'; // Ensure you define a default image constant

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

function makeOrdersService() {
  const baseUrl = '/api/v1/orders';

  async function fetchOrders(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.orders = data.orders.map((order) => {
      return {
        ...order
      };
    });
    return data;
  }

  async function fetchOrder(id) {
    const { order } = await efetch(`${baseUrl}/${id}`);
    return {
      ...order
    };
  }

  async function updateOrder(id, order) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
      headers: {
        'Content-Type': 'application/json' // Add the content type header
      }
    });
  }

  async function deleteOrder(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchOrders,
    fetchOrder,
    updateOrder,
    deleteOrder
  };
}

export default makeOrdersService();
