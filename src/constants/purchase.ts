export const purchaseStatus = {
  inCart: -1,
  all: 0,
  waitForConfirmation: 1,
  waitForIssue: 2,
  inShippingProcess: 3,
  delivered: 4,
  cancelled: 5
} as const
