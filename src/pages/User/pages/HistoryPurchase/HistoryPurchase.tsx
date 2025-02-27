import { createSearchParams, Link } from 'react-router'
import path from '../../../../constants/path'
import { purchaseStatus } from '../../../../constants/purchase'
import classNames from 'classnames'
import useQueryParams from '../../../../hooks/useQueryParams'
import { useQuery } from '@tanstack/react-query'
import purchaseApi from '../../../../api/purchase.api'
import { PurchaseListStatus } from '../../../../types/purchase.type'
import { formatCurrency, generateNameAndId } from '../../../../utils/utils'

const purchaseTabs = [
  {
    status: purchaseStatus.all,
    name: 'Tat ca'
  },
  {
    status: purchaseStatus.waitForConfirmation,
    name: 'Cho xac nhan'
  },
  {
    status: purchaseStatus.waitForIssue,
    name: 'Cho nhan hang'
  },
  {
    status: purchaseStatus.inShippingProcess,
    name: 'Dang giao'
  },
  {
    status: purchaseStatus.delivered,
    name: 'Da giao'
  },
  {
    status: purchaseStatus.cancelled,
    name: 'Da huy'
  }
]

export default function HistoryPurchase() {
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchaseStatus.all

  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status }],
    queryFn: () => purchaseApi.getPurchaseList({ status: status as PurchaseListStatus })
  })

  const purchasesInCart = purchasesInCartData?.data.data

  const purchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))
  return (
    <div>
      <div className='overflow-x-auto'>
        <div className='min-w-[700px]'>
          <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{purchaseTabsLink}</div>
          <div>
            {purchasesInCart?.map((purchase) => (
              <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
                <Link
                  to={`${path.home}${generateNameAndId({ name: purchase.product.name, id: purchase.product._id })}`}
                  className='flex'
                >
                  <div className='flex-shrink-0'>
                    <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
                  </div>
                  <div className='ml-3 flex-grow overflow-hidden'>
                    <div className='truncate'>{purchase.product.name}</div>
                    <div className='mt-3'>x{purchase.buy_count}</div>
                  </div>
                  <div className='ml-3 flex-shrink-0'>
                    <span className='truncate text-gray-500 line-through'>
                      ₫{formatCurrency(purchase.product.price_before_discount)}
                    </span>
                    <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                  </div>
                </Link>
                <div className='flex justify-end'>
                  <div>
                    <span>Tong gia tien</span>
                    <span className='ml-4 text-xl text-orange'>
                      ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
