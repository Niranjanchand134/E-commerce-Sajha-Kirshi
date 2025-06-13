import { Space, Table, Button, Tag } from 'antd';
import {Link, NavLink } from 'react-router-dom';
import {
  FormOutlined,
  DeleteOutlined,
  RightOutlined,
} from '@ant-design/icons';

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

const Farmerorderlist = () => {
    return(
        <>
        <div className="mt-4 rounded shadow p-4">
            <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h1 className="text-2xl font-bold whitespace-nowrap">Total Products Listed <span className='text-[#FE9596]'>50</span></h1>
            </div>

            <div className="overflow-x-auto">
            <Table columns={columns} dataSource={data} pagination={false} />
            </div>

            <div className="flex justify-end mt-2 mr-8">
            <Link to="buyer-shop" className="m-2 text-black">See more <RightOutlined /></Link>
            </div>
        </div>

        <div className="mt-4 rounded shadow p-4">
            <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h1 className="text-2xl font-bold whitespace-nowrap">Active Order <span className='text-[#FE9596]'>50</span></h1>
            </div>

            <div className="overflow-x-auto">
            <Table columns={columns} dataSource={data} pagination={false} />
            </div>

            <div className="flex justify-end mt-2 mr-8">
            <Link to="buyer-shop" className="m-2 text-black">See more <RightOutlined /></Link>
            </div>
        </div>

        <div className="mt-4 rounded shadow p-4">
            <div className="flex items-center gap-4 mb-4">
            <div className="w-1 h-6 bg-green-500 rounded"></div>
            <h1 className="text-2xl font-bold whitespace-nowrap text-gray-200">Pending Order <span className='text-[#FE9596]'>50</span></h1>
            </div>

            <div className="overflow-x-auto">
            <Table columns={columns} dataSource={data} pagination={false} />
            </div>

            <div className="flex justify-end mt-2 mr-8">
            <Link to="buyer-shop" className="m-2 text-black">See more <RightOutlined /></Link>
            </div>
        </div>
        </>
    )
}

export default Farmerorderlist;