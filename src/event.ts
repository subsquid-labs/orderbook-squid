/* Autogenerated file. Do not edit manually. */

/* tslint:disable */
/* eslint-disable */

/*
  Fuels version: 0.77.0
  Forc version: 0.51.1
  Fuel-Core version: 0.22.1
*/

import type {
  BigNumberish,
  BN,
  BytesLike,
  Contract,
  DecodedValue,
  FunctionFragment,
  Interface,
  InvokeFunction,
} from "fuels";

export type Enum<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

/*
    Mimics Sway Option and Vectors.
    Vectors are treated like arrays in Typescript.
  */
export type Option<T> = T | undefined;

export type Vec<T> = T[];
// export type DecodedEvent = OrderChangeEvent | TradeEvent | MarketCreateEvent;
export type DecodedEvent = OpenOrderEvent | CancelOrderEvent | MatchOrderEvent | TradeOrderEvent;
export enum Error {
  AccessDenied = "AccessDenied",
  NoOrdersFound = "NoOrdersFound",
  NoMarketFound = "NoMarketFound",
  OrdersCantBeMatched = "OrdersCantBeMatched",
  FirstArgumentShouldBeOrderSellSecondOrderBuy = "FirstArgumentShouldBeOrderSellSecondOrderBuy",
  ZeroAssetAmountToSend = "ZeroAssetAmountToSend",
  MarketAlreadyExists = "MarketAlreadyExists",
  BadAsset = "BadAsset",
  BadValue = "BadValue",
  BadPrice = "BadPrice",
  BaseSizeIsZero = "BaseSizeIsZero",
  CannotRemoveOrderIndex = "CannotRemoveOrderIndex",
  CannotRemoveOrderByTrader = "CannotRemoveOrderByTrader",
  CannotRemoveOrder = "CannotRemoveOrder",
}

export type Identity = Enum<{
  Address: Address;
  ContractId: ContractId;
}>;

// export enum OrderChangeEventIdentifier {
//   OrderOpenEvent = "OrderOpenEvent",
//   OrderCancelEvent = "OrderCancelEvent",
//   OrderMatchEvent = "OrderMatchEvent",
// }

export enum ReentrancyError {
  NonReentrant = "NonReentrant",
}

export type Address = { value: string };
export type AssetId = { value: string };
export type ContractId = { value: string };
export type I64 = { value: BigNumberish; negative: boolean };
export type Market = {
  asset_id: AssetId;
  asset_decimals: BigNumberish;
};
// export type MarketCreateEvent = {
//   asset_id: AssetId;
//   asset_decimals: BigNumberish;
//   timestamp: BigNumberish;
//   tx_id: string;
// };

enum AssetType {
  Base,
  Quote
}
enum OrderType {
  Sell,
  Buy
}

enum OrderStatus {
  Active,
  Closed,
  Canceled
}

// type Order {
// id: ID!
// asset: String! @index
// amount: BigInt!
// asset_type: AssetType!
// order_type: OrderType! @index
// price: BigInt! @index
// user: String! @index
// status: OrderStatus! @index # order status
// initial_amount: BigInt! # initial order amount
// timestamp: String!
// }
export type Order = {
  id: string;
  asset: AssetId;
  amount: I64;
  asset_type: AssetType;
  order_type: OrderType;
  price: BigNumberish;
  user: Address;
  status: OrderStatus;
  initial_amount: I64;
  timestamp: string
};

// export type OrderChangeEvent = {
//   order_id: string;
//   sender: Identity;
//   timestamp: BigNumberish;
//   identifier: OrderChangeEventIdentifier;
//   tx_id: string;
//   order: Option<Order>;
// };
export type OpenOrderEvent = {
  // id: ID!;
  order_id: string;
  tx_id: string;
  asset: AssetId;
  amount: I64;
  asset_type: AssetType;
  order_type: OrderType;
  price: BigNumberish;
  user: Address;
  timestamp: string;
};


// type TradeOrderEvent {
// id: ID!
// base_sell_order_id: String! @index
// base_buy_order_id: String! @index
// tx_id: String! @index
// order_matcher: String! @index
// trade_size: BigInt! @index
// trade_price: BigInt! @index
//   # block_height: BigInt! @index
// timestamp: String!
// }
export type TradeOrderEvent = {
  base_sell_order_id: string;
  base_buy_order_id: string;
  tx_id: string;
  order_matcher: Address;
  trade_size: BigNumberish;
  trade_price: BigNumberish;
  timestamp: BigNumberish;
}

