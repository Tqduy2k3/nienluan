import { DEFAULT_AVATAR } from '@/constants';

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

function makeUsersService() {
  const baseUrl = '/api/v1/users';

  async function fetchUsers(page, limit = 10) {
    let url = `${baseUrl}?page=${page}&limit=${limit}`;
    const data = await efetch(url);
    data.users = data.users.map((user) => {
      return {
        ...user,
        avatar: user.avatar ?? DEFAULT_AVATAR
      };
    });

    return data;
  }

  async function fetchUser(id) {
    const { user } = await efetch(`${baseUrl}/${id}`);
    return {
      ...user,
      avatar: user.avatar ?? DEFAULT_AVATAR
    };
  }

  async function createUser(user) {
    return efetch(baseUrl, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function deleteAllUsers() {
    return efetch(baseUrl, {
      method: 'DELETE'
    });
  }

  async function updateUser(id, user) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async function deleteUser(id) {
    return efetch(`${baseUrl}/${id}`, {
      method: 'DELETE'
    });
  }

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    deleteAllUsers
  };
}

export default makeUsersService();
