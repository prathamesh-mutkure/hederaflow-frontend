import axiosInstance from "@/app/utils/apis";

export type OrgPayroll = {
  id: number;
  name: string;
  organizationId: string;
  state: string;
  paymentType: string;
  paymentDate: string;
  paymentDateOfTheMonth: number;
  updatedAt: string;
  createdAt: string;
};

export async function getOrgPayrolls(): Promise<OrgPayroll[]> {
  const response = await axiosInstance.get(`/payroll/org/list`);

  const orgUsers = response.data as OrgPayroll[];

  return orgUsers;
}
