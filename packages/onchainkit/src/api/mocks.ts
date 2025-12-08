export const MOCK_VALID_CHARGE_ID = '1b03e80d-4e87-46fd-9772-422a1b693fb7';
export const MOCK_INVALID_CHARGE_ID = '00000000-0000-0000-0000-000000000000';
export const MOCK_VALID_PAYER_ADDRESS =
  '0x98fAbEA34A3A377916EBF7793f37E11EE98D29Eb';
export const MOCK_HYDRATE_CHARGE_SUCCESS_RESPONSE = {
  id: 1,
  jsonrpc: '2.0',
  result: {
    id: MOCK_VALID_CHARGE_ID,
    callData: {
      deadline: '2024-08-29T23:00:38Z',
      feeAmount: '10000',
      id: '0xd2e57fb373f246768a193cadd4a5ce1e',
      operator: '0xd1db362f9d23a029834375afa2b37d91d2e67a95',
      prefix: '0x4b3220496e666f726d6174696f6e616c204d6573736167653a20333220',
      recipient: '0xb724dcF5f1156dd8E2AB217921b5Bd46a9e5cAa5',
      recipientAmount: '990000',
      recipientCurrency: '0xF175520C52418dfE19C8098071a252da48Cd1C19',
      refundDestination: MOCK_VALID_PAYER_ADDRESS,
      signature:
        '0xb49a08026bdfdc55e3b1b797a9481fbdb7a9246c73f5f77fece76d5f24e979561f2168862aed0dd72980a4f9930cf23836084f3326b98b5546b280c4f0d57aae1b',
    },
    metaData: {
      chainId: 8453,
      contractAddress: '0x131642c019AF815Ae5F9926272A70C84AE5C37ab',
      sender: MOCK_VALID_PAYER_ADDRESS,
      settlementCurrencyAddress: '0xF175520C52418dfE19C8098071a252da48Cd1C19',
    },
  },
};
export const MOCK_VALID_PRODUCT_ID = '1b03e80d-4e87-46fd-9772-422a1b693fb7';
export const MOCK_CREATE_PRODUCT_CHARGE_SUCCESS_RESPONSE = {
  id: 1,
  jsonrpc: '2.0',
  result: {
    id: MOCK_VALID_CHARGE_ID,
    callData: {
      deadline: '2024-08-29T23:00:38Z',
      feeAmount: '10000',
      id: '0xd2e57fb373f246768a193cadd4a5ce1e',
      operator: '0xd1db362f9d23a029834375afa2b37d91d2e67a95',
      prefix: '0x4b3220496e666f726d6174696f6e616c204d6573736167653a20333220',
      recipient: '0xb724dcF5f1156dd8E2AB217921b5Bd46a9e5cAa5',
      recipientAmount: '990000',
      recipientCurrency: '0xF175520C52418dfE19C8098071a252da48Cd1C19',
      refundDestination: MOCK_VALID_PAYER_ADDRESS,
      signature:
        '0xb49a08026bdfdc55e3b1b797a9481fbdb7a9246c73f5f77fece76d5f24e979561f2168862aed0dd72980a4f9930cf23836084f3326b98b5546b280c4f0d57aae1b',
    },
    metaData: {
      chainId: 8453,
      contractAddress: '0x131642c019AF815Ae5F9926272A70C84AE5C37ab',
      sender: MOCK_VALID_PAYER_ADDRESS,
      settlementCurrencyAddress: '0xF175520C52418dfE19C8098071a252da48Cd1C19',
    },
  },
};

export const MOCK_HYDRATE_CHARGE_INVALID_CHARGE_ERROR_RESPONSE = {
  id: 1,
  jsonrpc: '2.0',
  error: {
    code: -32601,
    message: 'method not found - Not found',
  },
};
