export interface Product {
  name: string;
  note: string;
  defaultImagePath: string;
  activeImagePath: string;
  subProducts: SubProduct[];
}

export interface MotorProductResponse {
  code: string;
  message: string;
  data: PolicyProduct[];
}

export interface PolicyProduct {
  id: number;
  productId: number;
  ebizName: string;
  price: string;
  productSubclassCode: number;
  productCover: string;
  productCode1: number;
  productSubclassCode1: number;
  productClass: string;
  binderCode: number;
  product: null;
}

export interface SubProduct {
  name: string;
  notes: string[];
  defaultImgPath: string;
  activeImgPath: string;
}

export interface SubClass {
  type: string;
  subClass: string;
}

// endpoint calls

export interface BaseStatusResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface BaseCodeResponseData<T> {
  code: string | number;
  message: string;
  data: T;
}

export interface ProductResponse {
  id: number;
  name: string;
}

export interface VehicleMake {
  id: number;
  make: string;
}

export interface VehicleModel {
  // id: number;
  vehicleModelID: number;
  vehicleModelFullName: string;
}

export interface VehicleResponse {
  // id: number;
  name: string;
  code: number;
}

export interface AgentCodeRequest {
  agentCode: string;
}

export interface AgentCodeResponse {
  agn_code: string | null;
  agn_act_code: string | null;
  agN_SHT_DESC: string | null;
  acT_ACCOUNT_TYPE: string | null;
  agn_name: string | null;
  agn_status: string | null;
  refererLink: string | null;
}

export interface Save_Quote_Request {
  productId: number;
  user: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
  };
  quote: {
    quoteDiscount: number;
    quoteTotal: number;
    insured: number;
    duration: string;
  };
}

export interface Save_Quote_Response {
  quoteId: number;
  customerId: number;
}

export interface Post_KYC_Request {
  quoteId: number;
  custId: number;
  address: string;
  stateId: number;
  lgaid: number;
  modeOfIdentification: string;
  identificationFilePath: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  bvn: string;
  nin: string;
  referral: string;
}

export interface Post_KYC_Response {
  tqCustomerId: number;
}

export interface UploadFilesResponse {
  code: string;
  message: string;
}

export interface AdditionalDataRequest {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  maritalStatus: string;
  modeOfIdentification: string;
  identificationFilePath: string;
  productType: string;
  gender: string;
  bvn: string;
  nin: string;
  referral: string;
  dateOfBirth: string;
  employeeAddress: string;
  employeeName: string;
  occupation: string;
  employeeType: string;
  address: string;
  stateId: number;
  lgaId: number;
  custId: number;
  beneficiary: string;
  benRelation: string;
  benPhoneNumber: string;
  other: string;
  isfit: string;
  agree: string;
  sufferedPa: string;
  consultedDoc: string;
  attendedHos: string;
  ishealthy: string;
  takenTablets: string;
  exceedPre: string;
  hadXray: string;
  wakeUpNight: string;
}

export interface AdditionalDataResponse {
  data: number;
}

export interface BuyPersonalAccidentRequest {
  customerId: number;
  productType: string;
  productName: string;
  paymentDetails: {
    gateway: string;
    quoteId: number;
    paymentDtoAmount: number;
    channel: string;
    merchTxnref: string;
    merchantId: string;
    datecreate: string;
    dateupdated: string;
    isProcessed: boolean;
    isDataValid: boolean;
    transactionStatus: string;
    gatewayDumpId: number;
  };
  personalAccidentDto: {
    customerCode: number;
    personalAccidentDtoAmount: string;
    product_Name: string;
    insuredCode: number;
    propertyId: string;
    location: string;
    town: string;
    agentCode: string;
  };
  personalContactInfo: {
    firstName: string;
    lastName: string;
    bvn: string;
    nin: string;
    referredBy: string;
    phoneNumber: string;
    emailAddress: string;
    benAddr: string;
    benDob: string;
    beneficiary: string;
    benRelation: string;
    benPhoneNumber: string;
    address: string;
    state: string;
    custId: string;
  };
}

