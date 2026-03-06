import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Mail, Lock, Loader } from "lucide-react";

import Button from "../../components/ui/Button";
import Card, { CardBody } from "../../components/ui/Card";
import { AuthContext } from "../../contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "../../utils/toast";
import { loginSchema } from "../../validations/schemas";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { admin, login, loading: authLoading } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  if (admin && !authLoading) {
    return <Navigate to="/admin" replace />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      loginSchema.parse(formData);
      setErrors({});
      setLoading(true);

      await login(formData.email, formData.password);

      showSuccessToast("Login successful");
      navigate("/admin");
    } catch (error) {
      if (error.errors) {
        const newErrors = {};
        error.errors.forEach((err) => {
          newErrors[err.path[0]] = err.message;
        });
        setErrors(newErrors);
      } else {
        const message =
          error.response?.data?.message || error.message || "Login failed";
        showErrorToast(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[110vh] mt-[15px] flex flex-col justify-center items-center px-4 relative overflow-hidden bg-black">
      {/* BACKGROUND IMAGE */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* LOGIN CARD */}
      <Card className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl">
        <CardBody className="p-10">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center text-black text-3xl font-bold shadow-lg">
              H
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-300 mt-2 text-sm">
              Login to manage your hotel
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm text-gray-200 mb-2 flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="admin@hotel.com"
                className={`w-full px-4 py-3 rounded-xl bg-white/20 border text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.email ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-gray-200 mb-2 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl bg-white/20 border text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition ${
                  errors.password ? "border-red-500" : "border-white/20"
                }`}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* DEMO CREDENTIALS */}
          <div className="mt-6 text-center text-xs text-gray-300">
            Demo credentials <br />
            admin@hotel.com / password123
          </div>
        </CardBody>
      </Card>

      {/* FOOTER NOTE */}
      <div className="absolute bottom-6 text-gray-500 text-xs text-center w-full">
        &copy; {new Date().getFullYear()} LuxStay Admin Panel
      </div>
    </div>
  );
}