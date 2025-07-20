/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/Buyer/Component/Header.jsx",
    "./src/pages/Buyer/Landing.jsx",
    "./src/pages/Buyer/Component/Product.jsx",
    "./src/pages/Buyer/Component/Footer.jsx",
    "./src/pages/Buyer/Component/scroll.jsx",
    "./src/pages/Buyer/Component/shop.jsx",
    "./src/pages/Buyer/Component/ShopDetail.jsx",
    "./src/pages/Buyer/Component/OtherContent.jsx",
    "./src/pages/Buyer/auth/FarmerRegister.jsx",
    "./src/pages/Buyer/Component/KYChome.jsx",
    "./src/pages/Buyer/Component/Buynow.jsx",
    "./src/pages/Buyer/Component/AddCart.jsx",
    "./src/pages/Buyer/auth/ForgetPassword.jsx",
    "./src/pages/Buyer/auth/VerifyOTP.jsx",
    "./src/pages/Buyer/auth/ResetPassword.jsx",
    "./src/pages/Buyer/Component/PaymentMethod.jsx",

    "./src/pages/Farmer/FarmerHomePage.jsx",
    "./src/pages/Farmer/Component/FarmerSidebar.jsx",
    "./src/pages/Farmer/Parts/FarmerDashboard.jsx",
    "./src/pages/Farmer/Parts/FarmerProducts.jsx",
    "./src/pages/Farmer/Parts/FarmerAddProduct.jsx",
    "./src/pages/Farmer/Parts/FarmerChatbox.jsx",
    "./src/pages/Farmer/Parts/FarmerKYCform.jsx",
    "./src/pages/Farmer/Parts/FarmerKYChome.jsx",
    "./src/pages/Farmer/Parts/FarmerProfile.jsx",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				earth: {
					DEFAULT: 'hsl(var(--earth))',
					light: 'hsl(var(--earth-light))'
				},
				nature: {
					DEFAULT: 'hsl(var(--nature))',
					light: 'hsl(var(--nature-light))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'scale-in': {
					'0%': {
						opacity: '0',
						transform: 'scale(0.95)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale(1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.8s ease-out',
				'scale-in': 'scale-in 0.6s ease-out'
			}
		}
  },
  plugins: [],
};
