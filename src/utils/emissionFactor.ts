export const fugitiveEmissionsEmissionList = {
    "R401A": 1130,
    "R401B": 1236,
    "R401C": 876,
    "R402A": 2571,
    "R402B": 2261,
    "R403A": 3100,
    "R403B": 4457,
    "R404A": 3943,
    "R405A": 4821,
    "R406A": 1780,
    "R407A": 1923,
    "R407B": 2547,
    "R407C": 1624,
    "R407D": 1487,
    "R407E": 1425,
    "R407F": 1674,
    "R408A": 3257,
    "R409A": 1485,
    "R409B": 1474,
    "R410A": 1924,
    "R410B": 2048,
    "R411A": 1555,
    "R411B": 1659,
    "R412A": 2172,
    "R413A": 1945,
    "R414A": 1375,
    "R414B": 1274,
    "R415A": 1468,
    "R415B": 544,
    "R416A": 975,
    "R417A": 2127,
    "R417B": 2742,
    "R417C": 1643,
    "R418A": 1693,
    "R419A": 2688,
    "R419B": 2161,
    "R420A": 1382,
    "R421A": 2385,
    "R421B": 2890,
    "R422A": 2847,
    "R422B": 2290,
    "R422C": 2794,
    "R422D": 2473,
    "R422E": 2350,
    "R423A": 2274,
    "R424A": 2212,
    "R425A": 1431,
    "R426A": 1371,
    "R427A": 2024,
    "R428A": 3417,
    "R429A": 15.3,
    "R430A": 106,
    "R431A": 40,
    "R432A": 1.8,
    "R433A": 0.64,
    "R433B": 0.16,
    "R433C": 0.55,
    "R434A": 3076,
    "R435A": 28.4,
    "R436A": 1.35,
    "R436B": 1.47,
    "R437A": 1639,
    "R438A": 2059,
    "R439A": 1828,
    "R440A": 156,
    "R441A": 0.23,
    "R442A": 1754,
    "R443A": 1,
    "R444A": 89,
    "R445A": 118,
    "R500": 7564,
    "R501": 3870,
    "R502": 4786,
    "R503": 13299,
    "R504": 4299,
    "R505": 7956,
    "R506": 3857,
    "R507A": 3985,
    "R508A": 11607,
    "R508B": 11698,
    "R509A": 5758,
    "R510A": 1.24,
    "R511A": 7,
    "R512A": 196,
};
export const mobileCombustionEmissionList = {
    "Petrol": 2.06916,
    "Diesel": 2.57082,
    "Electric": 0.00368,
};
export const fuelEnergyRelatedEmissionWTTList = {
    "Electricty": 0.15,
    "Fuel": 0.58,
};
export const fuelEnergyRelatedEmissionTDList = {
    "Electricty": 0.02,
    "Fuel": 0,
};
export const purchasedGoodsAndServicesEmissionList = {
    "IT Expenses": 0.143,
    "FA Computers": 0.143,
    "FA Furniture And Fixture": 0.24,
    "Building Security": 0.074,
    "Entertainment(Catering/Pantry)": 0.132,
    "Hospitality": 0.145,
    "Car Fuel, Washing Etc Expenses": 0.103,
    "Building Maintenance": 0.113,
    "Printing & Stationary": 0.236,
    "Car Repairs Insurance and Maintenance": 0.103,
    "Building Cleaning": 0.214,
    "Plant Maintenance": 0.214,
    "Postage and Courrier Expenses": 0.303,
    "Utilities(Elec. & Water)": 0.246,
    "Office Boys Service": 0.051,
    'Office Equipment': 0.058,
};
export const employeeCommuteEmissionPetrolList = {
    "Car/Taxi": 2.06916,
    "Bus": 0.0278,
    "Metro": 0.19907,
};
export const employeeCommuteEmissionDieselList = {
    "Car/Taxi": 2.57082,
    "Bus": 0.0278,
    "Metro": 0.19907,
};
export const employeeCommuteEmissionHybridList = {
    "Car/Taxi": 0.00931,
    "Bus": 0.0278,
    "Metro": 0.19907,
};
export const employeeCommuteEmissionElectricList = {
    "Car/Taxi": 0.03513,
    "Bus": 0.0278,
    "Metro": 0.19907,
};

export const wasteGeneratedLandFillList = {
    "Household residual waste": 497.24244,
    "Commercial and industrial waste": 520.5327,
};
export const wasteGeneratedLandIncinerationList = {
    "Household residual waste": 4.68568,
    "Commercial and industrial waste": 4.68568,
};
export const businessTravelEFList = {
    "Average passenger": 0.14253,
    "Economy class": 0.10916,
    "Premium economy class": 0.17465,
    "Business class": 0.31656,
    "First class": 0.43663,
    "Private jet": 3.19
}
export const businessTravelWTTEFList = {
    "Average passenger": 0.02162,
    "Economy class": 0.01656,
    "Premium economy class": 0.02649,
    "Business class": 0.04802,
    "First class": 0.06623,
    "Private jet": 0.84
};

export const employeeCommuteFuelTypeList = ["Petrol", "Diesel", "Hybrid", "Electric"];
export const employeeCommuteTransportModeList = ["Car/Taxi", "Metro", "Bus"];
export const wasteGeneratedTreatmentTypeList = ["Landfill", "Incineration"];
export const purchasedCoolingUnitsList = ["kWh", "MWh", "GWh", "TWh"];

export const businessTravelFlightTypeList = ["Domestic", "International", "Commercial Flight"];

export const businessTravelCountryList: Record<
    string,
    { Lat: number; Lng: number }
> = {
    HBE: { Lat: 0.539615662, Lng: 0.518299956 },
    LHR: { Lat: 0.898443139, Lng: -0.008045968 },
    MAA: { Lat: 0.226788083, Lng: 1.399404994 },
    RIX: { Lat: 0.993504242, Lng: 0.41837462 },
    PUS: { Lat: 0.613989378, Lng: 2.250392631 },
    ICN: { Lat: 0.653803828, Lng: 2.206806524 },
    AMM: { Lat: 0.553653345, Lng: 0.628196358 },
    FCO: { Lat: 0.72977452, Lng: 0.213855193 },
    CAI: { Lat: 0.525728077, Lng: 0.548138105 },
    BAH: { Lat: 0.458515448, Lng: 0.883730013 },
    DEL: { Lat: 0.498570754, Lng: 1.345701213 },
    IAD: { Lat: 0.679701024, Lng: -1.351862225 },
    JED: { Lat: 0.378369929, Lng: 0.683401122 },
    NBO: { Lat: 0.023025, Lng: 0.644323 },
    DXB: { Lat: 0.440782903, Lng: 0.966284087 },
    BRU: { Lat: 0.888407496, Lng: 0.078522363 },
    DOH: { Lat: 0.440887622, Lng: 0.899979029 },
};
