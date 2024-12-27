import axios from 'axios';

const getProducts = async () => {
  const response = await axios.get('/api/products');
  return response.data;
};

const getProductById = async (productId: string) => {
  const response = await axios.get(`/api/products/${productId}`);
  return response.data;
};

const createProduct = async (productData: any) => {
  const response = await axios.post('/api/products', productData);
  return response.data;
};

export { getProducts, getProductById, createProduct };
