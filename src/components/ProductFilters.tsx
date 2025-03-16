import { Fragment } from 'react';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useFilterStore } from '@/store/filter.store';
import { motion } from 'framer-motion';

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
  { label: 'Name: Z to A', value: 'name_desc' },
  { label: 'Most Popular', value: 'popular' },
] as const;

const categories = [
  { id: 'electronics', name: 'Electronics' },
  { id: 'clothing', name: 'Clothing' },
  { id: 'books', name: 'Books' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'sports', name: 'Sports' },
] as const;

interface Props {
  mobileFiltersOpen: boolean;
  setMobileFiltersOpen: (open: boolean) => void;
}

export function ProductFilters({ mobileFiltersOpen, setMobileFiltersOpen }: Props) {
  const { categories: selectedCategories, sortBy, inStock, priceRange, dispatch } = useFilterStore();

  return (
    <>
      {/* Mobile filter dialog */}
      <Transition.Root show={mobileFiltersOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white dark:bg-gray-900 py-4 pb-6 shadow-xl">
                <div className="flex items-center justify-between px-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                  <button
                    type="button"
                    className="relative -mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setMobileFiltersOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Filters */}
                <form className="mt-4">
                  {/* Categories */}
                  <Disclosure as="div" className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-gray-900 px-2 py-3 text-sm text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">Categories</span>
                            <span className="ml-6 flex items-center">
                              <ChevronDownIcon
                                className={`h-5 w-5 transform ${open ? 'rotate-180' : ''} transition-transform`}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            {categories.map((category) => (
                              <div key={category.id} className="flex items-center">
                                <input
                                  id={`category-${category.id}`}
                                  type="checkbox"
                                  checked={selectedCategories.includes(category.id)}
                                  onChange={(e) => {
                                    const newCategories = e.target.checked
                                      ? [...selectedCategories, category.id]
                                      : selectedCategories.filter((id) => id !== category.id);
                                    dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
                                  }}
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <label
                                  htmlFor={`category-${category.id}`}
                                  className="ml-3 text-sm text-gray-600 dark:text-gray-300"
                                >
                                  {category.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {/* Price Range */}
                  <Disclosure as="div" className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white dark:bg-gray-900 px-2 py-3 text-sm text-gray-400">
                            <span className="font-medium text-gray-900 dark:text-white">Price Range</span>
                            <span className="ml-6 flex items-center">
                              <ChevronDownIcon
                                className={`h-5 w-5 transform ${open ? 'rotate-180' : ''} transition-transform`}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div>
                                <label htmlFor="min-price" className="block text-sm text-gray-700 dark:text-gray-300">
                                  Min
                                </label>
                                <input
                                  type="number"
                                  id="min-price"
                                  value={priceRange.min}
                                  onChange={(e) =>
                                    dispatch({
                                      type: 'SET_PRICE_RANGE',
                                      payload: { ...priceRange, min: Number(e.target.value) },
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label htmlFor="max-price" className="block text-sm text-gray-700 dark:text-gray-300">
                                  Max
                                </label>
                                <input
                                  type="number"
                                  id="max-price"
                                  value={priceRange.max}
                                  onChange={(e) =>
                                    dispatch({
                                      type: 'SET_PRICE_RANGE',
                                      payload: { ...priceRange, max: Number(e.target.value) },
                                    })
                                  }
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>

                  {/* In Stock */}
                  <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-6">
                    <div className="flex items-center">
                      <input
                        id="in-stock"
                        type="checkbox"
                        checked={inStock}
                        onChange={() => dispatch({ type: 'TOGGLE_IN_STOCK' })}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="in-stock" className="ml-3 text-sm text-gray-600 dark:text-gray-300">
                        In Stock Only
                      </label>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <div className="divide-y divide-gray-200 dark:divide-gray-700 space-y-6">
          {/* Sort */}
          <div className="py-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Sort By</h3>
            <div className="mt-4 space-y-4">
              {sortOptions.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center"
                >
                  <input
                    id={`sort-${option.value}`}
                    type="radio"
                    checked={sortBy === option.value}
                    onChange={() => dispatch({ type: 'SET_SORT', payload: option.value })}
                    className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`sort-${option.value}`}
                    className="ml-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    {option.label}
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="py-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
            <div className="mt-4 space-y-4">
              {categories.map((category) => (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center"
                >
                  <input
                    id={`desktop-category-${category.id}`}
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...selectedCategories, category.id]
                        : selectedCategories.filter((id) => id !== category.id);
                      dispatch({ type: 'SET_CATEGORIES', payload: newCategories });
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`desktop-category-${category.id}`}
                    className="ml-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
                  >
                    {category.name}
                  </label>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="py-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price Range</h3>
            <div className="mt-4 space-y-4">
              <div className="flex gap-4">
                <div>
                  <label htmlFor="desktop-min-price" className="block text-sm text-gray-700 dark:text-gray-300">
                    Min
                  </label>
                  <input
                    type="number"
                    id="desktop-min-price"
                    value={priceRange.min}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_PRICE_RANGE',
                        payload: { ...priceRange, min: Number(e.target.value) },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="desktop-max-price" className="block text-sm text-gray-700 dark:text-gray-300">
                    Max
                  </label>
                  <input
                    type="number"
                    id="desktop-max-price"
                    value={priceRange.max}
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_PRICE_RANGE',
                        payload: { ...priceRange, max: Number(e.target.value) },
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div className="py-6">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex items-center">
              <input
                id="desktop-in-stock"
                type="checkbox"
                checked={inStock}
                onChange={() => dispatch({ type: 'TOGGLE_IN_STOCK' })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="desktop-in-stock"
                className="ml-3 text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
              >
                In Stock Only
              </label>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
} 