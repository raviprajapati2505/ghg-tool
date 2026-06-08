type TooltipItem = {
  message: string | null;
  link: string | null;
};

type TooltipDataListProps = {
  tooltipKey: string;
};

const TooltipDataList = ({
  tooltipKey,
}: TooltipDataListProps): TooltipItem => {

  const tooltip_data_list: Record<string, TooltipItem> = {
    scope_1: {
      message: "Scope 1 emissions are direct greenhouse gas (GHG) emissions from sources that are owned or controlled by an organization.",
      link: "",
    },
    fire_extinguishers: {
      message: "Emissions from fire extinguishers are greenhouse gases released when extinguishers discharge, leak, or are serviced.",
      link: "",
    },
    fugitive_emissions: {
      message: "Fugitive emissions are unintentional releases of greenhouse gases from equipment, systems, or industrial processes. They occur through leaks, venting, or accidental discharge (e.g., refrigerants, fire suppressants, or gas pipelines).",
      link: "",
    },
    stationary_combustion: {
      message: "Stationary combustion refers to greenhouse gas emissions from burning fuels in fixed equipment at a facility. Examples include boilers, furnaces, generators, and heaters used for heating, power, or industrial processes.",
      link: "",
    },
    mobile_combustion: {
      message: "Mobile combustion refers to greenhouse gas emissions from burning fuels in transportation sources that move from place to place. Examples include company cars, trucks, buses, ships, and aircraft owned or controlled by the organization.",
      link: "",
    },
    process_emissions: {
      message: "Process emissions are greenhouse gas emissions released from industrial or chemical processes, not from fuel combustion. They occur when raw materials undergo physical or chemical transformation (e.g., cement production, metal smelting, chemical manufacturing).",
      link: "",
    },
    scope_2: {
      message: "Scope 2 emissions are indirect greenhouse gas emissions from the generation of purchased or acquired energy used by an organization.",
      link: "",
    },
    electricity_consumption: {
      message: "Electricity consumption is the amount of electrical energy used by an organization for its operations.",
      link: "",
    },
    purchased_cooling: {
      message: "Purchased cooling is cooling energy (like chilled water or district cooling) bought from an external provider and used in a facility.",
      link: "",
    },
    purchased_heating: {
      message: "Purchased heating is heat energy (like steam or hot water) bought from an external provider and used in a facility.",
      link: "",
    },
    scope_3: {
      message: "Scope 3 emissions are indirect emissions from activities in your value chain that are not owned or controlled by your organization.",
      link: "",
    },
    purchased_goods_and_services: {
      message: "Purchased goods and services are emissions from the production of products and services your organization buys and uses.",
      link: "",
    },
    fuel_energy_related: {
      message: "Fuel and energy-related activities are emissions from producing and delivering the fuel and energy your organization uses.",
      link: "",
    },
    waste_generated: {
      message: "Waste generated in operations refers to emissions from the treatment and disposal of waste produced by your company's activities.",
      link: "",
    },
    business_travel: {
      message: "Business travel refers to emissions from employee travel for work purposes using transportation not owned or controlled by the organization.",
      link: "",
    },
    employee_commute: {
      message: "Employee commuting refers to emissions from employees traveling between their homes and workplace.",
      link: "",
    },
    upstream_leased_assets: {
      message: "Upstream leased assets are emissions from assets your company leases and uses, but does not own.",
      link: "",
    },
    downstream_transportation_and_distribution: {
      message: "Downstream transportation and distribution are emissions from transporting and storing products after they are sold and leave your company.",
      link: "",
    },
    processing_of_sold_products: {
      message: "Processing of sold products refers to emissions from further processing of intermediate products after they are sold to other companies.",
      link: "",
    },
    use_of_sold_products: {
      message: "Use of sold products refers to emissions generated when customers use the products your company sells.",
      link: "",
    },
    end_of_life_treatment_of_sold_products: {
      message: "End-of-life treatment of sold products refers to emissions from disposal, recycling, or treatment of products after customers finish using them.",
      link: "",
    },
    downstream_leased_assets: {
      message: "Downstream leased assets are emissions from assets your company owns but leases to other parties.",
      link: "",
    },
    franchises: {
      message: "Franchises are emissions from the operations of franchise locations that use your brand but are owned and operated by other parties.",
      link: "",
    },
    investments: {
      message: "Investments are emissions from companies or projects your organization finances or has ownership in.",
      link: "",
    },
  };

  return tooltip_data_list[tooltipKey] || { message: null, link: null };
};

export default TooltipDataList;