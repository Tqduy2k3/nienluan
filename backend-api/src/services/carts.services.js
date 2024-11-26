const knex = require("../database/knex");
//const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
//const Paginator = require('./paginator');
//const getProdct = require("../services/products.service");
function cartsRepository() {
  return knex("cart");
}
function addingRepository() {
  return knex("Adding_Product");
}
async function createCart(cartData) {
  const newCartData = { U_id: cartData, C_id: cartData };
  //console.log(U_id);
  try {
    await cartsRepository().insert(newCartData).debug();
  } catch (error) {
    throw new Error("Cart creation failed: " + error.message);
  }
}
async function deleteCart(id) {
  const deleteCart = await cartsRepository().where("C_ID", id).first();
  if (!deleteCart) {
    return null;
  }
  await cartsRepository().where("C_ID", id).del();
  return deleteCart;
}
async function addProduct(Addingdata) {
  try {
    // Tạo đối tượng newdataAdding
    const newdataAdding = {
      C_id: Addingdata.C_ID,
      P_id: Addingdata.P_ID,
      AP_quantity: Addingdata.AP_quantity, // Chỉ sử dụng quantity
    };

    // Thêm sản phẩm vào bảng adding_product
    const getdataOld = await addingRepository()
      .where("C_id", newdataAdding.C_id)
      .where("P_id", newdataAdding.P_id)
      .select("AP_quantity")
      .debug();
    console.log(getdataOld);
    if (getdataOld.length === 0) {
      await addingRepository().insert(newdataAdding);
    } else {
      const updateData = { C_id: newdataAdding.C_id, P_id: newdataAdding.P_id };
      const newquantity =
        Number(newdataAdding.AP_quantity) + Number(getdataOld[0].AP_quantity);
      console.log("check", getdataOld[0].AP_quantity);
      await update_productOncart(updateData, newquantity);
    }
    // Lấy thông tin vừa thêm từ bảng products và adding_product
    const newAdding = await addingRepository()
      .select(
        "products.P_name",
        "products.P_price",
        "adding_product.AP_quantity"
      ) // Sử dụng P_price từ bảng products
      .innerJoin("products", "adding_product.P_id", "products.P_id")
      .where("adding_product.C_id", newdataAdding.C_id)
      .where("adding_product.P_id", newdataAdding.P_id)
      .first();
    const totalPrice = (newAdding.P_price * newAdding.AP_quantity).toFixed(2);

    return {
      status: "success",
      message: "Product added successfully",
      data: {
        P_name: newAdding.P_name,
        quantity: newAdding.AP_quantity,
        price: totalPrice,
      },
    };
  } catch (error) {
    console.error("Error adding product:", error); // Log error details
    return {
      status: "fail",
      message: "Cannot add product, please try again",
    };
  }
}

async function delete_productcart(dataDelete) {
  try {
    const deleted = await addingRepository()
      .where("P_id", dataDelete.P_ID)
      .where("C_id", dataDelete.C_ID)
      .first()
      .debug();
    if (!deleted) {
      throw new Error("no Product found from cart");
    }
    await addingRepository()
      .where("P_id", dataDelete.P_ID)
      .where("C_id", dataDelete.C_ID)
      .del()
      .debug();
    return deleted;
  } catch (error) {
    throw new Error("Delete failed: " + error.message);
  }
}
async function update_productOncart(updateData, AP_quantity) {
  try {
    const updateRows = await addingRepository()
      .where("C_id", updateData.C_id)
      .where("p_id", updateData.P_id)
      .update("AP_quantity", AP_quantity);
    if (updateRows === 0) {
      throw new Error("No product on cart");
    }
    const updated = await addingRepository()
      .where("C_id", updateData.C_id)
      .where("P_id", updateData.P_id)
      .first()
      .debug();
    return updated;
  } catch (error) {
    throw new Error("Data update failed: " + error.message);
  }
}
async function delete_productcartbyPid(id) {
  try {
    const product = await addingRepository().where("P_id", id).first(); // Kiểm tra sự tồn tại của sản phẩm
    if (!product) {
      throw new Error(`No product found with P_id: ${id}`);
    }
    await addingRepository().where("P_id", id).del().debug(); // Xóa nếu tồn tại
  } catch (error) {
    throw new Error(`Database delete failed for P_id ${id}: ${error.message}`);
  }
}

async function getProductsByCartId(C_id) {
  try {
    // Thực hiện truy vấn đến cơ sở dữ liệu để lấy sản phẩm theo Cart ID
    const cartItems = await addingRepository()
      .join("products", "adding_product.P_id", "=", "products.P_id")
      .select(
        "adding_product.P_id",
        "products.P_name",
        "adding_product.AP_quantity",
        "products.P_price",
        "products.P_image_url"
      )
      .where("adding_product.C_id", C_id);

    // Nếu không có sản phẩm nào trong giỏ hàng
    if (cartItems.length === 0) {
      return { products: [], totalPrice: 0 }; // Trả về mảng rỗng và tổng giá 0
    }

    // Tính tổng giá
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.P_price * item.AP_quantity; // Sử dụng item.price đã lấy từ join
    }, 0);

    return { products: cartItems, totalPrice }; // Trả về danh sách sản phẩm và tổng tiền
  } catch (error) {
    console.error(`Error fetching products from cart: ${error.message}`);
    throw error; // Ném lỗi lên để controller có thể xử lý
  }
}
async function totalproduct(C_id) {
  const total = await addingRepository()
    .sum("AP_quantity")
    .where("C_id", C_id)
    .groupBy("C_id")
    .debug();
  const totalNew = total[0] ? total[0]["sum(`AP_quantity`)"] : 0;
  console.log(totalNew);
  return totalNew;
}
module.exports = {
  createCart,
  deleteCart,
  addProduct,
  delete_productcart,
  update_productOncart,
  getProductsByCartId,
  totalproduct,
  addingRepository,
  delete_productcartbyPid,
};
