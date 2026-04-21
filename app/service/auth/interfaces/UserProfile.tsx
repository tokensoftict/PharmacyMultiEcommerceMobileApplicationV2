export interface UserProfile {
    status: boolean | undefined;
    loginStatus: boolean | undefined;
    data: Data | undefined;
}

export interface Info {
    id: number | undefined;
    user_id: number | undefined;
    address_id: any | undefined;
    status: boolean | undefined;
    customer_group_id: any | undefined;
    business_name: any | undefined;
    customer_type_id: any | undefined;
    device_key: string | undefined;
    cac_document: any | undefined;
    premises_licence: any | undefined;
    customer_local_id: any | undefined;
    phone: any | undefined;
    cart: any | undefined;
    wishlist: any | undefined;
    created_at: string | undefined;
    updated_at: string | undefined;
    customer_group: any | undefined;
    customer_type: any | undefined;
}

export interface Apps {
    app_id: number | undefined;
    domain: string | undefined;
    info: Info | undefined;
    logo: any | undefined;
    name: string | undefined;
    link: string | undefined;
    addresses: any | undefined;
}

export interface Token {
    token_type: string | undefined;
    access_token: string | undefined;
}

export interface MemberGroup {
    id: number | undefined;
    name: string | undefined;
    label: string | undefined;
    color: string | undefined;
    bg_color: string | undefined;
    card_gradient_start: string | undefined;
    card_gradient_end: string | undefined;
}

export interface Data {
    id: number | undefined;
    name: string | undefined;
    firstname: string | undefined;
    lastname: string | undefined;
    email: string | undefined;
    email_verification_status: boolean | undefined;
    phone_verified_status: boolean | undefined;
    phone: string | undefined;
    image: string | undefined;
    apps: Apps[] | undefined;
    token: Token | undefined;
    dosageForms : any;
    loyaltyPoints: number | undefined;
    memberGroup: MemberGroup | undefined;
    retailLoyaltyPoints: number | undefined;
    retailMemberGroup: MemberGroup | undefined;
    memberSince: string | undefined;
    nextTierPoints: number | undefined;
    retailNextTierPoints: number | undefined;
    totalOrders: number | undefined;
    retailtotalOrders: number | undefined;
    totalSpend: number | undefined;
    totalSpendFormatted: string | undefined;
    retailTotalSpend: number | undefined;
    retailTotalSpendFormatted: string | undefined;
    progress: number | undefined;
    retailProgress: number | undefined;
    nextMemberGroup: string | undefined;
    nextRetailMemberGroup: string | undefined;
}
