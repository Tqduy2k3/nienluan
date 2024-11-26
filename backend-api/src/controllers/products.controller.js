// Function to create a new product
const productService = require('../services/products.service');
const ApiError = require('../api-error');
const JSend = require('../jsend');
/** async function createProduct(req, res) {
    const { P_name, P_price, P_description, P_image_url } = req.body;
    
    try {
        // Kiểm tra xem tên sản phẩm và giá có được cung cấp hay không
        if (!P_name || !P_price) {
            return res.status(400).json({
                status: 'fail',
                message: 'Product name and price are required.'
            });
        }
        const newProductdata = {
            P_name,
            P_price,
            P_description: P_description || '',
            P_image_url: P_image_url || ''
        };

        // Chèn sản phẩm mới vào cơ sở dữ liệu
        const newProduct = await productService.createProduct(newProductdata);

        // Trả về phản hồi thành công với dữ liệu sản phẩm mới
        return res.status(201).json({
            status: 'success',
            message: 'Product created successfully',
            data: {
                P_id: newProduct.P_ID,
                P_name: newProduct.P_name,
                P_price: newProduct.P_price,
                P_description: newProduct.P_description,
                P_image_url: newProduct.P_image_url
            }
        });
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Product cannot be created, please try again.'
        });
    }
}
*/
async function createProduct(req, res, next) {
    try {
        const product = await productService.createProduct1({
            ...req.body,
            P_image_url: req.file ? `${req.file.filename}` : null,
        });
        return res
            .status(201)
            .set({
                Location: `${req.baseUrl}/${product.P_id}`
            })
            .json(
                JSend.success({
                    product,
                })
            );
    }catch (error){
        console.log(error);
        return next(
            new ApiError(500, 'An Error occured while create the product')
        );
    }
}
// Function to get products by filters (optional)
/**async function getProductsByFilter(req, res, next) {
    let result = {
        products: [],
        metadata: {
            totalRecord: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        },
    };

    try {
        // Gọi hàm service để lấy dữ liệu sản phẩm theo bộ lọc
        const filters = {
            name: req.query.name,
            price: req.query.price,
            page: req.query.page || 1,
            limit: req.query.limit || 9,
        };
        result = await productService.getProductsByFilter(filters);
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'An error occurred while retrieving products'));
        }
    

    // Trả về dữ liệu cho client dưới dạng JSON
    return res.json({
        status: 'success',
        data: {
            products: result.products,
            metadata: result.metadata,
        },
    });
}
*/
async function getProduct(req, res, next) {
    const {P_id} = req.params;
    try {
        const product = await productService.getProductbyID(P_id)
        if (!product){
            return next(new ApiError(404, 'Product not found'));
        }
        return res.json(JSend.success({product}));
    }catch(error){
        console.log(error);
        return next(new ApiError(500,`Error retrieving product with id=${P_id}`));
    }
}
async function getProductsByFilter(req, res, next) {
    let result = {
        products: [], // Thay đổi từ "product" sang "products" cho nhất quán
        metadata: {
            totalRecords: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 9,
        },
    };

    try {
        result = await productService.getManyProducts(req.query);
    } catch (error) {
        console.error("Error fetching products:", error);
        
        // Kiểm tra lỗi validation
        if (error instanceof SomeValidationError) {
            return next(new ApiError(400, 'Invalid request parameters.'));
        }

        // Lỗi không xác định thì trả về 500
        return next(new ApiError(500, 'An error occurred while retrieving products.'));
    }

    return res.json(
        JSend.success({
            products: result.products, // Đảm bảo trả về 'products' thay vì 'contacts'
            metadata: result.metadata,
        })
    );
}



// Function to get a single product by ID
/** function getProduct(req, res) {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: 'Product ID is required.' });
    }

    knex('Products')
        .where({ P_ID: id })
        .first()
        .then(product => {
            if (!product) {
                return res.status(404).json({ error: 'Product not found.' });
            }
            res.json({ product });
        })
        .catch(error => res.status(500).json({ error: error.message }));
}
*/
// Function to update a product
async function updateProduct(req, res, next) {
    const productID = req.params.id;
    const { P_name, P_price, P_description, P_image_url } = req.body;

    try {
        const updateData = {};
        if (P_name) updateData.P_name = P_name;
        if (P_price) updateData.P_price = P_price;
        if (P_description) updateData.P_description = P_description;
        if (P_image_url) updateData.P_image_url = P_image_url;

        // Kiểm tra xem có trường nào để cập nhật không
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No data to update'
            });
        }

        const updatedProduct = await productService.updateProduct(productID, updateData); // Sửa tên hàm thành updateProduct
        if (updatedProduct) {
            return res.json({
                status: 'success',
                message: 'Sản phẩm được cập nhật thành công!', 
                data: updatedProduct
            });
        } else {
            return res.status(404).json({
                status: 'fail',
                message: 'Product not found'
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 'fail',
            message: 'An error occurred while updating the product'
        });
    }
}


// Function to delete a product
async function deleteProduct(req, res, next) {
    const { id } = req.params;
    try {
        const deleted = await productService.deleteProduct(id);
        if(!deleted) {
            return next(new ApiError(404, 'Product not found'));
        }
        return res.json(JSend.success());
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Could not delete product with id=${id}`));
    }
    
}


module.exports = {
    createProduct,
    getProductsByFilter,
    updateProduct,
    deleteProduct,
    getProduct,
};