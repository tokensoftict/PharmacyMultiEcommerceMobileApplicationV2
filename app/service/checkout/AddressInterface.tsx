export interface AddressInterface {
    status: boolean
    data: DataInterface[]
}

export interface DataInterface {
    id: number
    name: string
    address_1: string
    address_2: string
    country: string
    state: string
}

export interface Addresses {
    address: Address[]
}

export interface Address {
    id: number,
    title : string,
    description : string,
    active: boolean
}
