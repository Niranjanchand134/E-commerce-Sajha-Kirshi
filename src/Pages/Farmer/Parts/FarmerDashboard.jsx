import { Space, Table, Button, Tag } from 'antd';
import {Link, NavLink } from 'react-router-dom';
import {
  FormOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { getProductByfarmer } from '../../../services/farmer/farmerApiService';

const columns = [
  {
    title: 'Sender',
    dataIndex: 'sender',
    key: 'sender',
    render: (text, record) => (
      <Space>
        <i className="fa-solid fa-user-circle text-2xl"></i>
        <span>{record.sender}</span>
      </Space>
    ),
  },
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
        let backgroundColor;
        let textColor;

        if (status === 'Success') {
        backgroundColor = '#BDFFA6';
        textColor = 'green';
        } else if (status === 'Pending') {
        backgroundColor = '#FCFFA6';
        textColor = '#785C01';
        } else {
        backgroundColor = '#FFA6A6';
        textColor = '#780101';
        }

        return (
        <Button
            className="rounded-full"
            size="small"
            type="primary"
            style={{
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            color: textColor,
            }}
        >
            {status}
        </Button>
        );
    },
    },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (amount) => <span>Rs. {amount}</span>,
  },
  {
    title: 'Qty',
    dataIndex: 'qty',
    key: 'qty',
    render: (qty) => <span>{qty} kg</span>,
  },
  {
    render: () => (
      <Space>
        <Button type="link" icon={<FormOutlined />} />
        <Button type="link" icon={<DeleteOutlined />} danger />
      </Space>
    ),
  },
];

const data = [
  {
    key: '1',
    sender: 'John Brown',
    date: 'May 4, 2025',
    status: 'Success',
    amount: 120,
    qty: 5,
  },
  {
    key: '2',
    sender: 'Jim Green',
    date: 'May 4, 2025',
    status: 'Pending',
    amount: 85,
    qty: 3,
  },
  {
    key: '3',
    sender: 'Joe Black',
    date: 'May 4, 2025',
    status: 'Failed',
    amount: 200,
    qty: 10,
  },
];



const FarmerDashboard = () => {

  const [products, setProduct] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await getProductByfarmer();
      console.log("the reposnse od product..",response);
      setProduct(response);

    };

    fetchProduct();
  }, []);

  return (
    <>
      <div className="flex justify-center py-8 px-22">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
          <div className="bg-[#FE9596] w-80 h-48 flex flex-col justify-center items-center rounded-sm shadow-md">
            <h4 className="text-white">Total Products Listed</h4>
            <h1 className="w-20 h-20 flex items-center justify-center border-4 border-white rounded-full text-white">
              50
            </h1>
          </div>
          <div className="bg-[#84C3F7] w-80 h-48 flex flex-col justify-center items-center rounded-sm shadow-md">
            <h4 className="text-white">Active Orders</h4>
            <h1 className="w-20 h-20 flex items-center justify-center border-4 border-white rounded-full text-white">
              50
            </h1>
          </div>
          <div className="bg-[#54DAC6] w-80 h-48 flex flex-col justify-center items-center rounded-sm shadow-md">
            <h4 className="text-white">Pending Inquiries</h4>
            <h1 className="w-20 h-20 flex items-center justify-center border-4 border-white rounded-full text-white">
              50
            </h1>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded shadow p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-1 h-6 bg-green-500 rounded"></div>
          <h1 className="text-2xl font-bold whitespace-nowrap">Recent Sales</h1>
        </div>

        <div className="overflow-x-auto">
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>

        <div className="flex justify-end mt-2 mr-8">
          <Link to="buyer-shop" className="m-2 text-black">
            See more <RightOutlined />
          </Link>
        </div>
      </div>

      <div className="mt-4 rounded shadow p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 px-4">
          <div className="flex items-center gap-4 mb-2 sm:mb-0">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h1 className="text-xl sm:text-2xl font-bold break-words">
              Recently added products
            </h1>
          </div>
          <Link
            to="buyer-shop"
            className="text-black text-sm sm:text-base whitespace-nowrap"
          >
            View All <RightOutlined />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 p-8 md:grid-cols-3 gap-4 w-full">
          {products.map((product) => (
            <NavLink
              to={`/Buyer-shopdetail/${product.id}`} // Assuming each product has an id
              key={product.id}
              className="rounded text-black no-underline transition-shadow duration-300 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]"
            >
              <img
                src={product.imagePaths[0] || "/assets/BuyersImg/Products/Onion.png"} // Fallback image if product.image doesn't exist
                alt={product.name}
              />
              <div className="flex justify-between">
                <div className="p-2">
                  <h5>{product.name || "Product Name"}</h5>
                  <p className="text-green-500 text-lg">
                    Rs {product.price || "00.00"}
                  </p>
                </div>
                <div className="text-right mr-4">
                  <p className="mt-2">{product.farmName || "Farm Name"}</p>
                  <p>{product.location || "Location"}</p>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </>
  );
};

export default FarmerDashboard;
