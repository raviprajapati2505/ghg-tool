import { getMDBSingleData } from "@/db/mongoQueries";
import { businessTravelCountryList, businessTravelEFList, businessTravelWTTEFList, employeeCommuteEmissionDieselList, employeeCommuteEmissionElectricList, employeeCommuteEmissionHybridList, employeeCommuteEmissionPetrolList, fuelEnergyRelatedEmissionTDList, fuelEnergyRelatedEmissionWTTList, fugitiveEmissionsEmissionList, mobileCombustionEmissionList, purchasedGoodsAndServicesEmissionList, wasteGeneratedLandFillList, wasteGeneratedLandIncinerationList } from "@/utils/emissionFactor";
import { airportsData } from "@/data/airportsData";

export const calculateProjectResult = async (projectCategories: any[] = []) => {
    try {
        const scope1Result: any[] = [];
        const scope2Result: any[] = [];
        const scope3Result: any[] = [];

        const allCategoriesResult: any[] = [];

        var totalProjectEmissionsmTCO2e = 0;
        var scope1TotalEmissionsmTCO2e = 0;
        var scope2TotalEmissionsmTCO2e = 0;
        var scope3TotalEmissionsmTCO2e = 0;

        const categoryCalculators: Record<string, Function> = {
            // Scope 1
            "fire-extinguishers": fireExtinguishersCalculate,
            "fugitive-emissions": fugitiveEmissionsCalculate,
            "mobile-combustion": mobileCombustionCalculate,
            "stationary-combustion": stationaryCombustionCalculate,
            // Scope 2
            "electricity-consumption": electricityConsumptionCalculate,
            "purchased-cooling": purchasedCoolingCalculate,
            // Scope 3
            "purchased-goods-and-services": purchasedGoodsAndServicesCalculate,
            "fuel-energy-related": fuelEnergyRelatedCalculate,
            "waste-generated": wasteGeneratedCalculate,
            "business-travel": businessTravelCalculate,
            "employee-commute": employeeCommuteCalculate,
        };

        for (const category of projectCategories) {
            const categoryData = category?.data || [];
            const categoryDetail = category?.categoryDetail[0] || {};
            const categoryScope = Number(categoryDetail?.scope);
            const categoryType = categoryDetail?.type;
            const categoryName = categoryDetail?.name;
            const categoryIcon = categoryDetail?.icon;

            const categoryDataWithResult: any = {
                name: categoryName,
                Scope: categoryScope,
                Type: categoryType,
                icon: categoryIcon,
            };

            const calculator = categoryCalculators[categoryType];
            const categoryResult =
                typeof calculator === "function"
                    ? await calculator(categoryData)
                    : { result: [], totalEmissionsmTCO2e: 0 };

            categoryDataWithResult.RowWiseResult = categoryResult?.result || [];
            const categoryTotalEmissionsmTCO2e = categoryResult?.totalEmissionsmTCO2e || 0;
            categoryDataWithResult.TotalResult = categoryTotalEmissionsmTCO2e?.toFixed(2);

            totalProjectEmissionsmTCO2e = totalProjectEmissionsmTCO2e + categoryTotalEmissionsmTCO2e
            if (categoryScope === 1) {
                scope1Result.push(categoryDataWithResult);
                scope1TotalEmissionsmTCO2e = scope1TotalEmissionsmTCO2e + categoryTotalEmissionsmTCO2e
            }
            else if (categoryScope === 2) {
                scope2Result.push(categoryDataWithResult);
                scope2TotalEmissionsmTCO2e = scope2TotalEmissionsmTCO2e + categoryTotalEmissionsmTCO2e
            }
            else if (categoryScope === 3) {
                scope3Result.push(categoryDataWithResult);
                scope3TotalEmissionsmTCO2e = scope3TotalEmissionsmTCO2e + categoryTotalEmissionsmTCO2e
            }
            allCategoriesResult.push({
                name: categoryName,
                TotalResult: categoryTotalEmissionsmTCO2e?.toFixed(2)
            });

        }

        const ProjectResultInfo: any = {
            totalProjectEmissionsmTCO2e: totalProjectEmissionsmTCO2e?.toFixed(2) || 0,
            scope1TotalEmissionsmTCO2e: scope1TotalEmissionsmTCO2e?.toFixed(2) || 0,
            scope2TotalEmissionsmTCO2e: scope2TotalEmissionsmTCO2e?.toFixed(2) || 0,
            scope3TotalEmissionsmTCO2e: scope3TotalEmissionsmTCO2e?.toFixed(2) || 0,
            allCategoriesResult: allCategoriesResult
        };

        return { scope1: scope1Result, scope2: scope2Result, scope3: scope3Result, ProjectResultInfo: ProjectResultInfo };
    } catch (error) {
        console.error("Error in calculateProjectResult:", error);
        return { scope1: [], scope2: [], scope3: [], ProjectResultInfo: {} };
    }
};

