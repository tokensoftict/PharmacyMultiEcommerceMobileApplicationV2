import {Data} from "@/service/product/show/interface/ProductInformationInterface.tsx";

export interface MedReminderInterface {
    id: number
    drug_name: string
    dosage: number
    total_dosage_in_package: number
    total_dosage_taken: number
    dosage_form : string,
    normal_schedules: any
    type: string
    use_interval: boolean
    interval: number
    every: string
    start_date_time: string
    date_create: string
    notes: any,
    allowRefill : boolean,
    percentageTaken : number,
    stock : Data,
}

export interface MedReminderSchedules {
    id: number
    med_reminder_id: number
    title: string
    drugName:string,
    dosage_form : string,
    dosage:string,
    status: string
    snoozed_at: any,
    scheduled_at: any,
    scheduled_at_full: any,
    snoozed_at_full: any,
    allowTaken : boolean,
    med_reminder : MedReminderInterface
}
