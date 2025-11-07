import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">IET DAVV</h3>
            <p className="text-primary-foreground/80 text-sm">
              Institute of Engineering & Technology, DAVV is a premier engineering institution committed to excellence in education and research.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/academics" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Academics
                </Link>
              </li>
              <li>
                <Link to="/notices" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Notices
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bulletin" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Bulletin Board
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/bot" className="text-primary-foreground/80 hover:text-primary-foreground text-sm transition-colors">
                  IET Bot
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80 text-sm">
                  Khandwa Road, Indore, Madhya Pradesh 452017
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} />
                <span className="text-primary-foreground/80 text-sm">
                  +91-731-2467059
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} />
                <span className="text-primary-foreground/80 text-sm">
                  info@ietdavv.edu.in
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            © {new Date().getFullYear()} Institute of Engineering & Technology, DAVV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
