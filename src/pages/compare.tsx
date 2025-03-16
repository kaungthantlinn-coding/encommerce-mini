import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XMarkIcon, PlusIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useCartStore } from '@/stores/cartStore';
import { toast } from 'react-hot-toast';

// Mock product data for demonstration
interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
  features?: {
    [key: string]: string | number | boolean;
  };
}

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Fjallraven - Foldsack No. 1 Backpack',
    price: 109.95,
    description: 'Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg',
    rating: {
      rate: 4.5,
      count: 120
    },
    features: {
      material: 'Canvas',
      waterproof: true,
      capacity: '20L',
      weight: '500g',
      dimensions: '40 x 30 x 15 cm',
      color: 'Brown',
      warranty: '2 years'
    }
  },
  {
    id: 2,
    title: 'Mens Casual Premium Slim Fit T-Shirts',
    price: 22.3,
    description: 'Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg',
    rating: {
      rate: 4.1,
      count: 259
    },
    features: {
      material: 'Cotton',
      waterproof: false,
      weight: '200g',
      dimensions: 'M size',
      color: 'Blue',
      warranty: '30 days'
    }
  },
  {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description: 'Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: {
      rate: 4.7,
      count: 500
    },
    features: {
      material: 'Cotton',
      waterproof: true,
      weight: '800g',
      dimensions: 'L size',
      color: 'Black',
      warranty: '1 year'
    }
  },
  {
    id: 4,
    title: 'Mens Casual Slim Fit',
    price: 15.99,
    description: 'The color could be slightly different between on the screen and in practice. / Please note that body builds vary by person, therefore, detailed size information should be reviewed below on the product description.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg',
    rating: {
      rate: 3.9,
      count: 120
    },
    features: {
      material: 'Polyester',
      waterproof: false,
      weight: '150g',
      dimensions: 'S size',
      color: 'White',
      warranty: '30 days'
    }
  }
];

export function Compare() {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCartStore();
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [allFeatures, setAllFeatures] = useState<string[]>([]);

  useEffect(() => {
    // Get product IDs from URL params
    const productIds = searchParams.get('ids')?.split(',').map(Number) || [];
    
    // Filter products that match the IDs
    const productsToCompare = mockProducts.filter(product => 
      productIds.includes(product.id)
    );
    
    // Set products to compare
    setCompareProducts(productsToCompare);
    
    // Set available products (those not being compared)
    setAvailableProducts(mockProducts.filter(product => 
      !productIds.includes(product.id)
    ));
    
    // Collect all unique feature keys from all products
    const featureKeys = new Set<string>();
    mockProducts.forEach(product => {
      if (product.features) {
        Object.keys(product.features).forEach(key => featureKeys.add(key));
      }
    });
    
    setAllFeatures(Array.from(featureKeys));
  }, [searchParams]);

  const handleAddProduct = () => {
    if (selectedProductId) {
      const productToAdd = mockProducts.find(p => p.id === selectedProductId);
      if (productToAdd) {
        // Add product to compare list
        setCompareProducts([...compareProducts, productToAdd]);
        
        // Remove from available products
        setAvailableProducts(availableProducts.filter(p => p.id !== selectedProductId));
        
        // Update URL with new product IDs
        const newIds = [...compareProducts.map(p => p.id), selectedProductId].join(',');
        window.history.replaceState(null, '', `/compare?ids=${newIds}`);
        
        // Reset selection
        setSelectedProductId(null);
      }
    }
  };

  const handleRemoveProduct = (productId: number) => {
    // Remove product from compare list
    const removedProduct = compareProducts.find(p => p.id === productId);
    setCompareProducts(compareProducts.filter(p => p.id !== productId));
    
    // Add back to available products if it exists
    if (removedProduct) {
      setAvailableProducts([...availableProducts, removedProduct]);
    }
    
    // Update URL with new product IDs
    const newIds = compareProducts.filter(p => p.id !== productId).map(p => p.id).join(',');
    if (newIds) {
      window.history.replaceState(null, '', `/compare?ids=${newIds}`);
    } else {
      window.history.replaceState(null, '', `/compare`);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image
    });
    toast.success(`${product.title} added to cart`);
  };

  // Function to render feature value with appropriate formatting
  const renderFeatureValue = (product: Product, feature: string) => {
    if (!product.features) return '-';
    
    const value = product.features[feature];
    
    if (value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Compare Products</h1>
      
      {compareProducts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">No products to compare</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Select products to compare their features side by side.
          </p>
          <div className="mt-6">
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Products
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Add product dropdown */}
          <div className="mb-8 flex items-end space-x-4">
            <div className="flex-1">
              <label htmlFor="add-product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Add another product to compare
              </label>
              <select
                id="add-product"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
              >
                <option value="">Select a product</option>
                {availableProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddProduct}
              disabled={!selectedProductId}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add to Compare
            </button>
          </div>
          
          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800 sticky left-0 z-10">
                    Feature
                  </th>
                  {compareProducts.map((product) => (
                    <th key={product.id} scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <span>{product.title}</span>
                        <button
                          onClick={() => handleRemoveProduct(product.id)}
                          className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                          <XMarkIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {/* Image row */}
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    Image
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="h-40 flex items-center justify-center">
                        <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Price row */}
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    Price
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
                    </td>
                  ))}
                </tr>
                
                {/* Rating row */}
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    Rating
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <svg
                              key={rating}
                              className={`h-5 w-5 ${
                                rating < Math.floor(product.rating.rate)
                                  ? 'text-yellow-400'
                                  : rating === Math.floor(product.rating.rate) && product.rating.rate % 1 > 0
                                  ? 'text-yellow-400'
                                  : 'text-gray-300 dark:text-gray-600'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2">{product.rating.rate} ({product.rating.count})</span>
                      </div>
                    </td>
                  ))}
                </tr>
                
                {/* Description row */}
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    Description
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      {product.description}
                    </td>
                  ))}
                </tr>
                
                {/* Feature rows */}
                {allFeatures.map((feature) => (
                  <tr key={feature}>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10 capitalize">
                      {feature}
                    </td>
                    {compareProducts.map((product) => (
                      <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                        {renderFeatureValue(product, feature)}
                      </td>
                    ))}
                  </tr>
                ))}
                
                {/* Add to cart row */}
                <tr>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    Actions
                  </td>
                  {compareProducts.map((product) => (
                    <td key={product.id} className="py-4 px-6 text-sm text-gray-500 dark:text-gray-400">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <ShoppingCartIcon className="h-5 w-5 mr-2" />
                        Add to Cart
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 