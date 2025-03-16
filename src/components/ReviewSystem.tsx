import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

// Review schema for form validation
const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  recommend: z.boolean().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

// Mock review data
interface Review {
  id: string;
  productId: number;
  rating: number;
  title: string;
  comment: string;
  name: string;
  date: string;
  recommend: boolean;
  helpfulCount: number;
  verified: boolean;
}

const mockReviews: Review[] = [
  {
    id: '1',
    productId: 1,
    rating: 5,
    title: 'Excellent product!',
    comment: 'This is one of the best purchases I have made. The quality is outstanding and it exceeded my expectations.',
    name: 'John Doe',
    date: '2023-02-15',
    recommend: true,
    helpfulCount: 12,
    verified: true,
  },
  {
    id: '2',
    productId: 1,
    rating: 4,
    title: 'Great value for money',
    comment: 'Very good product for the price. Would recommend to friends and family.',
    name: 'Jane Smith',
    date: '2023-01-20',
    recommend: true,
    helpfulCount: 8,
    verified: true,
  },
  {
    id: '3',
    productId: 1,
    rating: 3,
    title: 'Good but could be better',
    comment: 'The product is decent but there are a few improvements that could be made. The material could be more durable.',
    name: 'Mike Johnson',
    date: '2022-12-05',
    recommend: false,
    helpfulCount: 5,
    verified: false,
  },
];

interface ReviewSystemProps {
  productId: number;
}

export function ReviewSystem({ productId }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>(
    mockReviews.filter(review => review.productId === productId)
  );
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);

  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;
  
  // Calculate rating distribution
  const ratingCounts = reviews.reduce((counts, review) => {
    counts[review.rating - 1]++;
    return counts;
  }, [0, 0, 0, 0, 0]);
  
  const totalReviews = reviews.length;
  
  // Get percentage for each rating
  const ratingPercentages = ratingCounts.map(count => 
    totalReviews > 0 ? (count / totalReviews) * 100 : 0
  );

  // Form handling
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
      name: '',
      email: '',
      recommend: true,
    }
  });

  const watchRating = watch('rating');

  const onSubmit = (data: ReviewFormValues) => {
    // In a real app, you would send this to your API
    const newReview: Review = {
      id: Date.now().toString(),
      productId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      name: data.name,
      date: new Date().toISOString().split('T')[0],
      recommend: data.recommend || false,
      helpfulCount: 0,
      verified: false,
    };
    
    setReviews([newReview, ...reviews]);
    setIsWritingReview(false);
    reset();
    toast.success('Thank you for your review!');
  };

  const handleSetRating = (rating: number) => {
    setValue('rating', rating);
  };

  const handleMarkHelpful = (reviewId: string) => {
    if (helpfulReviews.includes(reviewId)) return;
    
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpfulCount: review.helpfulCount + 1 } 
        : review
    ));
    
    setHelpfulReviews([...helpfulReviews, reviewId]);
    toast.success('Thanks for your feedback!');
  };

  // Sort and filter reviews
  const filteredAndSortedReviews = [...reviews]
    .filter(review => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpfulCount - a.helpfulCount;
        default:
          return 0;
      }
    });

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
      
      {/* Review summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Average rating */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold mb-2">{averageRating.toFixed(1)}</div>
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        
        {/* Rating distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Rating Distribution</h3>
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating, index) => (
              <div key={rating} className="flex items-center">
                <button
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`flex items-center hover:text-blue-600 ${
                    filterRating === rating ? 'font-bold text-blue-600' : ''
                  }`}
                >
                  <span className="w-3">{rating}</span>
                  <StarIcon className="h-4 w-4 text-yellow-400 ml-1" />
                </button>
                <div className="flex-1 mx-3">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: `${ratingPercentages[5 - rating]}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 w-10">
                  {ratingCounts[5 - rating]}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Write a review button */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 flex flex-col justify-center items-center">
          <p className="text-center mb-4">Share your thoughts with other customers</p>
          <button
            onClick={() => setIsWritingReview(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Write a Review
          </button>
        </div>
      </div>
      
      {/* Review form */}
      {isWritingReview && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Overall Rating*
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleSetRating(rating)}
                    className="p-1"
                  >
                    {rating <= watchRating ? (
                      <StarIcon className="h-8 w-8 text-yellow-400" />
                    ) : (
                      <StarIconOutline className="h-8 w-8 text-gray-400 hover:text-yellow-400" />
                    )}
                  </button>
                ))}
              </div>
              <input type="hidden" {...register('rating')} />
              {errors.rating && (
                <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>
            
            {/* Review Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review Title*
              </label>
              <input
                id="title"
                type="text"
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Summarize your experience"
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>
            
            {/* Review Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Review*
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="What did you like or dislike? What did you use this product for?"
                {...register('comment')}
              ></textarea>
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600">{errors.comment.message}</p>
              )}
            </div>
            
            {/* Recommend */}
            <div>
              <div className="flex items-center">
                <input
                  id="recommend"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...register('recommend')}
                />
                <label htmlFor="recommend" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I would recommend this product to a friend
                </label>
              </div>
            </div>
            
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name*
              </label>
              <input
                id="name"
                type="text"
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your display name"
                {...register('name')}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email*
              </label>
              <input
                id="email"
                type="email"
                className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Your email (will not be published)"
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsWritingReview(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Reviews list */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">
            {filteredAndSortedReviews.length} {filteredAndSortedReviews.length === 1 ? 'Review' : 'Reviews'}
            {filterRating && ` with ${filterRating} stars`}
          </h3>
          
          <div className="flex items-center">
            <label htmlFor="sort-by" className="mr-2 text-sm text-gray-700 dark:text-gray-300">
              Sort by:
            </label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
        
        {filteredAndSortedReviews.length === 0 ? (
          <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-500 dark:text-gray-400">
              {filterRating 
                ? `No reviews with ${filterRating} stars yet.` 
                : 'No reviews yet. Be the first to review this product!'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAndSortedReviews.map((review) => (
              <div key={review.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`h-5 w-5 ${
                            star <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <h4 className="text-lg font-semibold">{review.title}</h4>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {review.date}
                  </div>
                </div>
                
                <div className="mt-2">
                  <div className="flex items-center mb-2">
                    <span className="font-medium">{review.name}</span>
                    {review.verified && (
                      <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    {review.recommend ? (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✓ Would recommend this product
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        ✗ Would not recommend this product
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={() => handleMarkHelpful(review.id)}
                    disabled={helpfulReviews.includes(review.id)}
                    className={`text-sm ${
                      helpfulReviews.includes(review.id)
                        ? 'text-gray-400 dark:text-gray-600 cursor-default'
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {helpfulReviews.includes(review.id) 
                      ? `${review.helpfulCount} ${review.helpfulCount === 1 ? 'person' : 'people'} found this helpful`
                      : `Helpful (${review.helpfulCount})`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 