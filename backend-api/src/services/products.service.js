const knex = require("../database/knex");
const Paginator = require("./paginator");
function productRepository() {
  return knex("products");
}
function readproduct(payload) {
  return {
    P_name: payload.P_name,
    P_price: payload.P_price,
    P_description: payload.P_description,
    P_image_url: payload.P_image_url,
  };
}
async function createProduct1(payload) {
  const product = readproduct(payload);
  const [P_id] = await productRepository().insert(product);
  return { P_id, ...product };
}
async function createProduct(Productdata) {
  try {
    const [newProductID] = await productRepository().insert(Productdata);
    const newProduct = await productRepository()
      .select(["P_ID", "P_name", "P_price", "P_description", "P_image_url"])
      .where("P_ID", newProductID)
      .first()
      .debug();

    return newProduct;
  } catch (error) {
    throw new Error("Product creation failed: " + error.message);
  }
}
async function getManyProducts(query) {
  const { P_name, P_price, page = 1, limit = 9 } = query;
  console.log("P_name:", P_name);
  const paginator = new Paginator(page, limit);
  let results = await knex("products") // Sử dụng knex với tên bảng 'products'
    .where((builder) => {
      if (P_name) {
        builder.where("P_name", "like", `%${P_name}%`); // Sử dụng "like" cho phép lọc tương tự
      }
      if (P_price) {
        builder.where("P_price", P_price);
      }
    })
    .select(
      knex.raw("count(P_id) OVER() AS recordCount"),
      "P_id",
      "P_name",
      "P_price",
      "P_description",
      "P_image_url"
    )
    .limit(paginator.limit)
    .offset(paginator.offset)
    .debug(); // Debug SQL query

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });

  console.log(results);

  return {
    metadata: paginator.getMetadata(totalRecords),
    products: results, // Đổi 'contacts' thành 'products'
  };
}

async function getProductbyID(P_id) {
  return productRepository().where("P_id", P_id).select("*").first().debug();
}

async function getProductsByFilter(query) {
  const { name, price, page = 1, limit = 9 } = query;
  const paginator = new Paginator(page, limit);

  let results = await productRepository()
    .where((builder) => {
      // Điều kiện lọc theo tên sản phẩm (nếu có)
      if (name) {
        builder.where("P_name", "like", `%${name}%`);
      }
      // Điều kiện lọc theo giá sản phẩm (nếu có)
      if (price) {
        builder.where("P_price", "=", price);
      }
    })
    .select(
      knex.raw("count(P_ID) OVER() AS recordCount"),
      "P_ID",
      "P_name",
      "P_price",
      "P_description",
      "P_image_url"
    )
    .limit(paginator.limit)
    .offset(paginator.offset)
    .debug(); // Kiểm tra câu truy vấn

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });
  return {
    metadata: paginator.getMetadata(totalRecords),
    products: results,
  };
}

async function updateProduct(id, updateData) {
  try {
    // Cập nhật sản phẩm dựa trên P_ID
    const updatedRows = await productRepository()
      .where("P_ID", id)
      .update(updateData);
    if (updatedRows === 0) {
      throw new Error("No product found with the given ID");
    }
    const updatedProduct = await productRepository()
      .select(["P_ID", "P_name", "P_price", "P_description", "P_image_url"])
      .where("P_ID", id)
      .first();

    return updatedProduct;
  } catch (error) {
    throw new Error("Database update failed: " + error.message);
  }
}
async function deleteProduct(id) {
  try {
    const getcart = require("../services/carts.services");
    const deletedProduct = await productRepository().where("P_ID", id).first();
    if (!deletedProduct) {
      throw new Error("No product found with the given ID");
    }
    const deleteadding = await getcart
      .addingRepository()
      .where("P_id", id)
      .first();
    if (deleteadding) {
      await getcart.delete_productcartbyPid(id);
    }
    await productRepository().where("P_ID", id).del();
    return deletedProduct;
  } catch (error) {
    throw new Error("Database delete failed: " + error.message);
  }
}
async function getPrice(P_id) {
  try {
    const product = await productRepository()
      .select("P_price")
      .where("P_id", P_id)
      .first() // Lấy kết quả đầu tiên
      .debug();

    if (product) {
      return product.P_price; // Trả về giá sản phẩm
    } else {
      throw new Error("Product not found"); // Ném lỗi nếu không tìm thấy sản phẩm
    }
  } catch (error) {
    console.error("Error fetching product price:", error);
    throw error;
  }
}

module.exports = {
  createProduct,
  getProductsByFilter,
  updateProduct,
  deleteProduct,
  getPrice,
  readproduct,
  createProduct1,
  getManyProducts,
  getProductbyID,
  productRepository,
};
