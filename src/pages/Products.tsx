import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Chip,
  Alert,
  InputAdornment,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
} from "../store/slices/productSlice";
import { Product } from "../types";
import { addToCartAsync } from "../store/slices/cartSlice";
import { productsAPI } from "../services/api";
import debounce from "lodash/debounce";
import { useAppDispatch } from "../hooks/useAppDispatch";

const ITEMS_PER_PAGE = 12;
const SEARCH_DELAY = 500; // 500ms delay for server search

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const [searchTerm, setSearchTerm] = useState("");
  const [serverSearchTerm, setServerSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const { products, loading } = useSelector(
    (state: RootState) => state.products
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const fetchProducts = useCallback(async () => {
    try {
      dispatch(fetchProductsStart());
      const response = await productsAPI.getAll({
        category: category || undefined,
        search: serverSearchTerm || undefined,
        sort: sortBy,
        page,
        limit: ITEMS_PER_PAGE,
      });
      dispatch(fetchProductsSuccess(response.products));
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error fetching products";
      dispatch(fetchProductsFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setIsSearching(false);
    }
  }, [dispatch, category, serverSearchTerm, sortBy, page]);

  // Debounced server search function
  const debouncedServerSearch = useCallback(
    debounce((value: string) => {
      setServerSearchTerm(value);
      setPage(1); // Reset to first page when searching
    }, SEARCH_DELAY),
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    debouncedServerSearch(value);
  };

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      setError("Please log in to add items to your cart");
      return;
    }

    if (product.stock <= 0) {
      setError("This product is out of stock");
      return;
    }

    setIsAddingToCart(product._id);
    setError(null);
    setSuccessMessage(null);

    try {
      await dispatch(addToCartAsync(product, 1));
      setSuccessMessage("Product added to cart successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error adding item to cart. Please try again.";
      setError(errorMessage);
    } finally {
      setIsAddingToCart(null);
    }
  };

  // Local search and sort
  const filteredProducts = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    return [...products]
      .filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
      )
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "name":
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [products, searchTerm, sortBy]);

  if (loading && !searchTerm) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products{" "}
          {category &&
            `- ${category.charAt(0).toUpperCase() + category.slice(1)}`}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search products"
              value={searchTerm}
              onChange={handleSearchChange}
              variant="outlined"
              sx={{ bgcolor: "white" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: isSearching && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth variant="outlined" sx={{ bgcolor: "white" }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortBy}
                label="Sort by"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      {filteredProducts.length === 0 ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="40vh"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <Card sx={{ height: "100%" }}>
                  <Box className="product-image-container">
                    <CardMedia
                      component="img"
                      image={product.image}
                      alt={product.name}
                    />
                  </Box>
                  <CardContent>
                    <Typography
                      gutterBottom
                      variant="h6"
                      component={RouterLink}
                      to={`/products/${product._id}`}
                      sx={{
                        color: "text.primary",
                        textDecoration: "none",
                        "&:hover": { color: "primary.main" },
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {product.description}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" color="primary.main">
                        ${product.price.toFixed(2)}
                      </Typography>
                      <Chip
                        label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                        color={product.stock > 0 ? "success" : "error"}
                        size="small"
                      />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => handleAddToCart(product)}
                      disabled={
                        !isAuthenticated ||
                        product.stock === 0 ||
                        isAddingToCart === product._id
                      }
                    >
                      {!isAuthenticated
                        ? "Login to Buy"
                        : product.stock === 0
                        ? "Out of Stock"
                        : isAddingToCart === product._id
                        ? "Adding..."
                        : "Add to Cart"}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && !searchTerm && (
            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;
