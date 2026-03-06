import { Mail, Phone, MapPin, Send } from "lucide-react";
import Button from "../components/ui/Button";

export default function Contact() {

  return (

    <div className="bg-[#0f0f0f] text-white min-h-screen">

      {/* HERO */}

      <section
        className="relative h-[45vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=2000")',
        }}
      >

        <div className="absolute inset-0 bg-black/70"></div>

        <div className="relative text-center px-6">

          <h1 className="text-5xl font-bold mb-4">
            Contact Us
          </h1>

          <p className="text-gray-300">
            We'd love to assist you with your stay
          </p>

        </div>

      </section>



      {/* CONTACT SECTION */}

      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">

        {/* CONTACT INFO */}

        <div className="space-y-8">

          <h2 className="text-3xl font-bold">
            Get In Touch
          </h2>

          <p className="text-gray-400">
            If you have questions about bookings,
            rooms, or services, feel free to reach out.
          </p>

          <div className="space-y-6">

            <div className="flex items-center gap-4">

              <Phone className="text-yellow-400"/>
              <div>
                <p className="font-semibold">Phone</p>
                <p className="text-gray-400">+91 98765 43210</p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <Mail className="text-yellow-400"/>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-400">info@luxuryhotel.com</p>
              </div>

            </div>

            <div className="flex items-center gap-4">

              <MapPin className="text-yellow-400"/>
              <div>
                <p className="font-semibold">Location</p>
                <p className="text-gray-400">
                  Bahadurgarh, Haryana, India
                </p>
              </div>

            </div>

          </div>

        </div>



        {/* CONTACT FORM */}

        <div className="bg-[#111] border border-white/10 rounded-xl p-8">

          <h3 className="text-xl font-semibold mb-6">
            Send a Message
          </h3>

          <form className="space-y-5">

            <input
              type="text"
              placeholder="Your Name"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3"
            />

            <textarea
              rows="4"
              placeholder="Your Message"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3"
            ></textarea>

            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black flex items-center justify-center gap-2">

              <Send size={16}/>
              Send Message

            </Button>

          </form>

        </div>

      </section>

    </div>

  );

}