"use client";
import { useState } from "react";
import {
  Button,
  Stack,
  Text,
  Alert,
  Divider,
  Group,
  NumberInput,
  TextInput,
  Switch,
} from "@mantine/core";
import { Transaction } from "@coinbase/onchainkit/transaction";
import { encodeFunctionData, type Hex } from "viem";
import { useAccount, useReadContract, useSendCalls } from "wagmi";

type Call = { to: Hex; data?: Hex; value?: bigint };

/**
 * Verified contract used for testing batched transactions.
 * @link `@https://basescan.org/address/0xe4d55cdf9a58157cf03b556b33b84e9d6c8c39e2#code`
 */
const CONTRACT_ADDRESS = "0xE4D55cDf9a58157CF03B556B33b84e9d6C8c39e2" as const;
const CONTRACT_ABI = [
  // Write functions
  {
    inputs: [],
    name: "incrementCounter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "incrementCounterBy",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
    name: "setValue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "name", type: "string" }],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "alwaysFail",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
  // Read functions
  {
    inputs: [],
    name: "counter",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "userValues",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "userNames",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function BatchedTransaction() {
  const { isConnected, address } = useAccount();
  const [approach, setApproach] = useState<"onchainkit" | "direct">(
    "onchainkit",
  );
  const [incrementAmount, setIncrementAmount] = useState<number | "">(5);
  const [setValue, setSetValue] = useState<number | "">(42);
  const [setName, setSetName] = useState("Mini App User");
  const [includeFailure, setIncludeFailure] = useState(false);
  const [onchainKitError, setOnchainKitError] = useState<string | null>(null);
  const [onchainKitSuccess, setOnchainKitSuccess] = useState<string | null>(
    null,
  );
  const [directError, setDirectError] = useState<string | null>(null);
  const [directSuccess, setDirectSuccess] = useState<string | null>(null);

  // Contract reading hooks
  const { data: counter, refetch: refetchCounter } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "counter",
  });

  const { data: userValue, refetch: refetchUserValue } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "userValues",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: userName, refetch: refetchUserName } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "userNames",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Direct batched approach using Wagmi
  const {
    sendCalls,
    isPending: isDirectPending,
    error: directWriteError,
  } = useSendCalls();

  // Create batched calls (shared by both approaches)
  const createBatchedCalls = (): Call[] => {
    const calls: Call[] = [];

    // Always increment counter
    calls.push({
      to: CONTRACT_ADDRESS,
      data: encodeFunctionData({
        abi: CONTRACT_ABI,
        functionName: "incrementCounter",
      }),
    });

    // Increment by amount if specified
    if (incrementAmount && incrementAmount > 0) {
      calls.push({
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: "incrementCounterBy",
          args: [BigInt(incrementAmount)],
        }),
      });
    }

    // Set value if specified
    if (setValue && setValue > 0) {
      calls.push({
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: "setValue",
          args: [BigInt(setValue)],
        }),
      });
    }

    // Set name if specified
    if (setName.trim()) {
      calls.push({
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: "setName",
          args: [setName],
        }),
      });
    }

    // Include failing call if requested
    if (includeFailure) {
      calls.push({
        to: CONTRACT_ADDRESS,
        data: encodeFunctionData({
          abi: CONTRACT_ABI,
          functionName: "alwaysFail",
        }),
      });
    }

    return calls;
  };

  // Refresh contract data
  const refreshContractData = () => {
    refetchCounter();
    refetchUserValue();
    refetchUserName();
  };

  // Handle direct batched approach
  const handleDirectTransaction = () => {
    try {
      setDirectError(null);
      setDirectSuccess(null);

      const calls = createBatchedCalls();

      // Use sendCalls to submit the same batched transactions
      sendCalls({
        calls: calls,
      });

      setDirectSuccess(
        `Batched transaction initiated with ${calls.length} calls`,
      );
      // Refresh contract data after a delay to allow transaction to be mined
      setTimeout(refreshContractData, 2000);
    } catch (error) {
      console.error("Direct transaction error:", error);
      setDirectError(
        error instanceof Error ? error.message : "Transaction failed",
      );
    }
  };

  const isDisabled = !isConnected;

  return (
    <Stack gap="md">
      <Text fw={600} size="lg">
        Batched Transaction Example
      </Text>

      <Text size="sm" c="dimmed">
        This demonstrates batched transactions using both OnchainKit&apos;s
        Transaction component and Wagmi&apos;s useSendCalls hook. Both
        approaches submit the same batched calls for direct comparison. Batched
        transactions work with smart contract wallets and EOA wallets that
        support ERC-7702. Contract: {CONTRACT_ADDRESS}
      </Text>

      {/* Contract State Section */}
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Text fw={500}>Current Contract State:</Text>
          <Button size="xs" variant="light" onClick={refreshContractData}>
            Refresh
          </Button>
        </Group>

        <Group gap="lg">
          <Text size="sm">
            <Text component="span" fw={500}>
              Counter:
            </Text>{" "}
            {counter?.toString() || "0"}
          </Text>
          {address && (
            <>
              <Text size="sm">
                <Text component="span" fw={500}>
                  Your Value:
                </Text>{" "}
                {userValue?.toString() || "0"}
              </Text>
              <Text size="sm">
                <Text component="span" fw={500}>
                  Your Name:
                </Text>{" "}
                {userName || "Not set"}
              </Text>
            </>
          )}
        </Group>
      </Stack>

      <Divider />

      {/* Configuration Section */}
      <Stack gap="xs">
        <Text fw={500}>Transaction Configuration:</Text>

        <Group>
          <Button
            size="xs"
            variant={approach === "onchainkit" ? "filled" : "outline"}
            onClick={() => setApproach("onchainkit")}
          >
            OnchainKit
          </Button>
          <Button
            size="xs"
            variant={approach === "direct" ? "filled" : "outline"}
            onClick={() => setApproach("direct")}
          >
            Direct Wagmi Batched
          </Button>
        </Group>

        <NumberInput
          label="Increment Amount"
          placeholder="5"
          value={incrementAmount}
          onChange={(value) =>
            setIncrementAmount(
              typeof value === "string" ? (value as "") : value,
            )
          }
          min={0}
        />

        <NumberInput
          label="Set Value"
          placeholder="42"
          value={setValue}
          onChange={(value) =>
            setSetValue(typeof value === "string" ? (value as "") : value)
          }
          min={0}
        />

        <TextInput
          label="Set Name"
          placeholder="Mini App User"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
        />

        <Switch
          label="Include Failing Call (for error testing)"
          checked={includeFailure}
          onChange={(event) => setIncludeFailure(event.currentTarget.checked)}
          color="red"
        />
      </Stack>

      <Divider />

      {/* OnchainKit Approach */}
      {approach === "onchainkit" && (
        <Stack gap="sm">
          <Text fw={500}>OnchainKit Transaction Component:</Text>

          <Transaction
            calls={createBatchedCalls()}
            onError={(error) => {
              console.error("OnchainKit transaction error:", error);
              setOnchainKitError(error.message || "Transaction failed");
              setOnchainKitSuccess(null);
            }}
            onSuccess={(response) => {
              console.log("OnchainKit transaction success:", response);
              setOnchainKitSuccess(
                `Success! ${response.transactionReceipts.length} transaction(s) completed`,
              );
              setOnchainKitError(null);
              // Refresh contract data after a delay to allow transaction to be mined
              setTimeout(refreshContractData, 2000);
            }}
          />

          {onchainKitError && (
            <Alert color="red" title="OnchainKit Error">
              {onchainKitError}
            </Alert>
          )}

          {onchainKitSuccess && (
            <Alert color="green" title="OnchainKit Success">
              {onchainKitSuccess}
            </Alert>
          )}
        </Stack>
      )}

      {/* Direct Wagmi Batched Approach */}
      {approach === "direct" && (
        <Stack gap="sm">
          <Text fw={500}>Direct Wagmi Batched Approach:</Text>

          <Text size="sm" c="dimmed">
            This uses Wagmi&apos;s useSendCalls hook to submit the same batched
            transactions as OnchainKit, allowing direct comparison of both
            approaches.
          </Text>

          <Button
            onClick={handleDirectTransaction}
            disabled={isDisabled || isDirectPending}
            loading={isDirectPending}
          >
            {isDirectPending ? "Sending Batch..." : "Send Batched Transactions"}
          </Button>

          {directWriteError && (
            <Alert color="red" title="Direct Transaction Error">
              {directWriteError.message}
            </Alert>
          )}

          {directError && (
            <Alert color="red" title="Direct Error">
              {directError}
            </Alert>
          )}

          {directSuccess && (
            <Alert color="green" title="Direct Success">
              {directSuccess}
            </Alert>
          )}
        </Stack>
      )}

      {!isConnected && (
        <Alert color="blue">
          Please connect your wallet to test batched transactions.
        </Alert>
      )}
    </Stack>
  );
}
