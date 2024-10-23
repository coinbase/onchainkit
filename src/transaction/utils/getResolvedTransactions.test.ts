import { describe, it, expect, vi } from 'vitest';
import { getResolvedTransactions } from './getResolvedTransactions';
import { encodeFunctionData } from 'viem';

vi.mock('viem', () => ({
  encodeFunctionData: vi.fn().mockReturnValue('mockEncodedData'),
}));

describe('getResolvedTransactions', () => {
  it('should resolve transactions when both calls and contracts are passed as arrays', async () => {
    const mockCalls = [
      { data: '0x123', to: '0xabc' },
      { data: '0x456', to: '0xdef' },
    ];

    const mockContracts = [
      {
        abi: [{ name: 'transfer', inputs: [] }],
        functionName: 'transfer',
        args: ['0x123', 1000],
        address: '0xabc',
      },
    ];

    const result = await getResolvedTransactions({
      calls: mockCalls,
      contracts: mockContracts,
    });

    expect(result).toEqual([
      ...mockCalls,
      { data: 'mockEncodedData', to: '0xabc' },
    ]);

    expect(encodeFunctionData).toHaveBeenCalledWith({
      abi: mockContracts[0].abi,
      functionName: mockContracts[0].functionName,
      args: mockContracts[0].args,
    });
  });

  it('should resolve transactions when calls is a function and contracts is an array', async () => {
    const mockCallsFn = vi
      .fn()
      .mockResolvedValue([{ data: '0x123', to: '0xabc' }]);

    const mockContracts = [
      {
        abi: [{ name: 'transfer', inputs: [] }],
        functionName: 'transfer',
        args: ['0x123', 1000],
        address: '0xabc',
      },
    ];

    const result = await getResolvedTransactions({
      calls: mockCallsFn,
      contracts: mockContracts,
    });

    expect(result).toEqual([
      { data: '0x123', to: '0xabc' },
      { data: 'mockEncodedData', to: '0xabc' },
    ]);

    expect(mockCallsFn).toHaveBeenCalled();
  });

  it('should resolve transactions when contracts is a function and calls is an array', async () => {
    const mockCalls = [{ data: '0x123', to: '0xabc' }];

    const mockContractsFn = vi.fn().mockResolvedValue([
      {
        abi: [{ name: 'transfer', inputs: [] }],
        functionName: 'transfer',
        args: ['0x123', 1000],
        address: '0xabc',
      },
    ]);

    const result = await getResolvedTransactions({
      calls: mockCalls,
      contracts: mockContractsFn,
    });

    expect(result).toEqual([
      { data: '0x123', to: '0xabc' },
      { data: 'mockEncodedData', to: '0xabc' },
    ]);

    expect(mockContractsFn).toHaveBeenCalled();
  });

  it('should not return reformatted contracts when calls are not provided', async () => {
    const mockContracts = [
      {
        abi: [{ name: 'transfer', inputs: [] }],
        functionName: 'transfer',
        args: ['0x123', 1000],
        address: '0xabc',
      },
    ];

    const result = await getResolvedTransactions({
      calls: undefined,
      contracts: mockContracts,
    });

    expect(result).toEqual(mockContracts);
  });

  it('should return calls when calls are provided but contracts are not', async () => {
    const mockCalls = [{ data: '0x123', to: '0xabc' }];

    const result = await getResolvedTransactions({
      calls: mockCalls,
      contracts: undefined,
    });

    expect(result).toEqual(mockCalls);
  });
});
