import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, CheckCircle } from "lucide-react";
import { useAdmin } from "@/hooks/use-admin";
import ProfilePhotoUpload from "@/components/profile-photo-upload";

export default function About() {
  const { isAdmin } = useAdmin();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string>("");

  useEffect(() => {
    const savedUrl = localStorage.getItem('profilePhotoUrl');
    if (savedUrl) {
      setProfilePhotoUrl(savedUrl);
    }
  }, []);

  const handlePhotoUpdate = (newUrl: string) => {
    setProfilePhotoUrl(newUrl);
    localStorage.setItem('profilePhotoUrl', newUrl);
  };

  return (
    <div className="pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light mb-6">About the Photographer</h2>
          <div className="mb-8">
            {isAdmin ? (
              <ProfilePhotoUpload 
                currentPhotoUrl={profilePhotoUrl}
                onPhotoUpdate={handlePhotoUpdate}
              />
            ) : (
              <div className="w-32 h-32 mx-auto">
                <img 
                  src={profilePhotoUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=400"} 
                  alt="Photographer portrait" 
                  className="w-full h-full object-cover rounded-full border-4 border-blue-500"
                />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-medium mb-4">Theos Zing'ombe</h3>
          <p className="text-slate-400 text-lg leading-relaxed">
            Professional photographer with over 5 years of experience capturing life's most beautiful moments. 
            Specializing in portrait, wedding, and commercial photography with a focus on storytelling and emotional connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h4 className="text-xl font-semibold mb-4">Experience & Expertise</h4>
            <ul className="space-y-3 text-slate-400">
              <li className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                5+ years professional photography experience
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                100+ successful wedding and portrait sessions
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                Featured in Photography Magazine
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-400 mt-1 mr-3 h-4 w-4 flex-shrink-0" />
                Award-winning landscape photography
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Photography Philosophy</h4>
            <p className="text-slate-400 leading-relaxed">
              I believe every photograph should tell a story. Whether capturing the intimacy of a wedding, 
              the confidence in a portrait, or the grandeur of a landscape, my goal is to create images 
              that evoke emotion and preserve memories for generations to come.
            </p>
          </div>
        </div>

        <div className="text-center bg-dark-secondary rounded-xl p-8">
          <h4 className="text-2xl font-semibold mb-4">Let's Create Together</h4>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Ready to discuss your photography needs? I'd love to hear about your vision and how we can bring it to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-blue-600 hover:bg-blue-700 transition-colors"
              onClick={() => window.open('mailto:matthewszingombe@gmail.com', '_self')}
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-600 hover:bg-slate-700 transition-colors"
              onClick={() => window.open('tel:+265888940764', '_self')}
            >
              <Phone className="w-4 h-4 mr-2" />
              +265 888 940 764
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
