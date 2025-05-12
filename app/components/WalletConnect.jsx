"use client";

import { useCallback, useEffect, useState } from "react";
// import type { Hex } from "viem"; // Type import, remove for JS
import {
  useAccount,
  useConnect,
  useDisconnect,
  usePublicClient,
  useSignMessage,
} from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "../utils/wagmi";
import React from "react"; // Keep React import for JSX

export function WalletConnect() {
  const { connect } = useConnect({
    mutation: {
      onSuccess: (data) => {
        const address = data.accounts[0];
        const chainId = data.chainId;
        const m = new SiweMessage({
          domain: document.location.host,
          address,
          chainId,
          uri: document.location.origin,
          version: "1",
          statement: "LOTRY.FUN Smart Wallet Authentication",
          nonce: "12345678", // In production, use a random nonce
        });
        setMessage(m);
        signMessage({ message: m.prepareMessage() });
      },
    },
  });

  const { disconnect } = useDisconnect();
  const account = useAccount();
  const client = usePublicClient();
  const [signature, setSignature] = useState(undefined);
  const { signMessage } = useSignMessage({
    mutation: { onSuccess: (sig) => setSignature(sig) },
  });
  const [message, setMessage] = useState(undefined);
  const [valid, setValid] = useState(undefined);

  const checkValid = useCallback(async () => {
    if (!signature || !account.address || !client || !message) return;

    client
      .verifyMessage({
        address: account.address,
        message: message.prepareMessage(),
        signature,
      })
      .then((v) => setValid(v));
  }, [signature, account, client, message]);

  useEffect(() => {
    checkValid();
  }, [signature, account, checkValid]);

  const handleConnect = () => {
    connect({ connector: cbWalletConnector });
  };

  const handleDisconnect = () => {
    disconnect();
    setSignature(undefined);
    setMessage(undefined);
    setValid(undefined);
  };

  // Display a shortened version of the address
  const shortenAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  return (
    <div>
      {!account.address ? (
        <button
          onClick={handleConnect}
          className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono bg-gray-700 text-green-300 py-1 px-2 rounded">
            {shortenAddress(account.address)}
          </span>
          <button
            onClick={handleDisconnect}
            className="bg-green-300 text-gray-600 font-semibold py-2 px-3 text-sm rounded-md hover:bg-green-400 transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
