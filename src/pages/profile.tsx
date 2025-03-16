import { useState } from 'react';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';

// Mock data for demonstration
const mockOrders = [
  {
    id: '1234',
    date: '2023-03-15',
    total: 129.99,
    status: 'Delivered',
    items: [
      { id: 1, name: 'Basic Tee', price: 35.00, quantity: 2 },
      { id: 2, name: 'Leather Wallet', price: 59.99, quantity: 1 },
    ]
  },
  {
    id: '5678',
    date: '2023-02-28',
    total: 89.97,
    status: 'Processing',
    items: [
      { id: 3, name: 'Running Shoes', price: 89.97, quantity: 1 },
    ]
  }
];

const mockAddresses = [
  {
    id: 1,
    type: 'Home',
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States',
    isDefault: true
  },
  {
    id: 2,
    type: 'Work',
    name: 'John Doe',
    street: '456 Office Blvd',
    city: 'New York',
    state: 'NY',
    zip: '10002',
    country: 'United States',
    isDefault: false
  }
];

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const [editingAddress, setEditingAddress] = useState<number | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '(555) 123-4567',
    }
  });

  const onSubmit = (data: ProfileFormValues) => {
    toast.success('Profile updated successfully!');
    console.log(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1 mb-8">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'}`
          }>
            Profile
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'}`
          }>
            Orders
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5 
            ${selected 
              ? 'bg-white dark:bg-gray-700 shadow text-blue-600 dark:text-blue-400' 
              : 'text-gray-700 dark:text-gray-400 hover:bg-white/[0.12] hover:text-blue-600'}`
          }>
            Addresses
          </Tab>
        </Tab.List>
        
        <Tab.Panels>
          {/* Profile Panel */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      {...register('phone')}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </Tab.Panel>
          
          {/* Orders Panel */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-xl font-semibold">Order History</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">View and track your recent orders</p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                {mockOrders.length > 0 ? (
                  <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockOrders.map((order) => (
                      <li key={order.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${order.total.toFixed(2)}</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'Delivered' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                          </p>
                        </div>
                        
                        <div className="mt-3">
                          <button className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            View Order Details
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">You haven't placed any orders yet.</p>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
          
          {/* Addresses Panel */}
          <Tab.Panel>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Saved Addresses</h2>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your shipping addresses</p>
                </div>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setEditingAddress(0)}
                >
                  Add New Address
                </button>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700">
                {mockAddresses.length > 0 ? (
                  <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {mockAddresses.map((address) => (
                      <li key={address.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">{address.type}</p>
                              {address.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="mt-1">{address.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{address.street}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{address.country}</p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                              onClick={() => setEditingAddress(address.id)}
                            >
                              Edit
                            </button>
                            <button className="text-sm text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300">
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">You don't have any saved addresses.</p>
                  </div>
                )}
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 