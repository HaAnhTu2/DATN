import React, { ChangeEvent, useEffect, useState } from 'react';
import { Product } from '../../../types/product';
import { updateProduct } from '../../../services/productService';

interface UpdateFormProductProps {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
    productToEdit: Product;
}

const UpdateFormProduct: React.FC<UpdateFormProductProps> = ({ setProducts, setMessage, productToEdit }) => {
    const [productname, setProductName] = useState(productToEdit.productname)
    const [brand, setBrand] = useState(productToEdit.brand)
    const [type, setType] = useState(productToEdit.type)
    const [quantity, setQuantity] = useState(productToEdit.quantity)
    const [price, setPrice] = useState(productToEdit.price)
    const [image2, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState(productToEdit.description)

    useEffect(() => {
        setProductName(productToEdit.productname);
        setBrand(productToEdit.brand);
        setType(productToEdit.type);
        setQuantity(productToEdit.quantity);
        setPrice(productToEdit.price);
        setImage(productToEdit.productimage_url)
        setDescription(productToEdit.description)
    }, [productToEdit]);

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const updatedProduct = { ...productToEdit, productname, brand, quantity, price, image2, description }
            await updateProduct(productToEdit._id, updatedProduct);
            setProducts(prevProducts =>
                prevProducts.map(product => (product._id === productToEdit._id ? updatedProduct : product)))
                alert(`Updated ${productToEdit.productname} item(s) to successfully!`);
        } catch (error) {
            setMessage('error updating product')
        }
    }
    const handleTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setType(event.target.value)
    }
    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
        }
    };
    return (
        <form onSubmit={handleUpdateProduct}>
            <div>
                <label>Product Name: </label><br />
                <input type="text" value={productname} onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)} required />
            </div>
            <div>
                <label>Brand: </label><br />
                <input type="text" value={brand} onChange={(e: ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)} required />
            </div>
            <label>Product Type:</label><br />
            <select value={type} onChange={handleTypeChange}>
                <option value="">Select a type</option>
                <option value="laptop">Laptop</option>
                <option value="desktop">Desktop</option>
                <option value="phone">Phone</option>
            </select>
            <div>
                <label>Quantity: </label><br />
                <input type="number" value={quantity} onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))} required />
            </div>
            <div>
                <label>Price: </label><br />
                <input type="number" value={price} onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))} required />
            </div>
            <div>
                <label>Image: </label><br />
                <input type="file" accept="image2/*" onChange={handleImageChange} />
            </div>
            <div >
                <label>Description: </label><br />
                <input type="text" value={description} onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-outline-dark">{'Update Product'}</button>
        </form>
    );
}
export default UpdateFormProduct;