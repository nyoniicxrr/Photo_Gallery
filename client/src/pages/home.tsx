import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Camera, Heart, Building } from "lucide-react";

export default function Home() {
  return (
    <div className="pt-16 animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&h=1380')"
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-light mb-6 animate-slide-up">
            Capture. Create. <span className="font-semibold text-blue-400">Inspire.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 font-light leading-relaxed animate-slide-up" 
             style={{ animationDelay: "0.2s" }}>
            Professional photography services that tell your story through stunning visuals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" 
               style={{ animationDelay: "0.4s" }}>
            <Link href="/gallery">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg font-medium transition-all duration-300 transform hover:scale-105">
                View Portfolio
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-slate-300 hover:bg-white hover:text-gray-900 text-lg font-medium transition-all duration-300">
                Get In Touch
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-3xl sm:text-4xl font-light mb-4">Photography Services</h3>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Specializing in capturing life's most precious moments with artistic vision and technical excellence
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-dark-secondary rounded-xl p-8 hover:bg-dark-accent transition-colors duration-300 group">
            <div className="text-4xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-4">Portrait Photography</h4>
            <p className="text-slate-400 leading-relaxed">
              Professional headshots, family portraits, and personal branding photography that captures personality and emotion.
            </p>
          </div>

          <div className="bg-dark-secondary rounded-xl p-8 hover:bg-dark-accent transition-colors duration-300 group">
            <div className="text-4xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Heart className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-4">Wedding Photography</h4>
            <p className="text-slate-400 leading-relaxed">
              Timeless wedding photography that tells your love story with elegance and artistic flair.
            </p>
          </div>

          <div className="bg-dark-secondary rounded-xl p-8 hover:bg-dark-accent transition-colors duration-300 group">
            <div className="text-4xl text-blue-400 mb-4 group-hover:scale-110 transition-transform">
              <Building className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-4">Commercial Photography</h4>
            <p className="text-slate-400 leading-relaxed">
              Product photography, corporate events, and business imagery that elevates your brand presence.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-dark-secondary py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl sm:text-4xl font-light mb-6">Ready to Create Something Beautiful?</h3>
          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            Let's discuss your vision and bring it to life through exceptional photography
          </p>
          <Link href="/about">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg font-medium transition-all duration-300 transform hover:scale-105">
              Start Your Project
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
