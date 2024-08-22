"use client";

import React, { useState } from "react";
import Head from "next/head";
import DashboardLayout from "@/app/components/layout/dashboard-layout";
import { OrganizationProfile } from "@/app/components/forms/organization-profile-form";

const Page = () => {
  const [date, setDate] = React.useState<Date>();

  const [userInputs, setUserInputs] = useState([
    { email: "", amount: "", token: "HBAR" },
  ]);

  const handleAddClick = () => {
    setUserInputs([
      ...userInputs,
      {
        email: "",
        amount: "",
        token: "HBAR",
      },
    ]);
  };

  const handleInputChange = (index: number, key: string, value: string) => {
    setUserInputs(
      userInputs.map((userInput, i) =>
        i === index ? { ...userInput, [key]: value } : userInput,
      ),
    );
  };

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
      >
        <OrganizationProfile />
      </DashboardLayout>
    </>
  );
};

export default Page;
