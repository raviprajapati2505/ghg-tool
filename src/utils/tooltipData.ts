export const tooltipData: Record<string, string> = {
  // Scope 1
  "Scope 1": "Scope 1 emissions are direct greenhouse gas (GHG) emissions from sources that are owned or controlled by an organization.",
  "Fire Extinguishers": "Emissions from fire extinguishers are greenhouse gases released when extinguishers discharge, leak, or are serviced.",
  "Fugitive Emissions": "Fugitive emissions are unintentional releases of greenhouse gases from equipment, systems, or industrial processes. They occur through leaks, venting, or accidental discharge (e.g., refrigerants, fire suppressants, or gas pipelines).",
  "Stationary Combustion": "Stationary combustion refers to greenhouse gas emissions from burning fuels in fixed equipment at a facility. Examples include boilers, furnaces, generators, and heaters used for heating, power, or industrial processes.",
  "Mobile Combustion": "Mobile combustion refers to greenhouse gas emissions from burning fuels in transportation sources that move from place to place. Examples include company cars, trucks, buses, ships, and aircraft owned or controlled by the organization.",
  "Process Emissions": "Process emissions are greenhouse gas emissions released from industrial or chemical processes, not from fuel combustion. They occur when raw materials undergo physical or chemical transformation (e.g., cement production, metal smelting, chemical manufacturing).",

  // Scope 2
  "Scope 2": "Scope 2 emissions are indirect greenhouse gas emissions from the generation of purchased or acquired energy used by an organization.",
  "Electricity Consumption": "Electricity consumption is the amount of electrical energy used by an organization for its operations.",
  "Purchased Cooling": "Purchased cooling is cooling energy (like chilled water or district cooling) bought from an external provider and used in a facility.",
  "Purchased Heating": "Purchased heating is heat energy (like steam or hot water) bought from an external provider and used in a facility.",

  // Scope 3
  "Scope 3": "Scope 3 emissions are indirect emissions from activities in your value chain that are not owned or controlled by your organization.",
  "Purchased Goods and Services": "Purchased goods and services are emissions from the production of products and services your organization buys and uses.",
  "Fuel & Energy Related": "Fuel and energy-related activities are emissions from producing and delivering the fuel and energy your organization uses.",
  "Waste Generated": "Waste generated in operations refers to emissions from the treatment and disposal of waste produced by your company's activities.",
  "Business Travel": "Business travel refers to emissions from employee travel for work purposes using transportation not owned or controlled by the organization.",
  "Employee Commute": "Employee commuting refers to emissions from employees traveling between their homes and workplace.",
  "Upstream leased assets": "Upstream leased assets are emissions from assets your company leases and uses, but does not own.",
  "Downstream transportation and distribution": "Downstream transportation and distribution are emissions from transporting and storing products after they are sold and leave your company.",
  "Processing of sold products": "Processing of sold products refers to emissions from further processing of intermediate products after they are sold to other companies.",
  "Use of sold products": "Use of sold products refers to emissions generated when customers use the products your company sells.",
  "End-of-life treatment of sold products": "End-of-life treatment of sold products refers to emissions from disposal, recycling, or treatment of products after customers finish using them.",
  "Downstream leased assets": "Downstream leased assets are emissions from assets your company owns but leases to other parties.",
  "Franchises": "Franchises are emissions from the operations of franchise locations that use your brand but are owned and operated by other parties.",
  "Investments": "Investments are emissions from companies or projects your organization finances or has ownership in.",
};

export const getTooltip = (subject: string): string => {
  return tooltipData[subject] ?? "";
};