import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia
        sx={{ height: 220 }}
        src={product.image}
        component="img"
        title="green iguana"
      />
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {product.name}
        </Typography>
        <Typography gutterBottom variant="subtitle1">
          ${product.cost}
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button variant="contained" sx={{width: '100%'}} startIcon={<AddShoppingCartOutlined />} onClick={() => handleAddToCart(product._id, 1)}>ADD TO CART</Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
