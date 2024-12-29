import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import DOMPurify from 'dompurify' // exclude js from html
import productApi from '../../api/product.api'
import ProductRating from '../../components/ProductRating'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameAndId, saleRate } from '../../utils/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Product as ProductType, ProductListConfig } from '../../types/product.type'
import Product from '../ProductList/components/Product'
import QuantityController from '../../components/QuantityController'
import purchaseApi from '../../api/purchase.api'
import { purchaseStatus } from '../../constants/purchase'
import { toast } from 'react-toastify'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  // for Quantity Controller component
  const [buyCount, setBuyCount] = useState(1)

  // Get query from URL
  const { nameAndId } = useParams()
  // console.log(nameId)
  const id = getIdFromNameAndId(nameAndId as string)
  // console.log(id)
  const { data: productDetailData } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetails(id as string)
  })

  // Image slider
  const [currentImagesIndex, setCurrentImagesIndex] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')

  // Get product details
  const product = productDetailData?.data.data
  console.log(product)

  // For zooming image
  const imageRef = useRef<HTMLImageElement>(null)

  // Get images of product
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentImagesIndex) : []),
    [product, currentImagesIndex]
  )
  // console.log(currentImages)

  // Get similar products (base on category)
  const queryConfig: ProductListConfig = { limit: '20', page: '1', category: product?.category._id }
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig),
    enabled: Boolean(product), // only use query to call api when product is available
    staleTime: 3 * 60 * 1000 // 3 minutes
  })
  // console.log(productsData)

  // Add product to cart mutation
  const addTocartMutation = useMutation({
    mutationFn: (body: { product_id: string; buy_count: number }) => purchaseApi.addToCart(body)
  })

  // set active image when calling to product api
  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  // Slider handle
  const next = () => {
    console.log(currentImagesIndex[1])
    if (currentImagesIndex[1] < (product as ProductType)?.image.length) {
      setCurrentImagesIndex((prev) => [prev[0] + 1, prev[1] + 1])
    }
  }

  const prev = () => {
    if (currentImagesIndex[0] > 0) {
      setCurrentImagesIndex((prev) => [prev[0] - 1, prev[1] - 1])
    }
  }

  // function to choose active image (this action will run when we hover (onMouseEnter) on an image )
  const chooseActiveImage = (img: string) => {
    setActiveImage(img)
  }

  // Zoom image
  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // get height and width of 'div' containing image
    const rect = event.currentTarget.getBoundingClientRect()

    // get current image of ref
    const image = imageRef.current as HTMLImageElement

    // get original value of image
    const { naturalHeight, naturalWidth } = image

    // calculate top and left
    const { offsetX, offsetY } = event.nativeEvent // position of mouse in element
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)

    // set width and hieght for image
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  // reset image to original state after finishing zoom
  const handleZoomRemove = () => {
    imageRef.current?.removeAttribute('style')
  }

  // Handle quantity controller
  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  // Handle add to cart
  const addToCart = () => {
    addTocartMutation.mutate(
      { buy_count: buyCount, product_id: product?._id as string },
      {
        onSuccess: (data) => {
          // invalidate this query so can call api again
          queryClient.invalidateQueries({
            queryKey: [
              'purchases',
              {
                status: purchaseStatus.inCart
              }
            ]
          }),
            toast.success(data.data.message, { autoClose: 3000 })
        }
      }
    )
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      {/* Product Info */}
      <div className='container'>
        <div className='bg-white py-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full cursor-zoom-in overflow-hidden pt-[100%] shadow'
                onMouseMove={handleZoom}
                onMouseLeave={handleZoomRemove}
              >
                <img
                  className='pointer-events-none absolute left-0 top-0 h-full w-full bg-white object-cover'
                  src={activeImage}
                  alt={product.name}
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  onClick={prev}
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div className='relative w-full pt-[100%]' key={img} onMouseEnter={() => chooseActiveImage(img)}>
                      <img
                        className='absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover'
                        src={img}
                        alt={product.name}
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='h-5 w-5'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              {/* Info on Rating, and sold */}
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassnames='fill-orange text-orange h-4 w-4'
                    nonActiveClassnames='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'>
                  <div>
                    <span>{formatNumberToSocialStyle(product.sold)}</span>
                    <span className='ml-1 text-gray-500'>Đã bán</span>
                  </div>
                </div>
              </div>
              {/* Info on Rating, and sold */}

              {/* Info on price */}
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold text-white'>
                  {saleRate(product.price_before_discount, product.price)} giảm
                </div>
              </div>
              {/* Info on price */}

              {/* Product Unit */}
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Số lượng</div>
                <QuantityController
                  value={buyCount}
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  max={product.quantity}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} sản phẩm co san</div>
              </div>
              {/* Product Unit */}

              {/* Add to cart */}
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border-orange bg-orange/10 px-5 capitalize text-orange shadow-sm hover:bg-orange/5'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  Thêm vào giỏ hàng
                </button>
                <button className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'>
                  Mua ngay
                </button>
              </div>
              {/* Add to cart */}
            </div>
          </div>
        </div>
      </div>
      {/* Product Info */}

      {/* Product Description */}
      <div className='mt-8'>
        <div className='container'>
          <div className='shadpw mt-8 bg-white p-4'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
            <div className='mx-4 mb-4 mt-12 text-sm leading-loose'>
              {/* Render HTML text in react component */}
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(product.description)
                }}
              />
              {/* Render HTML in react component */}
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}

      {/* Similar products */}
      <div className='mt-8'>
        <div className='container'>
          <div className='uppercase text-gray-400'>CÓ THỂ BẠN CŨNG THÍCH</div>
          {productsData && (
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {productsData.data.data.products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Similar products */}
    </div>
  )
}
