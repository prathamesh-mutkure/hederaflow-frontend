import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronsUpDown, Check } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { cn } from "@/app/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import {
  StellarWalletsKit,
  WalletNetwork,
  type ISupportedWallet,
  XBULL_ID,
  xBullModule,
  FreighterModule,
  AlbedoModule,
} from "@creit.tech/stellar-wallets-kit";
import * as StellarSdk from "@stellar/stellar-sdk";
import axios from "axios";
import axiosInstance from "@/app/utils/apis";

const FundModal = () => {
  const [userInputs, setUserInputs] = useState({
    email: "",
    amount: "",
    token: "HBAR",
  });

  const currencies = [
    { label: "HBAR", value: "HBAR" },
    { label: "USDC", value: "USDC" },
    { label: "USDT", value: "USDT" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInputs((prev) => ({ ...prev, [name]: value }));
  };

  const selectedCurrency = currencies.find(
    (currency) => currency.value === userInputs.token,
  );

  const kit = new StellarWalletsKit({
    selectedWalletId: XBULL_ID,
    network: WalletNetwork.TESTNET,
    modules: [new xBullModule(), new FreighterModule(), new AlbedoModule()],
  });

  const handleWalletSelection = async (option: ISupportedWallet) => {
    console.log(option.isAvailable);

    if (!option.isAvailable) {
      // TODO: Show error
      return;
    }

    kit.setWallet(option.id);

    const publicKey = await kit.getPublicKey();

    try {
      const server = new StellarSdk.Horizon.Server(
        "https://horizon-testnet.stellar.org",
      );

      // TODO: Check if account activated
      const account = await server.loadAccount(publicKey);

      // TODO: Put server wallet address in env
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: StellarSdk.Networks.TESTNET,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination:
              "GDDX2B6TRVLQBUO3KBHO4EHRLPCCC5ZWEAEUXB3SBFEIE3YKXLF4AITV",
            asset: StellarSdk.Asset.native(),
            amount: userInputs.amount,
          }),
        )
        .addMemo(StellarSdk.Memo.text("Deposite"))
        .setTimeout(60)
        .build();

      const { result: signedTxnXdr } = await kit.signTx({
        xdr: transaction.toXDR(),
        publicKeys: [publicKey],
        network: WalletNetwork.TESTNET,
      });

      const signedTxn = new StellarSdk.Transaction(
        signedTxnXdr,
        StellarSdk.Networks.TESTNET,
      );

      const txnResult = await server.submitTransaction(signedTxn, {
        skipMemoRequiredCheck: true,
      });

      const verifyDeposit = await axiosInstance.post("/wallet/deposit", {
        txHash: txnResult.hash,
      });
      console.log(verifyDeposit.data);

      return txnResult.successful;
    } catch (error: any) {
      console.error(`Error depositing funds - ${error?.message}`);

      return false;
    }
  };

  const onClick = async () => {
    await kit.openModal({
      onWalletSelected: (option) => {
        void handleWalletSelection(option);
      },
    });
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Add Funds</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Deposit Funds</DialogTitle>
            <DialogDescription>Deposit Funds to your account</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="items-center justify-between gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="flex gap-4">
                <Input
                  id="amount"
                  name="amount"
                  value={userInputs.amount}
                  onChange={handleChange}
                  className=""
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[100px] justify-between",
                        !userInputs.token && "text-muted-foreground",
                      )}
                    >
                      {selectedCurrency
                        ? selectedCurrency.label
                        : "Select Currency"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command label="Command Menu">
                      <CommandInput placeholder="Search currency..." />
                      <CommandEmpty>No Currency Found</CommandEmpty>
                      <CommandGroup>
                        {currencies.map((currency) => (
                          <CommandItem
                            key={currency.value}
                            value={currency.value}
                            onSelect={() => {
                              setUserInputs((prev) => ({
                                ...prev,
                                token: currency.value,
                              }));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                currency.value === userInputs.token
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            {currency.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" className="mt-4 w-full" onClick={onClick}>
              Deposit Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FundModal;
