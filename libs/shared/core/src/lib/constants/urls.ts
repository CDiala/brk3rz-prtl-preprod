export const getApiEndpoints = (baseUrl: string) => ({
  UserManagementAPI: {
    login: baseUrl + 'Auth/GeneralLogin',
    sendResetLink: baseUrl + 'Auth/ForgetPassword',
    resetPassword: baseUrl + 'Auth/ChangePassword',

    //
    registerOTP: baseUrl + 'Profiles/RegisterOTP',
    roleRequestUrl: baseUrl + 'Profiles/SearchAD',
  },

  MotorRequestAPI: {
    getMotorSetupData: baseUrl + 'MotorRequests/getMotorSetupData',
    saveMotorQuote: baseUrl + 'MotorRequests/SaveMotorQuoteRequest',
    getPendingMotorQuotes: baseUrl + 'MotorRequests/GetPending_ERMMotor',
    approveMotorQuote: baseUrl + 'MotorRequests/ApproveMotorRequest',
    rejectMotorQuote: baseUrl + 'MotorRequests/RejectMotorRequest',
  },

  VehiclesAPI: {
    getVehicleCategories: baseUrl + 'VehicleCategories',
    getVehicleConditions: baseUrl + 'VehicleConditions',
    getVehicleTypes: baseUrl + 'VehicleTypes',
    getVehicleMakes: baseUrl + 'VehicleMake/getVehicleMakeList',
    getVehicleModels: baseUrl + 'VehicleModel/getVehicleModelList',
  },

  statesURL: baseUrl + '/GetState',

  MarineRequestAPI: {
    clauseList: baseUrl + 'ClauseTypes',
    getMarineSetup: baseUrl + 'MarineProposerDetails/getMarineSetupData',
    saveMarineQuote: baseUrl + 'MarineProposerDetails/SaveMarineQuoteRequest',
    getPendingMarineQuotes:
      baseUrl + 'MarineProposerDetails/GetPending_ERMMarine',
    approveMarineQuote: baseUrl + 'MarineProposerDetails/ApproveMarineRequest',
  },

  businessList: baseUrl + 'NatureOfBusinesses',
  categoryURL: baseUrl + 'CategoryDetails',
  coverageURL: baseUrl + 'Coverages',
  portsURL: baseUrl + 'PortLists',
  ratesURL: baseUrl + 'MarineRates/SearchMarineRates',

  ConfigurationsAPI: {
    currency: baseUrl + 'Currencies',
    formM: baseUrl + 'FormMRates',
    marinePackagings: baseUrl + 'MarinePackagings',
    marineRate: baseUrl + 'MarineRateTables',
    vehicleCategories: baseUrl + 'VehicleCategories',
    vehicleConditions: baseUrl + 'VehicleConditions',
    vehicleTypes: baseUrl + 'VehicleTypes',
  },

  saveQuickQuote: baseUrl + 'QuickQuotes/AddQuickQuote',
});
