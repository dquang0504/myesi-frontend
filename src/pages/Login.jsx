import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

// Validation schema
const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// Role-based redirect paths
const redirectPaths = {
  admin: "/admin/dashboard",
  auditor: "/auditor/dashboard",
  analyst: "/analyst/dashboard",
  developer: "/developer/dashboard",
};

// Demo accounts for reference
const demoAccounts = [
  { role: "admin", email: "admin@myesi.com" },
  { role: "developer", email: "developer@myesi.com" },
  { role: "analyst", email: "analyst@myesi.com" },
  { role: "auditor", email: "auditor@myesi.com" },
];

const Login = () => {
  const navigate = useNavigate();
  const { login} = useAuth();


  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      const result = await login(values);

      if (result.success) {
        // Convert role to lowercase for case-insensitive matching
        const userRole = result.user.role.toLowerCase();
        const redirectPath = redirectPaths[userRole] || "/";
        navigate(redirectPath, { replace: true });
      } else {
        setFieldError("password", result.error || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setFieldError("password", "An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle demo account click - auto-fill credentials
  const handleDemoAccountClick = (email, setFieldValue) => {
    setFieldValue("email", email);
    setFieldValue("password", "demo123");
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={loginSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, setFieldValue }) => (
        <div className="login-page">
          <div className="login-container">
            <div className="login-left">
              <div className="login-card">
                <div className="login-header">
                  <div className="logo-container">
                    <div className="logo-icon">
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r="14"
                          stroke="#3b82f6"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 8V16L20 20"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h1>MyESI</h1>
                      <p className="tagline">Enterprise Software Inventory</p>
                    </div>
                  </div>
                  <p className="subtitle">
                    Manage software security, vulnerabilities, and compliance
                  </p>
                </div>

                <div className="sign-in-section">
                  <h2>Sign In</h2>
                  <p className="sign-in-subtitle">
                    Use your credentials to access your dashboard
                  </p>
                </div>
                <Form className="login-form">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field
                      
                      type="email"
                      name="email"
                      id="email"
                      placeholder="Enter your email"
                      className={`form-input ${
                        errors.email && touched.email ? "error" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Enter your password"
                      className={`form-input ${
                        errors.password && touched.password ? "error" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </Form>

                <div className="login-footer">
                  <p>&copy; 2025 SovaWare Pvt. Ltd. All rights reserved.</p>
                </div>
              </div>
            </div>

            <div className="login-right">
              <div className="demo-accounts-card">
                <h3>Demo Accounts</h3>
                <p className="demo-subtitle">
                  Use any of these accounts to explore the platform
                </p>

                <div className="demo-accounts-list">
                  {demoAccounts.map((account, index) => (
                    <div
                      key={index}
                      className="demo-account-item"
                      onClick={() =>
                        handleDemoAccountClick(account.email, setFieldValue)
                      }
                    >
                      <div className="demo-role-badge">{account.role}</div>
                      <div className="demo-email">{account.email}</div>
                    </div>
                  ))}
                </div>

                <div className="demo-note">
                  <p>
                    <strong>Click any demo account</strong> to auto-fill
                    credentials.
                    <br />
                    Password for all demo accounts: <code>demo123</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Formik>
  );
};

export default Login;
