import React, { ChangeEvent, useState } from "react";
import { createProduct } from "../../../services/productService";
import { Product } from "../../../types/product";

interface CreateFormProductProps {
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const CreateFormProduct: React.FC<CreateFormProductProps> = ({ setProducts, setMessage }) => {
    const [productname, setProductName] = useState('')
    const [brand, setBrand] = useState('')
    const [type, setType] = useState('')
    const [quantity, setQuantity] = useState(0)
    const [price, setPrice] = useState(0.0)
    const [image2, setImage] = useState<File | null>(null);
    const [description, setDescription] = useState('')

    const handleCreateProduct = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newProduct = new FormData();
            newProduct.append('productname', productname);
            newProduct.append('brand', brand);
            newProduct.append('producttype', type)
            newProduct.append('quantity', quantity.toString());
            newProduct.append('price', price.toString());
            newProduct.append('description', description);
            if (image2) {
                newProduct.append('image2', image2);
            }
            const createdProduct = await createProduct(newProduct);
            setMessage('Product created successfully')
            setProducts(prevProducts => [...prevProducts, createdProduct])
            setProductName('')
            setBrand('')
            setType('')
            setQuantity(0)
            setPrice(0.0)
            setImage(null)
            setDescription('')
        } catch (error) {
            setMessage('Error creating product');
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
        <form onSubmit={handleCreateProduct}>
            <div>
                <label>Product Name:</label><br />
                <input type="text" value={productname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)} required />
            </div>
            <div>
                <label>Product Brand:</label><br />
                <input type="text" value={brand}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setBrand(e.target.value)} required />
            </div>
            <div>
                <label>Product Type:</label><br />
                <select value={type} onChange={handleTypeChange}>
                    <option value="">Select a type</option>
                    <option value="laptop">Laptop</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="camera">Camera</option>
                    <option value="accessory">Accessory</option>
                </select>
            </div>
            <div>
                <label>Product Quantity:</label><br />
                <input type="number" value={quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setQuantity(Number(e.target.value))} required />
            </div>
            <div>
                <label>Product Price:</label><br />
                <input type="number" value={price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPrice(Number(e.target.value))} required />
            </div>
            <div>
                <label>Image: </label><br />
                <input type="file" accept="image2/*" onChange={handleImageChange} />
            </div>
            <div>
                <label>Product Description:</label><br />
                <input type="text" value={description}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-outline-dark">{'Create Product'}</button>
        </form>
    )
}
export default CreateFormProduct