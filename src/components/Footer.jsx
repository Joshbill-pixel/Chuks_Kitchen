import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Instagram, ArrowUp } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // <footer className="bg-brown-500 text-white">
    //   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
    //       {/* Brand Column */}
    //       <div>
    //         <h3 className="font-script text-2xl text-orange-400 mb-4">Chuks Kitchen</h3>
    //         <p className="text-gray-300 text-sm leading-relaxed">
    //           Bringing the authentic flavors of Nigerian home cooking to your table, with passion and care.
    //         </p>
    //       </div>

    //       {/* Quick Links */}
    //       <div>
    //         <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
    //         <ul className="space-y-2">
    //           {[
    //             { label: 'Home', path: '/home' },
    //             { label: 'Explore', path: '/menu' },
    //             { label: 'My Order', path: '/orders' },
    //             { label: 'Account', path: '/account' },
    //             { label: 'Contact', path: '/contact' },
    //           ].map((link) => (
    //             <li key={link.path}>
    //               <Link
    //                 to={link.path}
    //                 className="text-gray-300 text-sm hover:text-orange-400 transition-colors"
    //               >
    //                 {link.label}
    //               </Link>
    //             </li>
    //           ))}
    //         </ul>
    //       </div>

    //       {/* Contact Us */}
    //       <div>
    //         <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
    //         <ul className="space-y-2 text-sm text-gray-300">
    //           <li>+234 801 234 5678</li>
    //           <li>hello@chukkitchen.com</li>
    //           <li>123 Taste Blvd, Lagos, Nigeria</li>
    //         </ul>
    //       </div>

    //       {/* Social Links */}
    //       <div>
    //         <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
    //         <div className="flex flex-col space-y-2">
    //           {[
    //             { icon: Facebook, label: 'Facebook' },
    //             { icon: Twitter, label: 'Twitter' },
    //             { icon: Linkedin, label: 'LinkedIn' },
    //             { icon: Instagram, label: 'Instagram' },
    //           ].map((social) => (
    //             <a
    //               key={social.label}
    //               href="#"
    //               className="flex items-center gap-2 text-gray-300 text-sm hover:text-orange-400 transition-colors"
    //             >
    //               <social.icon className="w-4 h-4" />
    //               <span>{social.label}</span>
    //             </a>
    //           ))}
    //         </div>
    //       </div>
    //     </div>

    //     {/* Bottom Bar */}
    //     <div className="mt-12 pt-8 border-t border-brown-400 flex flex-col sm:flex-row items-center justify-between gap-4">
    //       <p className="text-gray-400 text-sm">
    //         © 2020 Lift Media. All rights reserved.
    //       </p>
    //       <button
    //         onClick={scrollToTop}
    //         className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors"
    //       >
    //         <ArrowUp className="w-5 h-5 text-white" />
    //       </button>
    //     </div>
    //   </div>
    // </footer>
    <footer className="bg-[#6B4E3D] text-white relative">
      <div className="container mx-auto px-6 py-12 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="w-65">
            <h2 className="font-serif text-orange-500 text-2xl lg:text-3xl mb-6 italic">
              Chuks Kitchen
            </h2>
            <p className="text-gray-200 w-50 leading-relaxed text-lg lg:text-1xl">
              Bringing the authentic <br/> flavors of Nigerian <br/> home cooking to your <br/> table, with passion <br/> and care.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Quick Links</h3>
            {/* <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Explore
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  My Order
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Account
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Contact
                </a>
              </li>
            </ul> */}
             <ul className="space-y-2 text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
              {[
                { label: 'Home', path: '/home' },
                { label: 'Explore', path: '/menu' },
                { label: 'My Order', path: '/orders' },
                { label: 'Account', path: '/account' },
                { label: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:+2348012345678" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  +234 801 234 5678
                </a>
              </li>
              <li>
                <a href="mailto:hello@chukskitchen.com" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  hello@chukskitchen.com
                </a>
              </li>
              <li className="text-gray-300 text-sm lg:text-base">
                123 Taste Blvd, Lagos, Nigeria
              </li>
            </ul>
          </div>

          {/* <div>
            <h3 className="text-white font-semibold text-lg mb-6">Follow Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors text-sm lg:text-base">
                  Instagram
                </a>
              </li>
            </ul>
          </div> */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex flex-col space-y-2">
              {[
                { icon: Facebook, label: 'Facebook' },
                { icon: Twitter, label: 'Twitter' },
                { icon: Linkedin, label: 'LinkedIn' },
                { icon: Instagram, label: 'Instagram' },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="flex items-center gap-2 text-gray-300 text-sm hover:text-orange-400 transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-600 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © 2024 Chuks Kitchen. All rights reserved.
          </p>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-8 right-20 bg-blue-500 hover:bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:shadow-xl"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
}
