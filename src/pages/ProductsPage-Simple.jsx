// Page des produits simplifiée pour ALMAS & DIMAS
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Star, 
  Heart, 
  ShoppingBag,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { productService } from '../services/productService';
import { useCart } from '../contexts/CartContext';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest'
  });

  const { addToCart } = useCart();

  const categories = [
    { id: '', name: 'Tous les produits' },
    { id: 'rings', name: 'Bagues' },
    { id: 'necklaces', name: 'Colliers' },
    { id: 'bracelets', name: 'Bracelets' },
    { id: 'earrings', name: 'Boucles d\'oreilles' }
  ];

  // Produits de démonstration avec images réalistes
  const demoProducts = [
    {
      _id: '1',
      name: 'Bague Solitaire Diamant',
      description: 'Bague solitaire en or blanc 18k avec diamant 1 carat',
      price: 2999,
      images: ['/images/products/ring1.jpg'],
      category: 'rings',
      rating: 4.9,
      reviews: 127
    },
    {
      _id: '2',
      name: 'Bague Topaze Impériale',
      description: 'Bague élégante avec topaze impériale et diamants',
      price: 1299,
      images: ['/images/products/ring2.jpg'],
      category: 'rings',
      rating: 4.8,
      reviews: 89
    },
    {
      _id: '3',
      name: 'Bague Moissanite Or Jaune',
      description: 'Bague de fiançailles en or jaune 18k avec moissanite',
      price: 899,
      images: ['/images/products/ring3.jpg'],
      category: 'rings',
      rating: 4.7,
      reviews: 156
    },
    {
      _id: '4',
      name: 'Collier Statement Or',
      description: 'Collier statement en or avec design géométrique',
      price: 599,
      images: ['/images/products/necklace1.jpg'],
      category: 'necklaces',
      rating: 4.6,
      reviews: 73
    },
    {
      _id: '5',
      name: 'Parure Sophia',
      description: 'Ensemble collier et boucles d\'oreilles assorties',
      price: 799,
      images: ['/images/products/necklace2.jpg'],
      category: 'necklaces',
      rating: 4.8,
      reviews: 92
    },
    {
      _id: '6',
      name: 'Collier Trèfle Or 21k',
      description: 'Collier pendentif trèfle en or 21k moderne',
      price: 1199,
      images: ['/images/products/necklace3.jpg'],
      category: 'necklaces',
      rating: 4.9,
      reviews: 64
    },
    {
      _id: '7',
      name: 'Bracelets Vague Amitié',
      description: 'Set de 2 bracelets vague or et argent',
      price: 149,
      images: ['/images/products/bracelet1.jpg'],
      category: 'bracelets',
      rating: 4.5,
      reviews: 203
    },
    {
      _id: '8',
      name: 'Bracelets Stack Or',
      description: 'Collection de bracelets empilables en or',
      price: 299,
      images: ['/images/products/bracelet2.jpg'],
      category: 'bracelets',
      rating: 4.7,
      reviews: 118
    },
    {
      _id: '9',
      name: 'Bracelets Plaqué Or',
      description: 'Bracelets tendance plaqués or 14k',
      price: 199,
      images: ['/images/products/bracelet3.jpg'],
      category: 'bracelets',
      rating: 4.6,
      reviews: 87
    }
  ];

  useEffect(() => {
    loadProducts();
  }, [filters]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Utiliser les produits de démonstration pour l'instant
      let filteredProducts = [...demoProducts];

      // Filtrer par catégorie
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }

      // Filtrer par recherche
      if (filters.search) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Filtrer par prix
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.price >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.price <= parseInt(filters.maxPrice));
      }

      // Trier
      switch (filters.sortBy) {
        case 'price-asc':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // newest - garder l'ordre par défaut
          break;
      }

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour l'URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const handleAddToCart = async (product) => {
    try {
      // For demo purposes, add the product directly to cart without API call
      const result = await addToCart(product._id, 1);
      if (result.success) {
        // Show success feedback (could add a toast notification here)
        console.log('Produit ajouté au panier avec succès');
      } else {
        console.error('Erreur lors de l\'ajout au panier:', result.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Bijoux
          </h1>
          <p className="text-xl text-gray-600">
            Découvrez notre collection de bijoux élégants et intemporels
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher un bijou..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Catégorie */}
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Tri */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux notés</option>
            </select>

            {/* Bouton filtres avancés */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filtres
            </Button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix minimum (€)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix maximum (€)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10000"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Résultats */}
        <div className="mb-6">
          <p className="text-gray-600">
            {products.length} produit{products.length > 1 ? 's' : ''} trouvé{products.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Grille de produits */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement des produits...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link to={`/products/${product._id}`}>
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = '/images/placeholder.jpg';
                      }}
                    />
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex items-center mb-2">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">({product.reviews})</span>
                  </div>
                  
                  <Link to={`/products/${product._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="p-2"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Message si aucun produit */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">Aucun produit trouvé</p>
            <Button onClick={() => {
              setFilters({ category: '', search: '', minPrice: '', maxPrice: '', sortBy: 'newest' });
              setSearchParams(new URLSearchParams());
            }}>
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