const fireExtinguishersCalculate = (data: any[] = []) => {
    const result: any[] = [];
    const emissionFactor = 1;
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const row: any = rowData || {};
        const totalQuantity = Number(row.total_quantity_of_co2);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
};

const fugitiveEmissionsCalculate = (data: any = []) => {
    const result: any[] = [];
    let totalEmissionsmTCO2e = 0;
    for (const rowData of data) {
        const dataType = rowData?.refrigerant_used || "";
        const emissionFactor = getEmissionFactor("fugitive-emissions", dataType);

        const row: any = rowData || {};
        const totalQuantity = Number(row.total_consumption_refill);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;

        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const mobileCombustionCalculate = (data: any = []) => {
    const result: any[] = [];
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const fuelType = rowData?.fuel_type || "";
        const emissionFactor = getEmissionFactor("mobile-combustion", fuelType);
        const row: any = rowData || {};
        const totalQuantity = Number(row.consumption);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const stationaryCombustionCalculate = (data: any = []) => {
    const result: any[] = [];
    const emissionFactor = 2.66155;
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const row: any = rowData || {};
        const totalQuantity = Number(row.total_consumption);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const electricityConsumptionCalculate = (data: any = []) => {
    const result: any[] = [];
    const emissionFactor = 0.258;
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const row: any = rowData || {};
        const totalQuantity = Number(row.electricity_consumption);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const fuelEnergyRelatedCalculate = (data: any = []) => {
    const result: any[] = [];
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const energyType = rowData.energy_type || "";
        const emissionFactorWtt = getEmissionFactor("fuel-energy-related-wtt", energyType);
        const emissionFactorTD = getEmissionFactor("fuel-energy-related-td", energyType);
        const emissionFactor = emissionFactorWtt + emissionFactorTD;
        const row: any = rowData || {};
        const totalQuantity = Number(row.energy_consumed);
        const EmissionsmTCO2e = !isNaN(totalQuantity)
            ? (totalQuantity * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const purchasedGoodsAndServicesCalculate = (data: any = []) => {
    const result: any[] = [];
    let totalEmissionsmTCO2e = 0;
    for (const rowData of data) {
        const descriptionType = rowData.description;
        const emissionFactor = getEmissionFactor("purchased-goods-and-services", descriptionType);
        const row: any = rowData || {};
        const totalAmountInQAR = Number(row.amount);
        const amountIn2022USD = !isNaN(totalAmountInQAR) ? totalAmountInQAR / 4.07 : 0;
        const EmissionsmTCO2e = !isNaN(amountIn2022USD)
            ? (amountIn2022USD * emissionFactor) / 1000
            : null;
        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const employeeCommuteCalculate = (data: any = []) => {
    const result: any[] = [];

    let totalEmissionsmTCO2e = 0;
    let totalForRowEmissionsmTCO2e = 0;

    let petrolCarEmissionFactor = 0.16272;
    let dieselCarEmissionFactor = 0.17304;
    let hybridCarEmissionFactor = 0.12825;
    let evCarEmissionFactor = 0.04047;
    let metroEmissionFactor = 0.0278;

    for (const rowData of data) {
        const row: any = rowData || {};

        const workingDays = Number(row?.working_days) || 0;


        const petrolUsers = Number(row?.petrol_users);
        const petrolAvgkm = Number(row?.petrol_avg_km);
        const petrolUsersMul = petrolCarEmissionFactor * petrolUsers * petrolAvgkm * workingDays;
        const petrolUsersEmissionsmTCO2e = !isNaN(petrolUsersMul) ? petrolUsersMul / 1000 : 0;
        row.petrol_emissionsm_TCO2e = petrolUsersEmissionsmTCO2e;
        totalForRowEmissionsmTCO2e = totalForRowEmissionsmTCO2e + petrolUsersEmissionsmTCO2e;

        const dieselUsers = Number(row?.diesel_users);
        const dieselAvgkm = Number(row?.diesel_avg_km);
        const dieselUsersMul = dieselCarEmissionFactor * dieselUsers * dieselAvgkm * workingDays;
        const dieselUsersEmissionsmTCO2e = !isNaN(dieselUsersMul) ? dieselUsersMul / 1000 : 0;
        row.diesel_emissionsm_TCO2e = dieselUsersEmissionsmTCO2e;
        totalForRowEmissionsmTCO2e = totalForRowEmissionsmTCO2e + dieselUsersEmissionsmTCO2e;


        const hybridUsers = Number(row?.hybrid_users);
        const hybridAvgkm = Number(row?.hybrid_avg_km);
        const hybridUsersMul = hybridCarEmissionFactor * hybridUsers * hybridAvgkm * workingDays;
        const hybridUsersEmissionsmTCO2e = !isNaN(hybridUsersMul) ? hybridUsersMul / 1000 : 0;
        row.hybrid_emissionsm_TCO2e = hybridUsersEmissionsmTCO2e;
        totalForRowEmissionsmTCO2e = totalForRowEmissionsmTCO2e + hybridUsersEmissionsmTCO2e;

        const evUsers = Number(row?.ev_users);
        const evAvgkm = Number(row?.ev_avg_km);
        const evUsersMul = evCarEmissionFactor * evUsers * evAvgkm * workingDays;
        const evUsersEmissionsmTCO2e = !isNaN(evUsersMul) ? evUsersMul / 1000 : 0;
        row.ev_emissionsm_TCO2e = evUsersEmissionsmTCO2e;
        totalForRowEmissionsmTCO2e = totalForRowEmissionsmTCO2e + evUsersEmissionsmTCO2e;

        const metroUsers = Number(row?.metro_commuters);
        const metroAvgkm = Number(row?.metro_avg_km)
        const metroUsersMul = metroEmissionFactor * metroUsers * metroAvgkm * workingDays;
        const metroUsersEmissionsmTCO2e = !isNaN(metroUsersMul) ? metroUsersMul / 1000 : 0;
        row.metro_emissionsm_TCO2e = metroUsersEmissionsmTCO2e;
        totalForRowEmissionsmTCO2e = totalForRowEmissionsmTCO2e + metroUsersEmissionsmTCO2e;

        row.total_emissionsm_TCO2e = totalForRowEmissionsmTCO2e;
        result.push(row);
        totalEmissionsmTCO2e += totalForRowEmissionsmTCO2e ?? 0;
    }

    return { totalEmissionsmTCO2e, result };
}

const wasteGeneratedCalculate = (data: any = []) => {
    const result: any[] = [];
    let emissionFactorRecyclable = 4.68568;
    let totalEmissionsmTCO2e = 0;
    for (const rowData of data) {
        const row = { ...rowData };
        const wasteType = row?.waste_type || "";
        const treatmentType = row?.treatment_type || "";
        let emissionFactorNonRecyclable = 0;
        if (treatmentType === "Landfill") {
            emissionFactorNonRecyclable = getEmissionFactor("waste-generated-land-fill", wasteType);
        } else if (treatmentType === "Incineration") {
            emissionFactorNonRecyclable = getEmissionFactor("waste-generated-land-incineration", wasteType);
        }
        const GeneralWaste = Number(row.general_waste) || 0;
        const nonRecyclableWasteWithEmissionFactor = GeneralWaste * emissionFactorNonRecyclable;

        const PaperWaste = Number(row.paper_waste) || 0;
        const PlasticWaste = Number(row.plastic_waste) || 0;
        const totalRecyclableWaste = PaperWaste + PlasticWaste;
        const totalRecyclableWasteWithEmissionFactor = totalRecyclableWaste * emissionFactorRecyclable;

        const totalQuantityWithEmissionFactor = totalRecyclableWasteWithEmissionFactor + nonRecyclableWasteWithEmissionFactor;
        const EmissionsmTCO2e = !isNaN(totalQuantityWithEmissionFactor) ? totalQuantityWithEmissionFactor / 1_000_000 : 0;

        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor_for_non_recyclable = emissionFactorNonRecyclable;
        row.emission_factor_for_recyclable = emissionFactorRecyclable;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}

const purchasedCoolingCalculate = (data: any[] = []) => {
    const result: any[] = [];
    const emissionFactor = 0.5; // kgCO2e per kWh
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const row = { ...rowData };

        const totalConsumption = Number(row.cooling_consumption) || 0;
        const units = row.units || "kWh";
        const consumptionInKWh = convertToKWh(totalConsumption, units);
        const EmissionsmTCO2e = (consumptionInKWh * emissionFactor) / 1000;

        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;

        totalEmissionsmTCO2e += EmissionsmTCO2e;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
};


const businessTravelCalculate = async (data: any = []) => {
    const result: any[] = [];
    let totalEmissionsmTCO2e = 0;

    for (const rowData of data) {
        const row = { ...rowData };
        const classType = row?.flight_class || "";
        const emissionFactor = getEmissionFactor("business-travel", classType);
        const emissionFactorWTT = getEmissionFactor("business-travel-wtt", classType);

        const from = row?.from || "";
        const destinations = row?.destinations || [];
        const totalDistance = await getTotalDistance(from, destinations);
        const EFCalc = totalDistance * emissionFactor;
        const WTTEFCalc = totalDistance * emissionFactorWTT;
        const EFPlusWTT = EFCalc + WTTEFCalc;
        const EmissionsmTCO2e = !isNaN(EFPlusWTT) ? EFPlusWTT / 1000 : 0;

        row.emissionsm_TCO2e = EmissionsmTCO2e;
        row.emission_factor = emissionFactor;
        row.emission_factor_wtt = emissionFactorWTT;
        totalEmissionsmTCO2e += EmissionsmTCO2e ?? 0;
        result.push(row);
    }

    return { totalEmissionsmTCO2e, result };
}


const getEmissionFactor = (categoryType: string, emissionFactorType: string): number => {
    const categories: Record<string, Record<string, number>> = {
        "fugitive-emissions": fugitiveEmissionsEmissionList,
        "mobile-combustion": mobileCombustionEmissionList,
        "purchased-goods-and-services": purchasedGoodsAndServicesEmissionList,
        "fuel-energy-related-wtt": fuelEnergyRelatedEmissionWTTList,
        "fuel-energy-related-td": fuelEnergyRelatedEmissionTDList,
        "business-travel": businessTravelEFList,
        "business-travel-wtt": businessTravelWTTEFList,
        "employee-commute-petrol": employeeCommuteEmissionPetrolList,
        "employee-commute-diesel": employeeCommuteEmissionDieselList,
        "employee-commute-hybrid": employeeCommuteEmissionHybridList,
        "employee-commute-electric": employeeCommuteEmissionElectricList,
        "waste-generated-land-fill": wasteGeneratedLandFillList,
        "waste-generated-land-incineration": wasteGeneratedLandIncinerationList,
    };

    const categoryList = categories[categoryType];
    if (!categoryList) return 0;

    const factor = categoryList[emissionFactorType];
    return factor !== undefined ? factor : 0;
};

const convertToKWh = (value: number, unit: string): number => {
    const conversions: Record<string, number> = {
        kWh: 1,
        MWh: 1_000,
        GWh: 1_000_000,
        TWh: 1_000_000_000,
    };

    return value * (conversions[unit] || 1);
};

export const getTotalDistance = async (from: string, destinations: string[]) => {
    let totalDistance = 0;
    let fromLocation = from;

    for (const location of destinations) {
        const toLocation = location;
        if (!fromLocation || !toLocation) continue;

        const fromLatLon = airportsData[fromLocation] || {};
        const toLatLon = airportsData[toLocation] || {};

        if (!fromLatLon?.LatR || !fromLatLon?.LngR || !toLatLon?.LatR || !toLatLon?.LngR) continue;

        const distance = calculateDistance(
            fromLatLon.LatR,
            fromLatLon.LngR,
            toLatLon.LatR,
            toLatLon.Lng
        );
        totalDistance += distance;
        fromLocation = toLocation;
    }

    return totalDistance;
};

export function calculateDistance(
    fromLat: number,
    fromLon: number,
    toLat: number,
    toLon: number
): number {
    try {
        const R = 6371; // Earth's radius in km

        const dLat = toLat - fromLat;
        const dLon = toLon - fromLon;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(fromLat) * Math.cos(toLat) * Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.asin(Math.sqrt(a));
        return R * c;
    } catch (error) {
        return 0;
    }
}