export interface BuyPersonalAccidentResponse {
  wef: string;
  wet: string;
  policyNumber: string;
}

export interface BuyThirdPartyMotorPolicyRequest {
  personalContactInfo: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    emailAddress: string;
    benAddr: string;
    benDob: string;
    beneficiary: string;
    benRelation: string;
    benPhoneNumber: string;
    bvn: string;
    nin: string;
    referredBy: string;
    address: string;
    custId: string;
  };
  vehicleInfo: {
    make: string;
    model: string;
    registration: string;
    engineNo: string;
    chasisNo: string;
    licence: string;
    otherInfo: string;
  };
  agentCode: string;
  customerId: number;
  productType: string;
  productName: string;
  paymentDetails: {
    gateway: string;
    quoteId: number;
    PaymentDtoAmount: number;
    channel: string;
    merchTxnref: string;
    merchantId: string;
    datecreate: string;
    dateupdated: string;
    isProcessed: boolean;
    isDataValid: boolean;
    transactionStatus: string;
    gatewayDumpId: number;
    merchTrxref: string;
  };
}

export interface GatewayRequest {
  id: number;
  partner: string;
  msgIn: string;
  msgout: string;
}

export interface GatewayResponse {
  gatwayDumpId: number;
}

export interface PersonalAccidentCertificateRequest {
  attachementUrl: string;
  destinationemail: string;
  policyNo: string;
  clnT_NAME: string;
  productName: string;
  wef: string;
  wet: string;
}

export interface PersonalAccidentCertificateResponse {
  data: true;
}

export interface PolicyDetailsInterface {
  ParamKey: string;
  ParamValue: string;
}

export interface VerifyClientRequest {
  firstName: string;
  middleName: string;
  lastName: string;
  nin: string;
  dateOfBirth: string;
}

