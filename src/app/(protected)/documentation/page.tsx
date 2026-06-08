"use client";

import { useEffect } from "react";
import "../../../scss/documentation.scss";

export default function Documentation() {
  const handleToggleCollapse = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const targetElement = event.currentTarget.nextElementSibling as HTMLElement | null;

    if (targetElement) {
      targetElement.classList.toggle("collapse");
      targetElement.classList.toggle("show");
    }
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleHashChange = () => {
    const hash = window.location.hash;
    if (hash) {
      const sectionId = hash.substring(1);
      handleScrollToSection(sectionId);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleHashChange();
    }, 10);

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="documentation-wrapper">
      <div className="sidebar-main-div">
        <nav id="sidebar" className="shadow rounded-3">
          <ul className="list-unstyled components">
            {/* Getting Started */}
            <li>
              <a
                href="#getting-started"
                onClick={handleToggleCollapse}
                className="dropdown-toggle"
              >
                Getting Started
              </a>
              <ul className="collapse list-unstyled">
                <li>
                  <a href="#introduction">Introduction to Sustaino-AI</a>
                </li>
                <li>
                  <a href="#quick-start">Quick Start Guide</a>
                </li>
              </ul>
            </li>

            {/* Core Features */}
            <li>
              <a
                href="#core-features"
                onClick={handleToggleCollapse}
                className="dropdown-toggle"
              >
                Core Features
              </a>
              <ul className="collapse list-unstyled">
                <li>
                  <a href="#dashboard">Dashboard Overview</a>
                </li>
                <li>
                  <a href="#projects">Project Management</a>
                </li>
                <li>
                  <a href="#categories">Emissions Categories</a>
                </li>
              </ul>
            </li>

            {/* User Management */}
            <li>
              <a
                href="#user-management"
                onClick={handleToggleCollapse}
                className="dropdown-toggle"
              >
                User Management
              </a>
              <ul className="collapse list-unstyled">
                <li>
                  <a href="#user-roles">User Roles & Permissions</a>
                </li>
                <li>
                  <a href="#audit-trail">Audit Trail</a>
                </li>
                <li>
                  <a href="#notifications">Notifications</a>
                </li>
              </ul>
            </li>

            {/* Account Settings */}
            <li>
              <a
                href="#account-settings"
                onClick={handleToggleCollapse}
                className="dropdown-toggle"
              >
                Account Settings
              </a>
              <ul className="collapse list-unstyled">
                <li>
                  <a href="#profile">Profile & Password</a>
                </li>
              </ul>
            </li>
            {/* Reporting */}
            <li>
              <a
                href="#reporting"
                onClick={handleToggleCollapse}
                className="dropdown-toggle"
              >
                Reporting
              </a>
              <ul className="collapse list-unstyled">
                <li>
                  <a href="#reports">Generate Reports</a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>

      <div className="documentation-content">
        {/* Introduction Section */}
        <div id="introduction" className="section">
          <h2>Introduction to Sustaino-AI</h2>
          <p>Sustaino-AI is a comprehensive <strong>Greenhouse Gas (GHG) Inventory Management System</strong> designed to help organizations track, measure, and manage their carbon emissions with precision and ease.</p>
          <p>Developed by <strong>GORD</strong> (Gulf Organisation for Research & Development), this platform enables organizations to:</p>
          <ul>
            <li>Track emissions across Scope 1, 2, and 3 categories</li>
            <li>Manage multiple projects by reporting year</li>
            <li>Monitor progress with interactive dashboards and visualizations</li>
            <li>Collaborate with team members using role-based access control</li>
            <li>Maintain compliance with complete audit trails for transparency</li>
          </ul>
          <img src="/screens/login.png" alt="Sustaino-AI Login Screen" className="img-fluid" />

          <h3>Key Features</h3>
          <p><strong>📁 Multi-Project Management</strong><br />Create and manage carbon footprint projects for different reporting years.</p>
          <p><strong>👥 Role-Based Access Control</strong><br />- <strong>Admin</strong>: Full system access, user management, and configuration<br />- <strong>Manager</strong>: Project creation, data entry, and report generation<br />- <strong>Data Entry</strong>: Limited access for entering emissions data</p>
          <p><strong>📝 Comprehensive Category Coverage</strong><br />Pre-configured emission categories covering all three scopes as defined by the GHG Protocol.</p>
          <p><strong>🔍 Complete Audit Trail</strong><br />Track all user actions with timestamp, user information, and action details for compliance.</p>

          <h3>GHG Scopes Overview</h3>
          <table className="table table-bordered">
            <thead>
              <tr><th>Scope</th><th>Description</th><th>Examples</th></tr>
            </thead>
            <tbody>
              <tr><td><strong>Scope 1</strong></td><td>Direct emissions from owned/controlled sources</td><td>Stationary combustion, mobile combustion, fugitive emissions</td></tr>
              <tr><td><strong>Scope 2</strong></td><td>Indirect emissions from purchased energy</td><td>Electricity consumption, purchased cooling, purchased heating</td></tr>
              <tr><td><strong>Scope 3</strong></td><td>All other indirect emissions in value chain</td><td>Purchased goods, waste, employee commute, business travel</td></tr>
            </tbody>
          </table>

          <h3>Getting Started</h3>
          <p>Ready to start tracking your carbon emissions?</p>
          <ol>
            <li><a href="#quick-start">Quick Start Guide</a> - Get up and running in minutes</li>
            <li><a href="#dashboard">Dashboard Overview</a> - Understand the main interface</li>
            <li><a href="#projects">Project Management</a> - Create your first project</li>
          </ol>
        </div>

        {/* Quick Start Section */}
        <div id="quick-start" className="section">
          <h2>Quick Start Guide</h2>
          <p>Follow these steps to start tracking your greenhouse gas emissions with Sustaino-AI:</p>
          <ol>
            <li>Login to the system</li>
            <li>Create your first project</li>
            <li>Select emission categories</li>
            <li>Enter emissions data</li>
            <li>View dashboard and reports</li>
          </ol>

          <h3>Step 1: Login to Sustaino-AI</h3>
          <p><strong>Access the Login Page</strong><br />Navigate to your organization's Sustaino-AI URL or click <strong>"Login"</strong> from the main navigation.</p>
          <img src="/screens/login.png" alt="Login Screen" className="img-fluid" />
          <p><strong>Enter Credentials</strong><br />Input your registered Email Address, enter your Password, and click Login.</p>
          <blockquote>Note: Contact your system administrator if you don't have login credentials.</blockquote>

          <h3>Step 2: Create Your First Project</h3>
          <p><strong>Navigate to Projects</strong><br />Click Projects from the main  menu and click Create Project button.</p>
          <img src="/screens/projects.png" alt="Projects List" className="img-fluid" />
          <p><strong>Enter Project Details</strong><br />- Project Type: Carbon Footprint<br />- Reporting Year: Select the year<br />- Project Name: Enter a descriptive name (e.g., "Company GHG 2024")<br />- Click Save</p>

          <h3>Step 3: Select Emission Categories</h3>
          <p>After creating the project, you'll see the Project Details page with categories organized by scope:</p>
          <img src="/screens/create_projects.png" alt="Project Details" className="img-fluid" />

          <h3>Step 4: Enter Emissions Data</h3>
          <p>Navigate to each category and enter your emissions data. For example, click on <strong>Fire Extinguishers</strong> to see the data entry interface.</p>
          <img src="/screens/data_entry.png" alt="Fire Extinguishers Data Entry" className="img-fluid" />

          <h3>Step 5: View Your Dashboard</h3>
          <p>Once data is entered, navigate to the Dashboard to visualize your emissions:</p>
          <img src="/screens/main_dashboard.png" alt="Main Dashboard" className="img-fluid" />
        </div>

        {/* Dashboard Section */}
        <div id="dashboard" className="section">
          <h2>Dashboard Overview</h2>
          <p>The Sustaino-AI dashboard provides a comprehensive view of greenhouse gas emissions across all three scopes.</p>
          <img src="/screens/main_dashboard.png" alt="Main Dashboard" className="img-fluid" />

          <h3>Carbon Emissions Trend</h3>
          <p>The top section displays emissions trends over time with year-over-year comparisons.</p>

          <h3>Scope Comparison</h3>
          <p>Compare emissions across Scope 1, 2, and 3 to identify the largest contributors to your carbon footprint.</p>

          <h3>Understanding MTCO2e</h3>
          <p>All emissions are displayed in <strong>MTCO2e</strong> (Metric Tons of Carbon Dioxide Equivalent), which converts all greenhouse gases to equivalent CO2.</p>
        </div>

        {/* Projects Section */}
        <div id="projects" className="section">
          <h2>Project Management</h2>
          <p>Projects in Sustaino-AI allow you to organize carbon footprint data by reporting year.</p>
          <img src="/screens/projects.png" alt="Projects List" className="img-fluid" />

          <h3>Creating a New Project</h3>
          <p>Navigate to Projects, click Create Project, enter project details, and save.</p>
          <img src="/screens/create_projects.png" alt="Create Projects" className="img-fluid" />

          <h3>Project Dashboard</h3>
          <p>Click on the gauge icon to view detailed project dashboard with emissions data.</p>
          <img src="/screens/project_dashboard.png" alt="Project Dashboard" className="img-fluid" />
        </div>

        {/* Categories Section */}
        <div id="categories" className="section">
          <h2>Emissions Categories</h2>
          <p>Sustaino-AI comes with pre-configured emission categories organized by GHG Protocol scopes.</p>
          <img src="/screens/Settings.png" alt="Settings Menu" className="img-fluid" />
          <img src="/screens/categories_list.png" alt="Categories List" className="img-fluid" />

          <h3 id="scope-1">Scope 1 Categories (Direct Emissions)</h3>
          <ul>
            <li id="scope-1-stationary"><strong>Stationary Combustion</strong> - Emissions from fuel combustion in stationary equipment</li>
            <li id="scope-1-mobile"><strong>Mobile Combustion</strong> - Emissions from fuel combustion in mobile sources</li>
            <li id="scope-1-fugitive"><strong>Fugitive Emissions</strong> - Intentional or unintentional releases from equipment</li>
            <li id="scope-1-fire"><strong>Fire Extinguishers</strong> - Emissions from fire suppression systems</li>
            <li id="scope-1-process"><strong>Process Emissions</strong> - Emissions from industrial processes</li>
          </ul>

          <h3 id="scope-2">Scope 2 Categories (Energy Indirect)</h3>
          <ul>
            <li id="scope-2-electricity"><strong>Electricity Consumption</strong> - Emissions from purchased electricity</li>
            <li id="scope-2-cooling"><strong>Purchased Cooling</strong> - Emissions from purchased chilled water</li>
            <li id="scope-2-heating"><strong>Purchased Heating</strong> - Emissions from purchased steam or hot water</li>
          </ul>

          <h3 id="scope-3">Scope 3 Categories (Other Indirect)</h3>
          <ul>
            <li id="scope-3-goods"><strong>Purchased Goods and Services</strong> - Emissions from production of purchased products</li>
            <li id="scope-3-fuel"><strong>Fuel & Energy Related</strong> - Upstream emissions from fuel production</li>
            <li id="scope-3-waste"><strong>Waste Generated</strong> - Emissions from waste disposal</li>
            <li id="scope-3-commute"><strong>Employee Commute</strong> - Employee travel to/from work</li>
            <li id="scope-3-travel"><strong>Business Travel</strong> - Employee travel for business</li>
            <li id="scope-3-upstream"><strong>Upstream Transportation</strong> - Transport of purchased goods</li>
            <li id="scope-3-downstream"><strong>Downstream Transportation</strong> - Transport of sold products</li>
            <li id="scope-3-leased"><strong>Upstream Leased Assets</strong> - Emissions from leased equipment</li>
            <li id="scope-3-use"><strong>Use of Sold Products</strong> - Emissions from customer product use</li>
            <li id="scope-3-eol"><strong>End-of-Life Treatment</strong> - Emissions from product disposal</li>
            <li id="scope-3-downstream-leased"><strong>Downstream Leased Assets</strong> - Emissions from leased assets</li>
            <li id="scope-3-franchises"><strong>Franchises</strong> - Emissions from franchise operations</li>
            <li id="scope-3-investments"><strong>Investments</strong> - Emissions from investment portfolio</li>
            <li id="scope-3-processing"><strong>Processing of Sold Products</strong> - Emissions from processing intermediate products</li>
          </ul>

          <h3>Managing Categories</h3>
          <p>To active or inactive a category, click the Edit button (pencil icon).</p>
          <img src="/screens/edit_categories.png" alt="Edit Category Interface" className="img-fluid" />
        </div>

        {/* User Management Section */}
        <div id="user-roles" className="section">
          <h2>User Roles & Permissions</h2>
          <p>Sustaino-AI provides role-based access control to manage user permissions.</p>
          <img src="/screens/users.png" alt="User Management" className="img-fluid" />

          <h3>User Roles</h3>
          <ul>
            <li><strong>Admin</strong> - Full system access, user management, category configuration</li>
            <li><strong>Manager</strong> - Project creation, data entry, report generation</li>
            <li><strong>Data Entry</strong> - Limited access for entering emissions data</li>
          </ul>
        </div>

        {/* Audit Trail Section */}
        <div id="audit-trail" className="section">
          <h2>Audit Trail</h2>
          <p>The Audit Trail provides a complete history of all user actions and system changes.</p>
          <img src="/screens/audit_trail.png" alt="Audit Trail" className="img-fluid" />

          <h3>Tracked Actions</h3>
          <ul>
            <li>User Status Changed</li>
            <li>User Created / Updated</li>
            <li>Project Created / Updated / Deleted</li>
            <li>Category Data Add / Update / Delete</li>
          </ul>
        </div>

        {/* Notifications Section */}
        <div id="notifications" className="section">
          <h2>Notifications</h2>
          <p>Stay informed about system activities with real-time notifications.</p>
          <img src="/screens/notifications.png" alt="Notifications" className="img-fluid" />

          <h3>Notification Types</h3>
          <ul>
            <li>New Data Added</li>
            <li>Data Approved</li>
            <li>Data Updated</li>
            <li>Project Created / Updated</li>
            
          </ul>
        </div>

        {/* Profile Section */}
        <div id="profile" className="section">
          <h2>Profile & Password Management</h2>
          <p>Manage your personal information and account security settings.</p>
          <img src="/screens/profile_and_password.png" alt="Profile Settings" className="img-fluid" />

          <h3>Changing Your Password</h3>
          <p><strong>Password Requirements:</strong><br />Minimum 8 characters, uppercase, lowercase, number, and special character.</p>
          <p><strong>Steps:</strong><br />1. Navigate to My Profile<br />2. Enter Current Password<br />3. Enter New Password<br />4. Confirm and Update</p>
        </div>

        {/* Reports Section */}
        <div id="reports" className="section">
          <h2>Generate Reports</h2>
          <p>Generate comprehensive greenhouse gas emissions reports.</p>
          <img src="/screens/report.png" alt="Report Sample" className="img-fluid" />

          <h3>Report Types</h3>
          <ul>
            <li>Annual GHG Report</li>
            <li>Project Summary</li>
            <li>Scope Comparison</li>
            <li>Category Analysis</li>
            <li>Trend Report</li>
          </ul>
        </div>
      </div>
    </div>
  );
}