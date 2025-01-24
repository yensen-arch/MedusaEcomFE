import itemsAvailability from './templates/items-availability.js';
import whatsMySize from './templates/what-my-size.js';
import compositionAndCare from './templates/composition-and-care.js';
import itemsWarranty from './templates/items-warranty.js';
import pricingPolicy from './templates/pricing-policy.js';
import giftCard from './templates/gift-card.js';
import giftPackaging from './templates/gift-packaging.js';
import shippingMethods from './templates/shipping-and-cost.js';
import OrderInServeralDeliveries from './templates/order-in-several-orders.js';
import WhereDoWeShip from './templates/where-do-we-ship.js';
import PaymentMethods from './templates/payment-methods.js';
import PaymentSecurity from './templates/payment-security.js';
import Invoices from './templates/invoices.js';
import PayWithGiftCard from './templates/payment-with-giftcard.js';
import OnlineShopping from './templates/online-shopping.js';
import OrderStatus from './templates/order-status.js';
import ChangeOrCancel from './templates/change-or-cancel.js';
import IssueMyOrder from './templates/issue-my-order.js';
import InStorePurchases from './templates/in-store-purchases.js';
import RetreiveStoreReceipt from './templates/retreive-store-receipt.js';
import OnlinePurchaseStore from './templates/online-purchase-from-store-device.js';
import Exchanges from './templates/exchanges.js';
import HowToReturn from './templates/how-to-return.js';
import HowToExchange from './templates/how-to-exchange.js';
import RefundForGiftPurchase from './templates/refund-for-gift-purchase.js';
import SpecialReturn from './templates/special-return.js'
import NewsLetter from './templates/newsletter.js';
import StoreMode from './templates/store-mode-in-app.js';
import UsedCloth from './templates/used-cloth-program.js';


export const faqs =[
  {
    text: 'HOW TO RETURN',
    link: '#'
  },
  {
    text: 'ITEMS AVAILABILITY',
    link: '#'
  },
  {
    text: 'RETRIEVE MY STORE RECEIPT',
    link: '#'
  },
  {
    text: 'ORDER STATUS',
    link: '#'
  },
  {
    text: 'REFUNDS',
    link: '#'
  }
];

export const faqs2 =[
  {
    title: 'MY ZARA ACCOUNT',
    pointers: [
      'REGISTRATION AND LOGIN',
      'MANAGING MY PROFILE',
      'MY FAVOURTIES',
      'MY ZARA QR CODE'
    ]
  },
  {
    title: 'ITEMS AND SIZES',
    pointers: [
      'ITEM AVAILABILITY',
      'WHAT\'S MY SIZE?',
      'COMPOSITION AND CARE',
      'ITEMS WARRANTY',
      'PRICING POLICY',
      'WITHDRAWN ITEMS'
    ]
  },
  {
    title: 'GIFT OPTIONS',
    pointers: [
      'GIFT CARD',
      'GIFT PACKAGING',
    ]
  },
  {
    title: 'SHIPPING',
    pointers:[
      'SHIPPING METHODS AND COSTS',
      'ORDERS IN SEVRAL DELIVERIES',
      'WHERE DO WE SHIP?'
    ]
  },
  {
    title: 'PAYMENTS AND INVOICES',
    pointers:[
      'PAYMENT METHODS',
      'INVOICES',
      'PAYMENT SECURITY',
      'PAYMENT WITH A GIFTCARD'
    ]
  },
  {
    title: 'MY PURCHASES',
    pointers: [
      'ONLINE SHOPPING',
      'ORDER STATUS',
      'CHANGE OR CANCEL MY ONLINE ORDER',
      'ISSUES WITH MY ORDER',
      'IN-STORE PURCHASES',
      'RETRIEVE MY STORE RECEIPT',
      'ONLINE PURCHASE FROM A STORE DEVICE'
    ]
  },
  {
    title: 'EXCHANGES, RETURNS AND REFUNDS',
    pointers: [
      'HOW TO RETURN',
      'HOW TO EXCHANGE',
      'REFUNDS',
      'RETURN FOR A PURCHASE MADE WITH A GIFT CARD',
      'SPECIAL RETURNS CONDITIONS',
    ]
  },
  {
    title: 'ZARA EXPERIENCES',
    pointers: [
      'OUR USED CLOTHING COLLECTION PROGRAMME',
      'STORE MODE IN THE APP',
      'NEWSLETTER',
    ]
  }
]

export const items_availability_map = {
  "ITEMS AVAILABILITY": itemsAvailability,
  "WHAT'S MY SIZE?": whatsMySize,
  "COMPOSITION AND CARE": compositionAndCare,
  "ITEMS WARRANTY": itemsWarranty,
  "PRICING POLICY": pricingPolicy
}

export const gift_card_help = {
  "GIFT CARD": giftCard,
  "GIFT PACKAGING": giftPackaging,
}

export const shipping_map = {
  "SHIPPING METHODS, TIMES AND COSTS": shippingMethods,
  "ORDERS IN SEVERAL DELIVERIES": OrderInServeralDeliveries,
  "WHERE DO WE SHIP?": WhereDoWeShip
}

export const payment_invoice_map = {
  "PAYMENT METHODS": PaymentMethods,
  "PAYMENT SECURITY": PaymentSecurity,
  "INVOICES": Invoices,
  "PAYMENT WITH A GIFT CARD": PayWithGiftCard
}

export const my_purchases_help_map = {
  "ONLINE SHOPPING": OnlineShopping,
  "ORDER STATUS": OrderStatus,
  "CHANGE OR CANCEL MY ONLINE ORDER": ChangeOrCancel,
  "ISSUES WITH MY ORDER": IssueMyOrder,
  "IN STORE PURCHASES": InStorePurchases,
  "RETREIVE MY STORE RECEIPT": RetreiveStoreReceipt,
  "ONLINE PURCHASE FROM A STORE DEVICE": OnlinePurchaseStore
};

export const exchanges_returns_refunds_map = {
  "HOW TO RETURN" : HowToReturn,
  "HOW TO EXCHANGE": HowToExchange,
  "REFUNDS": Exchanges,
  "REFUND FOR A PURCHASE MADE WITH A GIFT CARD": RefundForGiftPurchase,
  "SPECIAL RETURN CONDITIONS": SpecialReturn
};

export const zara_exp_map = {
  "NEWSLETTER": NewsLetter,
  "STORE MODE IN THE APP": StoreMode,
  "OUR USED CLOTHING COLLECTION PROGRAMME": UsedCloth
}