"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import callApi from "@/utils/callApi";
import { PasswordValidate } from "@/helpers/client/function";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>({});
  const [formErrors, setFormErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateForm = () => {
    const errors: any = {};
    if (!formData?.name) errors.name = "Name is required.";
    if (!formData?.email) errors.email = "Email is required.";
    if (!formData?.phone_number) errors.phone_number = "Phone number is required.";
    if (!formData?.designation) errors.designation = "Designation in SMEs is required.";
    if (!formData?.password) errors.password = "Password is required.";
    if (!formData?.confirm_password) errors.confirm_password = "Confirm password is required.";
    if (formData?.password !== formData.confirm_password)
      errors.confirm_password = "Password and confirm password do not match.";
    if (!PasswordValidate(formData.password))
      errors.password = "Password must contain uppercase, lowercase, number, and special character.";

    // organization information
    if (!formData?.organization_name) errors.organization_name = "SMEs name is required.";
    if (!formData?.organization_email) errors.organization_email = "SMEs email is required.";
    if (!formData?.organization_phone) errors.organization_phone = "SMEs phone number is required.";
    if (!formData?.organization_address) errors.organization_address = "SMEs address is required.";
    if (!formData?.organization_country) errors.organization_country = "SMEs country is required.";
    if (!formData?.organization_city) errors.organization_city = "SMEs city is required.";
    if (!formData?.organization_sector) errors.organization_sector = "SMEs sector is required.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await callApi("/api/auth/register", formData);

      setIsLoading(false);

      if (res?.status === 400) {
        Swal.fire({
          icon: "error",
          title: res?.title || "Error",
          text: res?.message || "Something went wrong",
          confirmButtonColor: "#224b6b",
        });
      } else if (res?.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res?.message,
          confirmButtonColor: "#224b6b",
        }).then((result) => {
          if (result.isConfirmed) router.push("/login");
        });
      }
    } catch (err) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong",
        confirmButtonColor: "#224b6b",
      });
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-12 col-md-8 col-lg-7">
          <div className="card shadow-lg rounded-3">
            <div className="card-body p-2 p-md-5">

              <h2 className="card-title text-center mb-4">Registration Request</h2>

              <form onSubmit={handleSubmit} noValidate>
                <div className="row">
                  <div className="col-lg-12 col-md-12 p-0 m-0 mb-3 mx-2">
                    <p className="p-0 m-0 fw-bold text-muted">SME Information</p>
                    <hr className="m-0" />
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_name" className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization_name ? "is-invalid" : ""}`}
                      id="organization_name"
                      placeholder="Enter your SMEs name"
                      value={formData.organization_name}
                      onChange={handleChange}
                    />
                    {formErrors.organization_name && <div className="invalid-feedback">{formErrors.organization_name}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.organization_email ? "is-invalid" : ""}`}
                      id="organization_email"
                      placeholder="Enter your SMEs email"
                      value={formData.organization_email}
                      onChange={handleChange}
                    />
                    {formErrors.organization_email && <div className="invalid-feedback">{formErrors.organization_email}</div>}
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_phone" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization_phone ? "is-invalid" : ""}`}
                      id="organization_phone"
                      placeholder="Enter your SMEs phone number"
                      value={formData.organization_phone}
                      onChange={handleChange}
                    />
                    {formErrors.organization_phone && <div className="invalid-feedback">{formErrors.organization_phone}</div>}
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_address" className="form-label">Address</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization_address ? "is-invalid" : ""}`}
                      id="organization_address"
                      placeholder="Enter your SMEs address"
                      value={formData.organization_address}
                      onChange={handleChange}
                    />
                    {formErrors.organization_address && <div className="invalid-feedback">{formErrors.organization_address}</div>}
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_sector" className="form-label">Sector</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors?.organization_address ? "is-invalid" : ""}`}
                      id="organization_sector"
                      placeholder="Enter SME Sector"
                      value={formData?.organization_sector || ""}
                      onChange={handleChange}
                    />
                    {formErrors?.organization_sector && <div className="invalid-feedback">{formErrors?.organization_sector}</div>}
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_country" className="form-label">Country</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization_country ? "is-invalid" : ""}`}
                      id="organization_country"
                      placeholder="Enter your SMEs country"
                      value={formData.organization_country}
                      onChange={handleChange}
                    />
                    {formErrors.organization_country && <div className="invalid-feedback">{formErrors.organization_country}</div>}
                  </div>
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="organization_city" className="form-label">City</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.organization_city ? "is-invalid" : ""}`}
                      id="organization_city"
                      placeholder="Enter your SMEs city"
                      value={formData.organization_city}
                      onChange={handleChange}
                    />
                    {formErrors.organization_city && <div className="invalid-feedback">{formErrors.organization_city}</div>}
                  </div>

                  <div className="col-lg-12 col-md-12 p-0 m-0 mb-3 mx-2">
                    <p className="p-0 m-0 fw-bold text-muted">SME Admin User Information</p>
                    <hr className="m-0" />
                  </div>

                  {/* Name */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors?.name ? "is-invalid" : ""}`}
                      id="name"
                      placeholder="Enter your name"
                      value={formData?.name}
                      onChange={handleChange}
                    />
                    {formErrors?.name && <div className="invalid-feedback">{formErrors?.name}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors?.email ? "is-invalid" : ""}`}
                      id="email"
                      placeholder="Enter your email"
                      value={formData?.email}
                      onChange={handleChange}
                    />
                    {formErrors?.email && <div className="invalid-feedback">{formErrors?.email}</div>}
                  </div>

                  {/* Phone Number */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="phone_number" className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors?.phone_number ? "is-invalid" : ""}`}
                      id="phone_number"
                      placeholder="Enter your phone number"
                      value={formData?.phone_number}
                      onChange={handleChange}
                    />
                    {formErrors?.phone_number && <div className="invalid-feedback">{formErrors?.phone_number}</div>}
                  </div>

                  {/* Designation */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="address" className="form-label">Designation</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors?.designation ? "is-invalid" : ""}`}
                      id="designation"
                      placeholder="Enter your designation"
                      value={formData?.designation}
                      onChange={handleChange}
                    />
                    {formErrors?.designation && <div className="invalid-feedback">{formErrors?.designation}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors?.password ? "is-invalid" : ""}`}
                      id="password"
                      placeholder="Enter your password"
                      value={formData?.password}
                      onChange={handleChange}
                    />
                    {formErrors?.password && <div className="invalid-feedback">{formErrors?.password}</div>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3 col-lg-6 col-md-12">
                    <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.confirm_password ? "is-invalid" : ""}`}
                      id="confirm_password"
                      placeholder="Confirm your password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                    />
                    {formErrors.confirm_password && <div className="invalid-feedback">{formErrors.confirm_password}</div>}
                  </div>




                  {/* Submit */}

                  <div className="d-grid mb-3 d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary action-button" style={{ width: "200px" }} >
                      Submit Request
                    </button>
                  </div>

                </div>


              </form>

              <p className="text-center text-muted mb-0">
                Already have an account?{" "}
                <Link href="/login" className="text-primary">Login</Link>
              </p>

            </div>
          </div>

          <div className="text-center mt-3 text-muted">
            Powered by <strong>GORD</strong>
          </div>
        </div>
      </div >
    </div >
  );
}
