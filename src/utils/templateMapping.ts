export const categoryTemplates: Record<string, {
    filename: string;
    displayName: string;
    fields: string[];
    columnMapping: Record<string, string>;
}> = {
    'business-travel': {
        filename: 'business_travel.xlsx',
        displayName: 'Business Travel Template',
        fields: ['reporting_period', 'flight_date', 'flight_type', 'flight_class', 'from', 'destination'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'flight_date': 'flight_date',
            'flight_type': 'flight_type',
            'flight_class': 'flight_class',
            'from': 'from',
            'destination_1': 'destination',
            'destination_2': 'destination',
            'destination_3': 'destination',
            'destination_4': 'destination',
            'destination_5': 'destination',
            'destination_6': 'destination'
        }
    },

    'electricity-consumption': {
        filename: 'electricity_consumption.xlsx',
        displayName: 'Electricity Consumption Template',
        fields: ['reporting_period', 'location', 'electricity_supplier', 'electricity_consumption', 'units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'electricity_supplier_grid___renewable___mixed': 'electricity_supplier',
            'electricty_consumption': 'electricity_consumption',
            'units': 'units'
        }
    },

    'fire-extinguishers': {
        filename: 'fire_extinguishers.xlsx',
        displayName: 'Fire Extinguishers Template',
        fields: ['reporting_period', 'office', 'location', 'office_id', 'total_quantity_of_co2', 'consumption_units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'office': 'office',
            'location': 'location',
            'office_id': 'office_id',
            'total_quantity_of_co2_refilled_during_reporting_period': 'total_quantity_of_co2',
            'consumption_units': 'consumption_units'
        }
    },

    'fugitive-emissions': {
        filename: 'fugitive_emissions.xlsx',
        displayName: 'Fugitive Emissions Template',
        fields: ['reporting_period', 'location', 'equipment_id', 'equipment_type', 'refrigerant_used', 'total_consumption_refill', 'units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'equipment_id': 'equipment_id',
            'equipment_type': 'equipment_type',
            'refrigerant_used': 'refrigerant_used',
            'total_consumption_refill_in_reporting_period': 'total_consumption_refill',
            'units': 'units'
        }
    },

    'mobile-combustion': {
        filename: 'mobile_combustion.xlsx',
        displayName: 'Mobile Combustion Template',
        fields: ['reporting_period', 'car_plate_id', 'vehicle_type', 'fuel_type', 'consumption', 'units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'car_plate___id': 'car_plate_id',
            'vehicle_type': 'vehicle_type',
            'type_of_fuel_used': 'fuel_type',
            'consumption': 'consumption',
            'units': 'units'
        }
    },

    'stationary-combustion': {
        filename: 'stationary_combustion.xlsx',
        displayName: 'Stationary Combustion Template',
        fields: ['reporting_period', 'location', 'asset_id', 'source_of_combustion', 'fuel_type', 'total_consumption', 'consumption_unit'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'asset___equipment_id': 'asset_id',
            'source_of_combustion': 'source_of_combustion',
            'type_of_fuel_used': 'fuel_type',
            'total_fuel_consumption_during_reporting_period': 'total_consumption',
            'consumption_unit': 'consumption_unit'
        }
    },

    'purchased-cooling': {
        filename: 'purchased_cooling.xlsx',
        displayName: 'Purchased Cooling Template',
        fields: ['reporting_period', 'location', 'cooling_supplier', 'cooling_type', 'cooling_consumption', 'units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'cooling_supplier': 'cooling_supplier',
            'cooling_type': 'cooling_type',
            'cooling_consumption': 'cooling_consumption',
            'units': 'units'
        }
    },

    'purchased-goods-and-services': {
        filename: 'purchased_goods_and_services.xlsx',
        displayName: 'Purchased Goods and Services Template',
        fields: ['date_of_expense', 'description', 'currency', 'amount'],
        columnMapping: {
            'date_of_expense': 'date_of_expense',
            'description_of_purchase___expense': 'description',
            'currency': 'currency',
            'amount_debited': 'amount'
        }
    },

    'fuel-energy-related': {
        filename: 'fuel_and_energy_related.xlsx',
        displayName: 'Fuel and Energy Related Template',
        fields: ['reporting_period', 'location', 'energy_type', 'energy_consumed', 'units'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'energy_type': 'energy_type',
            'energy_consumed': 'energy_consumed',
            'units': 'units'
        }
    },

    'waste-generated': {
        filename: 'waste_generated.xlsx',
        displayName: 'Waste Generated Template',
        fields: ['reporting_period', 'location', 'total_waste_collected', 'units', 'general_waste', 'treatment_type', 'recyclable_waste', 'paper_waste', 'plastic_waste'],
        columnMapping: {
            'reporting_period': 'reporting_period',
            'location': 'location',
            'total_waste_collected': 'total_waste_collected',
            'units': 'units',
            'general_waste': 'general_waste',
            'treatment_type': 'treatment_type',
            'recyclable_waste': 'recyclable_waste',
            'paper_waste': 'paper_waste',
            'plastic_waste_': 'plastic_waste',
        }
    },

    'employee-commute': {
        filename: 'employee_commute.xlsx',
        displayName: 'Employee Commute Template',
        fields: [
            'reporting_period',
            "working_days",
            "employees",
            "car_commuters",
            "petrol_users",
            "petrol_avg_km",
            "diesel_users",
            "diesel_avg_km",
            "hybrid_users",
            "hybrid_avg_km",
            "ev_users",
            "ev_avg_km",
            "metro_commuters",
            "metro_avg_km",
            "walking_commuters",
            "walking_avg_km",],
        columnMapping: {
            'reporting_period': 'reporting_period',
            "working_days": "working_days",
            "total_employees": "employees",
            "car_commuters": "car_commuters",
            "petrol_users": "petrol_users",
            "petrol_avg": "petrol_avg_km",
            "diesel_users": "diesel_users",
            "diesel_avg": "diesel_avg_km",
            "hybrid_users": "hybrid_users",
            "hybrid_avg": "hybrid_avg_km",
            "ev_users": "ev_users",
            "ev_avg": "ev_avg_km",
            "metro_commuters": "metro_commuters",
            "metro_avg": "metro_avg_km",
            "walking_commuters": "walking_commuters",
            "walking_avg": "walking_avg_km",
        }
    },
};


export const getTemplateUrl = (categoryType: string): string | null => {
    const template = categoryTemplates[categoryType];
    return template ? `/templates/${template.filename}` : null;
};

export const getTemplateFields = (categoryType: string): string[] | null => {
    const template = categoryTemplates[categoryType];
    return template ? template.fields : null;
};

export const getColumnMapping = (categoryType: string): Record<string, string> | null => {
    const template = categoryTemplates[categoryType];
    return template ? template.columnMapping : null;
};