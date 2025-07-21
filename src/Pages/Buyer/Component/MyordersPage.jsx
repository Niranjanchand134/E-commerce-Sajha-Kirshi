import React, { useState } from 'react';
import Footer from './Footer';
import Header from './Header';

const MyOrdersPage = () => {
  // Comprehensive dummy data
  const ordersData = [
    {
      id: 'ORD-78945612',
      date: '2023-06-15',
      status: 'Delivered',
      items: [
        {
          id: 'ITEM-789',
          name: 'Wireless Noise Cancelling Headphones',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop',
          price: 199.99,
          originalPrice: 249.99,
          quantity: 1,
          deliveredDate: '2023-06-20',
          rating: 4,
          review: "Great sound quality but battery could last longer"
        },
        {
          id: 'ITEM-790',
          name: 'Leather Headphone Case',
          image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=80&h=80&fit=crop',
          price: 29.99,
          quantity: 1,
          deliveredDate: '2023-06-20'
        }
      ],
      total: 229.98,
      discount: 40.00,
      shippingFee: 0.00,
      paymentMethod: 'Credit Card (•••• •••• •••• 4242)',
      shippingAddress: '456 Park Avenue, Apt 12, New York, NY 10022',
      trackingNumber: 'TRK789456123',
      carrier: 'FedEx'
    },
    {
      id: 'ORD-12398745',
      date: '2023-07-02',
      status: 'Shipped',
      items: [
        {
          id: 'ITEM-345',
          name: 'Smart Fitness Watch with Heart Rate Monitor',
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop',
          price: 159.99,
          originalPrice: 199.99,
          quantity: 1,
          expectedDelivery: '2023-07-10'
        }
      ],
      total: 159.99,
      discount: 40.00,
      shippingFee: 0.00,
      paymentMethod: 'PayPal (user@example.com)',
      shippingAddress: '789 Broadway, Suite 501, New York, NY 10003',
      trackingNumber: 'TRK123987456',
      carrier: 'UPS'
    },
    {
      id: 'ORD-45612378',
      date: '2023-07-10',
      status: 'Processing',
      items: [
        {
          id: 'ITEM-678',
          name: 'Wireless Charging Station (3-in-1)',
          image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=80&h=80&fit=crop',
          price: 49.99,
          quantity: 2,
          expectedDelivery: '2023-07-18'
        }
      ],
      total: 99.98,
      discount: 0.00,
      shippingFee: 4.99,
      paymentMethod: 'Credit Card (•••• •••• •••• 5555)',
      shippingAddress: '123 Main Street, Brooklyn, NY 11201',
      trackingNumber: null,
      carrier: null
    },
    {
      id: 'ORD-98765432',
      date: '2023-05-22',
      status: 'Cancelled',
      items: [
        {
          id: 'ITEM-234',
          name: 'Bluetooth Portable Speaker',
          image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=80&h=80&fit=crop',
          price: 89.99,
          quantity: 1
        }
      ],
      total: 89.99,
      discount: 0.00,
      shippingFee: 0.00,
      paymentMethod: 'Credit Card (•••• •••• •••• 4242)',
      shippingAddress: '321 Ocean Drive, Miami, FL 33139',
      cancellationReason: 'Changed my mind',
      cancelledDate: '2023-05-23'
    }
  ];

  const [orders, setOrders] = useState(ordersData);
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewItem, setCurrentReviewItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeTab.toLowerCase());

  // Status styling
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle order details expansion
  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Handle review submission
  const handleSubmitReview = () => {
    if (!currentReviewItem || !reviewRating) return;
    
    const updatedOrders = orders.map(order => {
      const updatedItems = order.items.map(item => {
        if (item.id === currentReviewItem.id) {
          return { ...item, rating: reviewRating, review: reviewText };
        }
        return item;
      });
      return { ...order, items: updatedItems };
    });
    
    setOrders(updatedOrders);
    setShowReviewModal(false);
    setReviewRating(0);
    setReviewText('');
  };

  // Cancel order function
  const cancelOrder = (orderId) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { 
          ...order, 
          status: 'Cancelled',
          cancellationReason: 'Requested by customer',
          cancelledDate: new Date().toISOString().split('T')[0]
        };
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };

  return (
    <>
    <Header/>
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Orders</h1>
      
      {/* Order Status Tabs */}
      <div className="flex overflow-x-auto mb-6 border-b">
        {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-3 font-medium whitespace-nowrap ${
              activeTab === tab 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'all' ? 'All Orders' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab !== 'all' && (
              <span className="ml-1 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {orders.filter(o => o.status.toLowerCase() === tab).length}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No orders found</h3>
          <p className="mt-2 text-gray-500">
            {activeTab === 'all' 
              ? "You haven't placed any orders yet." 
              : `You don't have any ${activeTab} orders.`}
          </p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white shadow rounded-lg overflow-hidden">
              {/* Order Header */}
              <div className="px-6 py-4 border-b flex flex-col sm:flex-row justify-between">
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center">
                    <span className="text-gray-600">Order #</span>
                    <span className="font-medium ml-1">{order.id}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-600">Placed on</span>
                    <span className="font-medium ml-1">{new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  {order.status === 'Cancelled' && (
                    <div className="mt-1 text-sm text-gray-600">
                      Cancelled on {new Date(order.cancelledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {order.cancellationReason && ` • ${order.cancellationReason}`}
                    </div>
                  )}
                </div>
                <div className="flex items-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              
              {/* Order Items Summary */}
              <div className="px-6 py-4">
                <div className="flex overflow-x-auto pb-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex-shrink-0 mr-4">
                      <img 
                        className="h-16 w-16 rounded object-cover border" 
                        src={item.image} 
                        alt={item.name} 
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} • Total: 
                      <span className="font-medium text-gray-900 ml-1">${order.total.toFixed(2)}</span>
                    </p>
                    {order.discount > 0 && (
                      <p className="text-xs text-green-600">
                        You saved ${order.discount.toFixed(2)}
                      </p>
                    )}
                  </div>
                  <button 
                    onClick={() => toggleOrderDetails(order.id)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {expandedOrder === order.id ? 'Hide details' : 'View details'}
                  </button>
                </div>
              </div>
              
              {/* Expanded Order Details */}
              {expandedOrder === order.id && (
                <div className="border-t">
                  {/* Items Details */}
                  <div className="px-6 py-4">
                    <h3 className="font-medium text-gray-900 mb-3">Items in this order</h3>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex-shrink-0">
                            <img className="h-20 w-20 rounded object-cover border" src={item.image} alt={item.name} />
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h4 className="text-base font-medium text-gray-900">{item.name}</h4>
                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                {item.originalPrice && (
                                  <p className="text-sm">
                                    <span className="text-gray-500 line-through mr-2">${item.originalPrice.toFixed(2)}</span>
                                    <span className="text-green-600">${item.price.toFixed(2)}</span>
                                  </p>
                                )}
                                {!item.originalPrice && (
                                  <p className="text-sm text-gray-900">${item.price.toFixed(2)}</p>
                                )}
                              </div>
                              <div className="text-right">
                                {order.status === 'Delivered' && item.deliveredDate && (
                                  <div className="mb-2">
                                    <p className="text-sm text-gray-600">
                                      Delivered on {new Date(item.deliveredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </p>
                                    {item.rating ? (
                                      <div className="flex items-center justify-end mt-1">
                                        {[...Array(5)].map((_, i) => (
                                          <svg
                                            key={i}
                                            className={`h-4 w-4 ${i < item.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setCurrentReviewItem(item);
                                          setShowReviewModal(true);
                                        }}
                                        className="mt-1 text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                      >
                                        Rate & Review
                                      </button>
                                    )}
                                  </div>
                                )}
                                {order.status === 'Shipped' && item.expectedDelivery && (
                                  <p className="text-sm text-gray-600">
                                    Expected by {new Date(item.expectedDelivery).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </p>
                                )}
                                <p className="text-sm font-medium">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="px-6 py-4 bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.shippingAddress}</p>
                          {order.trackingNumber && (
                            <p>
                              <span className="font-medium">Tracking #:</span> {order.trackingNumber}
                              {order.carrier && ` (${order.carrier})`}
                            </p>
                          )}
                          {order.status === 'Shipped' && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 inline-block">
                              Track Package
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.paymentMethod}</p>
                        </div>
                        
                        <div className="mt-4 text-sm">
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span>${(order.total - order.shippingFee + order.discount).toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between py-1">
                              <span className="text-gray-600">Discount</span>
                              <span className="text-green-600">-${order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between py-1">
                            <span className="text-gray-600">Shipping</span>
                            <span>
                              {order.shippingFee > 0 
                                ? `$${order.shippingFee.toFixed(2)}` 
                                : 'Free'}
                            </span>
                          </div>
                          <div className="flex justify-between py-1 font-medium border-t mt-2 pt-2">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-white border-t flex flex-wrap justify-end gap-3">
                    {order.status === 'Processing' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel Order
                      </button>
                    )}
                    <button className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700">
                      Cancel Order
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default MyOrdersPage;