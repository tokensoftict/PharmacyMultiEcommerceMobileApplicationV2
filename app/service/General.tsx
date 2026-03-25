import {location} from "@/assets/icons";

export interface responseInterface {
    status: boolean;
    data: nameOrId[];
}

export interface nameOrId {
    id: number;
    image?: string;
    name: string;
}


export interface addresses {
    id: number,
    name: string,
    address_1: string,
    address_2: string,
    country: string,
    state: string
}
