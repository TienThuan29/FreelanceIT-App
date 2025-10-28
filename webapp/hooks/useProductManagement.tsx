'use client';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import useAxios from './useAxios';
import { Api } from '@/configs/api';
import { Product, ProductStatus } from '@/types/product.type';

interface ProductLimitInfo {
  currentCount: number;
  maxAllowed: number;
  remaining: number;
  canAddMore: boolean;
}

interface CanAddProductResponse {
  canAdd: boolean;
  currentCount: number;
  maxAllowed: number;
  message?: string;
}

interface UseProductManagementReturn {
  products: Product[];
  myProducts: Product[];
  currentProduct: Product | null;
  limitInfo: ProductLimitInfo | null;
  canAddProduct: CanAddProductResponse | null;
  isLoading: boolean;
  error: string | null;
  
  // CRUD operations
  createProduct: (productData: Partial<Product>) => Promise<Product | null>;
  getProductById: (id: string) => Promise<Product | null>;
  getMyProducts: () => Promise<Product[]>;
  getAllProducts: () => Promise<Product[]>;
  getActiveProducts: () => Promise<Product[]>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  
  // Utility operations
  getProductLimitInfo: () => Promise<ProductLimitInfo | null>;
  checkCanAddProduct: () => Promise<CanAddProductResponse | null>;
  incrementViews: (id: string) => Promise<boolean>;
  
  // State management
  refreshMyProducts: () => Promise<void>;
  clearError: () => void;
  setCurrentProduct: (product: Product | null) => void;
}

export const useProductManagement = (): UseProductManagementReturn => {
  const axiosInstance = useAxios();
  const [state, setState] = useState({
    products: [] as Product[],
    myProducts: [] as Product[],
    currentProduct: null as Product | null,
    limitInfo: null as ProductLimitInfo | null,
    canAddProduct: null as CanAddProductResponse | null,
    isLoading: false,
    error: null as string | null,
  });

  const handleError = useCallback((error: any, operation: string) => {
    const errorMessage = error.response?.data?.message || error.message || `Failed to ${operation}`;
    setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
    toast.error(errorMessage);
    console.error(`Error ${operation}:`, error);
  }, []);

  // Create a new product
  const createProduct = useCallback(async (productData: Partial<Product>): Promise<Product | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.post(Api.Product.CREATE_PRODUCT, productData);
      
      if (response.data.success && response.data.dataResponse) {
        const newProduct = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          myProducts: [...prev.myProducts, newProduct],
          isLoading: false,
        }));
        toast.success('Tạo sản phẩm thành công!');
        return newProduct;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error: any) {
      handleError(error, 'create product');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Get product by ID
  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(`${Api.Product.GET_PRODUCT_BY_ID}/${id}`);
      
      if (response.data.success && response.data.dataResponse) {
        const product = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          currentProduct: product,
          isLoading: false,
        }));
        return product;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error: any) {
      handleError(error, 'get product');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Get my products (developer's products)
  const getMyProducts = useCallback(async (): Promise<Product[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Product.GET_MY_PRODUCTS);
      
      if (response.data.success && response.data.dataResponse) {
        const products = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          myProducts: products,
          isLoading: false,
        }));
        return products;
      }
      
      setState(prev => ({ ...prev, myProducts: [], isLoading: false }));
      return [];
    } catch (error: any) {
      handleError(error, 'get my products');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get all products
  const getAllProducts = useCallback(async (): Promise<Product[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Product.GET_ALL_PRODUCTS);
      
      if (response.data.success && response.data.dataResponse) {
        const products = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          products,
          isLoading: false,
        }));
        return products;
      }
      
      setState(prev => ({ ...prev, products: [], isLoading: false }));
      return [];
    } catch (error: any) {
      handleError(error, 'get all products');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Get active products (public)
  const getActiveProducts = useCallback(async (): Promise<Product[]> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Product.GET_ACTIVE_PRODUCTS);
      
      if (response.data.success && response.data.dataResponse) {
        const products = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          products,
          isLoading: false,
        }));
        return products;
      }
      
      setState(prev => ({ ...prev, products: [], isLoading: false }));
      return [];
    } catch (error: any) {
      handleError(error, 'get active products');
      return [];
    }
  }, [axiosInstance, handleError]);

  // Update product
  const updateProduct = useCallback(async (id: string, productData: Partial<Product>): Promise<Product | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.put(`${Api.Product.UPDATE_PRODUCT}/${id}`, productData);
      
      if (response.data.success && response.data.dataResponse) {
        const updatedProduct = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          myProducts: prev.myProducts.map(p => p.id === id ? updatedProduct : p),
          currentProduct: prev.currentProduct?.id === id ? updatedProduct : prev.currentProduct,
          isLoading: false,
        }));
        toast.success('Cập nhật sản phẩm thành công!');
        return updatedProduct;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error: any) {
      handleError(error, 'update product');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Delete product
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.delete(`${Api.Product.DELETE_PRODUCT}/${id}`);
      
      if (response.data.success) {
        setState(prev => ({
          ...prev,
          myProducts: prev.myProducts.filter(p => p.id !== id),
          currentProduct: prev.currentProduct?.id === id ? null : prev.currentProduct,
          isLoading: false,
        }));
        toast.success('Xóa sản phẩm thành công!');
        return true;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    } catch (error: any) {
      handleError(error, 'delete product');
      return false;
    }
  }, [axiosInstance, handleError]);

  // Get product limit info
  const getProductLimitInfo = useCallback(async (): Promise<ProductLimitInfo | null> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axiosInstance.get(Api.Product.GET_PRODUCT_LIMIT_INFO);
      
      if (response.data.success && response.data.dataResponse) {
        const limitInfo = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          limitInfo,
          isLoading: false,
        }));
        return limitInfo;
      }
      
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    } catch (error: any) {
      handleError(error, 'get product limit info');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Check if can add product
  const checkCanAddProduct = useCallback(async (): Promise<CanAddProductResponse | null> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      const response = await axiosInstance.get(Api.Product.CAN_ADD_PRODUCT);
      
      if (response.data.success && response.data.dataResponse) {
        const canAddInfo = response.data.dataResponse;
        setState(prev => ({
          ...prev,
          canAddProduct: canAddInfo,
        }));
        return canAddInfo;
      }
      
      return null;
    } catch (error: any) {
      handleError(error, 'check can add product');
      return null;
    }
  }, [axiosInstance, handleError]);

  // Increment product views
  const incrementViews = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await axiosInstance.post(`${Api.Product.INCREMENT_VIEWS}/${id}/view`);
      return response.data.success;
    } catch (error: any) {
      console.error('Error incrementing views:', error);
      return false;
    }
  }, [axiosInstance]);

  // Refresh my products
  const refreshMyProducts = useCallback(async (): Promise<void> => {
    await getMyProducts();
  }, [getMyProducts]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Set current product
  const setCurrentProduct = useCallback((product: Product | null) => {
    setState(prev => ({ ...prev, currentProduct: product }));
  }, []);

  return {
    products: state.products,
    myProducts: state.myProducts,
    currentProduct: state.currentProduct,
    limitInfo: state.limitInfo,
    canAddProduct: state.canAddProduct,
    isLoading: state.isLoading,
    error: state.error,
    createProduct,
    getProductById,
    getMyProducts,
    getAllProducts,
    getActiveProducts,
    updateProduct,
    deleteProduct,
    getProductLimitInfo,
    checkCanAddProduct,
    incrementViews,
    refreshMyProducts,
    clearError,
    setCurrentProduct,
  };
};

