import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface InquirySubmission {
    city: string;
    name: string;
    designation: string;
    email: string;
    message: string;
    phone: string;
    schoolName: string;
}
export interface ProspectusLead {
    name: string;
    email: string;
}
export interface backendInterface {
    getAllLeads(): Promise<Array<ProspectusLead>>;
    getAllSubmissions(): Promise<Array<InquirySubmission>>;
    setAdmin(newAdmin: Principal): Promise<void>;
    submitInquiry(submission: InquirySubmission): Promise<void>;
    submitLead(lead: ProspectusLead): Promise<void>;
}
