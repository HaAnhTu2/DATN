import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import { Product } from "../../type/product";
import { Row, Card, Table, Form } from "react-bootstrap";

interface HomeProps {
    setHome: (product: Product) => void;
}

const Home: React.FC<HomeProps> = () => {
    const [products, setHomes] = useState<Product[]>([]);
    const [loading, setloading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const fetchedHomes = await getProducts();
                setHomes(fetchedHomes);
                setloading(false)

            } catch (error) {
                console.error('error fetching products:', error);
                setloading(false)
            }
        };
        fetchHome();
    }, []);
    if (loading) {
        return <div>Loading...</div>;
    }
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredProducts = products.filter(product =>
        product.productname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
        <div>
            <div>
                {/* Search Form */}
                <Form className="d-flex align-items-center" style={{ margin: '10px' }}>
                    <Form.Control type="search" placeholder="Search" value={searchTerm} onChange={handleSearch} />
                </Form>
            </div>
            <Row className="mt-6">
                <Card className="h-100">
                    <div className="bg-white py-4">
                        <h4 className="mb-0">Product</h4>
                    </div>
                    <Table responsive className="text-nowrap">
                        <thead className="table-light">
                            <tr>
                                <th>Product Name</th>
                                <th>Brand</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map(product => (
                                <tr key={product._id}>
                                    <td>{product.productname}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.price}</td>
                                    <td>{product.productimage_url ? (
                                        <img
                                            src={`http://localhost:3000/image2/${product.productimage_url}`}
                                            alt={product.productname}
                                            style={{ width: "100px", height: "auto" }}
                                        />
                                    ) : (
                                        "No Image"
                                    )}</td>
                                    <td>{product.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            </Row>
        </div>
    )
}
export default Home