import { Link } from "react-router-dom";
import { Heart, Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-gray-300 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center text-black font-bold text-lg shadow-lg">
                L
              </div>
              <span className="text-2xl font-semibold text-white tracking-wide">
                LuxStay
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed">
              Experience world-class luxury stays with LuxStay. Discover premium
              rooms, elegant spaces, and unforgettable hospitality designed for
              your perfect getaway.
            </p>

            {/* SOCIAL */}
            <div className="flex gap-4 mt-6">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-yellow-500 hover:text-black transition duration-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: "Home", to: "/" },
                { label: "Rooms", to: "/rooms" },
                { label: "Events", to: "/events" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="hover:text-yellow-400 transition"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <a
                  href="mailto:info@luxstay.com"
                  className="hover:text-yellow-400 transition"
                >
                  info@luxstay.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-yellow-400" />
                <a
                  href="tel:+1234567890"
                  className="hover:text-yellow-400 transition"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-lg">Legal</h3>
            <ul className="space-y-3 text-sm">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-yellow-400 transition">
                      {item}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
            <p>© {currentYear} LuxStay. All rights reserved.</p>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>for luxury travelers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
