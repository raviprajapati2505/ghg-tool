export const sectorsDataList = [
    {
        "name": "Agriculture",
        "kpis": [
            {
                name: "Packaging Material & Waste",
                type: "basic",
                tasks: [
                    {
                        "question": "What percentage of the packaging materials used were made from recycled content during the reporting period?",
                        "frequency": ["quarterly"],
                        "data_type": "number",
                        "description": "(Weight of recycled packaging material / Total packaging material used) × 100"
                    },{
                        "question": "What were the total costs incurred in managing packaging waste (including collection, treatment, recycling, or disposal)?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Total cost = Cost of collection + segregation + recycling + disposal"
                    },
                    {
                        "question": "What is the estimated carbon footprint (CO₂e emissions) associated with the sourcing, production, and disposal of packaging materials?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "Carbon footprint = ∑(Packaging material weight × Emission factor per kg for material type)"
                    },
                    {
                        "question": "What is the average weight or volume of packaging material used per unit of product output?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "Average packaging per product = Total packaging used / Total product units output"
                    },
                    {
                        "question": "What is the total amount of packaging waste generated (in kg or metric tons) during the reporting year?",
                        "frequency": ["monthly"],
                        "data_type": "number",
                        "description": "Total packaging waste = Sum of all packaging waste streams (by weight or volume)"
                    }
                ]
            },
            {
                name: "Food and Nutrition",
                type: "basic",
                tasks: [
                    {
                        "question": "How would you describe the effectiveness of your organization’s initiatives on food security at local, regional, national, or global levels? Please provide examples or outcomes.",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "What key partnerships (including with governments or NGOs) is your organization involved in that support food security objectives?",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "Does your organization have any defined policies or strategic commitments to reduce food loss across the supply chain? Please describe.",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "What is the total weight (in metric tons) and percentage of food loss in your main products or categories? What methodology was used for this calculation (e.g., sampling, internal audit, supply chain estimates)?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Food loss (%) = (Weight of food lost / Total food produced) × 100"
                    },
                    {
                        "question": "How many food product recalls were issued for safety reasons during the reporting period, and what was the total volume (in units or tons) recalled?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": ""
                    }
                ]
            }
        ]
    },
    {
        "name": "E-Commerce",
        "kpis": [
            {
                name: "Packaging Material & Waste",
                type: "basic",
                tasks: [
                    {
                        "question": "What percentage of the materials used in your product packaging were made from recycled content during the reporting period?",
                        "frequency": ["quarterly"],
                        "data_type": "number",
                        "description": "Total Recycled material used/Total material used * 100"
                    },
                    {
                        "question": "What was the total expenditure incurred on managing packaging waste (including collection, segregation, recycling, and disposal)?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Total cost = Cost of collection + segregation + recycling + disposal"
                    },
                    {
                        "question": "What is the total weight or volume of packaging waste generated during the reporting year?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Total packaging waste = Sum of all packaging waste streams (by weight or volume)"
                    },
                    {
                        "question": "What is the estimated carbon footprint (in CO₂e) associated with the lifecycle of your packaging materials?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "Carbon footprint = ∑(Packaging material weight × Emission factor per kg for material type)"
                    },
                    {
                        "question": "What is the average weight or volume of packaging material used per unit of product output?Question text",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "Average packaging per product = Total packaging used / Total product units output"
                    }
                ]
            },
            {
                name: "Consumer Welfare",
                type: "basic",
                tasks: [
                    {
                        "question": "What is your organization’s Net Promoter Score for the reporting period, based on customer feedback surveys?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "text",
                        "description": "NPS = % Promoters (score 9–10) − % Detractors (score 0–6)"
                    },
                    {
                        "question": "What is the average time taken (in hours or days) to resolve customer complaints from the time of receipt?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Average resolution time = ∑(Time resolved − Time received) / Number of complaints"
                    },
                    {
                        "question": "What percentage of total customer grievances received during the reporting period were successfully resolved?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Resolution rate (%) = (Number of grievances resolved / Total grievances received) × 100"
                    },
                    {
                        "question": "What measures are in place to ensure customers clearly understand all applicable fees and charges? How is this information disclosed?",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "What percentage of your customers from the previous period continued their relationship with your company during the reporting year?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "Retention rate (%) = (Customers retained / Customers from previous year) × 100"
                    },
                    {
                        "question": " What percentage of customers discontinued services or ended their relationship with your organization during the reporting period?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "Churn rate (%) = (Customers lost during period / Total customers at start of period) × 100"
                    }
                ]
            }
        ]
    },
    {
        "name": "HealthCare",
        "kpis": [
            {
                name: "Packaging Material & Waste",
                type: "basic",
                tasks: [
                    {
                        "question": "What percentage of the packaging materials used by the organization is composed of recycled content?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "Total Recycled material used/Total material used * 100"
                    },
                    {
                        "question": "What is the total amount of packaging waste generated during the reporting period?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Sum of all packaging waste (in tons or kg) generated during the reporting period."
                    },
                    {
                        "question": " What was the total cost incurred for managing packaging waste during the reporting year (e.g., collection, treatment, recycling, disposal)?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What is the estimated carbon footprint (CO₂e emissions) resulting from the use of packaging materials, from sourcing to end-of-life?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "How much packaging material (by weight or volume) is used per unit of product output? Please specify the unit and type of packaging.",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": ""
                    }
                ]
            },

            {
                name: "Material Sourcing & Efficiency",
                type: "basic",
                tasks: [
                    {
                        "question": "What is the Waste-to-Product Ratio for each of the organization's products?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "The Waste-to-Product Ratio is a sustainability metric that measures the amount of waste generated during the production of a specific product compared to the total weight or quantity of the final product produced."
                    },
                    {
                        "question": "What percentage of materials used in the organization’s production processes are sourced from recycled materials?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "The Percentage of Recycled Materials in Production is a sustainability metric that measures the proportion of recycled materials used as inputs in the manufacturing or production process compared to the total materials used. "
                    }
                ]
            },
            {
                name: "Access and affordability",
                type: "basic",
                tasks: [
                    {
                        "question": "How does the organization ensure access to medicines for patients in low- and middle-income countries (LICs and LMICs)?",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "How many inhabitants or customers have been provided with access to an affordable healthcare system as a result of the organization's initiatives?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What percentage of the organization’s total healthcare insurance premiums is spent directly on medical claims and efforts to improve the quality of care?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What policies and practices are in place to ensure customer access to healthcare coverage? Give details on policies and practices.",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    },
                    {
                        "question": "Has your organization conducted a lifecycle assessment (LCA) of products? If yes, which products were covered, and what key environmental impacts were identified (e.g., emissions, water use, toxicity)?",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": "Percentage of Recycled Materials in Production ( Weight of Recycled Materials Used/Total Weight of Materials Used)×100"
                    }
                ]
            },
            {
                name: "Customer Welfare",
                type: "basic",
                tasks: [
                    {
                        "question": "What specific initiatives or programs has your organization implemented to improve access to healthcare products for priority diseases (e.g., HIV, TB, malaria) in underserved or priority countries?",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": "Total Product Output (kg or units)"
                    },
                    {
                        "question": "Please provide a list of products that have received WHO Prequalification under the Prequalification of Medicines Programme (PQP). Include product names and categories.",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    }
                ]
            }
        ]
    },
    {
        "name": "Industrial Mfg.",
        "kpis": [
            {
                "name": "Material Sourcing & Effciency",
                "type": "basic",
                "tasks": [
                    {
                        "question": "What is the Waste-to-Product Ratio for each of the organization's products?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "The Waste-to-Product Ratio is a sustainability metric that measures the amount of waste generated during the production of a specific product compared to the total weight or quantity of the final product produced."
                    },
                    {
                        "question": "What percentage of materials used in the organization’s production processes are sourced from recycled materials?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "The Percentage of Recycled Materials in Production is a sustainability metric that measures the proportion of recycled materials used as inputs in the manufacturing or production process compared to the total materials used. "
                    }
                ]
            },
            {
                "name": "Product Design & Lifecycle Management",
                "type": "basic",
                "tasks": [
                    {
                        "question": "What was the total revenue generated from remanufactured products and associated remanufacturing services in the reporting period?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What is the total weight of end-of-life products or components recovered through reverse logistics, take-back, or recycling programs?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": "Weight of end of life material recovered is the total weight of materials recovered from products at the end of their lifecycle for reuse or recycling"
                    },
                    {
                        "question": "What proportion (by weight or volume) of each product is made up of materials that are recyclable at end of life?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "The Percentage of Recyclable Materials in Products is a sustainability metric that measures the proportion of a product's total material weight that is made from recyclable materials."
                    }
                ]
            }
        ]
    },
    {
        "name": "FinTech",
        "kpis": [
            {
                "name": "Access & Affordability",
                "type": "basic",
                "tasks": [
                    {
                        "question": "How many no-cost retail checking accounts were opened for customers identified as previously unbanked or underbanked during the reporting period?",
                        "frequency": ["monthly", "annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "How many individuals from unbanked, underbanked, or underserved communities participated in your organization’s financial literacy or awareness initiatives during the reporting period?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": ""
                    }
                ]
            },
            {
                "name": "Customer Welfare",
                "type": "basic",
                "tasks": [
                    {
                        "question": "How many licensed employees or key decision-makers have been involved in investment-related investigations, consumer complaints, civil litigations, or regulatory proceedings during the year?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What is the total monetary value of losses incurred due to legal actions related to marketing and communication of financial products?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": ""
                    },
                    {
                        "question": "What percentage of licensed employees and decision-makers have any history of investment-related legal or regulatory issues?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "(Number of individuals with record / Total number of licensed employees and decision-makers) × 100"
                    },
                    {
                        "question": "How does your organization ensure that customers are well-informed about the features, risks, and benefits of financial products and services? Please describe communication channels, formats, and frequency.",
                        "frequency": ["annually"],
                        "data_type": "text",
                        "description": ""
                    }
                ]
            },
            {
                "name": "Access to Finance",
                "type": "basic",
                "tasks": [
                    {
                        "question": "What proportion of your customers have participated in any financial literacy or education initiatives provided by your institution?",
                        "frequency": ["quarterly", "annually"],
                        "data_type": "number",
                        "description": "(Number of customers who attended at least one financial literacy or education session during the year / Total number of customers) × 100"
                    },
                    {
                        "question": "What percentage of your total customers belong to low-income, unbanked, underbanked, or rural segments, as part of your financial inclusion efforts?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "(Number of customers from low-income, rural, unbanked/underbanked segments / Total customers) × 100. Data can be drawn from demographic profiling, KYC, or income declarations."
                    },
                    {
                        "question": "What proportion of your customers have participated in any financial literacy or education initiatives provided by your institution?",
                        "frequency": ["annually"],
                        "data_type": "number",
                        "description": "Average time (in hours or days) between the receipt of a complete loan application and the final disbursement of funds."
                    }
                ]
            }
        ]
    }

]
