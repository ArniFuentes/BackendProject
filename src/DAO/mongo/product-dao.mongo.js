import HTTP_RESPONSES from "../../constants/http-responses.contant.js";
import Product from "../../models/product.model.js";

class ProductDAO {
  async getProducts(
    page = 1,
    limit = 10,
    sortOptions = {},
    filterOptions = {}
  ) {
    try {
      const options = {
        page: page,
        limit: limit,
        sort: sortOptions,
        lean: true,
      };

      const query = filterOptions;
      const result = await Product.paginate(query, options);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    try {
      const product = await Product.findById(productId);
      if (!product) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return product;
    } catch (error) {
      throw error;
    }
  }

  async createProduct(newProductInfo) {
    try {
      return await Product.create(newProductInfo);
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, updatedProductInfo) {
    try {
      const result = await Product.updateOne(
        { _id: productId },
        { $set: updatedProductInfo }
      );
      if (result.nModified === 0) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId) {
    try {
      const result = await Product.deleteOne({ _id: productId });
      if (result.deletedCount === 0) {
        throw new HttpError(
          HTTP_RESPONSES.NOT_FOUND,
          HTTP_RESPONSES.NOT_FOUND_CONTENT
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default ProductDAO;