// type MatchOrderEvent {
//   id: ID!
//   order_id: String! @index
// tx_id: String!
// asset: String!
// order_matcher: String!
// owner: String!
// counterparty: String!
// match_size: BigInt!
// match_price: BigInt!
// timestamp: String!
// }
export type MatchOrderEvent = {
  order_id: string;
  tx_id: string;
  asset: AssetId;
  order_matcher: Address;
  owner: Address;
  counterparty: Address;
  match_size: I64;
  match_price: BigNumberish;
  timestamp: BigNumberish;
}

// type CancelOrderEvent {
//   id: ID!
//   order_id: String! @index
// tx_id: String!
// timestamp: String!
// }
export type CancelOrderEvent = {
  order_id: string;
  tx_id: string;
  timestamp: BigNumberish;
}

export type OrderbookAbiConfigurables = {
  QUOTE_TOKEN: AssetId;
  QUOTE_TOKEN_DECIMALS: BigNumberish;
  PRICE_DECIMALS: BigNumberish;
};

interface OrderbookAbiInterface extends Interface {
  functions: {
    cancel_order: FunctionFragment;
    create_market: FunctionFragment;
    get_configurables: FunctionFragment;
    get_market_by_id: FunctionFragment;
    get_order_change_events_by_order: FunctionFragment;
    market_exists: FunctionFragment;
    match_orders: FunctionFragment;
    open_order: FunctionFragment;
    order_by_id: FunctionFragment;
    orders_by_trader: FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "cancel_order",
    values: [string]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "create_market",
    values: [AssetId, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_configurables",
    values: []
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_market_by_id",
    values: [AssetId]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "get_order_change_events_by_order",
    values: [string]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "market_exists",
    values: [AssetId]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "match_orders",
    values: [string, string]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "open_order",
    values: [AssetId, I64, BigNumberish]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "order_by_id",
    values: [string]
  ): Uint8Array;
  encodeFunctionData(
    functionFragment: "orders_by_trader",
    values: [Address]
  ): Uint8Array;

  decodeFunctionData(
    functionFragment: "cancel_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "create_market",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_configurables",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_market_by_id",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "get_order_change_events_by_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "market_exists",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "match_orders",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "open_order",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "order_by_id",
    data: BytesLike
  ): DecodedValue;
  decodeFunctionData(
    functionFragment: "orders_by_trader",
    data: BytesLike
  ): DecodedValue;
}

export const abi = {
  encoding: "1",
  types: [
    {
      typeId: 0,
      type: "()",
      components: [],
      typeParameters: null,
    },
    {
      typeId: 1,
      type: "(_, _, _)",
      components: [
        {
          name: "__tuple_element",
          type: 12,
          typeArguments: null,
        },
        {
          name: "__tuple_element",
          type: 22,
          typeArguments: null,
        },
        {
          name: "__tuple_element",
          type: 22,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 2,
      type: "b256",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 3,
      type: "bool",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 4,
      type: "enum Error",
      components: [
        {
          name: "AccessDenied",
          type: 0,
          typeArguments: null,
        },
        {
          name: "NoOrdersFound",
          type: 0,
          typeArguments: null,
        },
        {
          name: "NoMarketFound",
          type: 0,
          typeArguments: null,
        },
        {
          name: "OrdersCantBeMatched",
          type: 0,
          typeArguments: null,
        },
        {
          name: "FirstArgumentShouldBeOrderSellSecondOrderBuy",
          type: 0,
          typeArguments: null,
        },
        {
          name: "ZeroAssetAmountToSend",
          type: 0,
          typeArguments: null,
        },
        {
          name: "MarketAlreadyExists",
          type: 0,
          typeArguments: null,
        },
        {
          name: "BadAsset",
          type: 0,
          typeArguments: null,
        },
        {
          name: "BadValue",
          type: 0,
          typeArguments: null,
        },
        {
          name: "BadPrice",
          type: 0,
          typeArguments: null,
        },
        {
          name: "BaseSizeIsZero",
          type: 0,
          typeArguments: null,
        },
        {
          name: "CannotRemoveOrderIndex",
          type: 0,
          typeArguments: null,
        },
        {
          name: "CannotRemoveOrderByTrader",
          type: 0,
          typeArguments: null,
        },
        {
          name: "CannotRemoveOrder",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 5,
      type: "enum Identity",
      components: [
        {
          name: "Address",
          type: 11,
          typeArguments: null,
        },
        {
          name: "ContractId",
          type: 13,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 6,
      type: "enum Option",
      components: [
        {
          name: "None",
          type: 0,
          typeArguments: null,
        },
        {
          name: "Some",
          type: 9,
          typeArguments: null,
        },
      ],
      typeParameters: [9],
    },
    {
      typeId: 7,
      type: "enum OrderChangeEventIdentifier",
      components: [
        {
          name: "OrderOpenEvent",
          type: 0,
          typeArguments: null,
        },
        {
          name: "OrderCancelEvent",
          type: 0,
          typeArguments: null,
        },
        {
          name: "OrderMatchEvent",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 8,
      type: "enum ReentrancyError",
      components: [
        {
          name: "NonReentrant",
          type: 0,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 9,
      type: "generic T",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 10,
      type: "raw untyped ptr",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 11,
      type: "struct Address",
      components: [
        {
          name: "bits",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 12,
      type: "struct AssetId",
      components: [
        {
          name: "bits",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 13,
      type: "struct ContractId",
      components: [
        {
          name: "bits",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 14,
      type: "struct I64",
      components: [
        {
          name: "value",
          type: 23,
          typeArguments: null,
        },
        {
          name: "negative",
          type: 3,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 15,
      type: "struct Market",
      components: [
        {
          name: "asset_id",
          type: 12,
          typeArguments: null,
        },
        {
          name: "asset_decimals",
          type: 22,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 16,
      type: "struct MarketCreateEvent",
      components: [
        {
          name: "asset_id",
          type: 12,
          typeArguments: null,
        },
        {
          name: "asset_decimals",
          type: 22,
          typeArguments: null,
        },
        {
          name: "timestamp",
          type: 23,
          typeArguments: null,
        },
        {
          name: "tx_id",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 17,
      type: "struct Order",
      components: [
        {
          name: "id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "trader",
          type: 11,
          typeArguments: null,
        },
        {
          name: "base_token",
          type: 12,
          typeArguments: null,
        },
        {
          name: "base_size",
          type: 14,
          typeArguments: null,
        },
        {
          name: "base_price",
          type: 23,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 18,
      type: "struct OrderChangeEvent",
      components: [
        {
          name: "order_id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "sender",
          type: 5,
          typeArguments: null,
        },
        {
          name: "timestamp",
          type: 23,
          typeArguments: null,
        },
        {
          name: "identifier",
          type: 7,
          typeArguments: null,
        },
        {
          name: "tx_id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "order",
          type: 6,
          typeArguments: [
            {
              name: "",
              type: 17,
              typeArguments: null,
            },
          ],
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 19,
      type: "struct RawVec",
      components: [
        {
          name: "ptr",
          type: 10,
          typeArguments: null,
        },
        {
          name: "cap",
          type: 23,
          typeArguments: null,
        },
      ],
      typeParameters: [9],
    },
    {
      typeId: 20,
      type: "struct TradeEvent",
      components: [
        {
          name: "base_token",
          type: 12,
          typeArguments: null,
        },
        {
          name: "order_matcher",
          type: 11,
          typeArguments: null,
        },
        {
          name: "seller",
          type: 11,
          typeArguments: null,
        },
        {
          name: "buyer",
          type: 11,
          typeArguments: null,
        },
        {
          name: "trade_size",
          type: 23,
          typeArguments: null,
        },
        {
          name: "trade_price",
          type: 23,
          typeArguments: null,
        },
        {
          name: "sell_order_id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "buy_order_id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "timestamp",
          type: 23,
          typeArguments: null,
        },
        {
          name: "tx_id",
          type: 2,
          typeArguments: null,
        },
      ],
      typeParameters: null,
    },
    {
      typeId: 21,
      type: "struct Vec",
      components: [
        {
          name: "buf",
          type: 19,
          typeArguments: [
            {
              name: "",
              type: 9,
              typeArguments: null,
            },
          ],
        },
        {
          name: "len",
          type: 23,
          typeArguments: null,
        },
      ],
      typeParameters: [9],
    },
    {
      typeId: 22,
      type: "u32",
      components: null,
      typeParameters: null,
    },
    {
      typeId: 23,
      type: "u64",
      components: null,
      typeParameters: null,
    },
  ],
  functions: [
    {
      inputs: [
        {
          name: "order_id",
          type: 2,
          typeArguments: null,
        },
      ],
      name: "cancel_order",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "asset_id",
          type: 12,
          typeArguments: null,
        },
        {
          name: "asset_decimals",
          type: 22,
          typeArguments: null,
        },
      ],
      name: "create_market",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [],
      name: "get_configurables",
      output: {
        name: "",
        type: 1,
        typeArguments: null,
      },
      attributes: null,
    },
    {
      inputs: [
        {
          name: "asset_id",
          type: 12,
          typeArguments: null,
        },
      ],
      name: "get_market_by_id",
      output: {
        name: "",
        type: 15,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "order",
          type: 2,
          typeArguments: null,
        },
      ],
      name: "get_order_change_events_by_order",
      output: {
        name: "",
        type: 21,
        typeArguments: [
          {
            name: "",
            type: 18,
            typeArguments: null,
          },
        ],
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "asset_id",
          type: 12,
          typeArguments: null,
        },
      ],
      name: "market_exists",
      output: {
        name: "",
        type: 3,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "order_sell_id",
          type: 2,
          typeArguments: null,
        },
        {
          name: "order_buy_id",
          type: 2,
          typeArguments: null,
        },
      ],
      name: "match_orders",
      output: {
        name: "",
        type: 0,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "base_token",
          type: 12,
          typeArguments: null,
        },
        {
          name: "base_size",
          type: 14,
          typeArguments: null,
        },
        {
          name: "base_price",
          type: 23,
          typeArguments: null,
        },
      ],
      name: "open_order",
      output: {
        name: "",
        type: 2,
        typeArguments: null,
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read", "write"],
        },
        {
          name: "payable",
          arguments: [],
        },
      ],
    },
    {
      inputs: [
        {
          name: "order",
          type: 2,
          typeArguments: null,
        },
      ],
      name: "order_by_id",
      output: {
        name: "",
        type: 6,
        typeArguments: [
          {
            name: "",
            type: 17,
            typeArguments: null,
          },
        ],
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
    {
      inputs: [
        {
          name: "trader",
          type: 11,
          typeArguments: null,
        },
      ],
      name: "orders_by_trader",
      output: {
        name: "",
        type: 21,
        typeArguments: [
          {
            name: "",
            type: 2,
            typeArguments: null,
          },
        ],
      },
      attributes: [
        {
          name: "storage",
          arguments: ["read"],
        },
      ],
    },
  ],
  loggedTypes: [
    {
      logId: "5557842539076482339",
      loggedType: {
        name: "",
        type: 8,
        typeArguments: [],
      },
    },
    {
      logId: "5432468599230875534",
      loggedType: {
        name: "",
        type: 4,
        typeArguments: [],
      },
    },
    {
      logId: "6411998037120698508",
      loggedType: {
        name: "",
        type: 18,
        typeArguments: [],
      },
    },
    {
      logId: "4834916382903929744",
      loggedType: {
        name: "",
        type: 16,
        typeArguments: [],
      },
    },
    {
      logId: "8794783797310168923",
      loggedType: {
        name: "",
        type: 20,
        typeArguments: [],
      },
    },
  ],
  messagesTypes: [],
  configurables: [
    {
      name: "QUOTE_TOKEN",
      configurableType: {
        name: "",
        type: 12,
        typeArguments: [],
      },
      offset: 56904,
    },
    {
      name: "QUOTE_TOKEN_DECIMALS",
      configurableType: {
        name: "",
        type: 22,
        typeArguments: null,
      },
      offset: 56976,
    },
    {
      name: "PRICE_DECIMALS",
      configurableType: {
        name: "",
        type: 22,
        typeArguments: null,
      },
      offset: 56984,
    },
  ],
};
