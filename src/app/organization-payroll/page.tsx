"use client";

import React, { useEffect, useState } from "react";
import { Icons } from "@/app/components/icons";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/app/lib/utils";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import Head from "next/head";
import DashboardLayout from "@/app/components/layout/dashboard-layout";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getOrganizationUsers, type OrgUser } from "@/apis/organization";
import { UserSelectDropdown } from "../components/user/user-select";
import axiosInstance from "../utils/apis";

const Page = () => {
  const { toast } = useToast();

  const [date, setDate] = React.useState<Date>();
  const [payrollName, setPayrollName] = useState("");
  const [paymentType, setPaymentType] = useState<"RECURRING" | "ONE_TIME">(
    "RECURRING",
  );
  const [userInputs, setUserInputs] = useState<
    {
      id: number | null;
      amount: string;
      token: string;
    }[]
  >([{ id: null, amount: "", token: "HBAR" }]);
  const [orgUsers, setOrgUsers] = useState<OrgUser[]>([]);

  const handleAddClick = () => {
    setUserInputs([
      ...userInputs,
      {
        id: null,
        amount: "",
        token: "HBAR",
      },
    ]);
  };

  const handleInputChange = (
    index: number,
    key: string,
    value: number | null,
  ) => {
    setUserInputs(
      userInputs.map((userInput, i) =>
        i === index ? { ...userInput, [key]: value } : userInput,
      ),
    );
  };

  const handleSubmit = async () => {
    const formattedDate = date?.toISOString();
    const users = userInputs.map((input) => ({
      id: input.id,
      amount: Number(input.amount),
      token: input.token,
    }));
    console.log("users", users);
    const payload = {
      name: payrollName,
      paymentType: paymentType,
      paymentDate: formattedDate,
      users: users,
    };
    console.log("payload", payload);
    try {
      const response = await axiosInstance.post("/payroll", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Payroll created:", response.data);
      toast({
        title: "Success",
        description: "Payroll created successfully!",
      });
    } catch (error) {
      console.error("Error creating payroll:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganizationUsers();
        console.log(data);

        setOrgUsers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    void fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>User Profile</title>
      </Head>
      <DashboardLayout
        type="user"
        heading="Visa Applications"
        text="Find all your visa application here"
        buttonLabel="New Visa Application"
        loading={false}
      >
        <div className="flex gap-[11px]">
          <Input
            className="m-[30px] w-[24rem]"
            placeholder="Enter payroll name"
            value={payrollName}
            onChange={(e) => setPayrollName(e.target.value)}
          />

          <div className="mt-[5px]">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "m-[26px] w-[240px] justify-start text-left font-normal",

                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Pick a date for paying</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  fromDate={new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="pt-[36px]">
            {/* TODO: Fix type */}
            <RadioGroup
              defaultValue="one-time"
              className="flex flex-row"
              onValueChange={setPaymentType}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="RECURRING" id="r3" />
                <Label htmlFor="r3">Recurring Pay</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ONE_TIME" id="r2" />
                <Label htmlFor="r2">One Time</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        {userInputs.map((input, index) => (
          <div key={index} className="m-6 flex gap-5">
            <UserSelectDropdown
              users={orgUsers}
              value={input.id}
              setValue={(val) => handleInputChange(index, "id", val)}
            />

            <Input
              className="w-[30rem]"
              placeholder="Enter Amount Payable"
              type="number"
              value={input.amount}
              onChange={(e) =>
                handleInputChange(index, "amount", parseFloat(e.target.value))
              }
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Token to Transfer</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Tokens</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={input.token}
                  onValueChange={(value) =>
                    handleInputChange(index, "token", value)
                  }
                >
                  <DropdownMenuRadioItem value="HBAR">HBAR</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="USDC">
                    USDC
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="USDT">
                    USDT
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddClick}>
              <Icons.add />
            </Button>
          </div>
        ))}
        <Button onClick={handleSubmit}>Create Payroll</Button>
      </DashboardLayout>
    </>
  );
};

export default Page;
