import React, {useEffect, useState} from "react";
import {Row, Card, Table } from 'react-bootstrap';
import { getProducts, deleteProduct } from "../../../../api/product";
import { Product } from "../../../../type/product";

interface ProductListProps{
    setFormProduct:(product:Product)=>void;
}

const ProductList:React.FC<ProductListProps>=({setFormProduct})=>{
    const [products,setProducts] =useState<Product[]>([]);
    const [loading, setloading] = useState(true);
    useEffect(()=>{
        const fetchProducts= async()=>{
            try{
                const fetchedProducts =await getProducts();
                setProducts(fetchedProducts);
                setloading(false);
            }catch(error){
                console.log('error fetching products:',error);
                setloading(false);
            }
        };
        fetchProducts();
    },[]);
    if(loading){
        return <div>Loading...</div>;
    }
    const handleUpdateProduct = (product:Product)=>{
        setFormProduct(product);
    };
    const handleDeleteProduct =async (id: string)=>{
        try{
            await deleteProduct(id)
            setProducts(products.filter(product=>product._id!=id))
        }catch(error){
            console.error('error deleting user:',error);
        }
    }
    return(
        <div>
            <div className="col-md-12">
                <h4 className="mb-0">Product</h4>
            </div>
            <table>
                <thead className="table-light">
                <tr>
                    <th>Product Name</th>
                    <th>Brand</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Description</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody >
                    {products.map(product=>(
                        <tr key={product._id}>
                            <td>{product.productname}</td>
                            <td>{product.brand}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>
                                {product.productimage_url ? (
                                <img
                                    src={`http://localhost:3000/image2/${product.productimage_url}`}
                                    alt={product.productname}
                                    style={{width: "100px", height:"auto"}}/>
                                    ):(
                                        "No Image"
                                    )}</td>
                            <td>{product.description}</td>
                            <td>
                                <button type="submit" className="btn btn-outline-dark" onClick={()=> handleUpdateProduct(product)}>Edit</button>
                                <button type="submit" className="btn btn-outline-dark" onClick={()=> handleDeleteProduct(product._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default ProductList;