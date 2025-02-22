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
    text: 'RETRIEVE MY STORE RECEIPT',
    link: '#'
  },
  {
    text: 'ITEMS AVAILABILITY',
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
    title: 'MY Clothd ACCOUNT',
    pointers: [
      'REGISTRATION AND LOGIN',
      'MANAGING MY PROFILE',
      'MY FAVOURTIES',
      'MY Clothd QR CODE'
    ]
  },
  {
    title: 'ITEMS AND SIZES',
    url:'items-and-sizes',
    pointers: [
      {
        pointer: 'ITEM AVAILABILITY',
        key: "item-availability"
      },
      {
        pointer: 'WHAT\'S MY SIZE?',
        key: 'my-size'
      },
      {
        pointer: 'COMPOSITION AND CARE',
        key: 'composition-and-care'
      },
      {
        pointer: 'ITEMS WARRANTY',
        key: 'warranty'
      },
      {
        pointer: 'PRICING POLICY',
        key: 'pricing'
      }
    ]
  },
  {
    title: 'GIFT OPTIONS',
    url: 'gift-card',
    pointers: [
      {
        pointer: 'GIFT CARD',
        key: 'gift-card'
      },
      {
        pointer: 'GIFT PACKAGING',
        key: 'gift-package'
      }
    ]
  },
  {
    title: 'SHIPPING',
    url: 'shipping',
    pointers:[
      {
        pointer: 'SHIPPING METHODS AND COSTS',
        key: 'shipping-methods'
      },
      {
        pointer: 'ORDERS IN SEVRAL DELIVERIES',
        key: 'multiple-deliveries'
      },
      {
        pointer: 'WHERE DO WE SHIP?',
        key: 'shipping'
      }
    ]
  },
  {
    title: 'PAYMENTS AND INVOICES',
    url: 'payment-invoice',
    pointers:[
      {
        pointer: 'PAYMENT METHODS',
        key: 'methods'
      },
      {
        pointer: 'INVOICES',
        key: "invoices"
      },
      {
        pointer: 'PAYMENT SECURITY',
        key: "security",
      },
      {
        pointer: 'PAYMENT WITH A GIFTCARD',
        key: 'gift-card-payment'
      }
    ]
  },
  {
    title: 'MY PURCHASES',
    url: "myOrders",
    pointers: [
      {
        pointer: 'ONLINE SHOPPING',
        key: 'online',
      },
      {
        pointer: 'ORDER STATUS',
        key: 'status',
      },
      {
        pointer: 'CHANGE OR CANCEL MY ONLINE ORDER',
        key: 'change-cancel'
      },
      {
        pointer: 'ISSUES WITH MY ORDER',
        key: "issues"
      },
      {
        pointer: 'IN-STORE PURCHASES',
        key: "in-store"
      },
      {
        pointer: 'RETRIEVE MY STORE RECEIPT',
        key: "retreive-receipt"
      },
      {
        pointer: 'ONLINE PURCHASE FROM A STORE DEVICE',
        key: 'store-device'
      }
    ]
  },
  {
    title: 'EXCHANGES, RETURNS AND REFUNDS',
    url: 'exchanges',
    pointers: [
      {
        pointer: 'HOW TO RETURN',
        key: "how-to-return"
      },
      {
        pointer: 'HOW TO EXCHANGE',
        key: 'how-to-exchange',
      },
      {
        pointer: 'REFUNDS',
        key: 'refunds'
      },
      {
        pointer: 'RETURN FOR A PURCHASE MADE WITH A GIFT CARD',
        key: 'gift-card-refund'
      },
      {
        pointer: 'SPECIAL RETURNS CONDITIONS',
        key: 'special'
      }
    ]
  },
  {
    title: 'Clothd EXPERIENCES',
    url: 'Clothd-experiences',
    pointers: [
      {
        pointer: 'OUR USED CLOTHING COLLECTION PROGRAMME',
        key: 'programme'
      },
      {
        pointer: 'STORE MODE IN THE APP',
        key: 'store-mode'
      },
      {
        pointer: 'NEWSLETTER',
        key: 'newsletter'
      }
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

export const Clothd_exp_map = {
  "NEWSLETTER": NewsLetter,
  "STORE MODE IN THE APP": StoreMode,
  "OUR USED CLOTHING COLLECTION PROGRAMME": UsedCloth
}

export const param_key_match = {
  "item-availablity": "ITEMS AVAILABILITY",
  "my-size": "WHAT'S MY SIZE?",
  "composition-and-care": "COMPOSITION AND CARE",
  "warranty": "ITEMS WARRANTY",
  "pricing": "PRICING POLICY",
  "gift-card": "GIFT CARD",
  "gift-package": "GIFT PACKAGING",
  "shipping-methods": "SHIPPING METHODS, TIMES AND COSTS",
  "multiple-deliveries": "ORDERS IN SEVERAL DELIVERIES",
  "shipping": "WHERE DO WE SHIP?",
  "methods": "PAYMENT METHODS",
  "security": "PAYMENT SECURITY",
  "invoices": "INVOICES",
  "gift-card-payment": "PAYMENT WITH A GIFT CARD",
  "online": "ONLINE SHOPPING",
  "status": "ORDER STATUS",
  "change-cancel": "CHANGE OR CANCEL MY ONLINE ORDER",
  "issues": "ISSUES WITH MY ORDER",
  "in-store": "IN STORE PURCHASES",
  "retreive-receipt": "RETREIVE MY STORE RECEIPT",
  "store-device": "ONLINE PURCHASE FROM A STORE DEVICE",
  "how-to-return": "HOW TO RETURN",
  "how-to-exchange": "HOW TO EXCHANGE",
  "refunds": "REFUNDS",
  "gift-card-refund": "REFUND FOR A PURCHASE MADE WITH A GIFT CARD",
  "special": "SPECIAL RETURN CONDITIONS",
  "newsletter": "NEWSLETTER",
  "store-mode": "STORE MODE IN THE APP",
  "programme": "OUR USED CLOTHING COLLECTION PROGRAMME"
}

export const zipCodeRanges = {
  Alabama: { min: "35004", max: "36925" },
  Alaska: { min: "99501", max: "99950" },
  Arizona: { min: "85001", max: "86556" },
  Arkansas: { min: "71601", max: "72959" },
  California: { min: "90001", max: "96162" },
  Colorado: { min: "80001", max: "81658" },
  Connecticut: { min: "06001", max: "06928" },
  Delaware: { min: "19701", max: "19980" },
  "District of Columbia": { min: "20001", max: "20799" },
  Florida: { min: "32004", max: "34997" },
  Georgia: { min: "30001", max: "39901" },
  Hawaii: { min: "96701", max: "96898" },
  Idaho: { min: "83201", max: "83876" },
  Illinois: { min: "60001", max: "62999" },
  Indiana: { min: "46001", max: "47997" },
  Iowa: { min: "50001", max: "52809" },
  Kansas: { min: "66002", max: "67954" },
  Kentucky: { min: "40003", max: "42788" },
  Louisiana: { min: "70001", max: "71497" },
  Maine: { min: "03901", max: "04992" },
  Maryland: { min: "20331", max: "21930" },
  Massachusetts: { min: "01001", max: "05544" },
  Michigan: { min: "48001", max: "49971" },
  Minnesota: { min: "55001", max: "56763" },
  Mississippi: { min: "38601", max: "39776" },
  Missouri: { min: "63001", max: "65899" },
  Montana: { min: "59001", max: "59937" },
  Nebraska: { min: "68001", max: "69367" },
  Nevada: { min: "88901", max: "89883" },
  "New Hampshire": { min: "03031", max: "03897" },
  "New Jersey": { min: "07001", max: "08989" },
  "New Mexico": { min: "87001", max: "88439" },
  "New York": { min: "00501", max: "14975" },
  "North Carolina": { min: "27006", max: "28909" },
  "North Dakota": { min: "58001", max: "58856" },
  Ohio: { min: "43001", max: "45999" },
  Oklahoma: { min: "73001", max: "74966" },
  Oregon: { min: "97001", max: "97920" },
  Pennsylvania: { min: "15001", max: "19640" },
  "Rhode Island": { min: "02801", max: "02940" },
  "South Carolina": { min: "29001", max: "29945" },
  "South Dakota": { min: "57001", max: "57799" },
  Tennessee: { min: "37010", max: "38589" },
  Texas: { min: "73301", max: "79999" },
  Utah: { min: "84001", max: "84784" },
  Vermont: { min: "05001", max: "05907" },
  Virginia: { min: "20101", max: "24658" },
  Washington: { min: "98001", max: "99403" },
  "West Virginia": { min: "24701", max: "26886" },
  Wisconsin: { min: "53001", max: "54990" },
  Wyoming: { min: "82001", max: "83128" }
};

// Helper function to get state from ZIP code
export const getStateFromZip = (zipCode) => {
  const zip = parseInt(zipCode);
  for (const [state, range] of Object.entries(zipCodeRanges)) {
    if (zip >= parseInt(range.min) && zip <= parseInt(range.max)) {
      return state;
    }
  }
  return null;
};

// Maintain backward compatibility
export const zipToStateMap = Object.fromEntries(
  Object.entries(zipCodeRanges).map(([state, range]) => [range.min, state])
);


