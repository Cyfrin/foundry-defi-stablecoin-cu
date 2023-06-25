import { gql } from "@apollo/client";
export const GET_ALL_DEPOSIT_ACCOUNTS = gql`
  query GetAllDepositAddress($userAddress: String) {
    collateralDepositeds(orderBy: blockTimestamp, orderDirection: asc) {
      id
      depositor
      amount
      blockNumber
    }
  }
`;