export interface Client {
  batch_no: number;
  policy_number: string;
  policy_renewal_endorsement_number: string | null;
  client: {
    code: number;
    client_short_description: string;
    name: string;
    other_names: string | null;
    id_registration_number: string | null;
    date_of_birth: string;
    tax_identification_number: string | null;
    physical_address: string | null;
    postal_address: string | null;
    email_address: string;
    telephone_1: string;
    telephone_2: string | null;
    fax: string | null;
    status: string;
    branch_code: number;
    request_id: string | null;
    type: string;
  };
  agent: {
    emailAddress: string;
    code: number;
    account_type: {
      account_type_code: number;
      type: string;
      short_description: string;
      with_holding_tex_rate: number;
      type_id: string;
      commission_reserve_rate: number;
      maximum_adv_amount: string | null;
      maximum_adv_repayment_period: string | null;
      receipt_include_commission: string;
      over_ride_rate: number;
      id_serial_format: string;
      vat_rate: number;
      format: string;
      odl_code: string | null;
      no_gen_code: string;
      lta_withholding_tax_rate: string | null;
      commission_levy_rate: number;
      cash_basis: string | null;
      payment_plan: string | null;
      credit_pol_appl: string | null;
    };
    name: string;
    telephone_1: string;
    town_code: number;
    country_code: number;
    status: string;
    branch: {
      branch_code: number;
      branch_short_description: string;
      region: {
        region_code: number;
        region_short_description: string;
        organisation_code: number;
        organisation_name: string;
        agent_code: string | null;
      };
      branch_name: string;
      physical_address: string;
      email_address: string;
      town_code: string | null;
      county_code: string | null;
      contact: string | null;
      manager: string | null;
      telephone: string;
      fax: string;
      gen_pol_clm: string | null;
      bns_code: number;
      agent_code: string | null;
      post_level: string | null;
      manager_allowed: string | null;
      override_commission_earned: string;
      zip_code: string | null;
    };
    country: {
      country_code: number;
      country_short_description: string;
      name: string;
      nationality: string;
      zip_code: number;
      mobile_prefix: string | null;
      currency_serial: number;
    };
    town: {
      town_code: number;
      short_description: string;
      name: string;
      state_code: number;
      country: {
        country_code: number;
        country_short_description: string;
        name: string;
        nationality: string;
        zip_code: number;
        mobile_prefix: string | null;
        currency_serial: number;
      };
    };
  };
  effect_to: string;
  effect_from: string;
  underwriting_year: number;
  total_sum_insured: number;
  co_insurance_policy: string;
  status: string;
  commission_amount: number;
  commission_rate: number;
  created_on: string | null;
  transaction_type: string | null;
  proposal_number: string | null;
  re_insured: string;
  basic_premium: string | null;
  net_premium: number;
  currency: {
    code: number;
    symbol: string;
    description: string;
    number_word: string;
    decimal_word: string;
  };
  prepared_by: string;
  prepared_date: string;
  checked_by: string;
  checked_date: string | null;
  policy_type: string;
  policy_risks: [
    {
      riskAdditionalInfo: [
        {
          ginPaSch_level1: string | null;
          ginPaBeneficiarySch_level2: string | null;
        },
      ];
      code: number;
      previous_batch_no: string | null;
      pol_in_code: string | null;
      property_id: string;
      quotation_revision_number: string | null;
      item_desc: string;
      value: number;
      basic_premium: number;
      net_premium: number;
      effect_from: string;
      effect_to: string;
      client: {
        code: number;
        client_short_description: string;
        name: string;
        other_names: string | null;
        id_registration_number: string | null;
        date_of_birth: string;
        tax_identification_number: string | null;
        physical_address: string | null;
        postal_address: string | null;
        email_address: string;
        telephone_1: string;
        telephone_2: string | null;
        fax: string | null;
        status: string;
        branch_code: number;
        request_id: string | null;
        type: string;
      };
      binder: {
        code: number;
        name: string;
        remarks: string;
        type: string;
        product: string | null;
        sub_class: {
          code: number;
          description: string;
        };
        currency: {
          code: number;
          symbol: string;
          description: string;
          number_word: string;
          decimal_word: string;
        };
      };
      sub_class: {
        code: number;
        description: string;
      };
      cover_type: {
        code: number;
        short_description: string;
        description: string;
        details: string;
        min_sum_insured: string | null;
        downgrade_on_sus: string | null;
        downgrade_on_sus_to: string | null;
      };
      enforce_cvt_minimum_premium: string;
      minimum_premium_used: string;
      cover_days: number;
      policy_risk_sections: [
        {
          code: number;
          section_short_description: string | null;
          limit_amount: number;
          premium_amount: number;
          annual_premium_amount: number;
          used_limit_amount: number;
          minimum_premium: number;
          annual_premium: number;
          prorata_or_full: string;
          section: {
            code: number;
            short_description: string | null;
            description: string;
          };
        },
      ];
    },
  ];
  intermediary_debit_note_no: string | null;
  co_insurance_share: string | null;
  our_share_premium: number;
  co_insurance_total_premium: number;
  debit_note_no: string;
  policy_fee: string | null;
  product_code: number;
}

export interface RenewRequest {
  policyNo: string;
  amount: string;
  merchTxnref: string; // TODO: ADD THIS FIELD TO RENEW PAYLOAD
  // attachments: File[]; // TODO: CONFIRM THE FILE TYPE
  agentCode: string;
  customerName: string;
  customerEmail: string;
  coverageType: string;
  url: string | null;
}

export interface RenewResponse {
  transCode: string;
  success: boolean;
  message: string;
  receiptNumber: string;
  policyNo: string;
  customercode: string;
  wef: string;
  wet: string;
}

export interface RenewalCertificateRequest
  extends PersonalAccidentCertificateRequest {
  coverageType: string;
}

/**
 *
 * {  "transCode": "103688000ebbf59d85",  "success": true,  "message": "Receipt successfully created",  "receiptNumber": "10002025070144",  "policyNo": "ZG/P/3000/010101/24/0000844",  "customercode": "10368800",  "wef": "8/8/2025 12:00:00 AM",  "wet": "8/7/2026 12:00:00 AM" }
 */
