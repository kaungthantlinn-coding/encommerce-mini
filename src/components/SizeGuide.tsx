import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SizeGuideProps {
  category: string;
}

interface SizeData {
  type: string;
  sizes: {
    size: string;
    chest?: string;
    waist: string;
    hips?: string;
    inseam?: string;
  }[];
}

// Mock size data
const sizeData: Record<string, SizeData[]> = {
  "men's clothing": [
    {
      type: 'Tops (inches)',
      sizes: [
        { size: 'S', chest: '36-38', waist: '30-32' },
        { size: 'M', chest: '39-41', waist: '33-35' },
        { size: 'L', chest: '42-44', waist: '36-38' },
        { size: 'XL', chest: '45-47', waist: '39-41' },
        { size: 'XXL', chest: '48-50', waist: '42-44' },
      ],
    },
    {
      type: 'Bottoms (inches)',
      sizes: [
        { size: '28', waist: '28', inseam: '30' },
        { size: '30', waist: '30', inseam: '30' },
        { size: '32', waist: '32', inseam: '32' },
        { size: '34', waist: '34', inseam: '32' },
        { size: '36', waist: '36', inseam: '34' },
      ],
    },
  ],
  "women's clothing": [
    {
      type: 'Tops (inches)',
      sizes: [
        { size: 'XS', chest: '32-33', waist: '24-25', hips: '34-35' },
        { size: 'S', chest: '34-35', waist: '26-27', hips: '36-37' },
        { size: 'M', chest: '36-37', waist: '28-29', hips: '38-39' },
        { size: 'L', chest: '38-40', waist: '30-32', hips: '40-42' },
        { size: 'XL', chest: '41-43', waist: '33-35', hips: '43-45' },
      ],
    },
    {
      type: 'Bottoms (inches)',
      sizes: [
        { size: '0', waist: '24', hips: '34', inseam: '30' },
        { size: '2', waist: '25', hips: '35', inseam: '30' },
        { size: '4', waist: '26', hips: '36', inseam: '30' },
        { size: '6', waist: '27', hips: '37', inseam: '30' },
        { size: '8', waist: '28', hips: '38', inseam: '30' },
        { size: '10', waist: '29', hips: '39', inseam: '30' },
        { size: '12', waist: '30', hips: '40', inseam: '30' },
      ],
    },
  ],
};

export function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const categoryData = sizeData[category] || [];

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm font-medium focus:outline-none transition-colors duration-200 group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="border-b border-dashed border-indigo-400 pb-0.5">Size Guide</span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <Dialog.Title
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900 dark:text-white flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Size Guide
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {categoryData.length > 0 ? (
                    <>
                      {/* Tabs */}
                      {categoryData.length > 1 && (
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                            {categoryData.map((data, index) => (
                              <button
                                key={data.type}
                                onClick={() => setActiveTab(index)}
                                className={`${
                                  activeTab === index
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400 font-medium'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                              >
                                {data.type}
                              </button>
                            ))}
                          </nav>
                        </div>
                      )}

                      {/* Size Table */}
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30"
                              >
                                Size
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                              >
                                Chest
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                              >
                                Waist
                              </th>
                              {categoryData[activeTab].sizes[0].hips && (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                                >
                                  Hips
                                </th>
                              )}
                              {categoryData[activeTab].sizes[0].inseam && (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider"
                                >
                                  Inseam
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {categoryData[activeTab].sizes.map((size, idx) => (
                              <tr key={size.size} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${idx % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}`}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50/50 dark:bg-indigo-900/10">
                                  {size.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                  {size.chest}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                  {size.waist}
                                </td>
                                {categoryData[activeTab].sizes[0].hips && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {size.hips}
                                  </td>
                                )}
                                {categoryData[activeTab].sizes[0].inseam && (
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                    {size.inseam}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* How to Measure */}
                      <div className="mt-8 bg-gradient-to-r from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 p-5 rounded-lg">
                        <h4 className="text-base font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          How to Measure
                        </h4>
                        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                          <li className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mr-3 flex-shrink-0 text-xs font-medium">1</span>
                            <div>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Chest:</span>
                              <span className="ml-1">Measure around the fullest part of your chest, keeping the tape horizontal.</span>
                            </div>
                          </li>
                          <li className="flex items-start">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mr-3 flex-shrink-0 text-xs font-medium">2</span>
                            <div>
                              <span className="font-medium text-indigo-700 dark:text-indigo-300">Waist:</span>
                              <span className="ml-1">Measure around your natural waistline, keeping the tape comfortably loose.</span>
                            </div>
                          </li>
                          {categoryData[activeTab].sizes[0].hips && (
                            <li className="flex items-start">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mr-3 flex-shrink-0 text-xs font-medium">3</span>
                              <div>
                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Hips:</span>
                                <span className="ml-1">Measure around the fullest part of your hips, keeping the tape horizontal.</span>
                              </div>
                            </li>
                          )}
                          {categoryData[activeTab].sizes[0].inseam && (
                            <li className="flex items-start">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 mr-3 flex-shrink-0 text-xs font-medium">4</span>
                              <div>
                                <span className="font-medium text-indigo-700 dark:text-indigo-300">Inseam:</span>
                                <span className="ml-1">Measure from the crotch to the bottom of the leg.</span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Tips */}
                      <div className="mt-6 bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
                        <h4 className="text-base font-medium text-indigo-800 dark:text-indigo-300 mb-3 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Sizing Tips
                        </h4>
                        <ul className="space-y-2 text-sm text-indigo-800 dark:text-indigo-200">
                          <li className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            If you're between sizes, we recommend sizing up for a more comfortable fit.
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Our sizes are based on US standard sizing.
                          </li>
                          <li className="flex items-center">
                            <svg className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Measurements are provided as a guide only. Fit may vary depending on the style and cut.
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Size guide not available for this category.
                    </p>
                  )}

                  <div className="mt-8 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-colors shadow-sm"
                      onClick={closeModal}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Got it
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 