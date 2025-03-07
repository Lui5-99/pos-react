import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardMedia,
  Chip,
  Divider,
  Paper,
} from "@mui/material";
import { ShoppingCart as CartIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { addToCart } from "../store/slices/cartSlice";
import { Product } from "../types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products } = useSelector((state: RootState) => state.products);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    if (!product) {
      navigate("/products");
    }
  }, [product, navigate]);

  if (!product) {
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setError("Please log in to add items to your cart");
      return;
    }

    if (quantity > product.stock) {
      setError("Not enough stock available");
      return;
    }

    dispatch(addToCart({ product, quantity }));
    setError("");
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={0} sx={{ p: 4, mt: 4, bgcolor: "transparent" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="500"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Box
                sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}
              >
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${product.price.toFixed(2)}
                </Typography>
                <Chip
                  label={product.stock > 0 ? "In Stock" : "Out of Stock"}
                  color={product.stock > 0 ? "success" : "error"}
                />
              </Box>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="body1"
                paragraph
                sx={{ color: "text.secondary" }}
              >
                {product.description}
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Category
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ textTransform: "capitalize" }}
                >
                  {product.category}
                </Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  Available Stock
                </Typography>
                <Typography variant="body1">{product.stock} units</Typography>
              </Box>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {addedToCart && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Product added to cart successfully!
                </Alert>
              )}
              <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
                <TextField
                  type="number"
                  label="Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, max: product.stock }}
                  sx={{ width: 100 }}
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || !isAuthenticated}
                  startIcon={<CartIcon />}
                  sx={{ flexGrow: 1 }}
                >
                  {!isAuthenticated
                    ? "Login to Buy"
                    : product.stock === 0
                    ? "Out of Stock"
                    : "Add to Cart"}
                </Button>
              </Box>
              {!isAuthenticated && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 2, textAlign: "center" }}
                >
                  Please log in to add items to your cart
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProductDetail;
