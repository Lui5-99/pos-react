import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Computer, Memory, Storage, Keyboard } from "@mui/icons-material";

const categories = [
  {
    title: "Computers",
    description: "High-performance desktop and laptop computers",
    icon: <Computer sx={{ fontSize: 60 }} />,
    link: "/products?category=computers",
  },
  {
    title: "RAM",
    description: "High-speed memory modules for your system",
    icon: <Memory sx={{ fontSize: 60 }} />,
    link: "/products?category=ram",
  },
  {
    title: "Storage",
    description: "SSDs and HDDs for your storage needs",
    icon: <Storage sx={{ fontSize: 60 }} />,
    link: "/products?category=storage",
  },
  {
    title: "Peripherals",
    description: "Keyboards, mice, and other accessories",
    icon: <Keyboard sx={{ fontSize: 60 }} />,
    link: "/products?category=peripherals",
  },
];

const Home = () => {
  return (
    <Box>
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          mb: 6,
        }}
      >
        <Container>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to TechStore
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Your one-stop shop for computer hardware and accessories
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to="/products"
            sx={{ mt: 4 }}
          >
            Browse Products
          </Button>
        </Container>
      </Box>

      <Container>
        <Typography variant="h4" component="h2" gutterBottom>
          Shop by Category
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={3} key={category.title}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <CardContent>
                  <Box sx={{ color: "primary.main", mb: 2 }}>
                    {category.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h3">
                    {category.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
                <Button
                  component={RouterLink}
                  to={category.link}
                  variant="outlined"
                  color="primary"
                  sx={{ mb: 2 }}
                >
                  Browse {category.title}
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
