import React, { useEffect, useRef } from "react";
import {
  Sprout,
  Shield,
  Smartphone,
  Users,
  CreditCard,
  UserCheck,
  BarChart3,
  Leaf,
  Building,
  Heart,
} from "lucide-react";
import { Button, Card } from "antd";
import Footer from "./Footer";
import Header from "./Header";
import { useNavigate } from "react-router-dom";

// Import images
import heroImage from "../../../assets/image/Hero pic.jpg";
import marketplaceIcon from "../../../assets/image/marketplace.jpeg";
import paymentIcon from "../../../assets/image/Esewa payment.png";
import trustIcon from "../../../assets/image/trust.png";

const AboutUs = () => {
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const visionRef = useRef(null);
  const featuresRef = useRef(null);
  const usersRef = useRef(null);
  const navigate = useNavigate();
  
  const hanglefarmerregister = () => {
      navigate("/Farmer-register");
  };

  const hanglebuyerregister = () => {
      navigate("/Buyer-register");
  };

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fade-in-up");
        }
      });
    }, observerOptions);

    const refs = [heroRef, missionRef, visionRef, featuresRef, usersRef];
    refs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Sprout,
      title: "Direct Farm-to-Table Marketplace",
      description:
        "Connect directly with buyers, eliminating middlemen and maximizing farmer profits.",
      image: marketplaceIcon,
    },
    {
      icon: CreditCard,
      title: "Secure Payments via eSewa",
      description:
        "Safe and reliable digital payment processing for all transactions.",
      image: paymentIcon,
    },
    {
      icon: UserCheck,
      title: "KYC Verification for Trust & Security",
      description: "Verified profiles ensure trust between farmers and buyers.",
      image: trustIcon,
    },
    {
      icon: BarChart3,
      title: "Order and Sales Tracking Dashboard",
      description: "Monitor your sales, orders, and analytics in real-time.",
    },
    {
      icon: Leaf,
      title: "Farm Profile & Product Listings",
      description:
        "Showcase your farm and products with detailed profiles and listings.",
    },
    {
      icon: Smartphone,
      title: "Mobile-Friendly Design for Rural Use",
      description:
        "Optimized for mobile devices, perfect for farmers on the go.",
    },
  ];

  const userGroups = [
    {
      icon: Users,
      title: "Smallholder Farmers",
      description:
        "Individual farmers looking to sell their produce directly to buyers.",
    },
    {
      icon: Building,
      title: "Agro-product Buyers",
      description:
        "Businesses and individuals purchasing fresh agricultural products.",
    },
    {
      icon: Heart,
      title: "Agricultural Cooperatives",
      description: "Farming cooperatives seeking to expand their market reach.",
    },
    {
      icon: Shield,
      title: "NGOs / Government Bodies",
      description:
        "Organizations supporting agricultural development and food security.",
    },
  ];

  return (
    <>
    <Header/>
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-nature-light via-background to-accent"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Empowering Nepali Farmers with{" "}
            <span className="text-[#16a34a]">Digital Agriculture</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-4xl mx-auto leading-relaxed">
            Sajha Krishi is a platform that helps farmers sell their products
            directly to buyers through a digital and transparent marketplace.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              type="primary"
              size="large"
              onClick={hanglefarmerregister}
              className="!bg-[#16a34a] !border-[#16a34a] !text-white hover:!bg-green-600 hover:!border-green-600 hover:!text-white shadow-nature flex items-center text-lg px-8 py-4"
            >
              <Users className="mr-2 h-5 w-5" />
              Register as Farmer
            </Button>
            <Button
              size="large"
              onClick={hanglebuyerregister}
              className="!bg-transparent !text-[#16a34a] !border-[#16a34a] hover:!bg-green-600 hover:!text-white flex items-center text-lg px-8 py-4"
            >
              <Building className="mr-2 h-5 w-5" />
              Register as Buyer
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section ref={missionRef} className="py-24 bg-nature-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Mission
            </h2>
            <div className="w-24 h-1 bg-[#16a34a] mx-auto mb-8"></div>
          </div>
          <Card className="border-0 shadow-soft bg-card/80 backdrop-blur-sm">
            <div className="p-12">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-center">
                At Sajha Krishi, our mission is to bridge the gap between
                farmers and buyers by offering a transparent, tech-powered
                platform to market, sell, and buy fresh agricultural products
                directly from farms across Nepal.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Vision Section */}
      <section ref={visionRef} className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Vision
            </h2>
            <div className="w-24 h-1 bg-[#16a34a] mx-auto mb-8"></div>
          </div>
          <Card className="border-0 shadow-soft">
            <div className="p-12">
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-center">
                We envision a future where every farmer in Nepal is digitally
                empowered, fairly compensated, and connected to a sustainable
                agricultural ecosystem.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* What We Do Section */}
      <section
        ref={featuresRef}
        className="py-24 bg-gradient-to-b from-background to-nature-light"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              What We Do
            </h2>
            <div className="w-24 h-1 bg-[#16a34a] mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive digital solutions designed specifically for Nepal's
              agricultural ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border-0 shadow-soft hover:shadow-nature transition-all duration-300 hover:-translate-y-2 bg-card/90 backdrop-blur-sm"
              >
                <div className="p-8 text-center">
                  <div className="mb-6 relative">
                    {feature.image ? (
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-nature rounded-full flex items-center justify-center">
                        <feature.icon className="h-10 w-10 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section ref={usersRef} className="py-24 bg-earth-light">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Who We Help
            </h2>
            <div className="w-24 h-1 bg-[#16a34a] mx-auto mb-8"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Supporting every stakeholder in Nepal's agricultural value chain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {userGroups.map((group, index) => (
              <Card
                key={index}
                className="group border-0 shadow-soft hover:shadow-nature transition-all duration-300 bg-card/90 backdrop-blur-sm"
              >
                <div className="p-8 flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-nature rounded-full flex items-center justify-center flex-shrink-0">
                    <group.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {group.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {group.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary via-nature to-primary">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Join Sajha Krishi Today
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
            Be part of Nepal's digital agriculture revolution. Connect, trade,
            and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              type="primary"
              size="large"
              className="!bg-background !text-[#16a34a] !border-[#16a34a] hover:!bg-green-600 hover:!text-white flex items-center text-lg px-8 py-4"
            >
              <Users className="mr-2 h-5 w-5" />
              Get Started as Farmer
            </Button>
            <Button
              size="large"
              className="!bg-transparent !text-white !border-white hover:!bg-green-600 hover:!text-white flex items-center text-lg px-8 py-4"
            >
              <Building className="mr-2 h-5 w-5" />
              Start Buying Today
            </Button>
          </div>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default AboutUs;
