"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { Address } from "~~/components/scaffold-stark";
import { useAccount } from "~~/hooks/useAccount";
import { Address as AddressType } from "@starknet-react/chains";
import Image from "next/image";
import { useConnect } from "@starknet-react/core";
import { CustomConnectButton } from "~~/components/scaffold-stark/CustomConnectButton";
import { useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { connect } = useConnect();

  // Simple state management for demo
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);
  const [counterValue, setCounterValue] = useState(0n);
  const [lastIncreasedBy, setLastIncreasedBy] = useState("0x0");
  const [lastPremium, setLastPremium] = useState(0n);
  const [inputAmount, setInputAmount] = useState(0n);
  const [events, setEvents] = useState([
    {
      args: {
        value: 0n,
        caller: "0x0",
        premium: 0n,
      },
    },
  ]);

  // Placeholder functions to be replaced with hooks

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <div className="border-b-2 border-primary pb-4">
              <span className="block text-2xl mb-2">Welcome to</span>
              <span className="block text-4xl font-bold">
                this counter demo
              </span>
            </div>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <div className="flex flex-col gap-4 w-full max-w-2xl">
              {/* Kill Switch Status Box */}
              <div
                className={`bg-base-200 p-4 rounded-lg ${isKillSwitchActive ? "border-2 border-red-500" : "border-2 border-green-500"}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">Kill Switch Status:</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${isKillSwitchActive ? "bg-red-500" : "bg-green-500"}`}
                    ></div>
                    <span
                      className={
                        isKillSwitchActive ? "text-red-500" : "text-green-500"
                      }
                    >
                      {isKillSwitchActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                {isKillSwitchActive && (
                  <p className="text-sm text-red-500 mt-2">
                    Warning: Contract interactions are currently disabled
                  </p>
                )}
              </div>
              {/* Counter Info Box */}
              <div className="bg-base-200 p-4 rounded-lg">
                <div className="flex flex-col gap-2">
                  <p className="font-medium">
                    Current Counter Value:{" "}
                    <span className="text-xl">{Number(counterValue)}</span>
                  </p>
                  <div className="text-sm opacity-70">
                    <p>
                      Last increased by:{" "}
                      <Address address={lastIncreasedBy as AddressType} />
                    </p>
                    <p>
                      Last Amount paid:{" "}
                      {(Number(lastPremium) / 10 ** 18).toFixed(5)} ETH
                    </p>
                  </div>
                </div>
              </div>

              {/* Events Box */}
              <div className="bg-base-200 p-4 rounded-lg">
                <p className="font-medium mb-2">Recent Events</p>
                <div className="text-sm opacity-70 space-y-1">
                  {events?.map((event, index) => (
                    <p key={index}>
                      Counter increased to {Number(event.args.value)} by{" "}
                      <Address
                        address={`0x${BigInt(event.args.caller).toString(16)}`}
                      />
                      {event.args.premium > 0n
                        ? `(${(Number(event.args.premium) / 10 ** 18).toFixed(5)} ETH)`
                        : " (0 ETH)"}
                    </p>
                  ))}
                </div>
              </div>

              {connectedAddress ? (
                <>
                  {/* Wallet Box */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#00A3FF]">
                        Connected Wallet:
                      </p>
                      <Address address={connectedAddress as AddressType} />
                    </div>
                  </div>
                  {/* Premium Selection */}
                  <div className="bg-base-200 p-4 rounded-lg">
                    <p className="font-medium mb-2">Select Premium Amount</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`btn btn-sm ${inputAmount === 10000000000000000n ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setInputAmount(10000000000000000n)}
                      >
                        0.01 ETH
                      </button>
                      <button
                        className={`btn btn-sm ${inputAmount === 1000000000000000n ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setInputAmount(1000000000000000n)}
                      >
                        0.001 ETH
                      </button>
                      <button
                        className={`btn btn-sm ${inputAmount === 100000000000000n ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setInputAmount(100000000000000n)}
                      >
                        0.0001 ETH
                      </button>
                      <button
                        className={`btn btn-sm ${inputAmount === 10000000000000n ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setInputAmount(10000000000000n)}
                      >
                        0.00001 ETH
                      </button>
                      <button
                        className={`btn btn-sm ${inputAmount === 0n ? "btn-primary" : "btn-outline"}`}
                        onClick={() => setInputAmount(0n)}
                      >
                        No Premium
                      </button>
                    </div>
                  </div>
                  {/* Increase Counter Button */}
                  <button
                    className="btn btn-primary w-full mt-4"
                    onClick={async () => {
                      if (inputAmount > 0) {
                        // await increaseCounterWithPremium();
                      } else {
                        // await increaseCounter();
                      }
                    }}
                  >
                    Increase Counter{" "}
                    {inputAmount > 0
                      ? `with ${Number(inputAmount) / 10 ** 18} ETH`
                      : "without Premium"}
                  </button>
                </>
              ) : (
                <CustomConnectButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
