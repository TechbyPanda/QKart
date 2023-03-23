import Header from "./Header";
import {
    CircularProgress,
    Grid,
    InputAdornment,
    TextField,
  } from "@mui/material";
import { Search, SentimentDissatisfied } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { config } from "../App";
import Footer from "./Footer";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import "./Products.css";
import { generateCartItemsFrom } from "./Cart.js";

const Products = () => {
    // UseState start
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const [debounce, setDebounce] = useState();
    const [status, setStatus] = useState(0);
    const [cartItem, setCartItem] = useState([]);
    const [items, setItems] = useState([]);
    // UseState end

    const token = window.localStorage.getItem('token');

    const performAPICall = async () => {
        try{
            // getting products
            const res = await axios.get(`${config.endpoint}/products`);
            setProducts(res.data);
            if(token){
                const cartData = await fetchCart();
                setItems(cartData);
                const cart = await generateCartItemsFrom(cartData, res.data);
                window.localStorage.setItem('products', JSON.stringify(res.data));
                window.localStorage.setItem('items', JSON.stringify(cart));
                setCartItem(cart);
            }
        }catch(error){
            if(error.response && error.response.status === 400){
                enqueueSnackbar(error.response.data.message, { variant: "error" });
            }else{
                enqueueSnackbar(
                    "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
                    { variant: "error" }
                );
            }
        }finally{
            setLoading(false);
        }
    }

    // Search start
    const performSearch = async (text) => {
        try {
            const searchData = await axios.get(
              `${config.endpoint}/products/search?value=${text}`
            );
            setStatus(0);
            setProducts(searchData.data);
        } catch (e) {
            if (e.response && e.response.status === 400) {
              enqueueSnackbar(e.response.data.message, { variant: "error" });
            }
            if (e.response.status === 404) {
              setStatus(404);
            } else {
              enqueueSnackbar(
                "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
                { variant: "error" }
              );
            }
        }
    }

    const handleSearch = (event) => {
        setSearch(event.target.value.trim());
        debounceSearch(event, 1000);
    }

    const debounceSearch = (event, debounceTimeout) => {
        if (debounce) clearTimeout(debounce);
        const debounceCall = setTimeout(() => {
            performSearch(event.target.value.trim());
        }, debounceTimeout);
        setDebounce(debounceCall);
    }

    // Search end

    // Cart start
    const fetchCart = async () => {
        if(!token) return;
        try {
            const cartData = await axios.get(`${config.endpoint}/cart`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            return cartData.data;
        } catch (e) {
            if (e.response && e.response.status === 400) {
              enqueueSnackbar(e.response.data.message, { variant: "error" });
            } else {
              enqueueSnackbar(
                "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
                {
                  variant: "error",
                }
              );
            }
            return null;
        }
    }

    const addToCart = async (id, value) => {
        // let url = `${config.endpoint}/cart`;
        // let payload = {
        //     productId: id,
        //     qty: value
        // }
        if(!token){
        enqueueSnackbar(
            "Login to add an item to the Cart",
            { variant: "warning" }
        );
        }else{
            if(items.find(item => item.productId === id)){
                enqueueSnackbar(
                    "Item already in cart. Use the cart sidebar to update quantity or remove item.",
                    { variant: "warning" }
                );
            }else{
                // const headers = {
                // Authorization: `Bearer ${token}`,
                // "Content-Type": "application/json",
                // };
                // const cart_response = await axios.post(url, payload, {headers});
                // setItems(cart_response.data);
                // setCartItem(generateCartItemsFrom(cart_response.data, products));
                handleQuantity(id, value);
            }
        }
    }

    const handleQuantity = async (id, value) => {
        let url = `${config.endpoint}/cart`;
        let payload = {
            productId: id,
            qty: value
        }
        const headers = {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
        const res = await axios.post(url, payload, {headers});
        setItems(res.data);
        setCartItem(generateCartItemsFrom(res.data, products));
    }
    // Cart end

    useEffect(() => {
        performAPICall();
    },[]);

    return (
        <div>
            <Header>
            <TextField
                size="small"
                type="text"
                name="search-box"
                className="search-desktop"
                InputProps={{
                    endAdornment: (
                    <InputAdornment position="end">
                        <Search color="primary" />
                    </InputAdornment>
                    ),
                }}
                onChange={(e) => handleSearch(e)}
                placeholder="Search for items "
                value={search}
            />
            </Header>

            <TextField
                className="search-mobile"
                size="small"
                fullWidth
                InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                    <Search color="primary" />
                    </InputAdornment>
                ),
                }}
                onChange={(e) => handleSearch(e)}
                placeholder="Search for items/categories"
                value={search}
            />

            <Grid container direction="row" justifyContent="center">
                <Grid container item md={token ? 9 : 12}>
                    <Grid container>
                        <Grid item className="product-grid">
                            <Box className="hero" mb={3}>
                                <p className="hero-heading">
                                India’s{" "}
                                <span className="hero-highlight">FASTEST DELIVERY</span> to
                                your door step
                                </p>
                            </Box>
                        </Grid>
                    </Grid>
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                width: "100%",
                                height: "250px",
                            }}
                            >
                            <CircularProgress />
                            <p>Loading Products...</p>
                        </Box>
                    ) : status === 404 ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column",
                                width: "100%",
                                height: "250px",
                            }}
                            >
                            <SentimentDissatisfied />
                            <p>No products found</p>
                        </Box>
                    ) : (
                        <Grid container spacing={2} padding={2}>
                            {products.map((item) => (
                                <Grid item lg={3} xs={12} md={4} sm={6} key={item._id}>
                                    <ProductCard
                                        product={item}
                                        handleAddToCart={addToCart}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}
                    
                </Grid>
                {token && <Grid item md={3} xs={12} sm={12} text-align="center" bgcolor="#E9F5E1">
                    <Cart
                        products={products}
                        items={cartItem}
                        handleQuantity={handleQuantity}
                    />
                </Grid>}
            </Grid>
            <Footer />
        </div>
    );
}

export default Products;
