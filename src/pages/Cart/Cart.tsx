import { useMutation, useQuery } from '@tanstack/react-query'
import { produce } from 'immer'
import { purchaseStatus } from '../../constants/purchase'
import purchaseApi from '../../api/purchase.api'
import path from '../../constants/path'
import { Link, useLocation } from 'react-router'
import { formatCurrency, generateNameAndId } from '../../utils/utils'
import QuantityController from '../../components/QuantityController'
import Button from '../../components/Button'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Purchase } from '../../types/purchase.type'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from '../../contexts/app.context'
import noProduct from '../../assets/images/no-product.png'

// add two more properties to state of each purchase
// interface ExtendedPurchase extends Purchase {
//   disabled: boolean
//   checked: boolean
// }

export default function Cart() {
  // get states for purchases by using contextApi
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  // get purchase list
  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: [
      'purchases',
      {
        status: purchaseStatus.inCart
      }
    ],
    queryFn: () => purchaseApi.getPurchaseList({ status: purchaseStatus.inCart })
  })
  // console.log(purchasesInCart)

  // update purchases (update quantity)
  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    // after updating, get `purchaseList` api will be called again to update the UI
    onSuccess: () => {
      refetch() // call again `purchases` api to get list of purchases
    }
  })

  // buy products
  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProduct,
    // after updating, get `purchaseList` api will be called again to update the UI
    onSuccess: (data) => {
      refetch() // call again `purchases` api to get list of purchases
      toast.success(data.data.message, {
        position: 'top-center',
        autoClose: 1000
      })
    }
  })

  // delete purchase
  const deletePurchaseMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    // after updating, get `purchaseList` api will be called again to update the UI
    onSuccess: () => {
      refetch() // call again `purchases` api to get list of purchases
    }
  })

  // Retrieve state from URL
  const location = useLocation()
  // console.log(location.state)

  // Retrieve purchaseId of `buy now` purchase, and pass it to useEffect to render the purchases list
  const chosenPurchaseIdFromLocation = (location.state as { purchaseId: string } | null)?.purchaseId

  // Retrieve info of purchases
  const purchasesInCart = purchasesInCartData?.data.data

  // check if all purchase is `checked`
  // if all purchases are checked, this input will be checked
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])

  // get checked purchases and its length
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length

  // calculate total price of checked purchases
  const totalCheckedPurchasesValue = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + current.product.price * current.buy_count
      }, 0),
    [checkedPurchases] // totalCheckedPurchasesValue will be recalculated when checkedPurchases changes
  )

  // calculate saved money
  const totalCheckedSavingValue = useMemo(
    () =>
      checkedPurchases.reduce((result, current) => {
        return result + (current.product.price_before_discount - current.product.price) * current.buy_count
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchasesObject = keyBy(prev, '_id')
      // console.log(extendedPurchasesObject)

      return (
        purchasesInCart?.map((purchase) => {
          const isChosenPurchaseIdFromLocation = chosenPurchaseIdFromLocation === purchase._id
          return {
            ...purchase,
            disabled: false,
            checked: isChosenPurchaseIdFromLocation || Boolean(extendedPurchasesObject[purchase._id]?.checked)
          }
        }) || []
      )
    })
  }, [purchasesInCart, chosenPurchaseIdFromLocation])

  //console.log(extendedPurchases)

  // This happen when the component is unmounted, meaning F5 , will replace the current state with value we ask for
  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  // use currying function: function return another function
  // this action makes sure that setExtendedPurchases will not be implemented until the component is rendered
  const handleChecked = (purchaseIndex: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      // changes are made to draft object which records changes and takes care of neccessary copies without affecting the original object
      produce((draft) => {
        draft[purchaseIndex].checked = event.target.checked
      })
    )
  }

  // Check all purchases at one time
  const handleCheckedAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    ) // changes are made to draft object which records changes and takes care of neccessary copies without affecting the original object)
  }

  // when type number on number input
  // 'VALUE' comes from onType in QuantityController
  const handleTypeQuantity = (purchaseIndex: number) => (value: number) => {
    setExtendedPurchases(
      // changes are made to draft object which records changes and takes care of neccessary copies without affecting the original object
      produce((draft) => {
        // when changing the quantity, the numberInput will be disabled, not changing until finished updating
        draft[purchaseIndex].buy_count = value
      })
    )
  }

  // increase or decrease the quantity of a product
  const handleQuantity = (purchaseIndex: number, value: number, enabled: boolean) => {
    if (enabled) {
      const purchase = extendedPurchases[purchaseIndex]
      setExtendedPurchases(
        // changes are made to draft object which records changes and takes care of neccessary copies without affecting the original object
        produce((draft) => {
          // when changing the quantity, the numberInput will be disabled, not changing until finished updating
          draft[purchaseIndex].disabled = true
        })
      )
      updatePurchaseMutation.mutate({
        product_id: purchase.product._id,
        buy_count: value
      })
    }
  }

  // handle delete for 1 purchase
  const handleDelete = (purchaseIndex: number) => () => {
    const purchaseId = extendedPurchases[purchaseIndex]._id
    deletePurchaseMutation.mutate([purchaseId])
  }

  // handle delete many purchases
  const handleDeleteManyPurchases = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deletePurchaseMutation.mutate(purchaseIds)
  }

  // handle buy purchases
  const handlePurchases = () => {
    // only let user purchase if the item is checked
    if (checkedPurchases.length > 0) {
      // create an object that have  data type as an array of object: {product_id: string; buy_count: number}[]
      const body = checkedPurchases.map((purchase) => ({
        product_id: purchase.product._id,
        buy_count: purchase.buy_count
      }))
      buyProductsMutation.mutate(body)
    }
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        {extendedPurchases.length > 0 ? (
          <>
            {/* Overflow purchase list */}
            <div className='overflow-auto'>
              <div className='min-w-[1000px]'>
                {/* Main Title */}
                <div className='grid grid-cols-12 rounded-sm bg-white px-9 py-5 text-sm capitalize text-gray-500 shadow'>
                  <div className='col-span-6 bg-white'>
                    <div className='flex items-center'>
                      <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                        <input
                          type='checkbox'
                          className='h5 w-5 accent-orange'
                          checked={isAllChecked}
                          onChange={handleCheckedAll}
                        />
                      </div>
                      <div className='flex-grow text-black'>Sản Phẩm</div>
                    </div>
                  </div>
                  <div className='col-span-6'>
                    <div className='grid grid-cols-5 text-center'>
                      <div className='col-span-2'>Đơn Giá</div>
                      <div className='col-span-1'>Số Lượng</div>
                      <div className='col-span-1'>Số Tiền</div>
                      <div className='col-span-1'>Thao Tác</div>
                    </div>
                  </div>
                </div>
                {/* Main Title */}

                {/* Main Content */}
                {extendedPurchases.length > 0 && (
                  <div className='my-3 rounded-sm bg-white p-5 shadow'>
                    {extendedPurchases?.map((purchase, index) => (
                      <div
                        key={purchase._id}
                        className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white px-4 py-5 text-center text-sm text-gray-500 first:mt-0'
                      >
                        {/* Image & Name */}
                        <div className='col-span-6'>
                          <div className='flex'>
                            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                              <input
                                type='checkbox'
                                className='h5 w-5 accent-orange'
                                checked={purchase.checked}
                                onChange={handleChecked(index)}
                              />
                            </div>
                            <div className='flex-grow'>
                              <div className='flex'>
                                <Link
                                  className='h-20 w-20 flex-shrink-0'
                                  to={`${path.home}${generateNameAndId({ name: purchase.product.name, id: purchase.product._id })}`}
                                >
                                  <img alt={purchase.product.name} src={purchase.product.image} />
                                </Link>
                                <div className='flex-grow px-2 pb-2 pt-1'>
                                  <Link
                                    to={`${path.home}${generateNameAndId({ name: purchase.product.name, id: purchase.product._id })}`}
                                    className='line-clamp-2 text-left'
                                  >
                                    {purchase.product.name}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Image & Name */}

                        {/* Other info */}
                        <div className='col-span-6'>
                          <div className='grid grid-cols-5 items-center'>
                            <div className='col-span-2'>
                              <div className='flex items-center justify-center'>
                                <span className='text-gray-300 line-through'>
                                  ₫{formatCurrency(purchase.product.price_before_discount)}
                                </span>
                                <span className='ml-3'>₫{formatCurrency(purchase.product.price)}</span>
                              </div>
                            </div>
                            <div className='col-span-1'>
                              <QuantityController
                                max={purchase.product.quantity}
                                value={purchase.buy_count}
                                classNameWrapper='flex items-center'
                                onIncrease={(value) => handleQuantity(index, value, value <= purchase.product.quantity)}
                                onDecrease={(value) => handleQuantity(index, value, value >= 1)}
                                onType={handleTypeQuantity(index)}
                                onFocusOut={(value) =>
                                  handleQuantity(
                                    index,
                                    value,
                                    value >= 1 &&
                                      value <= purchase.product.quantity &&
                                      value !== (purchasesInCart as Purchase[])[index].buy_count
                                  )
                                }
                                disabled={purchase.disabled}
                              />
                            </div>
                            <div className='col-span-1'>
                              <span className='text-orange'>
                                {formatCurrency(purchase.product.price * purchase.buy_count)}
                              </span>
                            </div>
                            <div className='col-span-1'>
                              <button
                                onClick={handleDelete(index)}
                                className='bg-none text-black transition-colors hover:text-orange'
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                        {/* Other info */}
                      </div>
                    ))}
                  </div>
                )}
                {/* Main Content */}
              </div>
            </div>
            {/* Overflow purchase list */}

            {/* Sticky Bottom */}
            <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
              <div className='flex items-center'>
                <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                  <input
                    type='checkbox'
                    className='h-5 w-5'
                    accent-orange
                    checked={isAllChecked}
                    onClick={handleCheckedAll}
                  />
                </div>
                <button className='mx-3 border-none bg-none'>Chọn tất cả ({extendedPurchases.length})</button>
                <button className='mx-3 border-none bg-none' onClick={handleDeleteManyPurchases}>
                  Xóa
                </button>
              </div>

              <div className='mt-5 flex flex-col sm:ml-auto sm:mt-0 sm:flex-row sm:items-center'>
                <div>
                  <div className='flex items-center sm:justify-end'>
                    <div>Tổng thanh toán ({checkedPurchasesCount} sản phẩm):</div>
                    <div className='ml-2 text-2xl text-orange'>₫{formatCurrency(totalCheckedPurchasesValue)}</div>
                  </div>
                  <div className='flex items-center text-sm sm:justify-end'>
                    <div className='text-gray-500'>Tiết kiệm</div>
                    <div className='ml-6 text-orange'>₫{formatCurrency(totalCheckedSavingValue)}</div>
                  </div>
                </div>
                <Button
                  onClick={handlePurchases}
                  className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
                  disabled={buyProductsMutation.isPending}
                >
                  Mua hàng
                </Button>
              </div>
            </div>

            {/* Sticky Bottom */}
          </>
        ) : (
          <div className='text-center'>
            <img src={noProduct} alt='no purchase' className='mx-auto h-24 w-24' />
            <div className='mt-5 font-bold text-gray-400'>Giỏ hàng của bạn còn trống</div>
            <div className='mt-5 text-center'>
              <Link
                to={path.home}
                className='rounded-sm bg-orange px-10 py-2 uppercase text-white transition-all hover:bg-orange/80'
              >
                Mua ngay
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
